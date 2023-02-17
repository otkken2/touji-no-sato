import { Button, Input,InputProps, TextField, Typography} from "@mui/material";
import GoogleMapReact from "google-map-react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";

import { Controller, useForm } from "react-hook-form"
import { MuiFileInput } from "mui-file-input";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover } from "@reach/combobox";
import { PlacesAutocomplete } from "./RyokanInfo";
import { useState } from "react";
import { LatLng } from "use-places-autocomplete";
import { API_URL } from "const";
import { Image, Post } from "interfaces";
import axios from "axios";
import Cookies from "js-cookie";
import { useAtom, useAtomValue } from "jotai";
import { descriptionAtom, filesAtom, ryokanAtom, userAtom } from "@/atoms/atoms";
import { UploadForm } from "@/components/Upload/UploadForm";

interface PostInterface{
  description: string;
      ryokan: string;
      images: Image | undefined;
}
const Upload = () => {
  const files = useAtomValue(filesAtom);
  const ryokan = useAtomValue(ryokanAtom);
  const description = useAtomValue(descriptionAtom);

  const user = useAtomValue(userAtom);

  const token = Cookies.get('token');

  const handleSubmit = async(e: any) => {
    e.preventDefault();
    console.log('handleSubmit')
    console.log(files);
    console.log(user);
    const formData = new FormData();

    files.map((file:any)=> {
      formData.append('files.Image',file, file.name);
    })
    // formData.append('files.Image', files);

    const textData = {
      ryokan: ryokan,
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
    }).then(res => console.log('成功！'));
  };

  return (
    <UploadForm handleSubmit={handleSubmit}/>
  );
}

export default Upload;