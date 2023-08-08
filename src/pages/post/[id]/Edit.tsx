import { bathingDayAtom, descriptionAtom, filesAtom, infoBalloonAtom, latAtom, lngAtom, selectedPlaceAtom, userAtom } from "@/atoms/atoms";
import { UploadForm } from "@/components/Upload/UploadForm";
import { ImageAttributes } from "@/Interface/interfaces";
import axios from "axios";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";
import Cookies from "js-cookie";
import { usePosts } from "lib/usePosts";
import router from "next/router";
import { useEffect } from "react";

const Edit = () => {
  const [files, setFiles] = useAtom(filesAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const user = useAtomValue(userAtom);
  const token = Cookies.get('token');
  const { id } = router.query;
  const selectedPlace = useAtomValue(selectedPlaceAtom);
  const lat = useAtomValue(latAtom);
  const lng = useAtomValue(lngAtom);
  const {uploadMediaFile} = usePosts();
  const [balloonText,setBalloonText] = useAtom(infoBalloonAtom);
  const bathingDay = useAtomValue(bathingDayAtom);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setBalloonText('投稿の更新をしています。少々お待ちください。')

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
    }
    formData.append('data', JSON.stringify(textData));
    await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'put',
      body: formData,
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(async res => {
      if (!flattenedUploadedFiles) return;
      for (const eachFile of flattenedUploadedFiles) {
        let fileSizeMB: number;
        fileSizeMB = eachFile.size / 1024;

        const data = {
          postId: id,
          mediaAssetId: eachFile.id,
          url: eachFile.url,
          fileSizeMB: fileSizeMB,
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

      setFiles([]);
      setBalloonText('投稿の更新に成功しました');
      router.push(`/post/${id}`);
    });
  }

  return (
    id && typeof id === 'string' &&
    <UploadForm handleSubmit={handleSubmit} title='編集' postId={id} isEditPage={true}/>
  );
};

export default Edit;