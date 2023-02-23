import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
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
import { usePosts } from 'lib/usePosts'
import { useAtom, useAtomValue } from 'jotai'
import { myFavoritesAtom, userAtom } from '@/atoms/atoms'
import { useFavorite } from 'lib/useFavorite'


export default function Home() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const token = Cookies.get('token');
  const { handleClickFavorite, myFavorites, setMyFavorites, getMyFavorites } = useFavorite()
  const user = useAtomValue(userAtom);
  // const [myFavorites,setMyFavorites] = useAtom(myFavoritesAtom)

  
  
  const getPosts = async () => {
    await axios.get(`${API_URL}/api/posts?populate=*`).then(res => {
      setPosts(res.data.data);
    }) 
  }

  useEffect(()=>{
    getPosts();
  },[myFavorites]);
  
  useEffect(()=>{
    getMyFavorites();
  },[]);

  // const handleClickFavorite = async( postId: number | undefined ,favoriteCount: number | undefined) => {
  //   await addFavorite(postId, favoriteCount, token,user?.id);
  // }

  const {isLoading, data} = useQuery('posts',getPosts);
  if(isLoading) return <h1>loading now...</h1>

  return (
    <>
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
            <div key={index} className={`post-${index} text-white mb-10`}>
              <Link  href={`post/${post.id}`}>
                <PostHeader username={post?.attributes?.user?.data?.attributes?.username} createdAt={post?.attributes?.createdAt}/>
                {/* 投稿本文 */}
                <p className='mb-1'>
                  {post?.attributes?.description}
                </p>
              </Link>

                {/* 旅館情報 */}
              {
                post.attributes?.ryokan && 
                <PlaceLink ryokan={post.attributes?.ryokan}/>
              }
              <Link href={`post/${post.id}`}>
                {/* 画像 */}
                {post?.attributes?.Image?.data?.map((eachData:any,ImageIndex:number)=>{
                  return(
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={ImageIndex} src={`${API_URL}${eachData.attributes.url}`} alt="" className='w-full' />
                    );
                })}
              </Link>
              <div className='favorite-container flex items-center' onClick={()=> handleClickFavorite(post?.id, post?.attributes?.favoriteCount,token, user?.id)}>
                <Image src='/favorite.svg' alt='お気に入りに追加' width={20} height={20} className='m-3'/>
                <p>{post?.attributes?.favoriteCount}</p>
              </div>
            </div>
          );
        })}
      </main>
    </>
  )
}
