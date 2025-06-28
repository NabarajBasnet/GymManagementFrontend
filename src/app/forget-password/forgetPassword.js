"use client";

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
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 px-4">
        <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Check your email
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                We've sent a password reset link to
                <br />
                <span className="font-medium text-gray-900 dark:text-white">
                  {email}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleBackToLogin}
                variant="outline"
                className="w-full h-11 font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>

              <p className="text-xs text-gray-500 dark:text-gray-400 px-2">
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
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 px-4">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <CardHeader className="pb-6 pt-8 px-8">
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            Reset your password
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300 leading-relaxed">
            Enter your email address and we'll send you a secure link to reset
            your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  className={`py-6 pl-4 pr-4 bg-white dark:bg-gray-800/50 border-2 rounded-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    error
                      ? "border-red-300 dark:border-red-700 focus:border-red-500"
                      : "border-gray-200 dark:border-gray-700 focus:border-blue-500"
                  }`}
                  disabled={isLoading}
                />
                {error && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                )}
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  {error}
                </p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-md transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
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
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium"
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
