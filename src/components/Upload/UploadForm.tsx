import { descriptionAtom, filesAtom, ryokanAtom, selectedPlaceAtom } from "@/atoms/atoms";
import { PlacesAutoComplete } from "@/pages/RyokanInfo";
import { Button, TextField } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { MuiFileInput } from "mui-file-input";
import { SetStateAction, useEffect } from "react";

interface UploadFormProps{
  handleSubmit: (e: any) => Promise<void>;
}
export const UploadForm = (props: UploadFormProps) => {
  const [ryokan, setRyokan] = useAtom(ryokanAtom);
  const selectedPlace = useAtomValue(selectedPlaceAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [files, setFiles] = useAtom(filesAtom);
  const {handleSubmit} = props;
  useEffect(()=>{
    console.log(files);
  })
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <div className="mb-5 w-full">
          {/* <TextField 
            className="bg-white w-full rounded-lg"
            required
            name="ryokan"
            label='旅館・温泉名'
            variant="filled"
            value={ryokan}
            onChange={e => setRyokan(e.target.value)}
          /> */}
          <PlacesAutoComplete />
        </div>
        <div className="mb-5">
          <TextField 
            required
            className="bg-white w-full rounded-lg mb-8"
            name="description"
            label='本文'
            variant="filled"
            value={description}
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
          <Button onClick={() => setFiles([])}>クリア</Button>
        </div>  
        <Button type="submit" variant="contained">投稿</Button>
      </div>
    </form>
  );
};