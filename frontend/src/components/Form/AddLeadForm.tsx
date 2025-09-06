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
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Lead
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 pt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Basic Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Company Name *
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  className={`border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.name ? "border-red-300 bg-red-50" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Contact Person
                </Label>
                <Input
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.email ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-xs">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
                      errors.mobileNumber ? "border-red-300 bg-red-50" : ""
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-600 text-xs">{errors.mobileNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Classification</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Lead Type
                </Label>
                <Select
                  value={formData.leadType}
                  onValueChange={(value) =>
                    handleSelectChange("leadType", value)
                  }
                >
                  <SelectTrigger className="border-gray-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select lead type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.values(LeadCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Source *
                </Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => handleSelectChange("source", value)}
                >
                  <SelectTrigger
                    className={`border-gray-200 focus:ring-blue-500 ${
                      errors.source ? "border-red-300 bg-red-50" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.values(LeadSource).map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.source && (
                  <p className="text-red-600 text-xs">{errors.source}</p>
                )}
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Assignment</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Assign to
                </Label>
                <Select
                  value={formData.assignedToId}
                  onValueChange={(value) =>
                    handleSelectChange("assignedToId", value)
                  }
                >
                  <SelectTrigger className="border-gray-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {teamMembers.salesReps.map((member) => (
                      <SelectItem key={member.id} value={member.id!}>
                        {member.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Stage
                </Label>
                <Select
                  value={formData.stageId}
                  onValueChange={(value) =>
                    handleSelectChange("stageId", value)
                  }
                >
                  <SelectTrigger className="border-gray-200 focus:ring-blue-500">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {stagesList.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id!}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">Address</h3>
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                Optional
              </span>
            </div>

            <div className="space-y-3">
              <Input
                name="address.street"
                value={formData.address.street || ""}
                onChange={handleInputChange}
                placeholder="Street address"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  name="address.city"
                  value={formData.address.city || ""}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  name="address.state"
                  value={formData.address.state || ""}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Input
                  name="address.postalCode"
                  value={formData.address.postalCode || ""}
                  onChange={handleInputChange}
                  placeholder="ZIP"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Input
                name="address.country"
                value={formData.address.country || ""}
                onChange={handleInputChange}
                placeholder="Country"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-900">Requirements</h3>
            </div>

            <Textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="Describe lead requirements, pain points, or notes..."
              rows={3}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            Create Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
