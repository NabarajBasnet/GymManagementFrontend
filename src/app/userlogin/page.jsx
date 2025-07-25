export async function generateMetadata() {
  return {
    title: "Userlogin | Fitbinary"
  }
}

import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    (<div className="flex bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 min-h-svh w-full items-center justify-center p-6 md:px-20">
      <div className="md:w-5xl xl:w-full rounded-xl md:px-4 shadow-2xl">
        <LoginForm />
      </div>
    </div>)
  );
}
