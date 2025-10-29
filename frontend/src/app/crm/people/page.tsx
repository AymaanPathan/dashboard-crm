"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  User,
  Briefcase,
  TrendingUp,
  TrendingDown,
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
import { ReusableListPage } from "@/components/reuseable/Lists/ReusableList";

const PeopleDashboard: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const users = useSelector((state: RootState) => state.user.users);
  const myManagers = useSelector((state: RootState) => state.user.myManagers);
  const analytics = useSelector((state: RootState) => state.user.analytics);

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
      <div className="mx-auto px-8 py-6 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-gray-400" />
                <input
                  placeholder="Search people..."
                  className="h-[38px] w-[300px] rounded-lg bg-white/60 backdrop-blur-xl border border-gray-200/60 px-3.5 pl-10 text-[13px] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-gray-300/80 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.02)] transition-all duration-150"
                />
              </div>
              <button className="h-[38px] px-4 rounded-lg text-[13px] font-medium text-gray-900 bg-white/60 backdrop-blur-xl hover:bg-white border border-gray-200/60 hover:border-gray-300/80 transition-all duration-150 inline-flex items-center gap-2">
                <Filter className="h-[14px] w-[14px]" />
                Filter
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="h-8 px-4 rounded-md text-xs font-medium text-white bg-black border border-black hover:bg-gray-900 transition-all duration-150 inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add People
            </button>
          </div>
        </div>

        <div className="grid gap-5 grid-cols-3 mb-10">
          <div className="rounded-xl bg-white/80 backdrop-blur-2xl border border-gray-200/40 p-7 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="text-[12px] font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Total people
            </div>
            <div className="text-[36px] font-bold text-black mb-2 tracking-tight">
              {analytics.totalPeople}
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-[13px] w-[13px] text-gray-400" />
              <p className="text-[13px] text-gray-500 font-normal">
                {analytics.addedLastMonth} from last month
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 backdrop-blur-2xl border border-gray-200/40 p-7 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="text-[12px] font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              Active members
            </div>
            <div className="text-[36px] font-bold text-black mb-2 tracking-tight">
              {analytics.totalPeople}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-black animate-pulse"></div>
              <p className="text-[13px] text-gray-500 font-normal">
                All members active
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/80 backdrop-blur-2xl border border-gray-200/40 p-7 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="text-[12px] font-semibold text-gray-500 mb-3 uppercase tracking-wider">
              This month
            </div>
            <div className="text-[36px] font-bold text-black mb-2 tracking-tight">
              {analytics.addedThisMonth}
            </div>
            <div className="flex items-center gap-1.5">
              {analytics.trend === "increased" ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md  text-black">
                  <TrendingUp className="h-[11px] w-[11px]" />
                  <span className="text-[12px] font-semibold">
                    +{analytics.percentageChange}%
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                  <TrendingDown className="h-[11px] w-[11px]" />
                  <span className="text-[12px] font-semibold">
                    -{analytics.percentageChange}%
                  </span>
                </div>
              )}
              <p className="text-[13px] text-gray-500 font-normal">
                from last month
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/80 backdrop-blur-2xl border border-gray-200/40 overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100/50 bg-white/40 backdrop-blur-xl">
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((employee, idx) => (
                <tr
                  key={employee.id}
                  className={`border-b border-gray-100/50 hover:bg-white/60 transition-all duration-150 ${
                    idx === users.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 flex items-center justify-center text-gray-900 text-[13px] font-semibold shadow-sm">
                        {employee.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-[13px] font-semibold text-gray-900">
                        {employee.username}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-[13px] text-gray-700 font-normal">
                      <Mail className="mr-2 h-[13px] w-[13px] text-gray-400" />
                      {employee.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium  text-gray-700  ">
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium  text-black shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="h-8 w-8 rounded-lg hover:bg-gray-100/60 inline-flex items-center justify-center transition-all duration-150">
                      <MoreVertical className="h-[15px] w-[15px] text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
