import { myFavoritesAtom, userAtom } from "@/atoms/atoms";
import axios from "axios";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";

export const useFavorite = () => {
  const [myFavorites,setMyFavorites] = useAtom(myFavoritesAtom);
  const user = useAtomValue(userAtom);
  type UpdateCountType = 'increase' | 'decrease'

  const handleFavoriteCount = async (type: UpdateCountType ,postId: number, favoriteCount: number, token: string) => {
    let newFavoriteCount;
    if(type === 'increase'){
      newFavoriteCount = favoriteCount + 1;
    }else{
      newFavoriteCount = favoriteCount - 1;
    }
    await axios.put(
      `${API_URL}/api/posts/${postId}`,
      {
        data:{
          favoriteCount: newFavoriteCount,
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
  };

  const addFavorite = async (userId: number, postId: number, token: string, favoriteCount: number) => {
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
      handleFavoriteCount('increase',postId, favoriteCount, token);
    });
  };

  const clearFavorite = async (postId: number, favoriteCount: number, token: string) => {
    const targetId: number = await axios.get(`${API_URL}/api/favorites?populate=*&filters[post][id][$eq]=${postId}`).then(res => res.data.data[0].id);
    console.log(targetId);

    await axios.delete(
      `${API_URL}/api/favorites/${targetId}`,
      {headers: {
        Authorization: `Bearer ${token}`
      }})
      .then(async(res) => {
        handleFavoriteCount('decrease', postId, favoriteCount, token);
      })
  };

  const handleClickFavorite = async (
    postId:        number | undefined,
    favoriteCount: number | undefined,
    token:         string | undefined,
    userId:        number | undefined
  ) => {
    if(favoriteCount === undefined)return;
    if(postId === undefined)return;
    if(token === undefined)return;
    if(userId === undefined)return;
    const myFavoritesIds = myFavorites.map((eachFavorite,index)=> {
      return eachFavorite.attributes?.post?.data?.id;
    });

    if(myFavoritesIds.includes(postId)){
      clearFavorite(postId,favoriteCount, token);
    }else{
      addFavorite(userId, postId, token, favoriteCount);
    }
  };

  const getMyFavorites = async() => {
    const myFavorites = await axios.get(`${API_URL}/api/favorites?populate[post][populate]=*&filters[user][id][$eq]=${user?.id}`).then(res=> res.data.data);
    setMyFavorites((prevState) => myFavorites);
  };

  return {myFavorites, setMyFavorites, handleClickFavorite, getMyFavorites}
}
