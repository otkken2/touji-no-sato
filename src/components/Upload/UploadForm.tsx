/* eslint-disable @next/next/no-img-element */
import { descriptionAtom, filesAtom, previewsAtom, selectedPlaceAtom, userAtom } from "@/atoms/atoms";
import { PlacesAutoComplete } from "@/pages/RyokanInfo";
import { Button, TextField } from "@mui/material";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";
import { usePosts } from "lib/usePosts";
import { MuiFileInput } from "mui-file-input";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Media } from "../Post/Media";
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/router";
import {PreviewFilesInterface} from '../../Interface/interfaces'


interface UploadFormProps{
  title?: string;
  handleSubmit: (e: any) => Promise<void>;
  postId?: string;
}

export const UploadForm = (props: UploadFormProps) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries: ["places"],
  });
  const user = useAtomValue(userAtom);
  const selectedPlace = useAtomValue(selectedPlaceAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [files, setFiles] = useAtom(filesAtom);
  const {handleSubmit, title, postId} = props;
  const [previews, setPreviews] = useAtom(previewsAtom);
  const { isMovie, fetchMediaUrlsOfPost,MediaUrls } = usePosts();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(!postId)return;
    console.log('HOGE');
    fetchMediaUrlsOfPost(Number(postId))
  },[postId]);

  useEffect(()=>{
    if(!MediaUrls)return;
    const previews: PreviewFilesInterface[] = MediaUrls.map(eachURl => (
      {
        URL: `${API_URL}${eachURl}`,
        isMovie: isMovie(eachURl),
      }
    ))
    if(!previews.length)return;
    setPreviews(previews);
  },[MediaUrls]);

  console.log("MediaUrls↓");
  console.log(MediaUrls);


  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      // @ts-ignore
      const fileURLs: PreviewFilesInterface[] = [...e.target.files].map((eachFile: File) => {
        return {
          URL: URL.createObjectURL(eachFile),
          isMovie: isMovie(eachFile.name)
        }
      })
      setPreviews(fileURLs);
      // console.log("e.target.files");
      // console.log(e.target.files);
      setFiles(Array.from(e.target.files));
    };
  };

  if(!user)router.push('/Login');
  return (
    isLoaded && user ?
      <div className="text-white items-center text-center max-h-[100vh] max-w-[560px] m-auto pt-11">
        <h1 className=' text-xl'>{title}</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-12">
            <div className="mb-10 w-full px-3">
              <PlacesAutoComplete />
            </div>
            <div className="mb-10 mx-3">
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
              <label className="bg-white text-primary font-bold flex justify-center items-center cursor-pointer h-[50px] mx-3 rounded-md outline-cyan-400 outline mb-8">
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
              {previews &&
                <div className="grid grid-cols-2 w-screen">
                  {
                    previews.map((preview,index) => (
                      preview.isMovie ?
                        <div key={index} className='flex justify-center'>
                          <ReactPlayer key={index} width='95%' height={200} url={preview.URL} controls={true}/>
                        </div>
                        :
                        <img className="w-[95%] m-auto" key={index} src={preview.URL} alt="プレビュー" />
                    ))
                  }
                </div>
              }
              <div className="mb-[50px]">
                <Button onClick={() => setFiles([])}>クリア</Button>
              </div>
              <button className='w-[50%] mb-[100px] left-0 m-auto bg-background-secondary h-14 text-primary rounded-full' type="submit">投稿する</button>
          </div>
        </form>
      </div>
    :
    <></>
  );
};
