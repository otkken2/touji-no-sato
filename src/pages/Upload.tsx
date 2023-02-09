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

interface PostInterface{
  description: string;
      ryokan: string;
      images: Image | undefined;
}
const Upload = () => {
  const [selected, setSelected] = useState<null | LatLng>(null);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      description: '',
      ryokan: '',
      images: undefined,
    }
  })

  const onSubmit = async (data: PostInterface) => { 
    console.log(JSON.stringify(data))
    console.log(data)
    const token = Cookies.get('token');
    console.log(token)
    return await axios.post(`${API_URL}/api/posts`,{
      'data':{
        description: data.description,
        ryokan: data.ryokan,
        images: data.images,
      }
    },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res=> {
      console.log(res)
    }).catch(err => {
      console.log('失敗')
      console.log(err);
    });
   }

  return (
    <form className="page-title" onSubmit={handleSubmit(onSubmit)}>
      UPLOAD FROM THIS PAGE
      <div className="flex flex-col">
        <Controller
          name="ryokan"
          control={control}
          render={({ field })=>(
            <TextField {...field} variant="filled" label='旅館・ホテル・温泉地を入力' className="bg-white rounded" placeholder="旅館・ホテル・温泉地の名前をみんなに教えてあげよう！"/>
          )}
        />
        <Controller
          name="description"

          control={control}
          render={({field})=> (
            <TextField {...field}  variant="filled" type="textarea" multiline minRows={5} className="bg-white rounded"/>
            )}
            />
        <Typography>ファイルを選択してください</Typography>
        <Controller
          name="images"
          control={control}
          render={({field})=>(
            <MuiFileInput {...field} className="bg-white rounded" variant="filled"/>
            )}
        />
        <Button type="submit" variant="contained">投稿</Button>
      </div>
    </form>
  );
}

export default Upload;