'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

export default function StaffLogin() {

    const {
        register,
        reset,
        handleSubmit,
        setError,
        clearErrors,
        formState: { isSubmitting, errors },
        setValue
    } = useForm();

    const onLogin = async (data) => {
        console.log("Data: ", data);
        const { email, password } = data;
        const finalData = { email, password };
        if (!email) {
            setError('email', {
                type: 'manual',
                message: "Email is required"
            })
        }
        if (!password) {
            setError('password', {
                type: 'manual',
                message: "Password is required"
            })
        }
        try {
            const response = await fetch(`http://localhost:3000/api/staff-login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalData)
            });
            const responseBody = await response.json();
            console.log("Response Body: ", responseBody);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">
                    Revive Fitness
                </h2>
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Staff Login
                </h2>
                <form onSubmit={handleSubmit(onLogin)}>
                    <div className="mb-4">
                        <Label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email Address
                        </Label>
                        <Input
                            {...register('email')}
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.email.message}`}</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            Password
                        </Label>
                        <Input
                            {...register('password')}
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <p className="text-sm font-semibold text-red-600">{`${errors.password.message}`}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
}
