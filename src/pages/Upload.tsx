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
import { userAtom } from "@/atoms/atoms";

interface PostInterface{
  description: string;
      ryokan: string;
      images: Image | undefined;
}
const Upload = () => {
  const [files, setFiles] = useState<any>();
  // console.log(files)
  const [ryokan, setRyokan] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const user = useAtomValue(userAtom);
  const [imageId, setImageId] = useState<number>(0);
  // const { control, handleSubmit } = useForm({
  //   defaultValues: {
  //     description: '',
  //     ryokan: '',
  //     images: undefined,
  //   }
  // })
  const token = Cookies.get('token');

  // const onSubmit = async (data: PostInterface) => { 
  //   console.log('投稿のdata')
  //   console.log(data)
  //   const postData = new FormData();
  //   if(data.images){
  //     postData.append('files.images', data.images as unknown as Blob);      
  //   }

  //   const textData = {
  //     description: data.description,
  //     ryokan: data.ryokan,
  //   };

  //   postData.append('data', JSON.stringify(textData));
  //   await axios.post(`${API_URL}/api/posts`,postData,{
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   }).then(res=> {
  //     console.log(res)
  //   }).catch(err => {
  //     console.log('失敗')
  //     console.log(err);
  //   });
  // }


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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <div className="mb-5 w-full">
          <TextField 
            className="bg-white w-full rounded-lg"
            required
            name="ryokan"
            label='旅館・温泉名'
            variant="filled"
            onChange={e => setRyokan(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <TextField 
            required
            className="bg-white w-full rounded-lg mb-8"
            name="description"
            label='本文'
            variant="filled"
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-10">
          <MuiFileInput 
            multiple
            variant="filled" 
            className="bg-white w-full" 
            placeholder="ファイルを選択してください" 
            onChange={e => setFiles(e)}
          />
          <Button onClick={() => setFiles(undefined)}>クリア</Button>
        </div>  
        <Button type="submit" variant="contained">投稿</Button>
      </div>
    </form>
  );
}

export default Upload;