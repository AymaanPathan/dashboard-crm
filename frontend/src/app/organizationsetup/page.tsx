/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RootDispatch } from "@/store";
import { Building2, Globe, Users, TrendingUp, BarChart3 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ErrorToast from "@/assets/toast/ErrorToast";
import SuccessToast from "@/assets/toast/SuccessToast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { createOrganization } from "@/store/slices/orgSlice";
import { IOrganization } from "@/models/org.model";

// Industry options
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

// Company size options
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

// Expected leads per month options
const LEADS_PER_MONTH = [
  "1-50",
  "51-100",
  "100-500",
  "500-1000",
  "1000-5000",
  "5000+",
];

const OrganizationSetupPage: React.FC = () => {
  const router = useRouter();
  const dispatch: RootDispatch = useDispatch();

  const [formData, setFormData] = useState<IOrganization>({
    id: "",
    organization_name: "",
    company_website: "",
    industry: "",
    company_size: "",
    employees: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        organization_name: formData?.organization_name?.trim(),
        company_website: formData?.company_website?.trim() || null,
      };

      await dispatch(createOrganization(submitData)).unwrap();

    } catch (error: any) {
      ErrorToast({
        title: "Setup failed",
        description: error?.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <div className="mt-10">
            <div className="space-y-6">
              {/* Organization Name */}
              <div>
                <Label
                  htmlFor="organization_name"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Organization Name *
                </Label>
                <div className="relative">
                  <Input
                    value={formData.organization_name}
                    onChange={(e) =>
                      handleInputChange("organization_name", e.target.value)
                    }
                    id="organization_name"
                    name="organization_name"
                    type="text"
                    required
                    className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 py-2 text-sm transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your organization name"
                  />
                  <Building2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Company Website */}
              <div>
                <Label
                  htmlFor="company_website"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Company Website{" "}
                  <span className="text-gray-500">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    value={formData?.company_website?.trim() || ""}
                    onChange={(e) =>
                      handleInputChange("company_website", e.target.value)
                    }
                    id="company_website"
                    name="company_website"
                    type="url"
                    className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-12 py-2 text-sm transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="https://your-company.com"
                  />
                  <Globe className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Industry */}
              <div>
                <Label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Industry *
                </Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) =>
                    handleInputChange("industry", value)
                  }
                >
                  <SelectTrigger className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Company Size */}
              <div>
                <Label
                  htmlFor="company_size"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Company Size *
                </Label>
                <Select
                  value={formData.company_size}
                  onValueChange={(value) =>
                    handleInputChange("company_size", value)
                  }
                >
                  <SelectTrigger className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size} employees
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
