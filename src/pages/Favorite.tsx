import Header from "@/components/Header/Header";
import { Post } from "@/components/Post/Post";
import { useFavorite } from "lib/useFavorite";
import { useEffect } from "react";

const Favorite = () => {
  const { getMyFavorites, myFavorites } = useFavorite();
  useEffect(()=>{
    getMyFavorites();
  },[]);

  return (
    <>
      <div className='max-w-[600px] mx-auto'>
        <Header/>
        <h1 className=' text-white text-center my-5 text-2xl'>お気に入り</h1>
        { 
          myFavorites &&
          myFavorites.map((myFavorite)=>{
            return(
              <Post key={myFavorite.attributes?.post?.data?.id} post={myFavorite?.attributes?.post?.data} index={myFavorite.attributes?.post?.data?.id}/>
            );
          })
        }
      </div>
    </>
  );
};

export default Favorite;