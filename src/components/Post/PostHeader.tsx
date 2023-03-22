/* eslint-disable @next/next/no-img-element */
import { PostData } from "@/Interface/interfaces";
import Image from "next/image";
import Moment from "react-moment";
import 'moment-timezone';
import Link from "next/link";
import { API_URL } from "const";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/atoms";
import { useEffect, useState } from "react";

interface PostHeaderProps{
  // post: PostData;
  userId?: number;
  username?: string;
  createdAt?: Date;
  profileIcon?: string;
}

export const PostHeader = (props: PostHeaderProps) => {
  const userId = props.userId;
  const username = props.username;
  const createdAt = props.createdAt;
  const profileIcon = props.profileIcon;
  const user = useAtomValue(userAtom);
  const [IconUrl, setIconUrl] = useState<string>('');
  // console.log("profileIcon")
  // console.log(profileIcon)
  console.log("user from PostHeader");
  console.log(user);

  useEffect(()=>{
    setIconUrl(user?.profileIcon?.attributes?.url);
  },[user]);


  if(!username)return <p>投稿者情報がありません</p>
  return(
    <div className='flex items-center justify-between mb-5 mx-[16px]'>
      <div className='flex'>
        <div className={`w-10 h-10 rounded-full bg_primary`}>
          <Link href={`/profile/${userId}`}>
            {/* TODO: イメージをユーザーが設定できるようにする。 */}
            {/* <Image src='/sample.JPG' height={100} width={100} alt="プロフィール" className="rounded-full"/> */}
            {/* <img src='/sample.JPG' height={100} width={100} alt="プロフィール" className="rounded-full"/> */}
            <img src={`${API_URL}${IconUrl}`} height={100} width={100} alt="プロフィール" className="rounded-full"/>
          </Link>
        </div>
        <p className='ml-3 my-auto'>{username}</p>
      </div>
    </div>
  );
}
