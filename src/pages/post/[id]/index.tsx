/* eslint-disable @next/next/no-img-element */
import axios, { AxiosResponse } from "axios";
import { API_URL } from "const";
import { PostData } from "@/Interface/interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { descriptionAtom, filesAtom, ryokanAtom, userAtom } from "@/atoms/atoms";
import Cookies from "js-cookie";
import { Post } from "@/components/Post/Post";
import { Button, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";

const ShowPostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<PostData>();
  const setRyokan = useSetAtom(ryokanAtom);
  const setDescription = useSetAtom(descriptionAtom);
  const setFiles = useSetAtom(filesAtom);
  const token = Cookies.get('token');
  const [replies, setReplies] = useState<PostData[]>([]);
  const [replyText, setReplyText] = useState<string>('');
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const user = useAtomValue(userAtom);
  const [hasPostedReply, setHasPostedReply] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleGetContent = () => {
    setRyokan(data?.attributes?.ryokan);
    setDescription(data?.attributes?.description);
  };

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
  },[id, router, hasPostedReply]);

  const handleDeletePost = async () => {
    await fetch(`${API_URL}/api/posts/${id}`,{
      method: 'delete',
      headers:{
        Authorization: `Bearer ${token}`
      }
    }).then(res=> {
      console.log('記事の削除成功！')
      alert('記事の削除に成功しました。Topページへ戻ります。')
      router.push('/')
    })
  };

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
    })
  };

  return (
    <>
      {
        router.isReady &&
        <Post post={data} isDetailPage={true} postId={id} handleGetContent={handleGetContent} handleDeletePost={handleDeletePost}/>
      }
      <hr />
      {/* リプライ作成フォーム */}
      <form onSubmit={handleSubmit} className='w-full flex flex-col text-white'>
        <TextField
          required
          multiline
          placeholder="返信を入力"
          name='text'
          variant="filled"
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          className='text-white'
        />
        <MuiFileInput
          multiple
          variant="filled"
          placeholder="ファイルを選択"
          onChange={e => setReplyFiles(e)}
        />
        <Button type="submit" variant="contained">返信</Button>
      </form>
      {isUploading && <p className="text-white font-bold">アップロード中です。しばらくお待ちください。。。</p>}
      {/* リプライ一覧 */}
      <div className="mb-20 text-white mt-5">
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
    </>
  );
};

export default ShowPostDetail;
