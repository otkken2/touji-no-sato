import axios from "axios";
import { API_URL } from "const";
import { UserData } from "interfaces";

export const usePosts = () => {
  const fetchMyPosts = async (userId: number | undefined) => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${userId}`)
      // .then(res =>{
      //   return res.data.data
      // });
    return response.data;
  }
  return {fetchMyPosts};
};