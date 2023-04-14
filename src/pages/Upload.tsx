import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import { API_URL } from "const";
import { Image, ImageAttributes, Post } from "@/Interface/interfaces";
import axios from "axios";
import Cookies from "js-cookie";
import { useAtom, useAtomValue } from "jotai";
import { bathingDayAtom, descriptionAtom, filesAtom, latAtom, lngAtom, selectedPlaceAtom, userAtom } from "@/atoms/atoms";
import { UploadForm } from "@/components/Upload/UploadForm";
import { useRouter } from "next/router";
import { usePosts } from "lib/usePosts";
import { useState } from "react";

interface PostInterface{
  description: string;
      ryokan: string;
      images: Image | undefined;
}
const Upload = () => {
  const [files, setFiles] = useAtom(filesAtom);
  const selectedPlace = useAtomValue(selectedPlaceAtom);
  const description = useAtomValue(descriptionAtom);
  const lat = useAtomValue(latAtom);
  const lng = useAtomValue(lngAtom);

  const user = useAtomValue(userAtom);
  const token = Cookies.get('token');
  const router = useRouter();
  const bathingDay = useAtomValue(bathingDayAtom);

  console.log("bathingDay")
  console.log(bathingDay)

  const uploadMediaFile = async (profileIcon: File) => {
    const formData = new FormData();
    formData.append('files',profileIcon, profileIcon.name);

    console.log('uploadMediaFile関数の引数ファイル確認↓');
    console.log(profileIcon);
    for (let [key, value] of formData.entries()) { 
      console.log('↓formDataの確認↓');
      console.log(key, value);
    }

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });
    const uploadedFile = await response.json();
    if(uploadedFile)console.log('ファイルアップロードされたよ');
    console.log("uploadedFile in uploadMediaFile()");
    console.log(uploadedFile);
    // setUploadedFiles(prev => [...prev,uploadedFile[0]]);
    return uploadedFile;
  };

  // console.log("new Date().toISOString()↓")
  // console.log(new Date().toISOString())

  // console.log("new Date()↓");
  // console.log(new Date());

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
  
    let flattenedUploadedFiles: ImageAttributes[] = [];
  
    if (files) {
      console.log("画像ファイルあるよ");
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
    await fetch(`${API_URL}/api/posts`, {
      method: "post",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      const post: Post = await res.json();
      if (!post) return;
      const postId = post.data?.id;
      if (!flattenedUploadedFiles) return;
      console.log("flattenedUploadedFilesあるよ");
      console.log("flattenedUploadedFiles↓");
      console.log(flattenedUploadedFiles);
      for (const eachFile of flattenedUploadedFiles) {
        const data = {
          postId: postId,
          mediaAssetId: eachFile.id,
          url: eachFile.url,
        };
  
        await axios
          .post(
            `${API_URL}/api/media-urls-of-posts`,
            {
              data: data,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => console.log("mediaUrlsOfPostsの投稿に成功しました"))
          .catch((err) => console.log(err));
      }
      // alert("Postの投稿に成功しました");
      // setUploadedFiles([]);
      setFiles([]);
      router.push("/");
    });
  };
  
  
  
  
  return (
    <UploadForm handleSubmit={handleSubmit} title='新規投稿'/>
  );
}

export default Upload;
