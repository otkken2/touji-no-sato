import axios from "axios";
import { API_URL } from "const";
import { UserData } from "@/Interface/interfaces";

export const usePosts = () => {
  const fetchMyPosts = async (userId: number | undefined) => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${userId}`)
    return response.data;
  }

  const isMovie = (url:string) => {
    return url.includes('.mp4') || url.includes('.MP4') || url.includes('.mov') || url.includes('MOV') || url.includes('WMV') || url.includes('AVI') || url.includes('FLV') || url.includes('MPEG');
  };

  return {fetchMyPosts, isMovie};
};
