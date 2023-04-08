/* eslint-disable @next/next/no-img-element */
import GoogleMapReact from "google-map-react";
import { userAtom } from "@/atoms/atoms";
import { GoogleMap, Marker, useLoadScript,InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { API_URL } from "const";
import { PostData } from "@/Interface/interfaces";
import { useAtomValue } from "jotai";
import { usePosts } from "lib/usePosts";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getGeocode, getLatLng, LatLng } from "use-places-autocomplete";
import Link from "next/link";
import router from "next/router";
import { Post } from "@/components/Post/Post";
import Moment from "react-moment";
import 'moment-timezone';
import { Media } from "@/components/Post/Media";

interface MyOnsenInterface{
  data: PostData,
  latLng: LatLng
};
interface PostsGroupsByLatLngInterface{
  latLng: LatLng,
  posts: PostData[],
}

const postsGroupsByLatLng = [
  {
    latLng: { lat: 37.0, lng: 139.2 },
    posts: [{},{}]
  },
  {
    latLng: { lat: 37.1, lng: 139.3 },
    posts: [{},{},{}]
  },

];

const MyOnsenCollection = () => {
  console.log(process.env.NEXT_PUBLIC_GOOGLE_API_KEY)
  const {id} = router.query;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries: ["places"],
  });
  const [center, setCenter] = useState<LatLng>({ lat: 37.0, lng: 139.2 });
  const [idOfVisibleInfoWindow,setIdOfVisibleInfoWindow] = useState<number>(0);
  const [myOnsens, setMyOnsens] = useState<MyOnsenInterface[]>([]);
  const fetchMyPosts = async () => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${id}&pagination[page]=1&pagination[pageSize]=1000`);
    return response.data;
  }
  const [postsGroupsByLatLng, setPostsGroupsByLatLng] = useState<PostsGroupsByLatLngInterface[]>([]);
  const LatLngFromAddress = useCallback(
    async () => {
      const myPosts = await fetchMyPosts();
      if(window.google === undefined)return;
      return myPosts?.data?.map(async(eachPost: PostData)=>{
        if(eachPost?.attributes?.lat && eachPost?.attributes?.lng){
          const latLng: LatLng = {lat: eachPost.attributes.lat, lng: eachPost.attributes.lng};
          setMyOnsens((prevState) => [...prevState,{data: eachPost, latLng: latLng}]);
        }else{
          if(!eachPost?.attributes?.ryokan)return;
          const address = eachPost?.attributes?.ryokan;;
          const geoCode = await getGeocode({address});
          const latLng = await getLatLng(geoCode[0]);
          setMyOnsens((prevState) => [...prevState,{data: eachPost, latLng: latLng}]);
        }
      });
    },[id]
  )

  useEffect(()=>{
    LatLngFromAddress();
  },[LatLngFromAddress, id]);

  useEffect(()=>{
    setPostsGroupsByLatLng([]);
    const getPostsGroupsByLatLng = async () => {
      if(myOnsens.length === 0)return;
      const myLatLngs = Array.from(
        new Map(
          myOnsens.map((each,id) =>
            [`${each.latLng.lat}${each.latLng.lng}`,each.latLng]
          )
        ).values()
      );
      myLatLngs.map((latLng)=>{
        setPostsGroupsByLatLng((prevPostsGroups)=>{
          const filteredOnsensByLatLng = myOnsens.filter((onsen)=> onsen.latLng.lat === latLng.lat && onsen.latLng.lng === latLng.lng);
          const posts = filteredOnsensByLatLng.map((eachOnsens)=> eachOnsens.data)
          return [...prevPostsGroups,{latLng: latLng, posts: posts}];
        })
      });
    };
    getPostsGroupsByLatLng();
  },[myOnsens])

  const handleSelectMarker = (idOfVisibleInfoWindow: number, latLng: LatLng) => {
    setCenter(latLng);
    setIdOfVisibleInfoWindow(idOfVisibleInfoWindow + 1);
  };

  if(!isLoaded)return <p>Mapを準備中。。。</p>
  return (
    <div className="pb-12">
      <GoogleMap
        onClick={()=>setIdOfVisibleInfoWindow(0)}
        zoom={5}
        center={center}
        mapContainerClassName={`w-[100vw] relative ${'h-[calc(100vh_-_52px_-_52px)]'}`}
      >
        {
          postsGroupsByLatLng && postsGroupsByLatLng.map((postGroupByLatLng,index)=>{
            return (
              <div key={index} className='text-white'>
                {
                  index + 1 === idOfVisibleInfoWindow
                  ?
                  <Marker
                    icon='/onsen.png'
                    position={postGroupByLatLng.latLng}
                    onClick={()=> handleSelectMarker(index,postGroupByLatLng.latLng)}
                    zIndex={10}
                  />
                  :
                  <Marker
                    position={postGroupByLatLng.latLng}
                    onClick={()=> handleSelectMarker(index,postGroupByLatLng.latLng)}
                  />
                }
                {
                  index + 1 === idOfVisibleInfoWindow &&
                  <div className='absolute bottom-0 bg-background h-[40vh] w-[100vw] overflow-scroll rounded-t-lg pt-3'>
                    <h1 className='text-xl mb-5'>{postGroupByLatLng.posts[0].attributes?.ryokan}</h1>
                    {postGroupByLatLng.posts.map((eachPost,postIndex)=>{
                      return (
                        <div key={postIndex} className='mb-5'>
                          {/* <h1>{eachPost.attributes?.ryokan}</h1> */}
                          <Moment  format='YYYY/MM/DD hh:mm' tz='Asia/Tokyo' className='text-opacity-80 text-sm text-white'>
                            {eachPost?.attributes?.createdAt}
                          </Moment>
                          <p>{eachPost.attributes?.description}</p>
                          <Media post={eachPost}/>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            );
          })
        }
      </GoogleMap>
    </div>
  );
  }

export default MyOnsenCollection;
