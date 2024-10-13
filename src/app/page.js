'use client'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TypingAnimation from "@/components/ui/typing-animation";
import { useState } from "react";

export default function Home() {

  const [signUpForm, setSignUpForm] = useState(false);

  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-cover bg-[url('/images/loginpagebg.jpg')] bg-right bg-opacity-60 items-center justify-center">
        <div className="text-white blur-none text-4xl font-bold">
          <TypingAnimation
            className="text-4xl font-bold text-white"
            text="Welcome Back!"
          />
        </div>
      </div>

      {
        signUpForm ? (
          <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-8">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
              <div className="w-full flex justify-center">
                <div className="w-3/12 bg-black h-0.5 mb-4"></div>
              </div>
              <div className="mb-4">
                <Label className="text-sm font-medium">
                  First Name
                </Label>
                <Input
                  type="email"
                  className="mt-1"
                  placeholder="name@example.com"
                />

                <Label className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  type="password"
                  className="mt-1"
                />
              </div>

              <Button onClick={() => setSignUpForm(!signUpForm)} className="w-full bg-blue-600 text-white font-bold py-2 rounded-md mb-4">
                Log In
              </Button>

              <div className="text-center text-gray-600 mb-4">Or</div>

              <Button className="w-full bg-gray-800 text-white flex items-center justify-center py-2 rounded-md">
                Forget Password ?
              </Button>

              <p className="text-center text-xs text-gray-500 mt-4">
                By clicking continue, you agree to our{' '}
                <a href="#" className="underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-8">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
              <div className="w-full flex justify-center">
                <div className="w-3/12 bg-black h-0.5 mb-4"></div>
              </div>
              <div className="mb-4">
                <div className="md:flex block items-center md:space-x-4">
                  <div>
                    <Label className="text-sm font-medium">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      className="mt-1"
                      placeholder="First Name"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      className="mt-1"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <Label className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  type="email"
                  className="mt-1"
                  placeholder="Email Address"
                />

                <Label className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  className="mt-1"
                  placeholder="Phone Number"
                />


                <Label className="text-sm font-medium">
                  Address
                </Label>
                <Input
                  type="tel"
                  className="mt-1"
                  placeholder="Address"
                />

                <Label className="text-sm font-medium">
                  Date Of Birth
                </Label>
                <Input
                  type="date"
                  className="mt-1"
                  placeholder="Date Of Birth"
                />
              </div>

              <Button onClick={() => setSignUpForm(!signUpForm)} className="w-full bg-blue-600 text-white font-bold py-2 rounded-md mb-4">
                Sign Up
              </Button>

              <div className="text-center text-gray-600 mb-4">Or</div>

              <Button className="w-full bg-gray-800 text-white flex items-center justify-center py-2 rounded-md">
                <FaGithub className="text-xl mx-2" /> Github
              </Button>

              <p className="text-center text-xs text-gray-500 mt-4">
                By clicking continue, you agree to our{' '}
                <a href="#" className="underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
        )
      }
    </div>
  );
}
