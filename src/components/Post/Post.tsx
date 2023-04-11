/* eslint-disable @next/next/no-img-element */
import Moment from "react-moment";
import 'moment-timezone';
import { PostData } from "@/Interface/interfaces";
import Link from "next/link";
import { PlaceLink } from "./PlaceLink";
import { PostHeader } from "./PostHeader";
import Image from "next/image";
import { useFavorite } from "lib/useFavorite";
import Cookies from "js-cookie";
import { useAtom, useAtomValue } from "jotai";
import { showReplyFormAtom, userAtom } from "@/atoms/atoms";
import { IconsContainer } from "./IconsContainer";

import { Media } from "./Media";
import { useState } from "react";

interface PostsProps{
  post: PostData | undefined;
  index?: number | undefined;
  isDetailPage?: boolean;
  isReply?: boolean;
  postId?: string | undefined;
  userIconUrl?: string | undefined;
  replyCount?: number;
  handleGetContent?: () => void;
  handleDeletePost?: () => Promise<void>;
}
export const Post = (props: PostsProps) => {
  const {
    post, 
    index, 
    isDetailPage = false, 
    isReply= false, 
    postId, 
    replyCount = 0,
    handleGetContent, 
    handleDeletePost,
  } = props;
  const token = Cookies.get('token');
  const user = useAtomValue(userAtom);
  const { handleClickFavorite, myFavoritesIds} = useFavorite();
  const [showReplyForm, setShowReplyForm] = useAtom(showReplyFormAtom);
  const handleClickReplyIcon = () => {
    if(isReply)return;
    setShowReplyForm(!showReplyForm);
  };
  const [localFavoriteCount, setLocalFavoriteCount] = useState<number>(post?.attributes?.favoriteCount || 0);


  if(post === undefined)return <></>;
  if(
    !post?.attributes?.user?.data?.attributes?.username ||
    !post?.attributes?.createdAt ||
    !post?.attributes?.description 
  )return <></>;
  return(
    <div key={index} className={`post-${index} text-white mb-10 border-b border-white/40`}>
      <div className='mb-5'>
        <>
          <PostHeader 
            userIconUrl={post?.attributes?.user?.data?.attributes?.profileIcon} 
            username={post.attributes.user.data.attributes.username} 
            createdAt={post.attributes.createdAt} 
            userId={post.attributes.user.data.id}
            isDetailPage={isDetailPage}
            ryokan={post.attributes?.ryokan}
            description={post.attributes?.description}
            postId={postId}
            post={post}
          />
          {/* 画像もしくは動画 */}

          <Media post={post} isDetailPage={isDetailPage}/>


          <div className='mx-[16px]'>
            {/* 日付 */}
            <div className={`flex flex-col mb-5  ${ isDetailPage && !isReply  ? 'text-md' : 'text-xs'}`}>
              <div className='flex'> 
                <p className="text-opacity-80 text-white">投稿日時：</p>
                <Moment format='YYYY/MM/DD hh:mm' tz='Asia/Tokyo' className='text-opacity-80  text-white'>
                  {post.attributes.createdAt}
                </Moment>
              </div>
              { post.attributes.bathingDay &&
              <div className='flex'>
                <p className='text-opacity-80  text-white'>入湯日：</p>
                <Moment format='YYYY/MM/DD' tz='Asia/Tokyo' className='text-opacity-80  text-white'>
                  {post.attributes.bathingDay}
                </Moment>
              </div>
              }
            </div>

            {/* <p>{String(post.attributes.bathingDay)}</p> */}
            {/* 投稿本文 */}
            <Link href={`/post/${post?.id}`}>
              <p className={`mb-1 break-words ${!isReply && isDetailPage && 'text-2xl'}`}>
                {post.attributes.description}
              </p>
            </Link>
          </div>
        </>
      </div>
        {/* 旅館情報 */}
        <div className='mx-[16px]'>
          {
            post.attributes?.ryokan &&
            <PlaceLink ryokan={post.attributes?.ryokan}/>
          }
        </div>
        {/* <IconsContainer postId={post?.id} isReply={isReply} token={token} userId={user?.id} replyCount={replyCount} favoriteCount={post?.attributes?.favoriteCount}/> */}

        
        <div className="icons-container flex justify-around">
      {/* リプライ ※TODO:ゆくゆくは、個別Postにぶらさがる各リプライそれぞれについたリプライ数も表示できるようにしたい */}
        <div className={`reply-container flex items-center ${isReply && 'opacity-50'}`} onClick={() => handleClickReplyIcon()}>
          <Image src='/reply.svg' alt='コメント' width={20} height={20} className='m-3'/>
          { isReply || <p>{replyCount}</p>}
        </div>
      {/* お気に入り登録・解除 */}
      <div className='favorite-container flex items-center' onClick={async()=> {
        const newFavoriteCount = await handleClickFavorite(post?.id, post?.attributes?.favoriteCount, token, user?.id)
        setLocalFavoriteCount(newFavoriteCount || 0);
      }}>
        { myFavoritesIds.includes(post?.id)
        ?
          <>
            <Image src='/favorite-red.png' alt='お気に入り追加済み' width={20} height={20} className='m-3'/>
            {/* <p>{post?.attributes?.favoriteCount}</p> */}
          </>
        : 
          <>
            <Image src='/favorite.svg' alt='お気に入りに追加' width={20} height={20} className='m-3'/>
            {/* <p>{post?.attributes?.favoriteCount}</p> */}
          </>
        }
        <p>{localFavoriteCount}</p>
      </div>
    </div>
    </div>
  );
};
