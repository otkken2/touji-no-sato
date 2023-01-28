import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import { ReactElement } from "react";
import './globals.css';

interface LayoutProps{
  readonly children: ReactElement
}

export const Layout = ({children}: LayoutProps) => {
  return (
    <>
      <Header/>
        <main className='text-white'>
          {children}
        </main>
      <Footer/>
    </>
  );
}