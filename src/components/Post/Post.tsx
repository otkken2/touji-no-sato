/* eslint-disable @next/next/no-img-element */
import Moment from "react-moment";
import 'moment-timezone';
import { Image as ImageInterface, PostData } from "@/Interface/interfaces";
import { API_URL } from "const";
import Link from "next/link";
import { PlaceLink } from "./PlaceLink";
import { PostHeader } from "./PostHeader";
import Image from "next/image";
import { useFavorite } from "lib/useFavorite";
import Cookies from "js-cookie";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/atoms";
import { IconsContainer } from "./IconsContainer";
import ReactPlayer from 'react-player';
import { usePosts } from "lib/usePosts";
import { useCallback, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
// import { Splide, SplideSlide } from 'splide-nextjs/react-splide';
// import '@splidejs/splide/css';
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

interface PostsProps{
  post: PostData | undefined;
  index?: number | undefined;
  isDetailPage?: boolean;
  isReply?: boolean;
  postId?: string | string[] | undefined;
  handleGetContent?: () => void;
  handleDeletePost?: () => Promise<void>;
}
export const Post = (props: PostsProps) => {
  const {post, index, isDetailPage = false, isReply= false, postId, handleGetContent, handleDeletePost} = props;
  const token = Cookies.get('token');
  const user = useAtomValue(userAtom);

  const { handleClickFavorite } = useFavorite();
  const { isMovie } = usePosts();
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
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

  const renderMedia = useCallback(()=>{
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
  },[currentSlide, instanceRef, isDetailPage, isMovie, loaded, post?.attributes?.Image?.data, post?.id, sliderRef]);

  if(post === undefined)return <></>;
  if(!post?.attributes?.user?.data?.attributes?.username || !post?.attributes?.createdAt || !post?.attributes?.description)return <></>;
  return(
    <div key={index} className={`post-${index} text-white mb-10`}>
      <div className=''>
        <>
          <PostHeader username={post.attributes.user.data.attributes.username} createdAt={post.attributes.createdAt} userId={post.attributes.user.data.id}/>
          {/* 画像もしくは動画 */}
          {renderMedia()}
          <IconsContainer postId={post?.id} token={token} userId={user?.id} replyCount={0} favoriteCount={post?.attributes?.favoriteCount} handleClickFavorite={handleClickFavorite}/>


          <div className='mx-[16px]'>
            {/* 日付 */}
            <Moment format='YYYY/MM/DD hh:mm' tz='Asia/Tokyo' className='text-opacity-80 text-sm text-white'>
              {post.attributes.createdAt}
            </Moment>
            {/* 投稿本文 */}
            <Link href={`post/${postId}`}>
              <p className='mb-1'>
                {post.attributes.description}
              </p>
            </Link>
          </div>
        </>
      </div>
      {/* 編集と削除(detailPageの場合のみ) */}
      {isDetailPage && handleGetContent && handleDeletePost &&
        <div className="flex">
          <Link className="mr-3" href={`/post/${postId}/Edit`} onClick={()=>{handleGetContent()}}>
            <Image src='/edit.svg' height={20} width={20} alt="編集"/>
          </Link>
          <Image className="mr-3" src={'/delete.svg'} height={20} width={20} alt='削除' onClick={()=> handleDeletePost()}/>
        </div>
      }
        {/* 旅館情報 */}
        <div className='mx-[16px]'>
          {
            post.attributes?.ryokan &&
            <PlaceLink ryokan={post.attributes?.ryokan}/>
          }
        </div>

    </div>
  );
};
