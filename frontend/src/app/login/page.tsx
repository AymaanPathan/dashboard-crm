/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RootDispatch } from "@/store";
import { loginUser } from "@/store/slices/authSlice";
import { BarChart3, Mail, Lock, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { isValidEmail } from "@/utils/validation.utils";
import ErrorToast from "@/assets/toast/ErrorToast";
import { useLoginLoading } from "@/assets/loadingStates/auth.loading.state";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { Input } from "@/components/ui/input";
const LoginPage: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Loading
  const isLoginLoading = useLoginLoading();

  const handleLogin = async () => {
    if (!email) return ErrorToast({ title: "Email is required" });
    if (!isValidEmail(email)) return ErrorToast({ title: "Invalid email" });
    if (!password) return ErrorToast({ title: "Password is required" });

    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                CRMFlow
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 py-2 text-sm transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 py-2 text-sm transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 focus:ring-1 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                {isLoginLoading ? (
                  <button
                    disabled
                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 opacity-75 cursor-not-allowed"
                  >
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
                    Signing in...
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    type="button"
                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Sign in
                  </button>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                ← Back to homepage
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gray-50 border-l border-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md px-8">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
              Streamline your sales process
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Track leads, manage deals, and grow your business with our
              powerful CRM platform trusted by teams worldwide.
            </p>

            <div className="mt-8 grid gap-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0">
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
                <span className="text-sm text-gray-700">
                  Pipeline management
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0">
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
                <span className="text-sm text-gray-700">
                  Real-time analytics
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0">
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
                <span className="text-sm text-gray-700">
                  Team collaboration
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
