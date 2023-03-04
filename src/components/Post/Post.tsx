/* eslint-disable @next/next/no-img-element */
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
import { HeaderAndDescription } from "./HeaderAndDescription";
import ReactPlayer from 'react-player';
import { usePosts } from "lib/usePosts";

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
  // const isMovie = (url:string) => {
  //   return url.includes('.mp4') || url.includes('.MP4') || url.includes('.mov') || url.includes('MOV') || url.includes('WMV') || url.includes('AVI') || url.includes('FLV') || url.includes('MPEG');
  // };
  if(post === undefined)return <></>;
  if(!post?.attributes?.user?.data?.attributes?.username || !post?.attributes?.createdAt || !post?.attributes?.description)return <></>;
  return(
    <div key={index} className={`post-${index} text-white mb-10`}>
      {/* <Link  href={`post/${post.id}`}> */}
        <HeaderAndDescription
          username={post.attributes.user.data.attributes.username}
          createdAt={post.attributes.createdAt}
          description={post.attributes.description}
          userId={post.attributes.user.data.id}
          postId={post.id}
        />
      {/* </Link> */}
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
      {
        post.attributes?.ryokan &&
        <PlaceLink ryokan={post.attributes?.ryokan}/>
      }
        {/* 画像 */}
        {post?.attributes?.Image?.data?.map((eachData: ImageInterface,ImageIndex:number)=>{
          if(eachData?.attributes?.url === undefined)return <></>;
          // 詳細画面ならリンクなし
          if(isDetailPage){
            return (
              isMovie(eachData.attributes.url) ?
              <div className="w-full">
                <ReactPlayer width='100%' url={`${API_URL}${eachData.attributes.url}`} controls={true}/>
              </div>
              :
              <img key={ImageIndex} src={`${API_URL}${eachData.attributes.url}`} alt="" className='w-full' />
            )
          }
          // リンクあり
          return(
            isMovie(eachData.attributes.url) ?
            <div className="w-full">
              <ReactPlayer width='100%' url={`${API_URL}${eachData.attributes.url}`} controls={true}/>
            </div>
            :
            <Link key={ImageIndex} href={`post/${post.id}`}>
              <img  src={`${API_URL}${eachData.attributes.url}`} alt="" className='w-full' />
            </Link>
            );
        })}
      <IconsContainer postId={post?.id} token={token} userId={user?.id} replyCount={0} favoriteCount={post?.attributes?.favoriteCount} handleClickFavorite={handleClickFavorite}/>
    </div>
  );
};
