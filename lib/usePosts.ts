import axios from "axios";
import { API_URL, IS_DEVELOPMENT_ENV, IS_PRODUCTION_ENV, IS_STAGING_ENV } from "const";
import { UserData } from "@/Interface/interfaces";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";
import { bathingDayAtom, descriptionAtom, existingFilesSizeMBAtom, selectedPlaceAtom } from "@/atoms/atoms";
import { selectAtom } from "jotai/utils";
import { SetStateAction } from "jotai/vanilla";
import { useState } from "react";
import { MediaUrlsOfPostInterface } from "@/Interface/interfaces";
import moment from 'moment';



export const usePosts = () => {
  const token = Cookies.get('token');
  const router = useRouter();
  const setSelectedPlace = useSetAtom(selectedPlaceAtom);
  const setDescription = useSetAtom(descriptionAtom);
  const fetchMyPosts = async (userId: number | undefined) => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${userId}`)
    return response.data;
  }
  const [MediaUrls, setMediaUrls] = useState<MediaUrlsOfPostInterface[]>([]);
  const setExistingFilesSizeMB = useSetAtom(existingFilesSizeMBAtom);
  const setBathingDay = useSetAtom(bathingDayAtom);

  const handleDeletePost = async (postId: string) => {
    if(confirm(`この記事を削除します。よろしいですか？`))
    await fetch(`${API_URL}/api/posts/${postId}`,{
      method: 'delete',
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res=> {
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

  const handleGetContent = (ryokanData: string = '', descriptionData: string = '', bathingDay: Date | undefined = undefined) => {
    // setRyokan(ryokanData);
    setSelectedPlace(ryokanData);
    setDescription(descriptionData);
    if(bathingDay === null){
      setBathingDay(undefined);
    }else{
      setBathingDay(moment(bathingDay).format('YYYY-MM-DD'));
    }
  };

  const isMovie = (url:string) => {
    return url.includes('.mp4') || url.includes('.MP4') || url.includes('.mov') || url.includes('MOV') || url.includes('WMV') || url.includes('AVI') || url.includes('FLV') || url.includes('MPEG');
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
      return uploadedFile;
    });
    return uploadedFiles;
  };

  const fetchMediaUrlsOfPost = async (postId: number| undefined) => {
    if(!postId)return;
    const res = await axios.get(`${API_URL}/api/media-urls-of-posts?filters[postId][$eq]=${postId}`);
    // dev環境→API_URL+url, staging&production環境->urlのみ
    const mediaUrlsOfPost: MediaUrlsOfPostInterface[] = res.data.data.map((each: any) => {
      if(IS_STAGING_ENV || IS_PRODUCTION_ENV){ //環境によってurlの形式が変わるので分岐
        
        const mediaUrlsOfPost: MediaUrlsOfPostInterface = {
          url: each.attributes.url,
          fileSizeMB: each.attributes.fileSizeMB,
        }
        return mediaUrlsOfPost;

      }else{
        
        const mediaUrlsOfPost: MediaUrlsOfPostInterface = {
          url: `${API_URL}${each.attributes.url}`,
          fileSizeMB: each.attributes.fileSizeMB,
        }
        return mediaUrlsOfPost;
      }
    });
    setMediaUrls(mediaUrlsOfPost);

    // 一つの投稿の中にあるファイルのサイズ
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
    return uploadedFile;
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
