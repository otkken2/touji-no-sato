import { infoBalloonAtom, isErrorAtom, timelimitAtom } from '@/atoms/atoms';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import 'tailwindcss/tailwind.css';

const InfoBalloon = () => {
  const [balloonText,setBalloonText] = useAtom(infoBalloonAtom);
  const [isError, setIsError] = useAtom(isErrorAtom);
  const [timelimit, setTimelimit] = useAtom(timelimitAtom)
  const timer = setTimeout(()=>{
      setBalloonText('');
      setIsError(false);
  },timelimit);

  useEffect(()=>{
    timer;
    return () => {
      clearTimeout(timer);
    };
  },[balloonText]);
  return (
    balloonText ?         
    <div className="fixed w-screen h-fit flex items-center justify-center z-20">
      <div className={`absolute  max-w-[600px] w-[95%] h-[50px] rounded-lg top-6  ${isError ? 'text-red-600 bg-background-secondary' : 'text-white bg-primary'} text-center leading-[50px]`}>
        {balloonText}
      </div>
    </div>
    :
    <></>
  );
};

export default InfoBalloon;