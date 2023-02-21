import GoogleMapReact from "google-map-react";
import { userAtom } from "@/atoms/atoms";
import { GoogleMap, Marker, useLoadScript,InfoWindow } from "@react-google-maps/api";
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
  const center: LatLng = { lat: 37.0, lng: 139.2 };
  const [idOfVisibleInfoWindow,setIdOfVisibleInfoWindow] = useState<number>(0);
  const [myOnsens, setMyOnsens] = useState<LatLng[]>([]);
  const fetchMyPosts = async () => {
    const response = await axios.get(`${API_URL}/api/posts?populate=*&filters[user][id][$eq]=${user?.id}`)
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
      setMyOnsens((myOnsens)=>[...myOnsens,latLng]);
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
                <InfoWindow position={eachMyOnsen}>
                {/* <div className="bg-red-300 absolute h-[100vh]"> */}
                  <div className="bg-red-300 max-w-[50px] max-h-[40px] overflow-scroll">
                    <p>
                      idは{idOfVisibleInfoWindow}です。
                      idは{idOfVisibleInfoWindow}です。
                      idは{idOfVisibleInfoWindow}です。
                      idは{idOfVisibleInfoWindow}です。
                      idは{idOfVisibleInfoWindow}です。
                      idは{idOfVisibleInfoWindow}です。
                      idは{idOfVisibleInfoWindow}です。
                      idは{idOfVisibleInfoWindow}です。
                      idは{idOfVisibleInfoWindow}です。
                    </p>
                  </div>
                </InfoWindow>
              }
              <Marker key={index} position={eachMyOnsen} onClick={() => handleSelectInfoWindow(index)}/>
            </div>
          );
        })}
        
      </GoogleMap>
    </div>
  );
  } 

export default MyOnsenCollection;
