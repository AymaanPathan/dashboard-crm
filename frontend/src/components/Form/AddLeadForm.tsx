"use client";
import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Tag,
  FileText,
  Users,
  X,
  ChevronDown,
} from "lucide-react";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { ILead } from "@/models/lead.model";
import { addLead } from "@/store/slices/kanbanSlice";
import { LeadSource } from "@/enums/leadSource..enum";
import { LeadCategory } from "@/enums/leadCategory.enum";

interface AddLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLeadForm: React.FC<AddLeadFormProps> = ({
  isOpen,
  onClose,
}) => {
  const teamMembers = useSelector((state: RootState) => state.user.teamMembers);
  const stagesList = useSelector((state: RootState) => state.stages.stages);

  const dispatch: RootDispatch = useDispatch();
  const [formData, setFormData] = useState<ILead>({
    name: "John Doe2",
    email: "john2@example.com",
    mobileNumber: "9876543210",
    source: "Website",
    requirements: "Looking for a solar solution",
    stageId: "",
    assignedToId: "",
    leadType: "Hot",
    contactPersonName: "Jane Doe",
    address: {
      street: "123 Main Street",
      city: "Vadodara",
      state: "Gujarat",
      postalCode: "390001",
      country: "India",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setOpenDropdown(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = "Required";
    if (!formData.source) newErrors.source = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    await dispatch(addLead(formData));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      mobileNumber: "",
      source: "",
      leadType: "Hot",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      contactPersonName: "",
      requirements: "",
      assignedToId: "",
      stageId: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-white shadow-2xl rounded-2xl">
        <div className="px-14 pt-12 pb-8">
          <div className="flex items-start justify-between mb-10">
            <h2 className="text-3xl font-semibold text-gray-900">New Lead</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-180px)] pr-2 -mr-2">
            <div className="space-y-10">
              {/* Basic Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Information
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Acme Corporation"
                      className={`w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b transition-colors focus:outline-none placeholder:text-gray-400 ${
                        errors.name
                          ? "border-red-300 focus:border-red-500"
                          : "border-gray-200 focus:border-gray-900"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      className="w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@acme.com"
                        className={`w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b transition-colors focus:outline-none placeholder:text-gray-400 ${
                          errors.email
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-gray-900"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b transition-colors focus:outline-none placeholder:text-gray-400 ${
                          errors.mobileNumber
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-gray-900"
                        }`}
                      />
                      {errors.mobileNumber && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.mobileNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Classification */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classification
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                      Lead Type
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "leadType" ? null : "leadType"
                          )
                        }
                        className="w-full px-0 py-2.5 text-[15px] text-left bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 flex items-center justify-between"
                      >
                        <span
                          className={
                            formData.leadType
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          {formData.leadType || "Select type"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      {openDropdown === "leadType" && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                          {Object.values(LeadCategory).map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() =>
                                handleSelectChange("leadType", category)
                              }
                              className="w-full px-4 py-2.5 text-[15px] text-left hover:bg-gray-50 transition-colors"
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                      Source
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "source" ? null : "source"
                          )
                        }
                        className={`w-full px-0 py-2.5 text-[15px] text-left bg-transparent border-0 border-b transition-colors focus:outline-none flex items-center justify-between ${
                          errors.source
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-gray-900"
                        }`}
                      >
                        <span
                          className={
                            formData.source ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          {formData.source || "Select source"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      {openDropdown === "source" && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                          {Object.values(LeadSource).map((source) => (
                            <button
                              key={source}
                              type="button"
                              onClick={() =>
                                handleSelectChange("source", source)
                              }
                              className="w-full px-4 py-2.5 text-[15px] text-left hover:bg-gray-50 transition-colors"
                            >
                              {source}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.source && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.source}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <Users className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                      Assigned To
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "assignedToId"
                              ? null
                              : "assignedToId"
                          )
                        }
                        className="w-full px-0 py-2.5 text-[15px] text-left bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 flex items-center justify-between"
                      >
                        <span
                          className={
                            formData.assignedToId
                              ? "text-gray-900"
                              : "text-gray-400"
                          }
                        >
                          {formData.assignedToId
                            ? teamMembers.salesReps.find(
                                (m) => m.id === formData.assignedToId
                              )?.username
                            : "Select team member"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      {openDropdown === "assignedToId" && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto">
                          {teamMembers.salesReps.map((member) => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() =>
                                handleSelectChange("assignedToId", member.id!)
                              }
                              className="w-full px-4 py-2.5 text-[15px] text-left hover:bg-gray-50 transition-colors"
                            >
                              {member.username}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">Stage</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "stageId" ? null : "stageId"
                          )
                        }
                        className="w-full px-0 py-2.5 text-[15px] text-left bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 flex items-center justify-between"
                      >
                        <span
                          className={
                            formData.stageId ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          {formData.stageId
                            ? stagesList.find((s) => s.id === formData.stageId)
                                ?.name
                            : "Select stage"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                      {openDropdown === "stageId" && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-auto">
                          {stagesList.map((stage) => (
                            <button
                              key={stage.id}
                              type="button"
                              onClick={() =>
                                handleSelectChange("stageId", stage.id!)
                              }
                              className="w-full px-4 py-2.5 text-[15px] text-left hover:bg-gray-50 transition-colors"
                            >
                              {stage.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                      Street
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street || ""}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city || ""}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state || ""}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-700">ZIP</label>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode || ""}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className="w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country || ""}
                      onChange={handleInputChange}
                      placeholder="United States"
                      className="w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-5 pb-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-700">
                    Requirements
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Add any notes about this lead..."
                    rows={4}
                    className="w-full px-0 py-2.5 text-[15px] bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-14 py-5 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-[15px] text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-[15px] bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all"
          >
            Create Lead
          </button>
        </div>
      </div>
    </div>
  );
};
