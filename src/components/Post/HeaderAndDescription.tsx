import Moment from "react-moment";
import 'moment-timezone';
import Link from "next/link";
import { PostHeader } from "./PostHeader";
interface HeaderAndDescriptionProps{
  username?: string;
  createdAt?: Date;
  description?: string;
  userId?: number;
  postId?: number;
}

export const HeaderAndDescription = (props: HeaderAndDescriptionProps) => {
  const { username, createdAt, description, userId, postId } = props;
  return (
    <div className='mx-[16px]'>
      <PostHeader username={username} createdAt={createdAt} userId={userId}/>
      <Moment format='YYYY/MM/DD hh:mm' tz='Asia/Tokyo'>
        {createdAt}
      </Moment>
      {/* 投稿本文 */}
      <Link href={`post/${postId}`}>
        <p className='mb-1'>
          {description}
        </p>
      </Link>
    </div>
  );
};
