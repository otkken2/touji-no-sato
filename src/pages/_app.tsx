import Footer from '@/components/Footer/Footer';
import { Layout } from '@/layouts/Layout';
import '@/styles/globals.css';
import { ApolloClient, InMemoryCache,ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import withData from '../../lib/apollo';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAtom } from 'jotai';
import { userAtom } from '@/atoms/atoms';
import { HydrationProvider, Client } from 'react-hydration-provider';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: `${API_URL}/graphql`,
  cache,
});



function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useState<string | undefined>( Cookies.get('token') )
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

  const queryClient = new QueryClient()
  return (
    <HydrationProvider>
    <Client>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
          <Footer/>
        </ApolloProvider>
      </QueryClientProvider>
    </Client>
    </HydrationProvider>

  )
}

export default App;

