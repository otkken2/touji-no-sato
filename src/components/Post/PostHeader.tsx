import { PostData } from "@/Interface/interfaces";
import Image from "next/image";
import Moment from "react-moment";
import 'moment-timezone';
import Link from "next/link";

interface PostHeaderProps{
  // post: PostData;
  userId?: number;
  username?: string;
  createdAt?: Date;
}

export const PostHeader = (props: PostHeaderProps) => {
  const userId = props.userId;
  const username = props.username;
  const createdAt = props.createdAt;
  if(!username)return <p>投稿者情報がありません</p>
  return(
    <div className='flex items-center justify-between mb-5 mx-[16px]'>
      <div className='flex'>
        <div className={`w-10 h-10 bg- rounded-full bg_primary`}>
          <Link href={`/profile/${userId}`}>
            {/* TODO: イメージをユーザーが設定できるようにする。 */}
            <Image src='/sample.JPG' height={100} width={100} alt="プロフィール" className="rounded-full"/>
          </Link>
        </div>
        <p className='ml-3 my-auto'>{username}</p>
      </div>
    </div>
  );
}
