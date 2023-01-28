import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "context/AppContext";

export default () => {
  const {user} = useContext(AppContext)
  return (
    <div className="flex justify-between items-center">
      <h1>
        <Image src={"/logo.svg"} alt="湯治の郷" width={148} height={55} className='my-5 ml-3'/>
      </h1>
      <div className='text-white mr-5 font-bold '>{user?.username ?? 'ゲスト'}さん！</div>
    </div>
  );
}