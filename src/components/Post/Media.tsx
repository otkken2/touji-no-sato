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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
      <div className={`keen-slider__slide bg-black flex ${isExpanded ? 'w-[100vw] h-screen justify-center items-center' : 'w-full h-fit'}`} >
        <Image src={url} sizes='100%' width={600} height={460} alt="Image" className={`object-scale-down ${isExpanded ? 'w-full h-full' : 'w-full max-h-[460px]'}`}/>
      </div>
    )
  }
  

  const handleSlideToPrev = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    instanceRef.current?.prev();
  };
  const handleSlideToNext = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    instanceRef.current?.next();
  };

  const handleExpandImage = () => {
    setIsExpanded(prev => !prev);
  };

  return(
    MediaUrls?.length ? 
    <div onClick={() => handleExpandImage()} className={isExpanded ? 'fixed w-screen h-screen z-50 top-0 left-0 ' : ''}>
      <div className='relative'>
        <div className={`keen-slider mb-3 overflow-hidden ${isExpanded ? 'h-screen w-screen' : ''}`} ref={sliderRef} key={isExpanded ? 'expanded' : 'not-expanded'}>
          {MediaUrls.map((MediaUrl: MediaUrlsOfPostInterface,ImageIndex:number)=>{ 
            if(!MediaUrl.url)return <></>;
            return(
              <div key={ImageIndex}>
                {
                  isMovie(MediaUrl.url) ?
                  <div className="w-full h-fit keen-slider__slide object-contain bg-black" >
                    <ReactPlayer width='100%' url={MediaUrl.url} controls={true}/>
                  </div>
                  :
                  // <Link href={`/post/${post.id}`}>
                  <>
                    {imgContainer(MediaUrl.url)}
                  </>
                  // </Link>
                }
              </div>
            );
          })}
        </div>
      {
        MediaUrls.length > 1 && 
        <>
          <div className='absolute cursor-pointer h-[30px] w-[30px] bg-black opacity-50 rounded-full left-3 top-1/2 flex justify-center items-center' onClick={(e) => handleSlideToPrev(e)}>←</div>
          <div className='absolute cursor-pointer h-[30px] w-[30px] bg-black opacity-50 rounded-full right-3 top-1/2 flex justify-center items-center' onClick={(e) => handleSlideToNext(e)}>→</div>
        </>
      }
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
    </div>
    :
    <></>
  );
};
