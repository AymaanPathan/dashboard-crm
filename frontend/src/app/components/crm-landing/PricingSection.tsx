import { CheckCircle } from "lucide-react";
import React from "react";

interface PricingProps {
  pricingPlans: any[];
}

export const PricingSection: React.FC<PricingProps> = ({ pricingPlans }) => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your team size and needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg border-2 p-8 relative ${
                plan.popular ? "border-black" : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature: any, featureIndex: any) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full mt-8 py-3 px-4 rounded-md font-medium transition-colors ${
                  plan.popular
                    ? "bg-black text-white hover:bg-gray-800"
                    : "border border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {plan.name === "Enterprise"
                  ? "Contact Sales"
                  : "Start Free Trial"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
