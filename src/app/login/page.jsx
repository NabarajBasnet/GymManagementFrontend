import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    (<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl border rounded-xl p-4 shadow-2xl">
        <LoginForm />
      </div>
    </div>)
  );
}
