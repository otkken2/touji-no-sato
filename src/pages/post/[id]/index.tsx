import { PlaceLink } from "@/components/Post/PlaceLink";
import { PostHeader } from "@/components/Post/PostHeader";
import axios from "axios";
import { API_URL } from "const";
import { Post, PostData } from "interfaces";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

const ShowPostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  // const [detailPost, setDetailPost] = useState<PostData>();
  const [data, setData] = useState<PostData>();

  
  // const { isLoading, data } = useQuery('detailPost',getPostDetail)
  
  // if(isLoading)return <p>now loading...</p>
  useEffect(()=>{
    const getPostDetail = async() => {
      if(!router.isReady)return;
      console.log(id)
      return await axios.get(`${API_URL}/api/posts/${id}?populate=*`).then(
        // (res): PostData => {
        (res): void => {
          console.log('detailPost取得成功！')
          // return res.data.data;
          setData(res.data.data);
        }
      ).catch(error=> console.log(error))
    };
    getPostDetail();
  },[id,router]);
  console.log("data");
  console.log(data);
  return ( 
    data?.attributes?.user?.data?.attributes?.username && data?.attributes?.createdAt &&
    <div className="text-white mb-12">
      <PostHeader username={data?.attributes?.user?.data?.attributes?.username} createdAt={data?.attributes?.createdAt}/>
      
      <p>{data?.attributes?.description}</p>
      {data?.attributes?.ryokan && 
        <PlaceLink ryokan={data?.attributes?.ryokan}/>
      }
      {data?.attributes?.Image?.data?.map((eachImage)=> {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img className='w-full' key={eachImage.id} src={`${API_URL}${eachImage.attributes?.url}`} alt="" />
        );
      })}
    </div>
  );
};

export default ShowPostDetail;