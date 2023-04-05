import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface PlaceLinkProps{
  ryokan: string;
}

export const PlaceLink = (props: PlaceLinkProps) => {
  const { ryokan } = props;
  const [showInfo, setShowInfo] = useState<boolean>(false);
  return (
      <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ryokan}`)}&basemap=satellite`} target='_blank' rel='noopener noreferrer'>
        <div className='flex items-center text-sm w-fit  relative'>
          <Image src={'/map.svg'} height={19} width={19} alt='mapIcon' className="mr-3"/> 
          <p className='text-primary' onMouseOver={() => setShowInfo(true)} onMouseLeave={()=> setShowInfo(false)}>{ryokan}</p>
          {/* <img src="/info.svg" className='w-5' alt="インフォ" /> */}
          {
            showInfo &&
            <p className='bg-background-secondary absolute bottom-0 -right-[210px] w-[200px] rounded-lg p-3 px-5'>Google Mapで宿や温泉（料金・空室状況・口コミetc）について調べることができます。</p>
          }
        </div>
      </Link>
  );
};