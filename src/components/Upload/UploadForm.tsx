/* eslint-disable @next/next/no-img-element */
import { descriptionAtom, filesAtom, infoBalloonAtom, previewsAtom, selectedPlaceAtom, userAtom } from "@/atoms/atoms";
import { PlacesAutoComplete } from "@/pages/RyokanInfo";
import { Button, TextField } from "@mui/material";
import { API_URL, IS_DEVELOPMENT_ENV } from "const";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { usePosts } from "lib/usePosts";
import { ChangeEvent, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import 'keen-slider/keen-slider.min.css'
import { useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/router";
import {PreviewFilesInterface} from '../../Interface/interfaces'
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../Header/Header";
import { DatePicker } from "@mui/x-date-pickers";
import DatePickerMui from "../Post/DatePickerMui";


interface UploadFormProps{
  title?: string;
  handleSubmit: (e: any) => Promise<void>;
  postId?: string;
  isEditPage?: boolean;
}

export const UploadForm = (props: UploadFormProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries: ["places"],
  });
  const {handleSubmit, title, postId, isEditPage = false} = props;
  const user = useAtomValue(userAtom);
  const setSelectedPlace = useSetAtom(selectedPlaceAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [files, setFiles] = useAtom(filesAtom);
  const [previews, setPreviews] = useAtom(previewsAtom);
  const [existingPreviews, setExistingPreviews] = useState<PreviewFilesInterface[]>([]);
  const { isMovie, fetchMediaUrlsOfPost,MediaUrls } = usePosts();
  const router = useRouter();
  const [selectedMediasForDelete, setSelectedMediasForDelete] = useState<PreviewFilesInterface[]>([]);
  const token = Cookies.get('token');
  const [checkedMediasIndex, setCheckedMediasIndex] = useState<number[]>([]);
  const [balloonText, setBalloonText] = useAtom(infoBalloonAtom);
  
  useEffect(()=>{ //Uploadページの場合
    if(isEditPage)return;
    setDescription('');
    setSelectedPlace('');
    setPreviews([]);
  },[]);

  useEffect(()=>{ //Editページの場合１
    if(!isEditPage)return;
    if(!postId)return;
    fetchMediaUrlsOfPost(Number(postId))
  },[postId]);

  useEffect(()=>{ //Editページの場合2 (既存画像データをプレビューとして表示する準備)
    if(!isEditPage)return;
    if(!MediaUrls)return;
    const existingPreviews: PreviewFilesInterface[] = MediaUrls.map(eachURl => (
      {
        URL: eachURl,
        isMovie: isMovie(eachURl),
      }
    ))
    if(!existingPreviews.length)return;
    setExistingPreviews(existingPreviews);
  },[MediaUrls]);

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      // @ts-ignore
      const fileURLs: PreviewFilesInterface[] = [...e.target.files].map((eachFile: File) => {
        return {
          URL: URL.createObjectURL(eachFile),
          isMovie: isMovie(eachFile.name)
        }
      })
      setPreviews([...previews,...fileURLs]);
      setFiles([...files,...Array.from(e.target.files)]);
    };
  };

  // replaceメソッドで、API_URLを''(空文字)に置換する->残った文字列をキーとして、media-urls-of-postエンドポイントのdeleteメソッドを呼び出して該当レコードを削除。
  const handleClickDeleteMedia = async () => {
    if(!postId)return; //Editページではない（＝Uploadページである）場合、postIdが渡されていないので早期リターン。
    selectedMediasForDelete.map(async eachMedia => {
      const deleteUrl = () => {
        if(IS_DEVELOPMENT_ENV){
          return eachMedia.URL.replace(`${API_URL}`,'');
        }else{
          return eachMedia.URL;
        }
      };
      const deleteId: number = await axios.get(`${API_URL}/api/media-urls-of-posts?filters[url][$eq]=${deleteUrl()}`).then( (res: any) => {
        return res.data.data[0].id;
      })
      if(!deleteId)return;
      await axios.delete(`${API_URL}/api/media-urls-of-posts/${deleteId}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
        fetchMediaUrlsOfPost(Number(postId));
        setBalloonText('画像の削除に成功しました。');
        router.push(`/post/${postId}/Edit`);
      })
    });
  };

  // 削除したい個別画像の選択
  const handleClickPreviews = async (preview: PreviewFilesInterface,index: number) => {//Editページの場合３
    if(!postId)return;
    if(checkedMediasIndex.includes(index)){
      setCheckedMediasIndex(prev => 
        prev.filter(eachCheckedIndex => eachCheckedIndex !== index)
        );
        setSelectedMediasForDelete(prev => 
          prev.filter(eachSelectedMedias => eachSelectedMedias.URL !== preview.URL)
          )
    }else{
      setCheckedMediasIndex(prev => [...prev,index]);
      setSelectedMediasForDelete(prev => [...prev,preview]);
    }
  };

  const renderPreview = (preview: PreviewFilesInterface, index: number, isExistingMedia: boolean = false) => (
    <>
      <div className='relative bg-black mb-5 mr-2 h-[200px]'>
        {
          preview.isMovie ?
            <div key={index} className='flex justify-center object-contain'>
              <ReactPlayer key={index} width='95%' height={200} url={preview.URL} controls={true}/>
            </div>
            :
            <img className="w-full m-auto h-full object-contain" key={index} src={preview.URL} alt="プレビュー" />
        }
        {
          isExistingMedia && <input type="checkbox" name="" id="" className="absolute top-1 right-1 h-5 w-10 " onClick={() => handleClickPreviews(preview,index)}/> 
        }
      </div>
    </>
  );

  if(!user)router.push('/Login');
  return (
    isLoaded && user ?
      <div className="text-white items-center text-center max-h-[100vh] max-w-[600px] m-auto">
        <Header/>
        <h1 className='mt-8 text-2xl'>{title}</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-12 mx-3">
            <div className="mb-10 w-full">
              <PlacesAutoComplete />
            </div>
            <div className="mb-5 w-full">
              <DatePickerMui/>
            </div>
            <div className="mb-10 ">
              <label htmlFor="">本文</label>
              <TextField
                required
                multiline
                inputProps={{
                  style: {
                    color: 'white'
                  }
                }}
                className="bg-background-secondary text-white w-full rounded-lg"
                name="description"
                InputLabelProps={{
                  style: {
                    color: 'white'
                  }

                }}
                variant="filled"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
              />
            </div>
              {
                isEditPage && existingPreviews.length > 0 &&
                <div className="w-full">
                  <p>元の写真</p>
                  <div className="grid grid-cols-2 mb-10">
                    {existingPreviews.map((preview,index)=>(
                      renderPreview(preview,index,true)
                      ))}
                  </div>
                </div>
              }
              
              
              {selectedMediasForDelete.length > 0 && isEditPage &&
                <button 
                  type="submit" 
                  className='w-[50%] h-[50px] mx-auto bg-background-secondary rounded-full px-3 cursor-pointer text-red-700 mb-10'
                  onClick={()=> handleClickDeleteMedia()}
                >
                  {selectedMediasForDelete.length}枚の写真を削除
                </button>
              }
              {previews.length > 0 &&
                <>
                  {isEditPage && <p>新しく選択した写真</p>}
                  <div className="grid grid-cols-2 mb-10">
                    {
                      previews.map((preview,index) => (
                        renderPreview(preview,index)
                      ))
                    }
                  </div>
                </>
              }
              {previews.length > 0 && 
                <div className="mb-[50px]">
                  <Button onClick={() => {
                    setFiles([])
                    setPreviews([]);
                  }}>クリア</Button>
                </div>
              }
              <label className="bg-white text-primary font-bold flex justify-center items-center cursor-pointer h-[50px] rounded-md outline-cyan-400 outline mb-8">
                <input
                  className='hidden'
                  multiple
                  type="file"
                  id=""
                  onChange={onFileInputChange}
                />
                <img src="/pictures.svg" alt="" className="h-[25px] mr-3"/>
                <p className="my-auto align-middlle">写真・動画を選択</p>
              </label>
              <button className='w-[50%] mb-[100px] left-0 m-auto bg-background-secondary h-14 text-primary rounded-full' type="submit">{isEditPage ? '更新する':'投稿する'}</button>
          </div>
        </form>
      </div>
    :
    <></>
  );
};
