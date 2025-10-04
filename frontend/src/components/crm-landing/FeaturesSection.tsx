"use client";
import { CheckCircle, Globe } from "lucide-react";
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
      <section id="features" className="py-28 bg-gray-50 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight">
              Everything you need to close more deals
            </h2>
            <p className="mt-4 text-base text-gray-700">
              Comprehensive CRM features designed for modern sales teams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white p-6 rounded-xl border border-gray-300 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-28 bg-gray-50 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-4xl sm:text-5xl font-semibold text-black tracking-tight mb-8">
                Advanced features for growing teams
              </h2>
              <div className="space-y-5">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-black text-base">
                      Quotation & Proposal Generator
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Custom templates with company branding and PDF generation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-black text-base">
                      Global Timezone & Currency Support
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Perfect for international teams and global client
                      management
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-black text-base">
                      Activity Timeline
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Track meetings, calls, notes, and files in one unified
                      view
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-black text-base">
                      Communication Integration
                    </h4>
                    <p className="text-gray-700 text-sm">
                      One-click email and WhatsApp integration via official APIs
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white rounded-xl border border-gray-300 p-8 shadow-sm"
            >
              <div className="space-y-5">
                <div className="flex items-center space-x-3">
                  <Globe className="w-7 h-7 text-black" />
                  <h3 className="text-xl font-semibold text-black">
                    Global Ready
                  </h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Built for international teams with multi-timezone support,
                  currency conversion, and localization features that scale with
                  your global operations.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div>
                    <div className="text-3xl font-semibold text-black">
                      150+
                    </div>
                    <div className="text-sm text-gray-700">
                      Countries Supported
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-semibold text-black">50+</div>
                    <div className="text-sm text-gray-700">Currencies</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};
