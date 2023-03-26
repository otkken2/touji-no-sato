/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { API_URL } from "const";
import { usePosts } from "lib/usePosts";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/atoms";

interface PostHeaderProps{
  userId?: number;
  username?: string;
  createdAt?: Date;
  userIconUrl?: string;
  isDetailPage?: boolean;
  postId?: string;
  ryokan?: string;
  description?: string;
}

export const PostHeader = (props: PostHeaderProps) => {
  const {userId, username, createdAt, userIconUrl, isDetailPage = false, postId, ryokan = '', description = ''} = props;
  const { handleDeletePost, handleGetContent } = usePosts();
  const [showEditDelete, setShowEditDelete] = useState<boolean>(false);
  const router = useRouter();
  const user = useAtomValue(userAtom);

  // console.log("ryokan")
  // console.log(ryokan)
  // console.log("description")
  // console.log(description)
  // console.log("isDetailPage")
  // console.log(isDetailPage)
  // console.log("postId")
  // console.log(postId)
  const handelClickEditIcon = () => {
    if(!ryokan && !description)return;
    handleGetContent(ryokan,description);
    router.push(`/post/${postId}/Edit`);
  };

  const isMyPost = user?.username === username;
  if(!username)return <p>投稿者情報がありません</p>
  return(
    <div className='mb-2 mx-[16px] flex justify-between'>
      <div className='flex'>
        <div className={`w-10 h-10 bg_primary rounded-full`}>
          <Link href={`/profile/${userId}`}>
            {/* TODO: イメージをユーザーが設定できるようにする。 */}
            <img src={userIconUrl ? `${API_URL}${userIconUrl}` : '/mypage.svg'} alt="プロフィール" className='w-full h-full rounded-full'/>
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
        {isDetailPage && postId && ryokan && description && showEditDelete &&
          <div className="flex edit-delete absolute justify-around bg-background-secondary rounded-md right-3 w-32 h-12 z-10">
            {/* <Link className="mr-3  bg-red-200" href={`/post/${postId}/Edit`} onClick={()=>{handleGetContent(ryokan,description)}}> */}
              <img src='/edit.svg' className='cursor-pointer' height={20} width={20} alt="編集" onClick={() => handelClickEditIcon()}/>
            {/* </Link> */}
            <Image className="mr-3 cursor-pointer" src={'/delete.svg'} height={20} width={20} alt='削除' onClick={()=> handleDeletePost(postId)}/>
          </div>
        }
      </div>
    </div>
  );
}
