/* eslint-disable @next/next/no-img-element */
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useEffect, useState } from 'react';
import { Image as ImageInterface, PostData } from "@/Interface/interfaces";
import ReactPlayer from 'react-player';
import Link from 'next/link';
import { usePosts } from 'lib/usePosts';
import { MediaUrlsOfPostInterface } from '@/Interface/interfaces';
import Image from 'next/image';

interface MediaProps{
  post: PostData,
  isDetailPage?: boolean;
}
export const Media = (props: MediaProps)=>{
  const {post, isDetailPage = false} = props;
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);
  const { isMovie, fetchMediaUrlsOfPost, MediaUrls } = usePosts();
  const [urls, setUrls] = useState<string[]>();

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slideChanged(slider){
        setCurrentSlide(slider.track.details.rel);
      },
      slides: { perView: 1 },
      created() {
        setLoaded(true);
      },
    },
  )
  
  useEffect(()=>{
    fetchMediaUrlsOfPost(post.id);
  },[post, post.id]);

  const imgContainer = (url: string) => {
    return (
      <div className="w-full h-fit keen-slider__slide object-contain bg-black flex" >
        <Image src={url} sizes='100%' width={600} height={460} alt="Image" className='w-full object-contain max-h-[460px]'/>
      </div>
    )
  }

  return(
    MediaUrls?.length ? 
    <>
      <div className='keen-slider mb-3' ref={sliderRef}>
         {MediaUrls.map((MediaUrl: MediaUrlsOfPostInterface,ImageIndex:number)=>{
          if(!MediaUrl.url)return <></>;
          return(
            isMovie(MediaUrl.url) ?
            <div className="w-full keen-slider__slide" >
              <ReactPlayer width='100%' url={MediaUrl.url} controls={true}/>
            </div>
            :
              <Link key={ImageIndex} href={`/post/${post.id}`}>
                {imgContainer(MediaUrl.url)}
              </Link>
            );
        })}
      </div>
      {/* ドット */}
      {loaded && instanceRef.current && instanceRef.current.track?.details?.slides?.length > 0 &&
        <div className="dots flex justify-center mb-5">
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
                className={`dot w-[8px] mx-[5px] h-[8px] cursor-pointer rounded-full ${idx === currentSlide ? 'bg-primary' : 'bg-white'}`}
              ></button>
            )
          })}
        </div>
      }
    </>
    :
    <></>
  );
};
