import { CheckCircle, Globe } from "lucide-react";
import React from "react";

interface Feature {
  features: any[];
}

export const FeaturesSection: React.FC<Feature> = ({ features }) => {
  return (
    <>
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to close more deals
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Comprehensive CRM features designed for modern sales teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Advanced features for growing teams
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Quotation & Proposal Generator
                    </h4>
                    <p className="text-gray-600">
                      Custom templates with company branding and PDF generation
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Global Timezone & Currency Support
                    </h4>
                    <p className="text-gray-600">
                      Perfect for international teams and global client
                      management
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Activity Timeline
                    </h4>
                    <p className="text-gray-600">
                      Track meetings, calls, notes, and files in one unified
                      view
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Communication Integration
                    </h4>
                    <p className="text-gray-600">
                      One-click email and WhatsApp integration via official APIs
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-8 h-8" />
                  <h3 className="text-xl font-semibold">Global Ready</h3>
                </div>
                <p className="text-gray-300">
                  Built for international teams with multi-timezone support,
                  currency conversion, and localization features that scale with
                  your global operations.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">150+</div>
                    <div className="text-sm text-gray-300">
                      Countries Supported
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">50+</div>
                    <div className="text-sm text-gray-300">Currencies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
