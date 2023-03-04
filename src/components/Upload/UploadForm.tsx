/* eslint-disable @next/next/no-img-element */
import { descriptionAtom, filesAtom, ryokanAtom, selectedPlaceAtom } from "@/atoms/atoms";
import { PlacesAutoComplete } from "@/pages/RyokanInfo";
import { Button, TextField } from "@mui/material";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";
import { usePosts } from "lib/usePosts";
import { MuiFileInput } from "mui-file-input";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import ReactPlayer from "react-player";

interface UploadFormProps{
  handleSubmit: (e: any) => Promise<void>;
}
interface PreviewFilesInterface{
  URL: string,
  isMovie: boolean
}
export const UploadForm = (props: UploadFormProps) => {
  const [ryokan, setRyokan] = useAtom(ryokanAtom);
  const selectedPlace = useAtomValue(selectedPlaceAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [files, setFiles] = useAtom(filesAtom);
  const {handleSubmit} = props;
  const [previews, setPreviews] = useState<PreviewFilesInterface[]>([]);
  const { isMovie } = usePosts();


  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files)return;
    const fileURLs: PreviewFilesInterface[] = [...e.target.files].map((eachFile: File) => {
      return {
        URL: URL.createObjectURL(eachFile),
        isMovie: isMovie(eachFile.name)
      }
    })
    setPreviews(fileURLs);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <div className="mb-5 w-full">
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
          {/* <MuiFileInput
            multiple
            variant="filled"
            className="bg-white w-full"
            placeholder="ファイルを選択してください"
            onChange={e => {
              console.log();
              setFiles(e)
            }} */}
          <input
            multiple
            type="file"
            id=""
            onChange={onFileInputChange}
          />
          {previews &&
            previews.map((preview,index) => (
              preview.isMovie ?
                <ReactPlayer key={index} url={preview.URL} controls={true}/>
                :
                <img key={index} src={preview.URL} alt="プレビュー" />
            ))
          }
          <Button onClick={() => setFiles([])}>クリア</Button>
        </div>
        <Button type="submit" variant="contained">投稿</Button>
      </div>
    </form>
  );
};
