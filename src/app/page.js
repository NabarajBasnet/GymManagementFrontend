import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full flex justify-center items-center min-h-screen p-8">
      <Link href={'/dashboard'} className="w-full flex justify-center text-black text-center text-4xl font-bold">
        Dashboard
      </Link>
    </div>
  );
}
