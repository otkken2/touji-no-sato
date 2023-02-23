import { PostData } from "@/Interface/interfaces";
import { API_URL } from "const";
import Link from "next/link";
import { PlaceLink } from "./PlaceLink";
import { PostHeader } from "./PostHeader";
import Image from "next/image";
import { useFavorite } from "lib/useFavorite";
import Cookies from "js-cookie";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/atoms";

interface PostsProps{
  post: PostData | undefined;
  index: number | undefined;

}
export const Post = (props: PostsProps) => {
  const {post, index} = props;
  const token = Cookies.get('token');
  const user = useAtomValue(userAtom);
  
  const { handleClickFavorite } = useFavorite();
  if(post === undefined)return <></>;
  if(!post?.attributes?.user?.data?.attributes?.username || !post?.attributes?.createdAt)return <></>;
  return(
    <div key={index} className={`post-${index} text-white mb-10`}>
      <Link  href={`post/${post.id}`}>
        <PostHeader username={post?.attributes?.user?.data?.attributes?.username} createdAt={post?.attributes?.createdAt}/>
        {/* 投稿本文 */}
        <p className='mb-1'>
          {post?.attributes?.description}
        </p>
      </Link>
        {/* 旅館情報 */}
      {
        post.attributes?.ryokan && 
        <PlaceLink ryokan={post.attributes?.ryokan}/>
      }
      <Link href={`post/${post.id}`}>
        {/* 画像 */}
        {post?.attributes?.Image?.data?.map((eachData:any,ImageIndex:number)=>{
          return(
            // eslint-disable-next-line @next/next/no-img-element
            <img key={ImageIndex} src={`${API_URL}${eachData.attributes.url}`} alt="" className='w-full' />
            );
        })}
      </Link>
      {/* お気に入り登録・解除 */}
      <div className='favorite-container flex items-center' onClick={()=> handleClickFavorite(post?.id, post?.attributes?.favoriteCount,token, user?.id)}>
        <Image src='/favorite.svg' alt='お気に入りに追加' width={20} height={20} className='m-3'/>
        <p>{post?.attributes?.favoriteCount}</p>
      </div>
    </div>
  );
};