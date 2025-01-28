'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import TypingAnimation from "@/components/ui/typing-animation";
import { useForm } from 'react-hook-form'
import { MdError } from "react-icons/md";
import { MdDelete, MdClose } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { Button } from "@/components/ui/button.jsx";
import { useState } from "react";

const SignUp = () => {

    const [toast, setToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ icon: MdDone, message: '' });
    const [errorMessage, setErrorMessage] = useState({ icon: MdError, message: '' });
    const [responseType, setResponseType] = useState('');
    const responseResultType = ['Success', 'Failure'];

    const {
        register,
        reset,
        handleSubmit,
        formState: { isSubmitting, errors }
    } = useForm()

    const onSignUp = async (data) => {
        try {
            const response = await fetch('http://88.198.112.156:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const responseBody = await response.json();
            if (response.ok) {
                setResponseType(responseResultType[0]);
                setToast(true);
                setTimeout(() => {
                    setToast(false)
                }, 10000);
                setSuccessMessage({
                    icon: MdDone,
                    message: responseBody.message || 'Unauthorized action'
                })
                reset();
            };
        } catch (error) {
            console.log("Error: ", error);
            setResponseType(responseResultType[1]);
            setToast(true);
            setTimeout(() => {
                setToast(false)
            }, 10000);
            setErrorMessage({
                icon: MdError,
                message: error.message || 'Unauthorized action'
            });
        };
    };

    return (
        <div className="flex min-h-screen" onClick={() => setToast(false)}>
            {toast ? (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className={`bg-white border shadow-2xl flex items-center justify-between p-4 relative`}>
                        <div>
                            {
                                responseType === 'Success' ? (
                                    <MdDone className="text-3xl mx-4 text-green-600" />
                                ) : (
                                    <MdError className="text-3xl mx-4 text-red-600" />
                                )
                            }
                        </div>
                        <div className="block">
                            {
                                responseType === 'Success' ? (
                                    <p className="text-sm font-semibold text-green-600">{successMessage.message}</p>
                                ) : (
                                    <p className="text-sm font-semibold text-red-600">{errorMessage.message}</p>
                                )
                            }
                        </div>
                        <div>
                            <MdClose
                                onClick={() => setToast(false)}
                                className="cursor-pointer text-3xl ml-4" />
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 items-center justify-center">
                <div className="text-white blur-none text-4xl font-bold">
                    <TypingAnimation
                        className="text-4xl font-bold text-white"
                        text="Sign Up"
                    />
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 flex-col justify-center items-center p-4">
                <div className="w-full max-w-md px-8 py-2 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
                    <div className="w-full flex justify-center">
                        <div className="w-3/12 bg-black h-0.5 mb-4"></div>
                    </div>
                    <form className="mb-4" onSubmit={handleSubmit(onSignUp)}>
                        <div className="md:flex block items-center md:space-x-4">
                            <div>
                                <Label className="text-sm font-medium">
                                    First Name
                                </Label>
                                <Input
                                    type="text"
                                    className="mt-1"
                                    placeholder="First Name"
                                    {...register('firstName', {
                                        required: { value: true, message: "First name is required!" }
                                    })}
                                />
                                {errors.firstName && (
                                    <p className="text-sm font-semibold text-red-600">{`${errors.firstName.message}`}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm font-medium">
                                    Last Name
                                </Label>
                                <Input
                                    type="text"
                                    className="mt-1"
                                    placeholder="Last Name"
                                    {...register('lastName', {
                                        required: { value: true, message: "Last name is required!" }
                                    })}
                                />
                                {errors.lastName && (
                                    <p className="text-sm font-semibold text-red-600">{`${errors.lastName.message}`}</p>
                                )}
                            </div>
                        </div>

                        <Label className="text-sm font-medium">
                            Email
                        </Label>
                        <Input
                            type="email"
                            className="mt-1"
                            placeholder="Email Address"
                            {...register('email', {
                                required: { value: true, message: "Please provide an email!" }
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.email.message}`}</p>
                        )}

                        <Label className="text-sm font-medium">
                            Phone Number
                        </Label>
                        <Input
                            type="tel"
                            className="mt-1"
                            placeholder="Phone Number"
                            {...register('phoneNumber', {
                                required: { value: true, message: "Please provide an email!" }
                            })}
                        />
                        {errors.phoneNumber && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.phoneNumber.message}`}</p>
                        )}

                        <Label className="text-sm font-medium">
                            Password
                        </Label>
                        <Input
                            type="password"
                            className="mt-1"
                            placeholder="Password"
                            {...register('password', {
                                required: { value: true, message: "Please provide password!" }
                            })}
                        />
                        {errors.password && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.password.message}`}</p>
                        )}

                        <Label className="text-sm font-medium">
                            Confirm Password
                        </Label>
                        <Input
                            type="password"
                            className="mt-1"
                            placeholder="Confirm Password"
                            {...register('confirmPassword', {
                                required: { value: true, message: "Please Confirm Password!" }
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.confirmPassword.message}`}</p>
                        )}


                        <Label className="text-sm font-medium">
                            Address
                        </Label>
                        <Input
                            type="tel"
                            className="mt-1"
                            placeholder="Address"
                            {...register('address', {
                                required: { value: true, message: "Please provide address!" }
                            })}
                        />
                        {errors.address && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.address.message}`}</p>
                        )}

                        <Label className="text-sm font-medium">
                            Date Of Birth
                        </Label>
                        <Input
                            type="date"
                            className="mt-1"
                            placeholder="Date Of Birth"
                            {...register('dob', {
                                required: { value: true, message: "Please provide your DOB!" }
                            })}
                        />
                        {errors.dov && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.dob.message}`}</p>
                        )}

                        <Button type='submit' className="w-full bg-blue-600 text-white font-bold py-2 rounded-md mt-4">
                            {isSubmitting ? 'Processing...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="text-center text-gray-600 mb-4">Or</div>

                    <Button className="w-full bg-gray-800 text-white flex items-center justify-center py-2 rounded-md">
                        <Link href={'/login'}>
                            Log In
                        </Link>
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
        </div>
    )
}

export default SignUp;
