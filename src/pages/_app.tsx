import Footer from '@/components/Footer/Footer';
import { Layout } from '@/layouts/Layout';
import '@/styles/globals.css';
import { ApolloClient, InMemoryCache,ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import withData from '../../lib/apollo';
import  {AppContext}  from 'context/AppContext';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: `${API_URL}/graphql`,
  cache,
});



function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | undefined>( Cookies.get('token') )
  useEffect(()=>{
    const token = Cookies.get('token')
    if(token){
      axios.get(`${API_URL}/api/users/me`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then(async (res) => {
        if(res.status === 200){
          setUser(res.data)
        }else{
          Cookies.remove('token');
          setUser(null)
          return;
        }

      })
    }
  },[])
  return (
    <AppContext.Provider value={{ user, setUser}}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
        <Footer/>
      </ApolloProvider>
    </AppContext.Provider>

  )
}

export default App;

