'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);

  return (
    <div className="w-full flex justify-center items-center min-h-screen">
      <a href="/login">Login</a>
    </div>
  );
};
