import GoogleMapReact from "google-map-react";
import { useMediaQuery } from "@mui/material";
import axios from "axios";
import { Dispatch, useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css"
import { SetStateAction, useAtom, useAtomValue, useSetAtom } from "jotai";
import { latAtom, lngAtom, selectedPlaceAtom } from "@/atoms/atoms";

// const options = {
//   method: 'GET',
//   url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
//   params: {locale: 'ja', name: '長寿館'},
//   headers: {
//     'X-RapidAPI-Key': 'ba3d005649msh2dd5744cb01116bp18b537jsn8243088475bd',
//     'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
//   }
// };

interface LatLng{
  lat: number;
  lng: number;
};

const RyokanInfo = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_API_KEY ?? '',
    libraries: ["places"],
  });

  if(!isLoaded)return <p>loading now...</p>


  return (
    <Map/>
  );
};

const Map = () => {
  // const center = useMemo(()=>({ lat: 35.6, lng: 138.9 }),[]);
  const [center, setCenter] = useState<LatLng>({ lat: 35.6, lng: 138.9 })
  const [selected, setSelected] = useState<null | LatLng>(null);
  const selectedPlace  = useAtomValue(selectedPlaceAtom);

  return (
    <>
      <div className="places-container">
        {/* <PlacesAutocomplete setSelected={setSelected} setCenter={setCenter}/> */}
        <PlacesAutoComplete/>
      </div>
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName='h-[100vh] w-[100vw]'
      >
        {selected && <Marker position={selected}/>}
      </GoogleMap>
    </>
  );
}


interface PlacesAutocompleteProps{
  setSelected:Dispatch<SetStateAction<null | LatLng>>;
  // setCenter:Dispatch<SetStateAction<LatLng>>;
}

// export const PlacesAutocomplete = ({setSelected, setCenter}: PlacesAutocompleteProps) => {
// export const PlacesAutoComplete = ({setSelected}: PlacesAutocompleteProps) => {
export const PlacesAutoComplete = () => {
  const [selectedPlace,setSelectedPlace] = useAtom(selectedPlaceAtom);
  const [lat,setLat] = useAtom(latAtom);
  const [lng,setLng] = useAtom(lngAtom);

  const {
    ready,
    value,
    setValue,
    suggestions: {status, data},
    clearSuggestions,
  } = usePlacesAutocomplete({defaultValue: selectedPlace || ''});


  const handleSelect = async (address: string) => {
    setValue(address, false);
    setSelectedPlace(address);
    clearSuggestions();

    const results = await getGeocode({address});
    const {lat, lng} = await getLatLng(results[0]);
    setLat(lat);
    setLng(lng);
  };

  return (
    // TODO: ユーザーの投稿ページにこの自動補完機能を実装する！
    <Combobox onSelect={handleSelect}>
      <label>旅館・公共浴場etc</label>
      <ComboboxInput
        value={value}
        // value={ryokan}
        onChange={(e)=> setValue(e.target.value)}
        // onChange={(e)=> setRyokan(e.target.value)}
        // disabled={!ready}
        className='w-full h-[55px] text-center text-white bg-background-secondary rounded-md'
        // placeholder='旅館・公共浴場etc...'
      />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({place_id, description})=>(
                <ComboboxOption key={place_id} value={description} />
              ))
            }
          </ComboboxList>
        </ComboboxPopover>
    </Combobox>
  );
};

export default  RyokanInfo;
