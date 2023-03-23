/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { API_URL } from "const";

interface PostHeaderProps{
  userId?: number;
  username?: string;
  createdAt?: Date;
  userIconUrl?: string;
}

export const PostHeader = (props: PostHeaderProps) => {
  const userId = props.userId;
  const username = props.username;
  const createdAt = props.createdAt;
  const userIconUrl = props.userIconUrl;

  if(!username)return <p>投稿者情報がありません</p>
  return(
    <div className='flex items-center justify-between mb-5 mx-[16px]'>
      <div className='flex'>
        <div className={`w-10 h-10 bg_primary rounded-full`}>
          <Link href={`/profile/${userId}`}>
            {/* TODO: イメージをユーザーが設定できるようにする。 */}
            <img src={userIconUrl ? `${API_URL}${userIconUrl}` : 'myPage.svg'} alt="プロフィール" className='w-full h-full rounded-full'/>
          </Link>
        </div>
        <p className='ml-3 my-auto'>{username}</p>
      </div>
    </div>
  );
}
