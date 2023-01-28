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
import { useAtomValue } from 'jotai'
import { userAtom } from '@/atoms/atoms'

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
  console.log({'user':user})

  useEffect(()=>{
    const getPosts = async () => {
      // const response = await axios.get('http://localhost:1337/api/posts?populate=*');
      // console.log(response.data);
      // setPosts(response.data.data);
      if(loading) return;
      setPosts(data.posts.data);
    };
    getPosts();
  },[data]);

  if(loading)return <h1>loading now...</h1>
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
              <div className='flex items-center justify-between'>
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
              {post.attributes.description}
              {post?.attributes?.Image?.data?.map((eachData:any,ImageIndex:number)=>{
                return(
                  
                  <Image className='w-full' src={`http://localhost:1337${eachData.attributes.url}`} alt={`onsen${ImageIndex + 1}`} width={275} height={183}/>
                );
              })}
            </div>
          );
        })}
      </main>
    </>
  )
}
