import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import { API_URL } from "const";
import { Image, ImageAttributes, Post } from "@/Interface/interfaces";
import axios from "axios";
import Cookies from "js-cookie";
import { useAtom, useAtomValue } from "jotai";
import { descriptionAtom, filesAtom, latAtom, lngAtom, selectedPlaceAtom, userAtom } from "@/atoms/atoms";
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
    if(uploadedFile)console.log('ファイルアップロードされたよ');
    console.log("uploadedFile in uploadMediaFile()");
    console.log(uploadedFile);
    // setUploadedFiles(prev => [...prev,uploadedFile[0]]);
    return uploadedFile;
  };

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
       // 仮
       bathingDay: Date(),
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
