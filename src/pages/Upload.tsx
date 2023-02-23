import { Button, Input,InputProps, TextField, Typography} from "@mui/material";
import GoogleMapReact from "google-map-react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";

import { Controller, useForm } from "react-hook-form"
import { MuiFileInput } from "mui-file-input";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from "@reach/combobox";
import { PlacesAutoComplete } from "./RyokanInfo";
import { useState } from "react";
import { LatLng } from "use-places-autocomplete";
import { API_URL } from "const";
import { Image, Post } from "@/Interface/interfaces";
import axios from "axios";
import Cookies from "js-cookie";
import { useAtom, useAtomValue } from "jotai";
import { descriptionAtom, filesAtom, ryokanAtom, selectedPlaceAtom, userAtom } from "@/atoms/atoms";
import { UploadForm } from "@/components/Upload/UploadForm";
import { useRouter } from "next/router";
import { usePosts } from "lib/usePosts";

interface PostInterface{
  description: string;
      ryokan: string;
      images: Image | undefined;
}
const Upload = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries: ["places"],
  });
  const files = useAtomValue(filesAtom);
  // const ryokan = useAtomValue(ryokanAtom);
  const selectedPlace = useAtomValue(selectedPlaceAtom);
  const description = useAtomValue(descriptionAtom);

  const user = useAtomValue(userAtom);
  const token = Cookies.get('token');
  const router = useRouter();


  const handleSubmit = async(e: any) => {
    e.preventDefault();
    console.log('handleSubmit')
    console.log(files);
    console.log(user);
    console.log(selectedPlace);
    const formData = new FormData();

    files.map((file:any)=> {
      formData.append('files.Image',file, file.name);
    })
    // formData.append('files.Image', files);

    const textData = {
      ryokan: selectedPlace,
      description: description,
      user: user?.id,
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
      router.push('/Mypage')
    });
  };

  return (
    isLoaded && 
      <UploadForm handleSubmit={handleSubmit}/>
  );
}

export default Upload;