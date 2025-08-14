"use client";
import { ArrowRight, BarChart3, Eye, EyeOff, Link, Mail } from "lucide-react";
import React, { useState } from "react";
const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600">
              Start your 14-day free trial today
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      id="first-name"
                      name="first-name"
                      type="text"
                      autoComplete="given-name"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      id="last-name"
                      name="last-name"
                      type="text"
                      autoComplete="family-name"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                    placeholder="john@company.com"
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company name
                </label>
                <div className="mt-1">
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                    placeholder="Your Company Inc."
                  />
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
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                    placeholder="Create a strong password"
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

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="team-size"
                  className="block text-sm font-medium text-gray-700"
                >
                  Team size
                </label>
                <div className="mt-1">
                  <select
                    id="team-size"
                    name="team-size"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                  >
                    <option value="">Select team size</option>
                    <option value="1-5">1-5 people</option>
                    <option value="6-10">6-10 people</option>
                    <option value="11-25">11-25 people</option>
                    <option value="26-50">26-50 people</option>
                    <option value="51+">51+ people</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-black hover:text-gray-800"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-black hover:text-gray-800"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                >
                  Start free trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-black hover:text-gray-800"
                  >
                    Sign in
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

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  14-day free trial • No credit card required • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
          <div className="text-white text-center max-w-md">
            <h3 className="text-2xl font-bold mb-4">
              Start closing more deals today
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of sales teams who trust CRMFlow to manage their
              pipeline and grow their business.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-gray-300">
                  Customer satisfaction
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">2x</div>
                <div className="text-sm text-gray-300">Faster deal closure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
