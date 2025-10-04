"use client";
import React from "react";
import { motion } from "framer-motion";

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Feature {
  features: FeatureProps[];
}

export const FeaturesSection: React.FC<Feature> = ({ features }) => {
  return (
    <>
      <section id="features" className="py-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
            className="max-w-3xl mb-16"
          >
            <h2 className="text-4xl sm:text-5xl text-black tracking-tight leading-tight">
              Everything you need to close more deals
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Comprehensive CRM features designed for modern sales teams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
