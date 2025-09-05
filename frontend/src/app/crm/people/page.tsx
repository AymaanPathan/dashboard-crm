"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { RootDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { addUserSlice, getUserSlice } from "@/store/slices/userSlice";
import { IUser } from "@/models/user.model";

const PeopleDashboard: React.FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const users = useSelector((state: RootState) => state.user.users);

  console.log(users, "users");
  const [formData, setFormData] = useState<IUser>({
    username: "joy",
    email: "joy3@gmail.com",
    password: "joy3@gmail.com",
    role: "admin",
    managerId: "12a6e347-ffca-402d-b1b3-31546ba17d06",
    isVerified: false,
  });

  useEffect(() => {
    dispatch(getUserSlice());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(addUserSlice(formData));
    setIsModalOpen(false);
    // Reset form
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

  const handleCancel = () => {
    setIsModalOpen(false);
    // Reset form
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

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Search and Filters */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search people..."
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-gray-50 hover:text-accent-foreground h-10 px-4 py-2">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </button>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add People
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-600">
              Total People
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">24</div>
          <p className="text-xs text-gray-500">+2 from last month</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-600">
              Active
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">22</div>
          <p className="text-xs text-gray-500">91.7% of total</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-600">
              Departments
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">6</div>
          <p className="text-xs text-gray-500">Engineering, Sales, Marketing</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-600">
              New This Month
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900">3</div>
          <p className="text-xs text-gray-500">+12.5% from last month</p>
        </div>
      </div>

      {/* People Table */}
      <div className="rounded-md border border-gray-200 bg-white">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b border-gray-200 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50">
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                  Employee
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                  Contact
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                  Role
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                  Department
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                  Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {users?.map((employee: IUser) => (
                <tr
                  key={employee?.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50"
                >
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {employee?.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="mr-1 h-3 w-3 text-gray-400" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="mr-1 h-3 w-3 text-gray-400" />
                        {employee.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="font-medium text-gray-900">
                      {employee.role}
                    </div>
                  </td>

                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        employee.isVerified
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 hover:text-gray-900 h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                      <span className="sr-only">Open menu</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Add New User
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="">Select a role</option>
                  <option value="admin">admin</option>
                  <option value="sales_manager">sales_manager</option>
                  <option value="sales_rep">sales_rep</option>
                  <option value="finance">finance</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="managerId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Manager ID
                </label>
                <input
                  type="text"
                  id="managerId"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Enter manager ID (optional)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label
                  htmlFor="isVerified"
                  className="ml-2 text-sm text-gray-700"
                >
                  Mark as verified
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleDashboard;
