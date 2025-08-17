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
const LoginPage: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                CRMFlow
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
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
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-black hover:text-gray-800"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  onClick={handleLogin}
                  type="button"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Sign in
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-black hover:text-gray-800"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-6">
              <Link href="/">
                <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900">
                  ← Back to homepage
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
          <div className="text-white text-center max-w-md">
            <h3 className="text-2xl font-bold mb-4">
              Manage your sales pipeline like a pro
            </h3>
            <p className="text-gray-300">
              Join thousands of teams already using CRMFlow to close more deals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
