import GoogleMapReact from "google-map-react";
import { userAtom } from "@/atoms/atoms";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { API_URL } from "const";
import { PostData } from "interfaces";
import { useAtomValue } from "jotai";
import { usePosts } from "lib/usePosts";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getGeocode, getLatLng, LatLng } from "use-places-autocomplete";

const MyOnsenCollection = () => {
  const user =  useAtomValue(userAtom);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries: ["places"],
  });
  const [center, setCenter] = useState<LatLng>({ lat: 35.6, lng: 138.9 })
  const [myOnsens, setMyOnsens] = useState<LatLng[]>([]);
  const fetchMyPosts = async () => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${user?.id}`)
    return response.data;
  }
  const [myPosts, setMyPosts] = useState<PostData[]>([]);
  const { isLoading, data } = useQuery('fetchMyPosts',fetchMyPosts);

  const LatLngFromAddress = async () => {
    if(isLoading)return;
    if(!data.data === undefined)return;
    if(window.google === undefined)return;
    return data?.data?.map(async(eachPost: PostData)=>{
      const address = eachPost?.attributes?.ryokan;
      const geoCode = await getGeocode({address});
      const latLng = await getLatLng(geoCode[0]);
      setMyOnsens((myOnsens)=>[...myOnsens,latLng]);
    });
  }

  useEffect(()=>{
    if(isLoading)return;
    LatLngFromAddress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data, isLoading,window.google]);
  
  if(!isLoaded)return <p>Mapを準備中。。。</p>
  if(isLoading)return;
  return (
    <div className="pb-12">
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName='h-[calc(100vh_-_52px)] w-[100vw]'
      >
        {myOnsens && myOnsens.map((eachMyOnsen,index) => {
          return <Marker key={index} position={eachMyOnsen}/>
        })}
      </GoogleMap>
    </div>
  );
  } 

export default MyOnsenCollection;
