"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  User,
  Briefcase,
  X,
  ChevronDown,
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserSlice,
  getUserManagerSlice,
  getUserSlice,
} from "@/store/slices/userSlice";
import { IUser } from "@/models/user.model";

// Inline Form Components
const FormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  submitLabel?: string;
}> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Submit",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-white shadow-2xl rounded-xl"
      >
        <div className="px-8 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="flex items-center gap-2 group">
              <span className="text-xs text-gray-400 border border-gray-300 rounded px-1.5 py-0.5 font-mono group-hover:border-gray-400 transition-colors">
                ESC
              </span>
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(85vh-140px)] pr-1">
            {children}
          </div>
        </div>
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-8 py-3 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-1.5 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-md transition-all"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
};

const FormField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}> = ({ label, name, value, onChange, placeholder, type = "text" }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-0 py-2 text-sm bg-transparent border-0 border-b border-gray-200 transition-colors focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
      />
    </div>
  );
};

const FormSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
}> = ({
  label,
  value,
  onChange,
  placeholder = "Select option",
  options,
  isOpen,
  onToggle,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <label className="block text-sm text-gray-700">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className="w-full h-9 px-3 text-sm text-left bg-white border border-gray-200 rounded-md transition-colors focus:outline-none focus:border-gray-900 flex items-center justify-between hover:border-gray-300"
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value
              ? options.find((opt) => opt.value === value)?.label
              : placeholder}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  onToggle();
                }}
                className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                  value === option.value ? "bg-gray-50 font-medium" : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
const PeopleDashboard: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const users = useSelector((state: RootState) => state.user.users);
  const myManagers = useSelector((state: RootState) => state.user.myManagers);

  const [formData, setFormData] = useState<IUser>({
    username: "",
    email: "",
    password: "",
    role: "",
    managerId: "",
    isVerified: false,
  });

  useEffect(() => {
    dispatch(getUserSlice());
  }, [dispatch]);

  useEffect(() => {
    if (formData.role) {
      dispatch(getUserManagerSlice(formData.role));
    }
  }, [dispatch, formData.role]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    await dispatch(addUserSlice(formData));
    setIsModalOpen(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "",
      managerId: "",
      currentOrganizationId: "",
      isVerified: false,
    });
    await dispatch(getUserSlice());
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "",
      managerId: "",
      currentOrganizationId: "",
      isVerified: false,
    });
  };

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "sales_manager", label: "Sales Manager" },
    { value: "sales_rep", label: "Sales Representative" },
    { value: "finance", label: "Finance" },
  ];

  const managerOptions =
    myManagers?.myManagers?.map((manager: IUser) => ({
      value: manager.id || "",
      label: manager.username,
    })) || [];

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="mx-auto px-12 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  placeholder="Search people..."
                  className="h-9 w-80 rounded-md bg-gray-50 border-0 px-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all"
                />
              </div>
              <button className="h-9 px-3 rounded-md text-sm font-normal text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-9 px-4 rounded-md text-sm font-normal text-white bg-gray-900 hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add People
            </button>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-4 mb-6">
          <div className="rounded-lg bg-gray-50 p-5 hover:bg-gray-100 transition-colors">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Total People
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">24</div>
            <p className="text-xs text-gray-400">+2 from last month</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-5 hover:bg-gray-100 transition-colors">
            <div className="text-xs font-medium text-gray-500 mb-2">Active</div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">22</div>
            <p className="text-xs text-gray-400">91.7% of total</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-5 hover:bg-gray-100 transition-colors">
            <div className="text-xs font-medium text-gray-500 mb-2">
              Departments
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">6</div>
            <p className="text-xs text-gray-400">
              Engineering, Sales, Marketing
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-5 hover:bg-gray-100 transition-colors">
            <div className="text-xs font-medium text-gray-500 mb-2">
              New This Month
            </div>
            <div className="text-2xl font-semibold text-gray-900 mb-1">3</div>
            <p className="text-xs text-gray-400">+12.5% from last month</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="h-11 px-4 text-left text-xs font-medium text-gray-500">
                    Employee
                  </th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-gray-500">
                    Contact
                  </th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-gray-500">
                    Role
                  </th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-gray-500">
                    Department
                  </th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-gray-500">
                    Status
                  </th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-gray-500">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((employee: IUser, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-medium">
                          {employee?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee?.username}
                          </div>
                          <div className="text-xs text-gray-400">
                            {employee?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Mail className="mr-1.5 h-3 w-3 text-gray-400" />
                          {employee.email}
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <Phone className="mr-1.5 h-3 w-3 text-gray-400" />
                          {employee.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {employee.role}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-normal ${
                          employee.isVerified
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {employee.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="h-7 w-7 rounded-md hover:bg-gray-100 inline-flex items-center justify-center transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                        <span className="sr-only">Open menu</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Add New User"
        onSubmit={handleSubmit}
        submitLabel="Add User"
      >
        <div className="space-y-6">
          <FormSection
            icon={<User className="w-4 h-4 text-gray-400" />}
            title="User Information"
          >
            <FormField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
            />
            <FormField
              label="Email"
              name="email"
              value={formData.email!}
              onChange={handleInputChange}
              placeholder="user@example.com"
              type="email"
            />
            <FormField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              type="password"
            />
          </FormSection>

          <FormSection
            icon={<Briefcase className="w-4 h-4 text-gray-400" />}
            title="Role & Access"
          >
            <FormSelect
              label="Role"
              value={formData.role}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
              placeholder="Select a role"
              options={roleOptions}
              isOpen={isRoleDropdownOpen}
              onToggle={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            />
            <FormSelect
              label="Manager"
              value={formData.managerId || ""}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, managerId: value }))
              }
              placeholder="Select a manager"
              options={managerOptions}
              isOpen={isManagerDropdownOpen}
              onToggle={() => setIsManagerDropdownOpen(!isManagerDropdownOpen)}
            />
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="isVerified"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleInputChange}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
              />
              <label htmlFor="isVerified" className="text-sm text-gray-700">
                Mark as verified
              </label>
            </div>
          </FormSection>
        </div>
      </FormModal>
    </div>
  );
};

export default PeopleDashboard;
