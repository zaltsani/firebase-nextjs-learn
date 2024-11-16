'use client'

import Image from "next/image";
import useFirebaseData from './lib/useFirebaseData'
import dynamic from 'next/dynamic';
import Link from "next/link";


const Map = dynamic(() => import('@/components/Maps'), { ssr: false });

export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <div className="bg-blue-500 w-full h-full p-0 gap-0" /> */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="w-full h-full">
          <Link href={'/login'} className="text-xl">Login</Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
