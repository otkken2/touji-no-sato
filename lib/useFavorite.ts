import { myFavoritesAtom, userAtom } from "@/atoms/atoms";
import axios from "axios";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";

export const useFavorite = () => {
  const [myFavorites,setMyFavorites] = useAtom(myFavoritesAtom);
  const user = useAtomValue(userAtom);
  type UpdateCountType = 'increase' | 'decrease'
  const myFavoritesIds = myFavorites.map((eachFavorite,index)=> {
    return eachFavorite.attributes?.post?.data?.id;
  });

  const handleFavoriteCount = async (type: UpdateCountType ,postId: number, favoriteCount: number, token: string) => {
    let newFavoriteCount;
    if(type === 'increase'){
      newFavoriteCount = favoriteCount + 1;
    }else{
      newFavoriteCount = favoriteCount - 1;
      if(newFavoriteCount < 0){
        newFavoriteCount = 0;
      }
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

    let newFavoriteCount = favoriteCount;

    if(myFavoritesIds.includes(postId)){
      await clearFavorite(postId,favoriteCount, token);
      newFavoriteCount--;
    }else{
      await addFavorite(userId, postId, token, favoriteCount);
      newFavoriteCount++;
    }

    return newFavoriteCount;
  };

  const getMyFavorites = async() => {
    if(!user)return;
    const myFavorites = await axios.get(`${API_URL}/api/favorites?populate[post][populate]=*&filters[user][id][$eq]=${user?.id}`).then(res=> res.data.data);
    setMyFavorites((prevState) => myFavorites);
    console.log('myFavoritesが更新されたよ！')
  };

  return {myFavorites, setMyFavorites, handleClickFavorite, getMyFavorites, myFavoritesIds}
}
