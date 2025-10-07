/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RootDispatch, RootState } from "@/store";
import { Building2, Globe, BarChart3, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorToast from "@/assets/toast/ErrorToast";
import SuccessToast from "@/assets/toast/SuccessToast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { useRouter } from "next/navigation";
import { createOrganization } from "@/store/slices/orgSlice";
import { IOrganization } from "@/models/org.model";
import { FormSelect } from "@/components/Form/Form";

// Industry and company size options
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Consulting",
  "Marketing & Advertising",
  "E-commerce",
  "Non-profit",
  "Government",
  "Other",
];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

const OrganizationSetupPage: React.FC = () => {
  const router = useRouter();
  const dispatch: RootDispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!currentUser.isVerified) {
      router.replace("/signup");
    }
  }, [currentUser.isVerified, router]);

  const [formData, setFormData] = useState<IOrganization>({
    id: "",
    organization_name: "",
    company_website: "",
    industry: "",
    company_size: "",
    employees: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown open states
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isCompanySizeOpen, setIsCompanySizeOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.organization_name.trim()) {
      ErrorToast({ title: "Organization name is required" });
      return false;
    }

    if (formData.company_website && !isValidUrl(formData.company_website)) {
      ErrorToast({ title: "Please enter a valid website URL" });
      return false;
    }

    if (!formData.industry) {
      ErrorToast({ title: "Please select an industry" });
      return false;
    }

    if (!formData.company_size) {
      ErrorToast({ title: "Please select company size" });
      return false;
    }

    return true;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        organization_name: formData.organization_name.trim(),
        company_website: formData.company_website?.trim() || null,
      };

      const res = await dispatch(createOrganization(submitData)).unwrap();
      if (res.status === "created") {
        SuccessToast({ title: "Organization created successfully" });
        router.push(`/crm/dashboard`);
      }
    } catch (error: any) {
      ErrorToast({
        title: "Setup failed",
        description: error?.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert options to {value, label} format
  const INDUSTRY_OPTIONS = INDUSTRIES.map((industry) => ({
    value: industry,
    label: industry,
  }));
  const COMPANY_SIZE_OPTIONS = COMPANY_SIZES.map((size) => ({
    value: size,
    label: `${size} employees`,
  }));

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <Link href={"/"} className="w-full mb-8">
          ← Back to homepage
        </Link>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Set up your organization
            </h2>
            <p className="mt-3 text-gray-600">
              Tell us about your company to personalize your experience
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Organization Name *
              </label>
              <div className="relative">
                <Input
                  value={formData.organization_name}
                  onChange={(e) =>
                    handleInputChange("organization_name", e.target.value)
                  }
                  type="text"
                  placeholder="Enter your organization name"
                  className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 py-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
                <Building2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Company Website */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Company Website{" "}
                <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <Input
                  value={formData.company_website || ""}
                  onChange={(e) =>
                    handleInputChange("company_website", e.target.value)
                  }
                  type="url"
                  placeholder="https://your-company.com"
                  className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 py-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
                <Globe className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Industry */}
            <FormSelect
              label="Industry *"
              value={formData.industry}
              onChange={(value) => handleInputChange("industry", value)}
              options={INDUSTRY_OPTIONS}
              isOpen={isIndustryOpen}
              onToggle={() => setIsIndustryOpen((prev) => !prev)}
            />

            {/* Company Size */}
            <FormSelect
              label="Company Size *"
              value={formData.company_size}
              onChange={(value) => handleInputChange("company_size", value)}
              options={COMPANY_SIZE_OPTIONS}
              isOpen={isCompanySizeOpen}
              onToggle={() => setIsCompanySizeOpen((prev) => !prev)}
            />

            {/* Submit Button */}
            <div>
              {isSubmitting ? (
                <ButtonLoading content="Setting up your organization..." />
              ) : (
                <Button
                  onClick={handleSubmit}
                  type="button"
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gray-50 border-l border-gray-100 flex items-center justify-center">
          <div className="text-center max-w-md px-8">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
              Customize your CRM experience
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Help us understand your business better so we can tailor our
              platform to meet your specific needs and goals.
            </p>

            <div className="mt-8 grid gap-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-gray-700">
                  Tailored team workflows
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-gray-700">
                  Industry-specific insights
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 flex-shrink-0">
                  <Building2 className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-gray-700">
                  Scalable infrastructure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationSetupPage;
