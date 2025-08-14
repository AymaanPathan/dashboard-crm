import { ArrowRight } from "lucide-react";
import React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            The CRM that grows
            <span className="block">with your business</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Powerful, customizable CRM designed for modern teams. Manage leads,
            automate workflows, and scale your sales operations with
            enterprise-grade features.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-colors inline-flex items-center justify-center">
              Start free trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:border-gray-400 transition-colors">
              View demo
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            14-day free trial • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
};
