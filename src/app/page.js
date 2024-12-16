'use client';

import { useRouter } from "next/navigation";
import TypingAnimation from "@/components/ui/typing-animation";
import { useEffect, useState } from "react";

export default function Home() {

  const router = useRouter();
  useEffect(() => {
    router.push('/login')
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-full bg-cover bg-gradient-to-r from-stone-700 via-gray-500 to-white bg-right bg-opacity-60 items-center justify-center">
        <div className="text-white blur-none text-4xl font-bold">
          <TypingAnimation
            className="text-4xl font-bold text-black"
            text="Welcome Back!"
          />
        </div>
      </div>
    </div>
  );
}
