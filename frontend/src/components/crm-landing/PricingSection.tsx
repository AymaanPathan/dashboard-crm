"use client";
import { CheckCircle } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
};

interface PricingProps {
  pricingPlans: Plan[];
}

export const PricingSection: React.FC<PricingProps> = ({ pricingPlans }) => {
  return (
    <section id="pricing" className="py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Choose the perfect plan for your team size and needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`bg-white rounded-lg border p-8 relative hover:border-gray-300 transition-colors flex flex-col ${
                plan.popular ? "border-gray-400" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-black text-white px-3 py-1 rounded-md text-xs font-medium">
                    Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-black">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-semibold text-black">
                    ₹{plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 text-sm ml-1">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-3 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full cursor-pointer mt-8 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  plan.popular
                    ? "bg-black text-white hover:bg-gray-800 hover:shadow-lg"
                    : "bg-white border border-gray-300 text-black hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                }`}
              >
                {plan.name === "Enterprise"
                  ? "Contact Sales"
                  : "Start Free Trial"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
