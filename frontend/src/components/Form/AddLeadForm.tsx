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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { ILead } from "@/models/lead.model";
import { addLead } from "@/store/slices/kanbanSlice";
import { LeadSource } from "@/enums/leadSource..enum";
import { LeadCategory } from "@/enums/leadCategory.enum";
import { IStage } from "@/models/stage.model";

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
    stageId: "14a79994-42f3-4cf6-962a-aa1d1eccf60d",
    assignedToId: "b501fe3c-fa84-4bd0-b6a6-ace37a0c0b1d",
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
  const addingLeadState = useSelector(
    (state: RootState) => state.kanban.loading.addingLead
  );


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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white border">
        <DialogTitle className="sr-only">Create New Lead</DialogTitle>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-black" />
              <h3 className="font-semibold text-black">Basic Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">
                  Company Name *
                </Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Acme Corporation"
                  className={`border-gray-300 focus:border-black focus:ring-1 focus:ring-black ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">
                  Contact Person
                </Label>
                <Input
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@acme.com"
                    className={`pl-10 border-gray-300 focus:border-black focus:ring-1 focus:ring-black ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">
                  Phone Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="+1 555 123 4567"
                    className={`pl-10 border-gray-300 focus:border-black focus:ring-1 focus:ring-black ${
                      errors.mobileNumber ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-xs">{errors.mobileNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-black" />
              <h3 className="font-semibold text-black">Classification</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">
                  Lead Type *
                </Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("leadType", value)
                  }
                >
                  <SelectTrigger
                    className={`border-gray-300 focus:border-black focus:ring-1 focus:ring-black ${
                      errors.leadType ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select lead type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.values(LeadCategory).map((category) => (
                      <SelectItem
                        key={category}
                        value={category.toLowerCase().replace(/\s+/g, "-")}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-xs">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black">
                  Source *
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("source", value)}
                >
                  <SelectTrigger
                    className={`border-gray-300 focus:border-black focus:ring-1 focus:ring-black ${
                      errors.source ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {Object.values(LeadSource).map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-xs">{errors.category}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-black" />
              <h3 className="font-semibold text-black">Address</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Optional
              </span>
            </div>

            <div className="space-y-3">
              <Input
                name="address.street"
                value={formData.address.street || ""}
                onChange={handleInputChange}
                placeholder="Street address"
                className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  name="address.city"
                  value={formData.address.city || ""}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                />
                <Input
                  name="address.state"
                  value={formData.address.state || ""}
                  onChange={handleInputChange}
                  placeholder="State"
                  className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                />
                <Input
                  name="address.postalCode"
                  value={formData.address.postalCode || ""}
                  onChange={handleInputChange}
                  placeholder="ZIP"
                  className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <Input
                name="address.country"
                value={formData.address.country || ""}
                onChange={handleInputChange}
                placeholder="Country"
                className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Assignment */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-black" />
              <h3 className="font-semibold text-black">Assignment</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select
                  onValueChange={(value) =>
                    handleSelectChange("assignedToId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Assignee" />
                  </SelectTrigger>

                  <SelectContent className="bg-white">
                    {teamMembers.salesReps?.map((member, index) => (
                      <SelectItem key={index} value={member.id!}>
                        {member.username}
                      </SelectItem>
                    ))}{" "}
                  </SelectContent>
                </Select>
              </div>

              <Select
                onValueChange={(value) => handleSelectChange("stageId", value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-black focus:ring-1 focus:ring-black">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {stagesList.map((stage: IStage, index: number) => (
                    <SelectItem key={index} value={stage.id!}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-black" />
              <h3 className="font-semibold text-black">Requirements</h3>
            </div>

            <Textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="Describe lead requirements, pain points, or notes..."
              className="min-h-[80px] border-gray-300 focus:border-black focus:ring-1 focus:ring-black resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-6 ">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 hover:border-black"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-black text-white hover:bg-gray-900"
            >
              {addingLeadState ? "Creating Lead..." : "Create Lead"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
