"use client";
import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";

export const HeroSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Only trigger animation once on mount
    if (!hasAnimated) {
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  return (
    <section className="pt-24 pb-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-[800ms] ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <h1 className="text-[48px] lg:text-[56px] font-semibold leading-[1.1] tracking-tight">
              <span className="text-black">The simplest CRM ever</span>
              <br />
              <span className="text-black/40">No complexity</span>
            </h1>
            <p className="mt-6 text-[16px] text-black/60 leading-relaxed font-normal">
              Build meaningful relationships at scale. CRMFlow brings AI-powered
              insights, seamless automation, and crystal-clear pipelines to
              modern teams who refuse to settle.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button className="bg-black hover:bg-black/90 text-white px-4 py-2.5 rounded-md text-[14px] font-medium transition-all inline-flex items-center justify-center gap-2">
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white hover:bg-black/5 text-black px-4 py-2.5 rounded-md text-[14px] font-normal transition-all border border-black/10">
                View demo
              </button>
            </div>
            <p className="mt-5 text-[13px] text-black/50 font-normal">
              14-day free trial • No credit card required
            </p>
          </div>

          <div
            className={`relative transition-all duration-[800ms] ease-out ${
              hasAnimated
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="relative bg-white rounded-lg border border-black/10 p-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-black/5"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-black/10 rounded w-32 mb-2"></div>
                    <div className="h-2 bg-black/5 rounded w-24"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div className="h-20 bg-white rounded-md border border-black/10"></div>
                  <div className="h-20 bg-white rounded-md border border-black/10"></div>
                  <div className="h-20 bg-white rounded-md border border-black/10"></div>
                </div>
                <div className="space-y-2.5 pt-2">
                  <div className="h-2 bg-black/5 rounded w-full"></div>
                  <div className="h-2 bg-black/5 rounded w-5/6"></div>
                  <div className="h-2 bg-black/5 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
