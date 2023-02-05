import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Header from '@/components/Header/Header'
import { useEffect, useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/client'
import Moment from 'react-moment'
import 'moment-timezone'
import { useAtom, useAtomValue } from 'jotai'
import { ryokanAtom, userAtom } from '@/atoms/atoms'
import Link from 'next/link'

const query = gql`
{
  posts {
    data{
      attributes {
        description
        user {
          data{
            attributes{
              username
              email
            }
          }
        }
        Image {
          data{
            attributes{
              url
            }
          }
        }
        createdAt
        ryokan
      }
    }
  }
}
`

export default function Home() {
  const { loading, error, data} = useQuery<any>(query);
  // console.log(data);
  const [posts, setPosts] = useState<any[]>([]);
  const user = useAtomValue(userAtom);
  const [ryokanName, setRyokanName] = useAtom(ryokanAtom);
  // console.log({'user':user})

  useEffect(()=>{
    const getPosts = async () => {
      if(loading) return;
      setPosts(data.posts.data);
    };
    getPosts();
  },[data, loading]);

  if(loading)return <h1>loading now...</h1>

  console.log(data.posts.data)
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
              <div className='flex items-center justify-between mb-5'>
                <div className='flex'>
                  <div className={`w-10 h-10 bg- rounded-full bg_primary`}>
                    <Image src='/mypage.svg' height={100} width={100} alt="プロフィール"/>
                  </div>
                  <p className='ml-3 my-auto'>{post?.attributes?.user?.data?.attributes?.username}</p>
                </div>
                <Moment format='YYYY/MM/DD hh:mm' tz='Asia/Tokyo'>
                  {post.attributes.createdAt}
                </Moment>
              </div>

              {/* 投稿本文 */}
              <p className='mb-1'>
                {post.attributes.description}
              </p>

              {/* 旅館情報 */}
              {
                post.attributes?.ryokan && 
                  <Link href='/RyokanInfo'>
                    <div className='flex items-center text-xs opacity-50'>
                      <Image src={'/map.svg'} height={19} width={19} alt='mapIcon'/> 
                      <p>{post.attributes?.ryokan}</p>
                    </div>
                  </Link>
              }
              {/* 画像 */}
              {post?.attributes?.Image?.data?.map((eachData:any,ImageIndex:number)=>{
                return(
                  
                  <Image key={ImageIndex} className='w-full' src={`http://localhost:1337${eachData.attributes.url}`} alt={`onsen${ImageIndex + 1}`} width={275} height={183}/>
                );
              })}
            </div>
          );
        })}
      </main>
    </>
  )
}
