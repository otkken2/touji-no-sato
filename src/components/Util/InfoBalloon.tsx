import { infoBalloonAtom } from '@/atoms/atoms';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import 'tailwindcss/tailwind.css';

const InfoBalloon = () => {
  const [balloonText,setBalloonText] = useAtom(infoBalloonAtom);
  const timer = setTimeout(()=>{
      setBalloonText('');
  },3000);

  useEffect(()=>{
    timer;
    return () => {
      clearTimeout(timer);
    };
  },[balloonText]);
  return (
    balloonText ?         
    <div className="fixed w-screen h-fit flex items-center justify-center z-20">
      <div className="absolute bg-primary max-w-[600px] w-[95%] h-[50px] rounded-lg top-6 text-white text-center leading-[50px]">
        {/* ここに中央に表示させたいコンテンツを追加してください */}
        {balloonText}
      </div>
    </div>
    :
    <></>
  );
};

export default InfoBalloon;