import { userAtom } from "@/atoms/atoms";
import { useAtomValue } from "jotai";
import Image from "next/image";

export default () => {
  const user = useAtomValue(userAtom);
  return (
    <div className="flex justify-between items-center">
      <h1>
        <Image src={"/logo.svg"} alt="湯治の郷" width={148} height={55} className='my-5 ml-3'/>
      </h1>
      <div className='text-white mr-5 font-bold '>{user?.username ?? 'ゲスト'}さん！</div>
    </div>
  );
}