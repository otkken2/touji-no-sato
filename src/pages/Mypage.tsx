import { userAtom } from "@/atoms/atoms";
import { Button } from "@mui/material";
import axios from "axios";
import { API_URL } from "const";
import { useAtomValue } from "jotai";
import { useQuery } from "react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

export default () => {
  const user =  useAtomValue(userAtom)

  return (
    <main>
      <h1>マイページ</h1>
      <div>
        <h2>{user?.username}</h2>
        <p>{user?.email}</p>
        <div>
          {user?.posts?.map(post=> {  
            return (
              <div key={post.id}>
                {post.Image?.map(eachImage => {
                  return (
                    <div key={eachImage.id}>
                      <Image src={`${API_URL}${eachImage.url}`} alt={eachImage.name} width={400} height={400}/>
                    </div>
                  )
                })}
                <p>{post.description}</p>
              </div>
            )
          })}
        </div> 
      </div>
    </main>
  );
}