import Footer from "@/components/Footer/Footer";
import { Layout } from "@/layouts/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { QueryClient, QueryClientProvider } from "react-query";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/atoms";
import { HydrationProvider, Client } from "react-hydration-provider";
import { LoadScriptNext, LoadScript } from "@react-google-maps/api";
import Script from "next/script";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";


function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  // useEffect(()=>{
  //   const autoLogin = async() => {
  //     const token = Cookies.get('token')
  //     if(!token)return;
  //     await axios.get(`${API_URL}/api/users/me`,{
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     }).then((res) => {
  //       if(res.status === 200){
  //         setUser(res.data)
  //       }else{
  //         Cookies.remove('token');
  //         setUser(undefined)
  //         return;
  //       }

  //     })
  //   }
  //   autoLogin()
  // },[token])

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "";

  const queryClient = new QueryClient();
  return (
    <>
      <HydrationProvider>
        {/* <LoadScript googleMapsApiKey={API_KEY}> */}
          <Client>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
                <Footer />
            </QueryClientProvider>
          </Client>
        {/* </LoadScript> */}
      </HydrationProvider>
    </>
  );
}

export default App;
