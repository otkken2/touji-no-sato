import { filesAtom, previewsAtom } from "@/atoms/atoms";
import { useAtom, useSetAtom } from "jotai";
import { usePosts } from "lib/usePosts";
import { ChangeEvent, SetStateAction, useEffect } from "react";
import ReactPlayer from "react-player";
import Image from "next/image";

interface FileInputProps{
    onFileInputChange: (e: ChangeEvent<HTMLInputElement> | SetStateAction<File[]>) => void;
}
export const FileInput = (props:FileInputProps)=>{
    // const {onFileInputChange} = props;
    const { isMovie } = usePosts();
    const [previews,setPreviews] = useAtom(previewsAtom);
    const setFiles = useSetAtom(filesAtom);

    const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
          // @ts-ignore
          const fileURLs: PreviewFilesInterface[] = [...e.target.files].map((eachFile: File) => {
            return {
              URL: URL.createObjectURL(eachFile),
              isMovie: isMovie(eachFile.name)
            }
          })
          setPreviews(fileURLs);
          setFiles(Array.from(e.target.files));
        };
      };

    useEffect(()=>{
        setPreviews([]);
    },[]);
    return (
      <>
        <label className="bg-white text-primary font-bold flex justify-center items-center cursor-pointer h-[50px] w-[full] rounded-md outline-cyan-400 outline mb-8">
          <input
            className='hidden'
            multiple
            type="file"
            id=""
            onChange={onFileInputChange}
          />
          <img src="/pictures.svg" alt="" className="h-[25px] mr-3"/>
          <p className="my-auto align-middlle">写真・動画を選択</p>
        </label>
        {previews.length > 0 &&
          <div className="grid grid-cols-2 w-full">
            {
              previews.map((preview,index) => (
								<div key={index} className='relative bg-black mb-5 mr-2 h-[200px]'>
									{
										preview.isMovie 
										?
											<div key={index} className='flex justify-center'>
											  <ReactPlayer width='95%' height={200} url={preview.URL} controls={true}/>
											</div>
										:
											<Image src={preview.URL} alt="プレビュー画像" width={200} height={200} sizes='100%' className="object-contain m-auto w-full h-full" />
									}
								</div>
              ))
            }
          </div>
        }
      </>
    );
}; 