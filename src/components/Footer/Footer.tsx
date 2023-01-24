import { AppContext } from "context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { useAuth } from "lib/useAuth";

const FOOTER_ICON_WIDTH = 35;
const FOOTER_ICON_HEIGHT = 35;

export default () => {
  const {logout} = useAuth();
  const {user} = useContext(AppContext);
  return (
    <footer className="text-center flex flex-row justify-around py-2 bg-slate-700">
      <Link href='/Favorite'>
        <Image src='/favorite.svg' height={FOOTER_ICON_HEIGHT} width={FOOTER_ICON_WIDTH} alt="お気に入り"/>
      </Link>
      <Link href='/Upload'>
        <Image src='/upload.svg' height={FOOTER_ICON_HEIGHT} width={FOOTER_ICON_WIDTH} alt="投稿する"/>
      </Link>
      <Link href='/'>
        <Image src='/home.svg' height={FOOTER_ICON_HEIGHT} width={FOOTER_ICON_WIDTH} alt="ホーム"/>
      </Link>
      
      {/* TODO 追々、未ログイン状態でのみ表示するようにする */}
      {user === null ?
        <>
          <Link href='/Login'>
            <Image src='/login.svg' height={FOOTER_ICON_HEIGHT} width={FOOTER_ICON_WIDTH} alt="ログイン"/>
          </Link>
          <Link href='/Register'>
            <Image src='/signup.svg' height={FOOTER_ICON_HEIGHT} width={FOOTER_ICON_WIDTH} alt="会員登録"/>
          </Link>
        </>
        :
        <>
          <Link href='/Mypage'>
              <Image src='/mypage.svg' height={FOOTER_ICON_HEIGHT} width={FOOTER_ICON_WIDTH} alt="プロフィール"/>
          </Link>
          {/* // <Link href='/Mypage'> */}
              <Image src='/logout.svg' height={FOOTER_ICON_HEIGHT - 5} width={FOOTER_ICON_WIDTH - 5} alt="ログアウト" onClick={() => logout()}/>
          {/* </Link> */}
        </>
      }
    </footer>
  );
}