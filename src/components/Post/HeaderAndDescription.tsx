import { PostHeader } from "./PostHeader";
interface HeaderAndDescriptionProps{
  username?: string;
  createdAt?: Date;
  description?: string;
}

export const HeaderAndDescription = (props: HeaderAndDescriptionProps) => {
  const { username, createdAt, description } = props;
  return (
    <>
      <PostHeader username={username} createdAt={createdAt}/>
      {/* 投稿本文 */}
      <p className='mb-1'>
        {description}
      </p>
    </>
  );
};