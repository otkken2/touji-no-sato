import { myPostsAtom, userAtom } from "@/atoms/atoms";
import { Button } from "@mui/material";
import axios from "axios";
import { API_URL } from "const";
import { useAtom, useAtomValue } from "jotai";
import { useQuery } from "react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Post } from "@/Interface/interfaces";
import Link from "next/link";
import router from "next/router";

interface ProfileProps{
  userId: number,
}

export const Profile = () => {
  const {id} = router.query;
  console.log(id)
  const fetchMyPosts = async () => {
    return await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${id}`)
      .then(res =>{
        return res.data.data
      });
  }
  const {isLoading, data} = useQuery('myPosts',fetchMyPosts)

  if(isLoading)return <p>loading now...</p>
  return (
    <main>
      <h1>マイページ</h1>
      <Link href={`/profile/${id}/MyOnsenCollection`}>
        <h2>温泉コレクションを見る</h2>
      </Link>
      <div>
        <div>
          {data?.map((eachdata: any)=>{
            return (
              <div key={eachdata.id} className={`mb-20`}>
                <div >
                  {eachdata?.attributes?.Image?.data?.map((eachImage:any)=>{
                    return (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="w-full" key={eachImage.id} src={`${API_URL}${eachImage.attributes.url}`} alt={eachImage.attributes.name}/>
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

export default Profile;
