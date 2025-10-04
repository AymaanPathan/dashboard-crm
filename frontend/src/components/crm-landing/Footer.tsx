import { BarChart3 } from "lucide-react";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <span className="text-base font-semibold text-gray-900">
                CRMFlow
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-4">
              The modern CRM that grows with your business. Simple, powerful,
              and built for teams.
            </p>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Email:</span>{" "}
                hello@crmflow.com
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Support:</span>{" "}
                support@crmflow.com
              </p>
            </div>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a
                    href="#features"
                    className="hover:text-gray-900 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-gray-900 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2025 CRMFlow. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
