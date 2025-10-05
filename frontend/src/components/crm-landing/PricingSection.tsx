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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              id={`pricing-${index}`}
              data-animate-pricing
              className={`bg-white rounded-lg border p-8 relative hover:border-black/20 transition-all duration-700 ease-out flex flex-col ${
                plan.popular ? "border-black/20 shadow-sm" : "border-black/10"
              } ${
                isVisible[`pricing-${index}`]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-black text-white px-2.5 py-1 rounded-md text-[12px] font-medium">
                    Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-[16px] font-medium text-black">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-[36px] font-semibold text-black">
                    ₹{plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-black/50 text-[14px] ml-1">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[14px] text-black/60">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 space-y-3 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                    <span className="text-[14px] text-black/70">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full mt-8 py-2.5 px-4 rounded-md text-[14px] font-medium transition-all ${
                  plan.popular
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-white border border-black/10 text-black hover:bg-black/5"
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
