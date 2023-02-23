import { PostData } from "@/Interface/interfaces";
import Image from "next/image";
import Moment from "react-moment";
import 'moment-timezone';

interface PostHeaderProps{
  // post: PostData;
  username?: string;
  createdAt?: Date;
}

export const PostHeader = (props: PostHeaderProps) => {
  const username = props.username;
  const createdAt = props.createdAt;
  if(!username)return <p>投稿者情報がありません</p>
  return(
    <div className='flex items-center justify-between mb-5'>
      <div className='flex'>
        <div className={`w-10 h-10 bg- rounded-full bg_primary`}>
          <Image src='/mypage.svg' height={100} width={100} alt="プロフィール"/>
        </div>
        <p className='ml-3 my-auto'>{username}</p>
      </div>
      <Moment format='YYYY/MM/DD hh:mm' tz='Asia/Tokyo'>
        {createdAt}
      </Moment>
    </div>
  );
}