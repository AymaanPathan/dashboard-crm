"use client";
import { ChevronRight } from "lucide-react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import React, { useState } from "react";
import OtpPage from "./OtpPage";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ErrorToast from "@/assets/toast/ErrorToast";
import { isValidEmail } from "@/utils/validation.utils";
import { useRegisterLoading } from "@/assets/loadingStates/auth.loading.state";
import Link from "next/link";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpDigits, setOtpDigits] = useState("");
  const dispatch: RootDispatch = useDispatch();
  const step = useSelector((state: RootState) => state.auth.step);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Loading
  const isRegisterLoading = useRegisterLoading();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const newError = { username: "", email: "", password: "" };
    let hasError = false;

    if (!username) {
      newError.username = "Username is required";
      hasError = true;
    }
    if (!email) {
      newError.email = "Email is required";
      hasError = true;
    } else if (!isValidEmail(email)) {
      newError.email = "Invalid email format";
      hasError = true;
    }
    if (!password) {
      newError.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newError.password = "Password must be at least 6 characters";
      hasError = true;
    }
    setErrors(newError);

    if (hasError) return;

    try {
      const res = await dispatch(registerUser({ username, email, password }));
      if (res.meta.requestStatus === "fulfilled") {
        setShowOtpVerification(true);
      }
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <Link href={"/"} className="w-full mb-12">
          ← Back to homepage
        </Link>
        <div
          className={`transition-all duration-500 ease-in-out ${
            showOtpVerification
              ? "opacity-100 translate-x-0"
              : "opacity-100 translate-x-0"
          }`}
        >
          {step === "otp" ? (
            <OtpPage
              otp={otpDigits}
              setOtp={setOtpDigits}
              setShowOtpVerification={setShowOtpVerification}
            />
          ) : (
            <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
              <div className="flex flex-col space-y-3 text-left">
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                  Create account
                </h1>
                <p className="text-sm text-gray-600">
                  Enter your details below to create your account
                </p>
              </div>

              <div className="grid gap-6 select-none">
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <Label
                      className="text-sm font-medium text-gray-900"
                      htmlFor="username"
                    >
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="username"
                        className="flex h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter your username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      className="text-sm font-medium text-gray-900"
                      htmlFor="email"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        className="flex h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="name@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      className="text-sm font-medium text-gray-900"
                      htmlFor="password"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        className="flex h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-12 py-2 text-sm transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {!showPassword ? (
                        <EyeOff
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 "
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <Eye
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 "
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                      {errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-11 px-6 py-2 shadow-sm w-full"
                    type="submit"
                    onClick={handleSignup}
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0 1 8-8v8z"
                          />
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden w-full bg-gray-50 lg:block border-l border-gray-100">
        <div className="flex h-full items-center justify-center p-12">
          <div className="mx-auto flex w-full max-w-lg flex-col justify-center space-y-8 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 shadow-sm">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="m8 3 4 8 5-5v11H5V6l3-3z" />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                {showOtpVerification ? "Almost there!" : "Welcome to CRM Pro"}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                {showOtpVerification
                  ? "Just verify your email and you'll be ready to start managing your customers and growing your business."
                  : "The modern CRM solution for growing teams. Manage customers, track sales, and scale your business with confidence."}
              </p>
            </div>

            <div className="grid gap-6 text-left">
              <div className="flex items-start space-x-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0 mt-0.5">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Advanced Analytics
                  </p>
                  <p className="text-sm text-gray-600">
                    Real-time insights into your sales performance and customer
                    behavior
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0 mt-0.5">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Team Collaboration
                  </p>
                  <p className="text-sm text-gray-600">
                    Seamless workflows and communication tools for your entire
                    team
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0 mt-0.5">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Smart Automation
                  </p>
                  <p className="text-sm text-gray-600">
                    Automate repetitive tasks and focus on what matters most
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
