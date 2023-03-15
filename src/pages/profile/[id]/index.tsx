import { myPostsAtom, userAtom } from "@/atoms/atoms";
import { Button } from "@mui/material";
import axios from "axios";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";
import { useQuery } from "react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import router from "next/router";
import { Post } from "@/components/Post/Post";
import { PostData } from "@/Interface/interfaces";
import MyOnsenCollection from "./MyOnsenCollection";

interface ProfileProps{
  userId: number,
}

type ShowMode = "ALL_MY_POSTS" | "ONSEN_COLLECTION";

export const Profile = () => {
  const {id} = router.query;
  console.log(id)
  const [data, setData] = useState<PostData[]>([])
  const [showMode, setShowMode] = useState<ShowMode>('ONSEN_COLLECTION');
  useEffect(()=>{
    const fetchMyPosts = async () => {
      if(!router.isReady)return;
      return await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${id}`)
        .then(res =>{
          setData(res.data.data);
        });
    }
    fetchMyPosts();
  },[id]);

  console.log(data);
  return (
    <main className='text-white'>
      <h1>マイページ</h1>
      <div className='flex justify-around '>
        <div
          className={`${ showMode === 'ONSEN_COLLECTION' && 'border-b-4 border-solid border-primary'}`}
          onClick={()=>setShowMode('ONSEN_COLLECTION')}
        >
          温泉コレクション
        </div>
        <div
          className={`${ showMode === 'ALL_MY_POSTS' && 'border-b-4 border-solid border-primary'}`}
          onClick={()=>setShowMode('ALL_MY_POSTS')}
        >
          投稿一覧
        </div>
      </div>
      <div>
        {
          showMode === 'ALL_MY_POSTS' ?
          <div>
            {data?.map((eachdata: PostData,index)=>{
              return (
                <Post key={index} post={eachdata}/>
              )
            })}
          </div>
          :
          <MyOnsenCollection/>
        }
      </div>
    </main>
  );
}

export default Profile;
