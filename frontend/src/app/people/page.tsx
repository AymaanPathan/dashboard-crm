import React from "react";
import { Plus, Search, Filter, MoreVertical, Mail, Phone } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  avatar: string;
  status: "active" | "inactive";
}

const PeopleDashboard: React.FC = () => {
  // Mock data - replace with your actual data
  const employees: Employee[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      role: "Sales Manager",
      department: "Sales",
      avatar: "SJ",
      status: "active",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@company.com",
      phone: "+1 (555) 234-5678",
      role: "Software Engineer",
      department: "Engineering",
      avatar: "MC",
      status: "active",
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      phone: "+1 (555) 345-6789",
      role: "Product Designer",
      department: "Design",
      avatar: "ER",
      status: "inactive",
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.kim@company.com",
      phone: "+1 (555) 456-7890",
      role: "Marketing Specialist",
      department: "Marketing",
      avatar: "DK",
      status: "active",
    },
  ];

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
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2">
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
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50"
                >
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <span className="text-sm font-medium text-gray-700">
                          {employee.avatar}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email}
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
                        {employee.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <div className="font-medium text-gray-900">
                      {employee.role}
                    </div>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                      {employee.department}
                    </span>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        employee.status === "active"
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.status}
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
    </div>
  );
};

export default PeopleDashboard;
