/* eslint-disable @next/next/no-img-element */
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { useCallback, useState } from 'react';
import { Image as ImageInterface, PostData } from "@/Interface/interfaces";
import ReactPlayer from 'react-player';
import { API_URL } from 'const';
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
  const { isMovie } = usePosts();


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
  return(
    <>
      <div className='keen-slider mb-3' ref={sliderRef}>
        {post?.attributes?.Image?.data?.map((eachData: ImageInterface,ImageIndex:number)=>{
          if(eachData?.attributes?.url === undefined)return <></>;
          // 詳細画面ならリンクなし
          if(isDetailPage){
            return (
              isMovie(eachData.attributes.url) ?
              <div className="w-[100vw] keen-slider__slide" >
                <ReactPlayer width='100%' url={`${API_URL}${eachData.attributes.url}`} controls={true}/>
              </div>
              :
              <div className="w-[100vw] keen-slider__slide" >
                <img key={ImageIndex}  src={`${API_URL}${eachData.attributes.url}`} alt="" className='w-full h-full' />
              </div>
            )
          }
          // リンクあり
          return(
            isMovie(eachData.attributes.url) ?
            <div className="w-full keen-slider__slide" >
              <ReactPlayer width='100%' url={`${API_URL}${eachData.attributes.url}`} controls={true}/>
            </div>
            :
              <Link key={ImageIndex} href={`post/${post.id}`}>
                <div className="w-screen h-auto keen-slider__slide" >
                  <img  src={`${API_URL}${eachData.attributes.url}`} alt="" className='w-full h-auto' />
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
              className={`dot w-[8px] mx-[5px] h-[8px] cursor-pointer bg-white rounded-full ${idx === currentSlide && 'bg-primary'}`}
            ></button>
          )
        })}
        </div>
      }
    </>
  );
};
