import Image from "next/image";
interface IconsContainerProps{
  postId: number | undefined;
  token: string | undefined;
  userId: number | undefined;
  replyCount: number | undefined;
  favoriteCount: number | undefined;
  handleClickFavorite: (
    postId:          number | undefined, 
    favoriteCount:   number | undefined, 
    token:           string | undefined, 
    userId:          number | undefined
  ) => Promise<void>
}
export const IconsContainer = (props: IconsContainerProps) => {
  const {postId, token, userId, replyCount = 0, favoriteCount, handleClickFavorite} = props;
  return (
    <div className="icons-container flex justify-around">
      {/* リプライ */}
      <div className="reply-container flex items-center ">
        <Image src='/reply.svg' alt='コメント' width={20} height={20} className='m-3'/>
        <p>{replyCount}</p>
      </div>
      {/* お気に入り登録・解除 */}
      <div className='favorite-container flex items-center' onClick={()=> handleClickFavorite(postId, favoriteCount, token, userId)}>
        <Image src='/favorite.svg' alt='お気に入りに追加' width={20} height={20} className='m-3'/>
        <p>{favoriteCount}</p>
      </div>
    </div>
  );
}