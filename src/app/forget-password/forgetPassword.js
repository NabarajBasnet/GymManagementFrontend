"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [renderOTPSection, setRenderOTPSection] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
  };

  if (isSubmitted) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
        <Card className="w-full max-w-md shadow-sm border-0 rounded-3xl bg-white">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We've sent a password reset link to
                <br />
                <span className="font-medium text-gray-800">{email}</span>
              </p>
            </div>

            {/* Centered and Customized OTP Entry Section */}
            <div className="flex flex-col items-center space-y-4 mt-6">
              <InputOTP maxLength={6} className="justify-center text-black">
                <InputOTPGroup className="gap-2">
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-12 h-12 text-black text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <Button
                variant="default"
                className="w-full max-w-md h-11 font-medium bg-blue-500 hover:bg-blue-600 text-white"
              >
                Verify OTP
              </Button>
            </div>

            {/* Navigation & Info */}
            <div className="mt-6 space-y-3">
              <Button
                onClick={handleBackToLogin}
                variant="outline"
                className="w-full h-11 font-medium border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>

              <p className="text-xs text-gray-500 px-2">
                Didn't receive the email? Check your spam folder or try again in
                a few minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <Card className="w-full max-w-md shadow-sm border-0 rounded-3xl bg-white">
        <CardHeader className="pb-6 pt-8 px-8">
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Reset your password
          </CardTitle>
          <CardDescription className="text-center text-gray-600 leading-relaxed">
            Enter your email address and we'll send you a secure link to reset
            your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                  placeholder="Enter your email address"
                  className={`py-6 pl-4 pr-4 bg-white border-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    error
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {error && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  {error}
                </p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-all duration-200 shadow hover:shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending link...
                </div>
              ) : (
                "Send reset link"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
              >
                ← Back to login
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
