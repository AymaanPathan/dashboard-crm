"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  User,
  Briefcase,
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserSlice,
  getUserManagerSlice,
  getUserSlice,
} from "@/store/slices/userSlice";
import { IUser } from "@/models/user.model";
import {
  FormCheckbox,
  FormField,
  FormModal,
  FormSection,
  FormSelect,
} from "@/components/reuseable/Form/Form";

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
                    className="border-b border-gray-100 bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 shadow-2xl w-8 rounded-full bg-white  flex items-center justify-center text-black text-sm font-medium">
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
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {employee.role}
                      </div>
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

      <div>
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
                onToggle={() =>
                  setIsManagerDropdownOpen(!isManagerDropdownOpen)
                }
              />
              <div className="flex items-center gap-2.5 pt-1">
                <FormCheckbox
                  label="isVerified"
                  name="isVerified"
                  checked={formData.isVerified!}
                  onChange={handleInputChange}
                />
                <label htmlFor="isVerified" className="text-sm text-gray-700">
                  Mark as verified
                </label>
              </div>
            </FormSection>
          </div>
        </FormModal>
      </div>
    </div>
  );
};

export default PeopleDashboard;
