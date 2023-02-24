import { PlaceLink } from "@/components/Post/PlaceLink";
import { PostHeader } from "@/components/Post/PostHeader";
import axios from "axios";
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

const ShowPostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  // const [detailPost, setDetailPost] = useState<PostData>();
  const [data, setData] = useState<PostData>();
  const setRyokan = useSetAtom(ryokanAtom);
  const setDescription = useSetAtom(descriptionAtom);
  const setFiles = useSetAtom(filesAtom);
  const token = Cookies.get('token');

  
  // const { isLoading, data } = useQuery('detailPost',getPostDetail)
  // if(isLoading)return <p>now loading...</p>

  const handleGetContent = () => {
    setRyokan(data?.attributes?.ryokan);
    setDescription(data?.attributes?.description);
    // setFiles();
  };

  useEffect(()=>{
    const getPostDetail = async() => {
      if(!router.isReady)return;

      console.log(id)
      return await axios.get(`${API_URL}/api/posts/${id}?populate=*`).then(
        (res): void => {
          console.log('detailPost取得成功！')
          setData(res.data.data);
        }
      ).catch(error=> {
        if(error.response.status === 404)router.push('/')
      })
    };
    getPostDetail();
  },[id,router]);
  
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
    router.isReady &&
    <Post post={data} isDetailPage={true} postId={id} handleGetContent={handleGetContent} handleDeletePost={handleDeletePost}/>
  );
};

export default ShowPostDetail;