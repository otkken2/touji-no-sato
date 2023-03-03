/* eslint-disable @next/next/no-img-element */
import GoogleMapReact from "google-map-react";
import { userAtom } from "@/atoms/atoms";
import { GoogleMap, Marker, useLoadScript,InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { API_URL } from "const";
import { Post, PostData } from "@/Interface/interfaces";
import { useAtomValue } from "jotai";
import { usePosts } from "lib/usePosts";
import { ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getGeocode, getLatLng, LatLng } from "use-places-autocomplete";
import Link from "next/link";
import router from "next/router";

interface MyOnsenInterface{
  data: PostData,
  latLng: LatLng
};

const MyOnsenCollection = () => {
  // const user =  useAtomValue(userAtom);
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
        zoom={5}
        center={center}
        mapContainerClassName='h-[calc(100vh_-_52px)] w-[100vw] relative'
      >
        {myOnsens && myOnsens.map((eachMyOnsen,index) => {
          return (

            <div key={index}>
              {index + 1 === idOfVisibleInfoWindow &&
                <InfoWindow position={eachMyOnsen.latLng}>
                {/* <div className="bg-red-300 absolute h-[100vh]"> */}
                  <div className="max-w-[350px] max-h-[540px] overflow-y-scroll">
                    <ul>
                      <li className="mb-1">{eachMyOnsen.data.attributes?.createdAt as ReactNode}</li>
                      <li className="mb-8">{eachMyOnsen.data.attributes?.ryokan}</li>
                      <li className="mb-3">{eachMyOnsen.data.attributes?.description}</li>
                    </ul>
                    {eachMyOnsen.data.attributes?.Image?.data?.map((eachData,imageIndex)=>{
                      return(
                        <img className="w-full" key={imageIndex} src={`${API_URL}${eachData?.attributes?.url}`} alt={eachData.attributes?.name} />
                      );
                    })}
                    <Link href={`post/${eachMyOnsen.data.id}`}>詳細ページを開く</Link>
                  </div>
                </InfoWindow>
              }
              <Marker key={index} position={eachMyOnsen.latLng} onClick={() => handleSelectInfoWindow(index)}/>
            </div>
          );
        })}

      </GoogleMap>
    </div>
  );
  }

export default MyOnsenCollection;
