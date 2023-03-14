/* eslint-disable @next/next/no-img-element */
import { descriptionAtom, filesAtom, ryokanAtom, selectedPlaceAtom } from "@/atoms/atoms";
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


interface UploadFormProps{
  handleSubmit: (e: any) => Promise<void>;
}
interface PreviewFilesInterface{
  URL: string,
  isMovie: boolean
}
export const UploadForm = (props: UploadFormProps) => {
  const [ryokan, setRyokan] = useAtom(ryokanAtom);
  const selectedPlace = useAtomValue(selectedPlaceAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [files, setFiles] = useAtom(filesAtom);
  const {handleSubmit} = props;
  const [previews, setPreviews] = useState<PreviewFilesInterface[]>([]);
  const { isMovie } = usePosts();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);


  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files)return;
    // @ts-ignore
    const fileURLs: PreviewFilesInterface[] = [...e.target.files].map((eachFile: File) => {
      return {
        URL: URL.createObjectURL(eachFile),
        isMovie: isMovie(eachFile.name)
      }
    })
    setPreviews(fileURLs);
  };

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slideChanged(slider){
        setCurrentSlide(slider.track.details.rel);
        console.log(slider.track.details.rel);
      },
      slides: { perView: 1 },
      created() {
        setLoaded(true);
      },
    },
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col mt-12">
        <div className="mb-5 w-full px-3">
          <PlacesAutoComplete />
        </div>
        <div className="mb-5 mx-3">
          <label htmlFor="">本文</label>
          <TextField
            required
            multiline
            inputProps={{
              style: {
                color: 'white'
              }
            }}
            className="bg-background-secondary text-white w-full rounded-lg mb-8"
            name="description"
            // label='本文'
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
            // <div className="keen-slider w-screen" ref={sliderRef}>
            <div className="grid grid-cols-2 w-screen">
              {
                previews.map((preview,index) => (
                  preview.isMovie ?
                    // <div key={index} className='flex justify-center keen-slider__slide'>
                    <div key={index} className='flex justify-center'>
                      <ReactPlayer key={index} width='95%' height={200} url={preview.URL} controls={true}/>
                    </div>
                    :
                    <img className="w-[95%] m-auto" key={index} src={preview.URL} alt="プレビュー" />
                ))
              }
            </div>
          }
          {/* {loaded && instanceRef.current && instanceRef.current.track?.details?.slides?.length > 0 &&
            <div className="dots flex justify-center">
            {[
              // @ts-ignore
              ...Array(instanceRef.current.track?.details?.slides?.length).keys(),
            ].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx)
                  }}
                  className={`dot w-[8px] mx-[5px] h-[8px] cursor-pointer bg-white rounded-full ${idx === currentSlide && 'bg-primary'}`}
                ></button>
              )
            })}
            </div>
          } */}
          <div className="mb-[100px]">
            <Button onClick={() => setFiles([])}>クリア</Button>
          </div>
          <button className='w-[50%] mb-[100px] left-0 m-auto bg-background-secondary h-14 text-primary rounded-full' type="submit">投稿する</button>
      </div>
    </form>
  );
};
