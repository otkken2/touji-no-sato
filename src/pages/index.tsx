import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/Header/Header'
import { useEffect, useState } from 'react'
import Moment from 'react-moment'
import 'moment-timezone'
import Link from 'next/link'
import axios from 'axios'
import { API_URL } from 'const'
import { PostHeader } from '@/components/Post/PostHeader'
import { PostData } from '@/Interface/interfaces'
import { PlaceLink } from '@/components/Post/PlaceLink'
import { useQuery } from 'react-query'
import Cookies from 'js-cookie'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/atoms/atoms'
import { useFavorite } from 'lib/useFavorite'
import { Post } from '@/components/Post/Post'


export default function Home() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const token = Cookies.get('token');
  const { handleClickFavorite, myFavorites, getMyFavorites } = useFavorite()
  const user = useAtomValue(userAtom);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClickShowMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const getPosts = async (pageSize = 100) => {
    setIsLoading(true);
    const response = await axios.get(
      `${API_URL}/api/posts?populate[user][populate]=*&sort=createdAt%3Adesc&pagination[page]=${currentPage}&pagination[pageSize]=25`
    );
    const tmpData: PostData[] = response.data.data || [];
    
    // 初回読み込み時の重複データを排除
    const postsIds = posts.map(eachPost => eachPost.id);
    if(!postsIds.length){ // 初回呼び出し時
      setPosts(prev => [...prev, ...tmpData]);
    }else{ //初回以降
      const data = tmpData.filter(eachData => {
        return !postsIds.includes(eachData.id);
      })
      setPosts(prev => [...prev,...data]);
    }
    setIsLoading(false);
  }

  useEffect(()=>{
    getPosts();
  },[myFavorites,currentPage]);

  useEffect(()=>{
    getMyFavorites();
  },[]);

  // const {isLoading, data} = useQuery('posts',getPosts);
  // if(isLoading) return <h1>loading now...</h1>
  return (
    <div className='max-w-[600px] mx-auto'>
      <Head>
        <title>湯治の郷</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <main className='pb-14'>
        {
          posts.map((post,index)=>{
          return(
              !post.attributes?.parentPostId &&
              <Post key={index} post={post} index={index}/>
          );
          })
        }
        {isLoading && <p className='text-white text-center mb-10'>...Loading now</p>}
        {
          posts.length &&
          <div 
            className='bg-background-secondary mb-10 text-primary h-[50px] w-[180px] leading-[50px] mx-auto text-center  rounded-full'
            onClick={()=> handleClickShowMore()}
          >more</div>
        }
      </main>
    </div>
  )
}
