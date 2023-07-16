/* eslint-disable @next/next/no-img-element */
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useCallback, useEffect, useState } from 'react';
import { Image as ImageInterface, PostData } from "@/Interface/interfaces";
import ReactPlayer from 'react-player';
import Link from 'next/link';
import { usePosts } from 'lib/usePosts';

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
        console.log(slider.track.details.rel);
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

  // console.log(urls);

  // if(post?.attributes?.Image?.data === undefined)return <></>;
  // if(post?.attributes?.Image?.data?.length === 0)return <></>;
  return(
    MediaUrls?.length ? 
    <>
      <div className='keen-slider mb-3' ref={sliderRef}>
         {MediaUrls.map((url: string,ImageIndex:number)=>{
          if(!url)return <></>;
          // 詳細画面ならリンクなし
          if(isDetailPage){
            return (
              isMovie(url) ?
              <div key={ImageIndex} className="w-[100vw] keen-slider__slide" >
                <ReactPlayer width='100%' url={url} controls={true}/>
              </div>
              :
              // <div className="w-[100vw] keen-slider__slide" >
              <div className="w-full keen-slider__slide object-contain bg-black" >
                <img key={ImageIndex}  src={url} alt="" className='w-full max-h-[460px] object-contain' />
              </div>
            )
          }
          // リンクあり
          return(
            isMovie(url) ?
            <div className="w-full keen-slider__slide" >
              <ReactPlayer width='100%' url={url} controls={true}/>
            </div>
            :
              <Link key={ImageIndex} href={`/post/${post.id}`}>
                <div className="w-full h-fit keen-slider__slide object-contain bg-black flex" >
                  <img  src={url} alt="" className='w-full object-contain max-h-[460px] items-center' />
                </div>
              </Link>
            );
        })}
      </div>
      {/* ドット */}
      {loaded && instanceRef.current && instanceRef.current.track?.details?.slides?.length > 0 &&
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
