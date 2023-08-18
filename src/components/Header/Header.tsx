import { userAtom } from "@/atoms/atoms";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const user = useAtomValue(userAtom);
  return (
    <div className="flex justify-between items-center">
      <h1>
        <Link href="/">
          {/* <Image src={"/logo.svg"} alt="湯治の郷" width={148} height={55} className='my-5 ml-3'/> */}
          <Image src={"/logo_toujinosato.png"} alt="湯治の郷" width={148} height={55} className='my-5 ml-3'/>
        </Link>
      </h1>
      <Link href={`/profile/${user?.id}`}>
        <div className='text-white mr-5 font-bold '>{user?.username ?? 'ゲスト'}さん</div>
      </Link>
    </div>
  );
}

export default Header;