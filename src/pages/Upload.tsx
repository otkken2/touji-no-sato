import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import { API_URL } from "const";
import { Image, Post } from "@/Interface/interfaces";
import axios from "axios";
import Cookies from "js-cookie";
import { useAtom, useAtomValue } from "jotai";
import { descriptionAtom, filesAtom, latAtom, lngAtom, selectedPlaceAtom, userAtom } from "@/atoms/atoms";
import { UploadForm } from "@/components/Upload/UploadForm";
import { useRouter } from "next/router";

interface PostInterface{
  description: string;
      ryokan: string;
      images: Image | undefined;
}
const Upload = () => {
  const files = useAtomValue(filesAtom);
  const selectedPlace = useAtomValue(selectedPlaceAtom);
  const description = useAtomValue(descriptionAtom);
  const lat = useAtomValue(latAtom);
  const lng = useAtomValue(lngAtom);

  const user = useAtomValue(userAtom);
  const token = Cookies.get('token');
  const router = useRouter();


  const handleSubmit = async(e: any) => {
    e.preventDefault();
    console.log('handleSubmit')
    console.log(files);
    console.log(selectedPlace);
    const formData = new FormData();

    files?.map((file:any)=> {
      formData.append('files.Image',file, file.name);
    })

    const textData = {
      ryokan: selectedPlace,
      description: description,
      user: user?.id,
      lat: lat,
      lng: lng,
    }
    formData.append('data', JSON.stringify(textData));
    await fetch(`${API_URL}/api/posts`, {
      method: 'post',
      body: formData,
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      alert('投稿に成功しました');
      router.push('/')
    });
  };

  return (
    <UploadForm handleSubmit={handleSubmit} title='新規投稿'/>
  );
}

export default Upload;
