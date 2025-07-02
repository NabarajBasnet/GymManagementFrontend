"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [forgetPasswordOTP, setForgetPasswordOTP] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // timer countdown
  useEffect(() => {
    if (!isSubmitted || timer <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + timer * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.ceil((endTime - now) / 1000));

      setTimer(timeLeft);

      if (timeLeft > 0) {
        requestAnimationFrame(updateTimer);
      } else {
        setIsResendDisabled(false);
      }
    };

    const frameId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(frameId);
  }, [isSubmitted, timer]);

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

    try {
      const response = await fetch(
        `http://localhost:3000/api/tenant/forget-password-pin?email=${email}`,
        {
          method: "PATCH",
        }
      );

      const responseBody = await response.json();
      console.log(responseBody);
      if (response.ok) {
        toast.success(responseBody.message);
        setIsSubmitted(true);
        setIsLoading(false);
        setTimer(60); // Reset timer on successful submit
        setIsResendDisabled(true); // Disable resend button when timer starts
      } else {
        setIsLoading(false);
        toast.error(responseBody.message);
      }
      console.log(responseBody);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
      console.log("Error: ", error);
    }
  };

  const handleResendOTP = async () => {
    setIsResendDisabled(true);
    setTimer(60);

    try {
      const response = await fetch(
        `http://localhost:3000/api/tenant/forget-password-pin?email=${email}`,
        {
          method: "PATCH",
        }
      );

      const responseBody = await response.json();
      if (response.ok) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(responseBody.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBackToLogin = () => {
    setForgetPasswordOTP("");
    setIsSubmitted(false);
    setEmail("");
    setError("");
    setTimer(60); // Reset timer
    setIsResendDisabled(false); // Enable resend button
  };

  const verifyForgetPasswordPIN = async () => {
    setVerifying(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/tenant/verify-forget-password-pin?OTP=${forgetPasswordOTP}`
      );
      const responseBody = await response.json();
      console.log(responseBody);
      if (response.ok) {
        setVerifying(false);
      } else {
        toast.error(responseBody.message);
        setVerifying(false);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error(error.message);
      setVerifying(false);
    }
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
              <InputOTP
                maxLength={6}
                value={forgetPasswordOTP}
                onChange={setForgetPasswordOTP}
                className="justify-center text-black"
              >
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
                onClick={() => verifyForgetPasswordPIN()}
                variant="default"
                className="w-full max-w-md h-11 font-medium bg-blue-500 hover:bg-blue-600 text-white"
              >
                {verifying ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>

            {/* Resend OTP Section with Timer */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResendOTP}
                  disabled={isResendDisabled}
                  className={`font-medium ${
                    isResendDisabled
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  {isResendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
              </p>
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
                  className={`py-6 pl-4 pr-4 bg-white border-2 rounded-md text-black transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
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
                "Send OTP"
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
