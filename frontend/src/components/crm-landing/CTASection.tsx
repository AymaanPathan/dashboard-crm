import { ArrowRight } from "lucide-react";
import React from "react";

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to transform your sales process?
        </h2>
        <p className="text-xl text-gray-300 mb-10">
          Join thousands of businesses already using CRMFlow to close more deals
          and grow faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-gray-900 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
            Start your free trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button className="border border-gray-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:border-gray-500 transition-colors">
            Schedule a demo
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
};
