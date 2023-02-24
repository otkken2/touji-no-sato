import { descriptionAtom, filesAtom, ryokanAtom, userAtom } from "@/atoms/atoms";
import { UploadForm } from "@/components/Upload/UploadForm";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";
import Cookies from "js-cookie";
import router from "next/router";
import { useEffect } from "react";

const Edit = () => {
  const [files, setFiles] = useAtom(filesAtom);
  const [ryokan, setRyokan] = useAtom(ryokanAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const user = useAtomValue(userAtom);
  const token = Cookies.get('token');
  const { id } = router.query;


  useEffect(()=>{

  });
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
    await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'put',
      body: formData,
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res => console.log('成功！'));
  };

  return (
    <UploadForm handleSubmit={handleSubmit}/>
  );
};

export default Edit;