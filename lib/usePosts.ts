import axios from "axios";
import { API_URL } from "const";
import { UserData } from "@/Interface/interfaces";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";
import { descriptionAtom, selectedPlaceAtom } from "@/atoms/atoms";
import { selectAtom } from "jotai/utils";

export const usePosts = () => {
  const token = Cookies.get('token');
  const router = useRouter();
  const setSelectedPlace = useSetAtom(selectedPlaceAtom);
  const setDescription = useSetAtom(descriptionAtom);
  const fetchMyPosts = async (userId: number | undefined) => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${userId}`)
    return response.data;
  }

  const handleDeletePost = async (postId: string) => {
    await fetch(`${API_URL}/api/posts/${postId}`,{
      method: 'delete',
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res=> {
      console.log('記事の削除成功！')
      alert('記事の削除に成功しました。Topページへ戻ります。')
      router.push('/')
    })
  };

  const handleGetContent = (ryokanData: string, descriptionData: string) => {
    // setRyokan(ryokanData);
    setSelectedPlace(ryokanData);
    setDescription(descriptionData);
  };

  const isMovie = (url:string) => {
    return url.includes('.mp4') || url.includes('.MP4') || url.includes('.mov') || url.includes('MOV') || url.includes('WMV') || url.includes('AVI') || url.includes('FLV') || url.includes('MPEG');
  };

  return {fetchMyPosts, isMovie, handleDeletePost, handleGetContent};
};
