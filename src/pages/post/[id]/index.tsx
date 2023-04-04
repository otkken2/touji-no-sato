/* eslint-disable @next/next/no-img-element */
import axios, { AxiosResponse } from "axios";
import { API_URL } from "const";
import { PostData } from "@/Interface/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { descriptionAtom, filesAtom, previewsAtom, showReplyFormAtom, userAtom } from "@/atoms/atoms";
import Cookies from "js-cookie";
import { Post } from "@/components/Post/Post";
import { Button, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { FileInput } from "@/components/Post/FileInput";
import { SetStateAction } from "jotai/vanilla";

const ShowPostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<PostData>();
  const setFiles = useSetAtom(filesAtom);
  const token = Cookies.get('token');
  const [replies, setReplies] = useState<PostData[]>([]);
  const [replyText, setReplyText] = useState<string>('');
  // const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const [replyFiles, setReplyFiles] = useAtom(filesAtom);
  const user = useAtomValue(userAtom);
  const [hasPostedReply, setHasPostedReply] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previews, setPreviews] = useAtom(previewsAtom);
  const [showReplyForm, setShowReplyForm] = useAtom(showReplyFormAtom);

  useEffect(()=>{
    const getPostDetail = async() => {
      if(!router.isReady)return;
      return await axios.get(`${API_URL}/api/posts/${id}?populate=*`).then(
        (res): void => {
          setData(res.data.data);
        }
      ).catch(error=> {
        if(error.response.status === 404)router.push('/')
      })
    };
    getPostDetail();
  },[id,router]);

  useEffect(()=>{
    if(!router.isReady)return;
    const getReplies = async() => {
      const res = await axios.get(`${API_URL}/api/posts?populate=*&filters[parentPostId][$eq]=${id}`);
      console.log('ReplyData[]');
      console.log(res.data?.data);
      if(res.data === undefined)return;
      setReplies(res.data.data);
    };
    getReplies()
  },[id, router, hasPostedReply, previews]);


  const handleSubmit = async(e:any) => {
    e.preventDefault();
    setIsUploading(true);
    console.log('handleSubmit run')
    const formData = new FormData();

    replyFiles.map((file: File)=>{
      formData.append('files.Image', file);
    });

    const data = {
      description: replyText,
      user: user?.id,
      parentPostId: id,
    }
    formData.append('data', JSON.stringify(data));
    await fetch(`${API_URL}/api/posts`,{
      method: 'post',
      body: formData,
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      console.log('リプの投稿に成功しました。')
      setHasPostedReply(true);
      setIsUploading(false);
      setPreviews([]);
      setReplyText('');
      setShowReplyForm(false);
    })
  };

  return (
    <div className='max-w-[600px] mx-auto relative'>
      {
        router.isReady &&
        <div className="">
          <Post post={data} isDetailPage={true} postId={String(id)}/>
        </div>
      }
      {/* リプライ作成フォーム */}
      {showReplyForm && 
      <div className="fixed bg-background border-t border-x  rounded-t-lg w-[100%] pt-8 bottom-[50px] h-[40vh]">
        <form onSubmit={handleSubmit} className='w-[90%] flex flex-col mx-auto text-white '>
          <div className="mb-5">
            <TextField
              required
              multiline
              placeholder="返信を入力"
              name='text'
              variant="filled"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              inputProps={{
                style: {
                  color: 'white'
                }
              }}
              className="bg-background-secondary text-white w-full rounded-lg "
              InputLabelProps={{
                style: {
                  color: 'white'
                }
              }}
            />
          </div>
          <div className="mx-auto w-full">
            <FileInput onFileInputChange={(e)=> setReplyFiles(e as SetStateAction<File[]>)}/>
          </div>
          <button type="submit" className="bg-primary h-10 w-full mx-auto rounded-lg mb-10">返信</button>
        </form>
        <div className="text-white text-center mx-auto flex justify-center h-10 bg-background-secondary w-[100px] rounded-full" onClick={()=> setShowReplyForm(false)}>
          <img src="/arrow_bottom.png" alt="" className='w-7'/>
        </div>
      </div>
      }
      {isUploading && <p className="text-white font-bold">アップロード中です。しばらくお待ちください。。。</p>}
      {/* リプライ一覧 */}

      <div className={`mb-20 text-white mt-5 ${showReplyForm ? 'mb-[47vh]' : ''}`}>
        {/* {replies.length > 0 && showReplies && */}
        {replies.length > 0 &&
          replies.map(eachReply => {
            if(eachReply.attributes?.user?.data?.attributes?.username &&
               eachReply.attributes?.createdAt &&
               eachReply.attributes?.description
            ){
              return (
                <Post post={eachReply} key={eachReply.id} />
              );
            }
          })
        }
      </div>
    </div>
  );
};

export default ShowPostDetail;
