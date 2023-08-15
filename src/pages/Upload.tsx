import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import { API_URL, TIME_LIMIT_FOR_MOVIE, TIME_LIMIT_OF_INFO_BALLOON } from "const";
import { Image, ImageAttributes, Post } from "@/Interface/interfaces";
import axios from "axios";
import Cookies from "js-cookie";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { bathingDayAtom, descriptionAtom, filesAtom, infoBalloonAtom, isErrorAtom, latAtom, lngAtom, previewsAtom, selectedPlaceAtom, timelimitAtom, userAtom } from "@/atoms/atoms";
import { UploadForm } from "@/components/Upload/UploadForm";
import { useRouter } from "next/router";
import { usePosts } from "lib/usePosts";
import { useEffect, useState } from "react";

interface PostInterface{
  description: string;
      ryokan: string;
      images: Image | undefined;
}
const Upload = () => {
  const [files, setFiles] = useAtom(filesAtom);
  const setPreviews = useSetAtom(previewsAtom);
  const [selectedPlace, setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [lat,setLat] = useAtom(latAtom);
  const [lng,setLng] = useAtom(lngAtom);

  const user = useAtomValue(userAtom);
  const token = Cookies.get('token');
  const router = useRouter();
  const bathingDay = useAtomValue(bathingDayAtom);
  const setBalloonText = useSetAtom(infoBalloonAtom);
  const [timelimit, setTimelimit] = useAtom(timelimitAtom)
  const setIsError = useSetAtom(isErrorAtom);

  useEffect(()=>{
    setLat(0);
    setLng(0);
    setTimelimit(TIME_LIMIT_FOR_MOVIE);
  },[]);

  const uploadMediaFile = async (profileIcon: File) => {
    const formData = new FormData();
    formData.append('files',profileIcon, profileIcon.name);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error uploading file:', error);
      setIsError(true);
      setBalloonText('ファイルのアップロードに失敗しました')
      throw new Error('Error uploading file');
    }

    const uploadedFile = await response.json();
    return uploadedFile;
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setBalloonText('アップロード中です。このままお待ちください。')
    const formData = new FormData();
  
    let flattenedUploadedFiles: ImageAttributes[] = [];
  
    if (files) {
      const uploadedFilesPromises = files.map((file) => uploadMediaFile(file));
      const allUploadedFiles: ImageAttributes[][] = await Promise.all(uploadedFilesPromises);
      flattenedUploadedFiles = allUploadedFiles.flat();
    }
  
    const textData = {
      ryokan: selectedPlace,
      description: description,
      user: user?.id,
      lat: lat,
      lng: lng,
      bathingDay: bathingDay,
    };
    formData.append("data", JSON.stringify(textData));
  
    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: "post",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        setIsError(true);
        setBalloonText('記事の投稿に失敗しました。')
        throw new Error('API /api/posts failed');
      }
  
      const post: Post = await response.json();
      const postId = post.data?.id;
      
      for (const eachFile of flattenedUploadedFiles) {
        let fileSizeMB: number = eachFile.size / 1024;
        const data = {
          postId: postId,
          mediaAssetId: eachFile.id,
          url: eachFile.url,
          fileSizeMB: fileSizeMB
        };
  
        const axiosResponse = await axios.post(
          `${API_URL}/api/media-urls-of-posts`,
          { data: data },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (axiosResponse.status !== 200) {
          setIsError(true);
          setBalloonText('ファイルのアップロードに失敗しました')
          throw new Error('API /api/media-urls-of-posts failed');
        }
      }
  
      setSelectedPlace('');
      setFiles([]);
      setPreviews([]);
      setDescription('');
      router.push("/");
      setTimelimit(TIME_LIMIT_OF_INFO_BALLOON);
      setBalloonText('投稿に成功しました');
  
    } catch (error) {
      console.error(error);
      
      setBalloonText('投稿に失敗しました');
    }
  };
  
  
  return (
    <UploadForm handleSubmit={handleSubmit} title='新規投稿'/>
  );
}

export default Upload;
