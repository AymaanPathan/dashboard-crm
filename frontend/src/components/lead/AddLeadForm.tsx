/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Building2, MapPin, Tag, FileText, Users } from "lucide-react";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { IAddress, ILead } from "@/models/lead.model";
import { addLead } from "@/store/slices/kanbanSlice";
import { LeadSource } from "@/enums/leadSource..enum";
import { LeadCategory } from "@/enums/leadCategory.enum";
import {
  FormField,
  FormModal,
  FormSection,
  FormSelect,
  FormTextarea,
} from "../Form/Form";
import ErrorToast from "@/assets/toast/ErrorToast";
import SuccessToast from "@/assets/toast/SuccessToast";

interface AddLeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobileNumber?: string;
  source?: string;
  leadType?: string;
  assignedToId?: string;
  stageId?: string;
  contactPersonName?: string;
  requirements?: string;
  address?: IAddress;
  [key: string]: string | IAddress | undefined;
}

export const AddLeadForm: React.FC<AddLeadFormProps> = ({
  isOpen,
  onClose,
}) => {
  const teamMembers = useSelector((state: RootState) => state.user.teamMembers);
  const stagesList = useSelector((state: RootState) => state.stages.stages);
  const [selectedOptions, setSelectedOptions] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const addingLead = useSelector(
    (state: RootState) => state.kanban.loading.addingLead
  );
  const dispatch: RootDispatch = useDispatch();
  const [formData, setFormData] = useState<ILead>({
    name: "",
    email: "",
    mobileNumber: "",
    source: "",
    requirements: "",
    stageId: "",
    assignedToId: "",
    leadType: "Hot",
    contactPersonName: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

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
      // Clear error message on change
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const addressErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "Phone number is required";
    if (!formData.source) newErrors.source = "Please select a source";
    if (!formData.leadType) newErrors.leadType = "Please select a lead type";
    if (!formData.assignedToId)
      newErrors.assignedToId = "Please select a team member";
    if (!formData.stageId) newErrors.stageId = "Please select a stage";

    // ✅ Address validation
    if (!formData?.address.street?.trim())
      addressErrors.street = "Street is required";
    if (!formData?.address.city?.trim())
      addressErrors.city = "City is required";
    if (!formData?.address.state?.trim())
      addressErrors.state = "State is required";
    if (!formData?.address.pincode?.trim())
      addressErrors.pincode = "ZIP is required";

    if (Object.keys(addressErrors).length > 0) {
      (newErrors.address as any) = addressErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    try {
      await dispatch(addLead(formData)).unwrap();
      SuccessToast({
        title: "Lead added",
        description: "The lead has been added successfully.",
        duration: 5000,
      });
      onClose();
    } catch (error: any) {
      ErrorToast({
        title: "Failed to add lead",
        description: error,
        duration: 5000,
      });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
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
        pincode: "",
      },
      contactPersonName: "",
      requirements: "",
      assignedToId: "",
      stageId: "",
    });
    setErrors({});
    onClose();
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Lead"
      onSubmit={handleSubmit}
      submitLabel={addingLead ? "Adding..." : "Add Lead"}
    >
      <div className="space-y-6">
        {/* Company Information */}
        <FormSection
          icon={<Building2 className="w-3.5 h-3.5 text-gray-500" />}
          title="Company Information"
        >
          <div className="space-y-3">
            <FormField
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Acme Corporation"
              error={errors.name}
            />

            <FormField
              label="Contact Person"
              name="contactPersonName"
              value={formData.contactPersonName}
              onChange={handleInputChange}
              placeholder="John Smith"
              error={errors.contactPersonName}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@acme.com"
                error={errors.email}
              />

              <FormField
                label="Phone"
                name="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                error={errors.mobileNumber}
              />
            </div>
          </div>
        </FormSection>

        {/* Classification */}
        <FormSection
          icon={<Tag className="w-3.5 h-3.5 text-gray-500" />}
          title="Classification"
        >
          <div className="grid grid-cols-2 gap-3">
            <FormSelect
              label="Lead Type"
              value={formData.leadType}
              onChange={(value) => handleSelectChange("leadType", value)}
              placeholder="Select type"
              options={Object.values(LeadCategory).map((cat) => ({
                value: cat,
                label: cat,
              }))}
              isOpen={selectedOptions === "leadType"}
              onToggle={() =>
                setSelectedOptions(
                  selectedOptions === "leadType" ? null : "leadType"
                )
              }
              error={errors.leadType}
            />

            <FormSelect
              label="Source"
              value={formData.source}
              onChange={(value) => handleSelectChange("source", value)}
              placeholder="Select source"
              options={Object.values(LeadSource).map((src) => ({
                value: src,
                label: src,
              }))}
              error={errors.source}
              isOpen={selectedOptions === "source"}
              onToggle={() =>
                setSelectedOptions(
                  selectedOptions === "source" ? null : "source"
                )
              }
            />
          </div>
        </FormSection>

        {/* Assignment */}

        <FormSection
          icon={<Users className="w-3.5 h-3.5 text-gray-500" />}
          title="Assignment"
        >
          <div className="grid grid-cols-2 gap-3">
            {
              <FormSelect
                label="Assigned To"
                value={formData.assignedToId}
                onChange={(value) => handleSelectChange("assignedToId", value)}
                placeholder="Select team member"
                options={teamMembers.salesReps.map((member) => ({
                  value: member.id!,
                  label: member.username,
                }))}
                isOpen={selectedOptions === "assignedToId"}
                onToggle={() =>
                  setSelectedOptions(
                    selectedOptions === "assignedToId" ? null : "assignedToId"
                  )
                }
                error={errors.assignedToId}
              />
            }
            <FormSelect
              label="Stage"
              value={formData.stageId ?? ""}
              onChange={(value) => handleSelectChange("stageId", value)}
              placeholder="Select stage"
              options={stagesList.map((stage) => ({
                value: stage.id!,
                label: stage.name!,
              }))}
              isOpen={selectedOptions === "stageId"}
              onToggle={() =>
                setSelectedOptions(
                  selectedOptions === "stageId" ? null : "stageId"
                )
              }
              error={errors.stageId}
            />
          </div>
        </FormSection>

        {/* Address */}
        <FormSection
          icon={<MapPin className="w-3.5 h-3.5 text-gray-500" />}
          title="Address"
        >
          <div className="space-y-3">
            <FormField
              label="Street"
              name="address.street"
              value={formData.address.street || ""}
              onChange={handleInputChange}
              placeholder="123 Main Street"
              error={errors.address?.street}
            />

            <div className="grid grid-cols-3 gap-3">
              <FormField
                label="City"
                name="address.city"
                value={formData.address.city || ""}
                onChange={handleInputChange}
                placeholder="City"
                error={errors.address?.city}
              />
              <FormField
                label="State"
                name="address.state"
                value={formData.address.state || ""}
                onChange={handleInputChange}
                placeholder="State"
                error={errors.address?.state}
              />
              <FormField
                label="ZIP"
                name="address.pincode"
                value={formData.address.pincode || ""}
                onChange={handleInputChange}
                placeholder="12345"
                error={errors.address?.pincode}
              />
            </div>
          </div>
        </FormSection>

        {/* Requirements */}
        <FormSection
          icon={<FileText className="w-3.5 h-3.5 text-gray-500" />}
          title="Notes"
        >
          <FormTextarea
            label="Requirements"
            name="requirements"
            value={formData.requirements!}
            onChange={handleInputChange}
            placeholder="Add any notes about this lead..."
            rows={3}
          />
        </FormSection>
      </div>
    </FormModal>
  );
};
