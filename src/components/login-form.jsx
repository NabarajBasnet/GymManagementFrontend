'use client';

import { FaMeta } from "react-icons/fa6";
import { FaApple, FaGoogle } from "react-icons/fa";
import { MdDone, MdClose, MdError } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import * as React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';

export function LoginForm({ className, ...props }) {

  const [toast, setToast] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState({ icon: MdDone, message: '' });
  const [errorMessage, setErrorMessage] = React.useState({ icon: MdError, message: '' });
  const [responseType, setResponseType] = React.useState('');
  const responseResultType = ['Success', 'Failure'];

  const router = useRouter();
  const {
    register,
    reset,
    formState: { isSubmitting, errors },
    handleSubmit,
    setError
  } = useForm();

  const [responseMessage, setResponseMessage] = React.useState('');
  const [responseStatus, setResponseStatus] = React.useState('');

  const onLoginUser = async (data) => {
    try {
      const response = await fetch('http://88.198.112.156:3000/api/auth/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const responseBody = await response.json();
      setResponseStatus(response.status);

      if (response.status === 404) {
        setError(
          "email", {
          type: "manual",
          message: responseMessage
        }
        )
      };

      if (response.status === 403) {
        setError(
          "password", {
          type: "manual",
          message: responseMessage
        }
        )
      };

      if (response.status === 400) {
        setError(
          ["password", "email"], {
          type: "manual",
          message: responseMessage
        }
        )
      };

      if (response.status === 200) {
        setToast(true);
        setResponseType(responseResultType[0]);
        setTimeout(() => {
          setToast(false)
        }, 10000);
        setSuccessMessage({
          icon: MdDone,
          message: responseBody.message || 'Unauthorized action'
        });
        router.push('/dashboard');
      };

      setResponseMessage(responseBody.message);
      if (response.ok) {
        setToast(true);
        setResponseType(responseResultType[0]);
        setTimeout(() => {
          setToast(false)
        }, 10000);
        setSuccessMessage({
          icon: MdDone,
          message: responseBody.message || 'Unauthorized action'
        });
        reset();
      };
    } catch (error) {
      setToast(true);
      setResponseType(responseResultType[1]);
      setTimeout(() => {
        setToast(false)
      }, 10000);
      setErrorMessage({
        icon: MdError,
        message: responseBody.message || 'Unauthorized action'
      });
      console.log('Error: ', error);
    };
  };


  return (
    (<div
      onClick={() => setToast(false)}
      className={cn("flex flex-col gap-6", className)} {...props}>

      {toast && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setToast(false)}
          ></div>

          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`relative flex items-start gap-3 px-4 py-3 bg-white shadow-lg border-l-[5px] rounded-xl
                            transition-all duration-300 ease-in-out w-80
                            ${responseType === 'Success' ? 'border-emerald-500' : 'border-rose-500'}`}>

              <div className={`flex items-center justify-center p-2 rounded-full 
                                    ${responseType === 'Success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                {responseType === 'Success' ? (
                  <MdDone className="text-xl text-emerald-600" />
                ) : (
                  <MdError className="text-xl text-rose-600" />
                )}
              </div>

              <div className="flex-1">
                <h3 className={`text-base font-semibold mb-1
                                    ${responseType === 'Success' ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {responseType === 'Success' ? "Successfully sent!" : "Action required"}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {responseType === 'Success'
                    ? (
                      <div>
                        {successMessage.message}
                      </div>
                    )
                    : (
                      <div>
                        {errorMessage.message}
                      </div>
                    )
                  }
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {responseType === 'Success' ? (
                    <button className="text-xs font-medium text-emerald-700 hover:text-emerald-900 underline">
                      Done
                    </button>
                  ) : (
                    <button className="text-xs font-medium text-rose-700 hover:text-rose-900 underline">
                      Retry Now
                    </button>
                  )}
                  <span className="text-gray-400">|</span>
                  <button
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 underline"
                    onClick={() => setToast(false)}>
                    Dismiss
                  </button>
                </div>
              </div>

              <MdClose
                onClick={() => setToast(false)}
                className="cursor-pointer text-lg text-gray-400 hover:text-gray-600 transition mt-0.5"
              />
            </div>
          </div>
        </>
      )}

      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onLoginUser)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} placeholder="m@example.com" required />
                {errors.email && (
                  <p className="text-sm font-semibold text-red-600">{`${errors.email.message}`}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" {...register('password')} required />
                {errors.password && (
                  <p className="text-sm font-semibold text-red-600">{`${errors.password.message}`}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                {isSubmitting ? 'Wait...' : 'Login'}
              </Button>
              <div
                className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <FaApple className='text-2xl' />
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <FaGoogle className='text-2xl' />
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <FaMeta className='text-2xl' />
                  <span className="sr-only">Login with Meta</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/dumbell.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div
        className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>)
  );
}
