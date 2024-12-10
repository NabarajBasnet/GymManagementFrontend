'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TypingAnimation from "@/components/ui/typing-animation";
import { useEffect, useState } from "react";

export default function Home() {

  const [signUpForm, setSignUpForm] = useState(false);

  const router = useRouter();
  useEffect(() => {
    router.push('/login')
  }, []);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-full bg-cover bg-[url('/images/gym.jpg')] bg-right bg-opacity-60 items-center justify-center">
        <div className="text-white blur-none text-4xl font-bold">
          <TypingAnimation
            className="text-4xl font-bold text-white"
            text="Welcome Back!"
          />
        </div>
      </div>
    </div>
  );
}
