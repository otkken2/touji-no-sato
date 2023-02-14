import { myPostsAtom, userAtom } from "@/atoms/atoms";
import { Button } from "@mui/material";
import axios from "axios";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";
import { useQuery } from "react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Post } from "interfaces";

export const Mypage = () => {
  const user =  useAtomValue(userAtom)
  const [myPosts,setMyPosts] = useAtom(myPostsAtom)
  const fetchMyPosts = async () => {
    return await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${user?.id}`)
      .then(res =>{
        return res.data.data
      });
  }
  const {isLoading, data} = useQuery('myPosts',fetchMyPosts)
  console.log(data)

  if(isLoading)return <p>loading now...</p>
  return (
    <main>
      <h1>マイページ</h1>
      <div>
        <h2>{user?.username}</h2>
        <p>{user?.email}</p>
        <div>
          {data.map((eachdata: any)=>{
            return (
              <div key={eachdata.id} className={`mb-20`}>
                <div >
                  {eachdata.attributes.Image.data.map((eachImage:any)=>{
                    return (
                      <Image key={eachImage.id} src={`${API_URL}${eachImage.attributes.url}`} alt={eachImage.attributes.name} width={400} height={400}/>
                      )
                    })}
                </div>
                <p>{eachdata.attributes.description}</p>
              </div>
            )
          })}
        </div> 
      </div>
    </main>
  );
}

export default Mypage;