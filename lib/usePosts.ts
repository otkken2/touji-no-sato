import axios from "axios";
import { API_URL } from "const";
import { UserData } from "@/Interface/interfaces";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";
import { descriptionAtom, selectedPlaceAtom } from "@/atoms/atoms";
import { selectAtom } from "jotai/utils";
import { SetStateAction } from "jotai/vanilla";
import { useState } from "react";

export const usePosts = () => {
  const token = Cookies.get('token');
  const router = useRouter();
  const setSelectedPlace = useSetAtom(selectedPlaceAtom);
  const setDescription = useSetAtom(descriptionAtom);
  const fetchMyPosts = async (userId: number | undefined) => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${userId}`)
    return response.data;
  }
  const [MediaUrls, setMediaUrls] = useState<string[]>([]);

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

  const getPostByPostId = async (id: string)=> {
    const postDetail = await axios.get(`${API_URL}/api/posts/${id}?populate=*`).then(
      (res) => res.data.data
    );
    return postDetail;
  };

  const handleGetContent = (ryokanData: string = '', descriptionData: string = '') => {
    // setRyokan(ryokanData);
    setSelectedPlace(ryokanData);
    setDescription(descriptionData);
  };

  const isMovie = (url:string) => {
    return url.includes('.mp4') || url.includes('.MP4') || url.includes('.mov') || url.includes('MOV') || url.includes('WMV') || url.includes('AVI') || url.includes('FLV') || url.includes('MPEG');
  };

  const uploadMediaFile = async (profileIcon: File) => {
    const formData = new FormData();
    formData.append('files',profileIcon, profileIcon.name);
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });
    const uploadedFile = await response.json();
    return uploadedFile[0];
  };
  const uploadMediaFiles = async (files: File[]) => {
    const uploadedFiles = files.map(async(eachFile)=>{//ここのブロック内で１ファイルごとにpostした方が良いのかも？どっちも試してみよう。
      const formData = new FormData();
      formData.append('files',eachFile, eachFile.name);
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      const uploadedFile = await response.json();
      console.log('from usePosts↓');
      console.log(uploadedFile);
      return uploadedFile;
    });
    console.log('array from usePosts↓')
    console.log(uploadedFiles);
    return uploadedFiles;
  };

  const fetchMediaUrlsOfPost = async (postId: number| undefined) => {
    if(!postId)return;
    const res = await axios.get(`${API_URL}/api/media-urls-of-posts?filters[postId][$eq]=${postId}`);
    const urls = res.data.data.map((each: any) => each?.attributes?.url);
    setMediaUrls(urls);
  };

  return {
    fetchMyPosts, 
    isMovie, 
    handleDeletePost, 
    handleGetContent, 
    getPostByPostId,
    uploadMediaFiles,
    uploadMediaFile,
    fetchMediaUrlsOfPost,
    MediaUrls,
  };
};
