import axios from "axios";
import { API_URL } from "const";
import { UserData } from "interfaces";

export const usePosts = () => {
  const fetchMyPosts = async (userId: number | undefined) => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${userId}`)
    return response.data;
  }
  const addFavorite = async (postId: number | undefined ,favoriteCount: number | undefined, token: string | undefined, userId: number | undefined) => {
    if(favoriteCount === undefined)return;
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
      ).then(result => console.log(result))
      .catch(err => console.log(err))
    });
    
  };
  return {fetchMyPosts, addFavorite};
};