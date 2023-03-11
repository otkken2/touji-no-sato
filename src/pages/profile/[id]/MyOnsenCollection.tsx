/* eslint-disable @next/next/no-img-element */
import GoogleMapReact from "google-map-react";
import { userAtom } from "@/atoms/atoms";
import { GoogleMap, Marker, useLoadScript,InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { API_URL } from "const";
import { PostData } from "@/Interface/interfaces";
import { useAtomValue } from "jotai";
import { usePosts } from "lib/usePosts";
import { ReactNode, useEffect, useState } from "react";
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


const postsGroupsByLatLng = [
  {
    latLng: { lat: 37.0, lng: 139.2 },
    posts: [{},{},{}]
  }
];

const MyOnsenCollection = () => {
  const {id} = router.query;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries: ["places"],
  });
  const center: LatLng = { lat: 37.0, lng: 139.2 };
  const [idOfVisibleInfoWindow,setIdOfVisibleInfoWindow] = useState<number>(0);
  const [myOnsens, setMyOnsens] = useState<MyOnsenInterface[]>([]);
  const fetchMyPosts = async () => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${id}`)
    return response.data;
  }
  const { isLoading, data } = useQuery('fetchMyPosts',fetchMyPosts);
  const [] = useState<boolean>(false);
  const LatLngFromAddress = async () => {
    if(isLoading)return;
    if(!data.data === undefined)return;
    if(window.google === undefined)return;
    return data?.data?.map(async(eachPost: PostData)=>{
      const address = eachPost?.attributes?.ryokan;
      const geoCode = await getGeocode({address});
      const latLng = await getLatLng(geoCode[0]);
      setMyOnsens((prevState) => [...prevState,{data: eachPost, latLng: latLng}]);
      // setMyOnsens((myOnsens)=>[...myOnsens,latLng]);
    });
  }

  useEffect(()=>{
    if(isLoading)return;
    LatLngFromAddress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data, isLoading,window.google]);

  const handleSelectInfoWindow = (idOfVisibleInfoWindow: number) => {
    setIdOfVisibleInfoWindow(idOfVisibleInfoWindow + 1);
  };

  if(!isLoaded)return <p>Mapを準備中。。。</p>
  if(isLoading)return;
  return (
    <div className="pb-12">
      <GoogleMap
        onClick={()=>setIdOfVisibleInfoWindow(0)}
        zoom={5}
        center={center}
        mapContainerClassName='h-[calc(100vh_-_52px)] w-[100vw] relative'
      >
        {myOnsens && myOnsens.map((eachMyOnsen,index) => {
          return (

            <div key={index} className='text-white'>
              <Marker key={index} position={eachMyOnsen.latLng} onClick={() => handleSelectInfoWindow(index)}/>
              {
                index + 1 === idOfVisibleInfoWindow &&
                <div className='absolute bottom-0 bg-background h-[40vh] w-[100vw] overflow-scroll'>

                  <Moment format='YYYY/MM/DD hh:mm' tz='Asia/Tokyo' className='text-opacity-80 text-sm text-white'>
                    {eachMyOnsen?.data?.attributes?.createdAt}
                  </Moment>
                  <Media post={eachMyOnsen.data}/>
                  <p>{eachMyOnsen.data.attributes?.description}</p>
                </div>
              }
            </div>
          );
        })}

      </GoogleMap>
    </div>
  );
  }

export default MyOnsenCollection;
