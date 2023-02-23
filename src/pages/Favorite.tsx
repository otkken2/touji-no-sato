import { Post } from "@/components/Post/Post";
import { useFavorite } from "lib/useFavorite";
import { useEffect } from "react";

const Favorite = () => {
  const { getMyFavorites, myFavorites } = useFavorite();
  useEffect(()=>{
    getMyFavorites();
  },[]);

  return (
    myFavorites &&
      <div>
        {myFavorites.map((myFavorite)=>{
          return(
            <Post key={myFavorite.attributes?.post?.data?.id} post={myFavorite?.attributes?.post?.data} index={myFavorite.attributes?.post?.data?.id}/>
          );
        })}
      </div>
  );
};

export default Favorite;