/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { API_URL, IS_DEVELOPMENT_ENV } from "const";
import { usePosts } from "lib/usePosts";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/atoms";
import { PostData } from "@/Interface/interfaces";

interface PostHeaderProps{
  userId?: number;
  username?: string;
  createdAt?: Date;
  userIconUrl?: string;
  isDetailPage?: boolean;
  postId?: string;
  ryokan?: string;
  description?: string;
  post?: PostData;
}

export const PostHeader = (props: PostHeaderProps) => {
  const {userId, username, createdAt, userIconUrl, isDetailPage = false, postId, ryokan = '', description = ''} = props;
  const { handleDeletePost, handleGetContent } = usePosts();
  const [showEditDelete, setShowEditDelete] = useState<boolean>(false);
  const router = useRouter();
  const user = useAtomValue(userAtom);

  const handelClickEditIcon = () => {
    handleGetContent(ryokan,description);
    router.push(`/post/${postId}/Edit`);
  };

  const switchIconUrlByEnv = () => {
    if(IS_DEVELOPMENT_ENV){
      return API_URL + userIconUrl;
    }else{
      return userIconUrl;
    }
  }

  const isMyPost = user?.username === username;
  if(!username)return <p>投稿者情報がありません</p>
  return(
    <div className='mb-2 mx-[16px] flex justify-between'>
      <div className='flex'>
        <div className={`w-10 h-10 bg_primary rounded-full`}>
          <Link href={`/profile/${userId}`}>
            <img src={userIconUrl ? switchIconUrlByEnv() : '/mypage.svg'} alt="プロフィール" className='w-full h-full rounded-full'/>
          </Link>
        </div>
        <p className='ml-3 my-auto'>{username}</p>
      </div>
      <div className="relative">
        {/*　【重要】他ユーザーの投稿を編集できないようにする */}
        {isMyPost && isDetailPage &&
          <img src="/ellipsis.png" alt="" className='w-5 h-5 cursor-pointer m-3' onClick={()=> setShowEditDelete(prevState => !prevState)}/>
        }
        {/* 編集と削除(detailPageの場合のみ) */}
        {isDetailPage && postId && showEditDelete &&
          <div className="flex edit-delete absolute justify-around bg-background-secondary rounded-md right-3 w-32 h-12 z-10">
              <img src='/edit.svg' className='cursor-pointer' height={20} width={20} alt="編集" onClick={() => handelClickEditIcon()}/>
            <Image className="mr-3 cursor-pointer" src={'/delete.svg'} height={20} width={20} alt='削除' onClick={()=> handleDeletePost(postId)}/>
          </div>
        }
      </div>
    </div>
  );
}
