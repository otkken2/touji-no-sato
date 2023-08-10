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
import InfoBalloon from "@/components/Util/InfoBalloon";
import  Head  from "next/head";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";


function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));
  

  const description = `<湯治の郷>は温泉を愛するすべての人に使ってもらうことを目指した記録共有アプリです。
  投稿はGoogleMapと連携され、閲覧した人が１クリックで宿や外湯の口コミ・値段情報や予約サイトへのリンクなどにアクセスすることができます。
  また、投稿は地図上にマッピングされ、ピンをクリックすると訪れた地域ごとに投稿を確認することができます。`;

  const queryClient = new QueryClient();
  return (
    <div className=''>
      <Head>
        <meta property="og:title" content="湯治の郷 | 温泉を愛する人達の為の記録共有アプリ" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_DOMAIN}/ogImage.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href="favicon.png" />
        {/* 他の共通のOGPタグもここに追加 */}
      </Head>
      <HydrationProvider>
          <Client>
            <QueryClientProvider client={queryClient}>
                  <InfoBalloon/>
                  <Component {...pageProps}/>
                  <Footer />
            </QueryClientProvider>
          </Client>
      </HydrationProvider>
    </div>
  );
}

export default App;
