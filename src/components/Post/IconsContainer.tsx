import { showReplyFormAtom } from "@/atoms/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useFavorite } from "lib/useFavorite";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
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
      {/* リプライ ※TODO:ゆくゆくは、個別Postにぶらさがる各リプライそれぞれについたリプライ数も表示できるようにしたい */}
        <div className={`reply-container flex items-center ${isReply && 'opacity-50'}`} onClick={() => handleClickReplyIcon()}>
          <Image src='/reply.svg' alt='コメント' width={20} height={20} className='m-3'/>
          { isReply || <p>{replyCount}</p>}
        </div>
      {/* お気に入り登録・解除 */}
      <div className='favorite-container flex items-center' onClick={()=> handleClickFavorite(postId, favoriteCount, token, userId)}>
        { myFavoritesIds.includes(postId)
        ?
          <>
            <Image src='/favorite-red.svg' alt='お気に入り追加済み' width={20} height={20} className='m-3'/>
            <p>{favoriteCount}</p>
          </>
        : 
          <>
            <Image src='/favorite.svg' alt='お気に入りに追加' width={20} height={20} className='m-3'/>
            <p>{favoriteCount}</p>
          </>
        }
        {/* <p>{favoriteCount}</p> */}
      </div>
    </div>
  );
}