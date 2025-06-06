import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    (<div className="flex bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full md:max-w-4xl rounded-xl md:p-4 shadow-2xl">
        <LoginForm />
      </div>
    </div>)
  );
}
