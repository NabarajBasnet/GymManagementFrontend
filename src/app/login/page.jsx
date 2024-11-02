'use client'

import { MdDone } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import * as React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TypingAnimation from "@/components/ui/typing-animation";
import { useForm } from 'react-hook-form';

const Login = () => {

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
    const [toast, setToast] = React.useState(false);

    const onLoginUser = async (data) => {
        try {
            const response = await fetch('http://88.198.112.156:3000/api/auth/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })

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
                setTimeout(() => {
                    setToast(false);
                }, [5000]);
                router.push('/dashboard');
            };

            setResponseMessage(responseBody.message);
            if (response.ok) {
                reset();
            };
        } catch (error) {
            console.log('Error: ', error);
        };
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-8">
                <form onSubmit={handleSubmit(onLoginUser)} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                    {toast ? (
                        <div className="w-full flex justify-center">
                            <div className="fixed top-5 bg-white border shadow-2xl flex items-center justify-between p-4">
                                <div>
                                    <MdDone className="text-4xl mx-4 text-green-600" />
                                </div>
                                <div className="block">
                                    <p className="text-sm font-semibold">{responseMessage}</p>
                                </div>
                                <div>
                                    <IoMdClose
                                        onClick={() => setToast(false)}
                                        className="cursor-pointer ml-4" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                        </>
                    )}
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
                            {...register('email', {
                                required: {
                                    value: true, message: "Email address required!"
                                }
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.email.message}`}</p>
                        )}

                        <Label className="text-sm font-medium">
                            Password
                        </Label>
                        <Input
                            type="password"
                            className="mt-1"
                            {...register('password', {
                                required: {
                                    value: true, message: "Passwrd is required!"
                                }
                            })}
                        />
                        {errors.password && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.password.message}`}</p>
                        )}
                    </div>

                    <Button type='submit' className="w-full bg-blue-600 text-white font-bold py-2 rounded-md mb-4">
                        {isSubmitting ? 'Processing...' : 'Log In'}
                    </Button>

                    <div className="text-center text-gray-600">Or</div>
                    <div className="w-full flex justify-around items-center mb-4">
                        <h1>New User?</h1>
                        <Link href={'/signup'} className="text-blue-600 text-sm font-semibold">Create account</Link>
                    </div>
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
                </form>
            </div>

            <div className="hidden lg:flex w-1/2 bg-cover bg-[url('/images/loginpagebg.jpg')] bg-right bg-opacity-60 items-center justify-center">
                <div className="text-white blur-none text-4xl font-bold">
                    <TypingAnimation
                        className="text-4xl font-bold text-white"
                        text="Welcome Back!"
                    />
                </div>
            </div>
        </div>
    )
}

export default Login;
