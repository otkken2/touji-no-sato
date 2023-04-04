import { showReplyFormAtom } from "@/atoms/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useFavorite } from "lib/useFavorite";
import Image from "next/image";
interface IconsContainerProps{
  postId: number | undefined;
  token: string | undefined;
  userId: number | undefined;
  replyCount: number | undefined;
  favoriteCount: number | undefined;
  isReply?: boolean
}
export const IconsContainer = (props: IconsContainerProps) => {
  const {postId, token, userId, replyCount = 0, favoriteCount, isReply = false} = props;
  const [showReplyForm, setShowReplyForm] = useAtom(showReplyFormAtom);
  const { handleClickFavorite, myFavoritesIds} = useFavorite();

  const handleClickReplyIcon = () => {
    if(isReply)return;
    setShowReplyForm(!showReplyForm);
  };
  return (
    <div className="icons-container flex justify-around">
      {/* リプライ */}
      {isReply || 
        <div className="reply-container flex items-center" onClick={() => handleClickReplyIcon()}>
          <Image src='/reply.svg' alt='コメント' width={20} height={20} className='m-3'/>
          <p>{replyCount}</p>
        </div>
      }
      {/* お気に入り登録・解除 */}
      <div className='favorite-container flex items-center' onClick={()=> handleClickFavorite(postId, favoriteCount, token, userId)}>
        { myFavoritesIds.includes(postId)
        ?
          <Image src='/favorite-red.png' alt='お気に入り追加済み' width={20} height={20} className='m-3'/>
        : 
          <Image src='/favorite.svg' alt='お気に入りに追加' width={20} height={20} className='m-3'/>
        }
        <p>{favoriteCount}</p>
      </div>
    </div>
  );
}