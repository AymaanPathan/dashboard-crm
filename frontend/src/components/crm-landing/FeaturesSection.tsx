"use client";
import React, { useState } from "react";

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Feature {
  features: FeatureProps[];
}

export const FeaturesSection: React.FC<Feature> = ({ features }) => {
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

    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-20 px-6 sm:px-8 lg:px-12 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div
          id="features-header"
          data-animate
          className={`max-w-[600px] mb-16 transition-all duration-700 ease-out ${
            isVisible["features-header"]
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-[40px] sm:text-[48px] font-semibold tracking-tight leading-[1.1] text-black">
            Everything you need to close more deals
          </h2>
          <p className="mt-4 text-[16px] text-black/60 leading-relaxed">
            Comprehensive CRM features designed for modern sales teams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {features.map((feature, index) => (
            <div
              key={index}
              id={`feature-${index}`}
              data-animate
              className={`flex gap-4 transition-all duration-700 ease-out ${
                isVisible[`feature-${index}`]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-black/5 rounded-md flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-black" />
                </div>
              </div>
              <div>
                <h3 className="text-[16px] font-medium text-black mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-black/60 leading-relaxed text-[14px]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
