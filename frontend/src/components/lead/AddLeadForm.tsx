"use client";
import React, { useState } from "react";
import { Building2, MapPin, Tag, FileText, Users } from "lucide-react";

import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { ILead } from "@/models/lead.model";
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
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Lead"
      onSubmit={handleSubmit}
      submitLabel="Create Lead"
    >
      <div className="space-y-8">
        <FormSection
          icon={<Building2 className="w-4 h-4 text-gray-400" />}
          title="Company Information"
        >
          <div className="space-y-4">
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
            />

            <div className="grid grid-cols-2 gap-8">
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
          icon={<Tag className="w-4 h-4 text-gray-400" />}
          title="Classification"
        >
          <div className="grid grid-cols-2 gap-8">
            <FormSelect
              label="Lead Type"
              value={formData.leadType}
              onChange={(value) => handleSelectChange("leadType", value)}
              placeholder="Select type"
              options={Object.values(LeadCategory).map((cat) => ({
                value: cat,
                label: cat,
              }))}
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
            />
          </div>
        </FormSection>

        {/* Assignment */}
        <FormSection
          icon={<Users className="w-4 h-4 text-gray-400" />}
          title="Assignment"
        >
          <div className="grid grid-cols-2 gap-8">
            <FormSelect
              label="Assigned To"
              value={formData.assignedToId}
              onChange={(value) => handleSelectChange("assignedToId", value)}
              placeholder="Select team member"
              options={teamMembers.salesReps.map((member) => ({
                value: member.id!,
                label: member.username,
              }))}
            />

            <FormSelect
              label="Stage"
              value={formData.stageId ?? ""}
              onChange={(value) => handleSelectChange("stageId", value)}
              placeholder="Select stage"
              options={stagesList.map((stage) => ({
                value: stage.id!,
                label: stage.name!,
              }))}
            />
          </div>
        </FormSection>

        {/* Address */}
        <FormSection
          icon={<MapPin className="w-4 h-4 text-gray-400" />}
          title="Address"
        >
          <div className="space-y-4">
            <FormField
              label="Street"
              name="address.street"
              value={formData.address.street || ""}
              onChange={handleInputChange}
              placeholder="123 Main Street"
            />

            <div className="grid grid-cols-3 gap-6">
              <FormField
                label="City"
                name="address.city"
                value={formData.address.city || ""}
                onChange={handleInputChange}
                placeholder="City"
              />
              <FormField
                label="State"
                name="address.state"
                value={formData.address.state || ""}
                onChange={handleInputChange}
                placeholder="State"
              />
              <FormField
                label="ZIP"
                name="address.postalCode"
                value={formData.address.postalCode || ""}
                onChange={handleInputChange}
                placeholder="12345"
              />
            </div>

            <FormField
              label="Country"
              name="address.country"
              value={formData.address.country || ""}
              onChange={handleInputChange}
              placeholder="United States"
            />
          </div>
        </FormSection>

        {/* Requirements */}
        <FormSection
          icon={<FileText className="w-4 h-4 text-gray-400" />}
          title="Notes"
        >
          <FormTextarea
            label="Requirements"
            name="requirements"
            value={formData.requirements!}
            onChange={handleInputChange}
            placeholder="Add any notes about this lead..."
            rows={4}
          />
        </FormSection>
      </div>
    </FormModal>
  );
};
