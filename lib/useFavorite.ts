import { myFavoritesAtom, userAtom } from "@/atoms/atoms";
import axios from "axios";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";

export const useFavorite = () => {
  const [myFavorites,setMyFavorites] = useAtom(myFavoritesAtom);
  const user = useAtomValue(userAtom);
  

  
  const addFavorite = async (
    postId:        number | undefined,
    favoriteCount: number | undefined, 
    token:         string | undefined, 
    userId:        number | undefined
  ) => {
    if(favoriteCount === undefined)return;
    const myFavoritesIds = myFavorites.map((eachFavorite,index)=> {
      return eachFavorite.attributes?.post?.data?.id;
    });
    
    if(myFavoritesIds.includes(postId)){
      // removeFavorite();
      alert('既に「お気に入り」追加済みです');
      return;
    }

    await axios.post(
      `${API_URL}/api/favorites`,
      {
        data:{
          user: userId,
          post: postId,
        }
      },
      {
        headers:
          {
            Authorization: `Bearer ${token}`
          }
      }
    ).then(async(res) => {
      if(res.status !== 200)return;
      await axios.put(
        `${API_URL}/api/posts/${postId}`,
        {
          data:{
          favoriteCount: favoriteCount + 1,
          },
          headers:{
            Authorization: `Bearer ${token}`
          }
        },
      ).then(result => {
        console.log(result)
        getMyFavorites();
      })
       .catch(err => console.log(err))
    });
  };

  const getMyFavorites = async() => {
    const myFavorites = await axios.get(`${API_URL}/api/favorites?populate=*&filters[user][id][$eq]=${user?.id}`).then(res=> res.data.data);
    // console.log("myFavorites");
    // console.log(myFavorites);
    setMyFavorites((prevState) => myFavorites);
  };

  return {myFavorites, setMyFavorites, addFavorite, getMyFavorites}
}