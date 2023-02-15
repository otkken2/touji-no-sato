import Link from "next/link";
import Image from "next/image";

interface PlaceLinkProps{
  ryokan: string;
}

export const PlaceLink = (props: PlaceLinkProps) => {
  const { ryokan } = props;
  return (
      <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ryokan}`)}&basemap=satellite`} target='_blank' rel='noopener noreferrer'>
        <div className='flex items-center text-xs opacity-50'>
          <Image src={'/map.svg'} height={19} width={19} alt='mapIcon'/> 
          <p>{ryokan}</p>
        </div>
      </Link>
  );
};