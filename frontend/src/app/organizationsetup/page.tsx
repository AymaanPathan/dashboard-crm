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
  const isUserVerified = useSelector(
    (state: RootState) => state.auth.user.isVerified
  );
  console.log("Is User Verified:", isUserVerified);

  const [formData, setFormData] = useState<IOrganization>({
    id: "",
    organization_name: "",
    company_website: "",
    industry: "",
    company_size: "",
    employees: [],
  });

  const [errors, setErrors] = useState({
    organization_name: "",
    company_website: "",
    industry: "",
    company_size: "",
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
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      organization_name: "",
      company_website: "",
      industry: "",
      company_size: "",
    };
    let hasError = false;

    if (!formData.organization_name.trim()) {
      newErrors.organization_name = "Organization name is required";
      hasError = true;
    }

    if (formData.company_website && !isValidUrl(formData.company_website)) {
      newErrors.company_website = "Please enter a valid website URL";
      hasError = true;
    }

    if (!formData.industry) {
      newErrors.industry = "Please select an industry";
      hasError = true;
    }

    if (!formData.company_size) {
      newErrors.company_size = "Please select company size";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
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
      console.log("Create Organization Response:", res);
      if (res.status === "created") {
        SuccessToast({ title: "Organization created successfully" });
        router.push(`/crm/dashboard`);
      }
    } catch (error: any) {
      console.log("Organization Creation Error:", error);
      ErrorToast({
        title: "Setup failed",
        description: error,
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
      <div className="flex-1 flex flex-col justify-center py-6 px-4 sm:px-6 lg:flex-none lg:px-12 xl:px-16">
        <Link href={"/"} className="w-full mb-4">
          ← Back to homepage
        </Link>

        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mt-5 space-y-3.5">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Organization Name *
              </label>
              <div>
                <div className="relative">
                  <Input
                    value={formData.organization_name}
                    onChange={(e) =>
                      handleInputChange("organization_name", e.target.value)
                    }
                    type="text"
                    placeholder="Enter your organization name"
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 pr-10 py-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                  <Building2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.organization_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.organization_name}
                  </p>
                )}
              </div>
            </div>

            {/* Company Website */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Company Website{" "}
                <span className="text-gray-500">(Optional)</span>
              </label>
              <div>
                <div className="relative">
                  <Input
                    value={formData.company_website || ""}
                    onChange={(e) =>
                      handleInputChange("company_website", e.target.value)
                    }
                    type="url"
                    placeholder="https://your-company.com"
                    className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 pr-10 py-2 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                  <Globe className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.company_website && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.company_website}
                  </p>
                )}
              </div>
            </div>

            {/* Industry */}
            <div>
              <FormSelect
                label="Industry *"
                value={formData.industry}
                onChange={(value) => handleInputChange("industry", value)}
                options={INDUSTRY_OPTIONS}
                isOpen={isIndustryOpen}
                onToggle={() => setIsIndustryOpen((prev) => !prev)}
              />
              {errors.industry && (
                <p className="text-sm text-red-500 mt-1">{errors.industry}</p>
              )}
            </div>

            {/* Company Size */}
            <div>
              <FormSelect
                label="Company Size *"
                value={formData.company_size}
                onChange={(value) => handleInputChange("company_size", value)}
                options={COMPANY_SIZE_OPTIONS}
                isOpen={isCompanySizeOpen}
                onToggle={() => setIsCompanySizeOpen((prev) => !prev)}
              />
              {errors.company_size && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.company_size}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-1.5">
              {isSubmitting ? (
                <ButtonLoading content="Setting up your organization..." />
              ) : (
                <Button
                  onClick={handleSubmit}
                  type="button"
                  className="group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors shadow-sm"
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
          <div className="text-center max-w-md px-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
              Customize your CRM experience
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Help us understand your business better so we can tailor our
              platform to meet your specific needs and goals.
            </p>

            <div className="mt-5 grid gap-2.5 text-left">
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
