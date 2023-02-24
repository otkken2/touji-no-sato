import { PlaceLink } from "@/components/Post/PlaceLink";
import { PostHeader } from "@/components/Post/PostHeader";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "const";
import { PostData } from "@/Interface/interfaces";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSetAtom } from "jotai";
import { descriptionAtom, filesAtom, ryokanAtom } from "@/atoms/atoms";
import Cookies from "js-cookie";
import { Post } from "@/components/Post/Post";
import { Reply, ReplyData } from "@/Interface/reply";
import { HeaderAndDescription } from "@/components/Post/HeaderAndDescription";

const ShowPostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<PostData>();
  const setRyokan = useSetAtom(ryokanAtom);
  const setDescription = useSetAtom(descriptionAtom);
  const setFiles = useSetAtom(filesAtom);
  const token = Cookies.get('token');
  const [replies, setReplies] = useState<ReplyData[]>([]);

  const handleGetContent = () => {
    setRyokan(data?.attributes?.ryokan);
    setDescription(data?.attributes?.description);
    // setFiles();
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
      const res = await axios.get(`${API_URL}/api/replies?populate[post][populate]=*&populate[user]=*&filters[post][id][$eq]=${id}`);
      console.log('ReplyData[]');
      console.log(res.data?.data);
      if(res.data === undefined)return;
      setReplies(res.data.data);
    };
    getReplies()
  },[id, router]);
  
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

  return ( 
    <>
      {
        router.isReady &&
        <Post post={data} isDetailPage={true} postId={id} handleGetContent={handleGetContent} handleDeletePost={handleDeletePost}/>
      }
      <hr />
      <div className="mb-20 text-white mt-5">
        {replies.length > 0 && 
          replies.map(eachReply => {
            if(eachReply.attributes?.user?.data?.attributes?.username && 
               eachReply.attributes?.createdAt &&
               eachReply.attributes?.text
            ){
              return (
                <div key={eachReply.id} className='mb-5'>
                  <HeaderAndDescription key={eachReply.id} username={eachReply.attributes.user.data.attributes.username} createdAt={eachReply.attributes.createdAt} description={eachReply.attributes.text}/>
                </div>
              );
            }
          })
        }
      </div>
    </>
  );
};

export default ShowPostDetail;