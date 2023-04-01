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
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/atoms";
import { IconsContainer } from "./IconsContainer";

import { Media } from "./Media";

interface PostsProps{
  post: PostData | undefined;
  index?: number | undefined;
  isDetailPage?: boolean;
  isReply?: boolean;
  postId?: string | undefined;
  userIconUrl?: string | undefined;
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
    handleGetContent, 
    handleDeletePost,
  } = props;
  const token = Cookies.get('token');
  const user = useAtomValue(userAtom);
  
  if(post === undefined)return <></>;
  if(
    !post?.attributes?.user?.data?.attributes?.username ||
    !post?.attributes?.createdAt ||
    !post?.attributes?.description 
  )return <></>;
  return(
    <div key={index} className={`post-${index} text-white mb-10 border-b border-white/40`}>
      <div className=''>
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
            <Moment format='YYYY/MM/DD hh:mm' tz='Asia/Tokyo' className='text-opacity-80 text-sm text-white'>
              {post.attributes.createdAt}
            </Moment>
            {/* 投稿本文 */}
            <Link href={`/post/${post?.id}`}>
              <p className='mb-1'>
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
        <IconsContainer postId={post?.id} token={token} userId={user?.id} replyCount={0} favoriteCount={post?.attributes?.favoriteCount}/>
    </div>
  );
};
