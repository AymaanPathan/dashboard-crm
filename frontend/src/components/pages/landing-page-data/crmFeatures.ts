import {
  Users,
  FileText,
  BarChart3,
  CheckCircle,
  Shield,
  Zap,
} from "lucide-react";

export const crmFeatures = [
  {
    icon: Users,
    title: "Multi-Role User Management",
    description:
      "Customizable roles for Admin, Manager, Sales Rep, Ops, and Finance teams with granular permissions.",
  },
  {
    icon: FileText,
    title: "Lead Management",
    description:
      "Import/export leads via CSV/Excel with global format support and comprehensive lead tracking.",
  },
  {
    icon: BarChart3,
    title: "Customizable Kanban Pipeline",
    description:
      "Drag-and-drop pipeline stages from Lead to Closed with fully customizable workflow stages.",
  },
  {
    icon: CheckCircle,
    title: "Task Management",
    description:
      "Per-lead task management with due dates, priorities, reminders, and recurring task support.",
  },
  {
    icon: Shield,
    title: "Role-Based Access Control",
    description:
      "Team leaders see team pipelines with sophisticated visibility controls and lead assignment.",
  },
  {
    icon: Zap,
    title: "Real-Time Notifications",
    description:
      "In-app and email alerts for tasks, new leads, updates with customizable notification preferences.",
  },
];
