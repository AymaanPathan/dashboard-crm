"use client";
import { CheckCircle } from "lucide-react";
import React, { useState } from "react";

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
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll("[data-animate-pricing]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="pricing"
      className="py-20 px-6 sm:px-8 lg:px-12 bg-white border-t border-black/8"
    >
      <div className="max-w-[1200px] mx-auto">
        <div
          id="pricing-header"
          data-animate-pricing
          className={`max-w-[600px] mb-16 transition-all duration-700 ease-out ${
            isVisible["pricing-header"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-[40px] sm:text-[48px] font-semibold tracking-tight leading-[1.1] text-black">
            Flexible Pricing Plans
          </h2>
          <p className="mt-3 text-[16px] text-black/60">
            Choose the perfect plan for your team size and needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              id={`pricing-${index}`}
              data-animate-pricing
              className={`bg-white rounded-xl p-6 relative hover:shadow-sm transition-all duration-300 ease-out flex flex-col ${
                plan.popular ? "shadow-sm" : "border-gray-200"
              } ${
                isVisible[`pricing-${index}`]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-5">
                  <span className="bg-gray-900 text-white px-3 py-0.5 rounded-full text-xs font-medium">
                    Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500 text-sm ml-1.5">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-6 space-y-2.5 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full cursor-pointer mt-6 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  plan.popular
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
