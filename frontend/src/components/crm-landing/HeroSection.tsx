"use client";
import { ArrowRight } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-28 px-6 sm:px-8 lg:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div>
              <h1 className="text-5xl  sm:text-6xl lg:text-5xl leading-tight">
                <span className="text-gray-900">The simplest CRM ever</span>
                <br />
                <span className="text-gray-500">No complexity</span>
              </h1>
              <p className="mt-6 text-base text-gray-600 leading-relaxed font-sans">
                Build meaningful relationships at scale. CRMFlow brings
                AI-powered insights, seamless automation, and crystal-clear
                pipelines to modern teams who refuse to settle.
              </p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="bg-black cursor-pointer text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 hover:shadow-lg hover transition-all inline-flex items-center justify-center">
                Start free trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button className="bg-white cursor-pointer text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all border border-gray-300">
                View demo
              </button>
            </div>
            <p className="mt-5 text-xs text-gray-600 font-normal">
              14-day free trial • No credit card required
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-xl shadow-sm border border-gray-300 p-8 overflow-hidden">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="h-24 bg-gray-100 rounded-lg border border-gray-300"></div>
                  <div className="h-24 bg-gray-100 rounded-lg border border-gray-300"></div>
                  <div className="h-24 bg-gray-100 rounded-lg border border-gray-300"></div>
                </div>
                <div className="space-y-3 pt-3">
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
