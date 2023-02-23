import { API_URL } from "const";
import { Image } from "@/Interface/interfaces";

interface PostImagesProps{
  images: Image[];
}

export const PostImages = (props: PostImagesProps) => {
  const { images } = props;
  return (
    // {post?.attributes?.Image?.data?.map((eachData:any,ImageIndex:number)=>{
    images.map((image:any,ImageIndex:number)=>{
      return(
        // eslint-disable-next-line @next/next/no-img-element
        <img key={ImageIndex} src={`${API_URL}${image.attributes.url}`} alt="" className='w-full' />
        );
    })
  ); 
};