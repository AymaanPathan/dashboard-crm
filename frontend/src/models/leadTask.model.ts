import { ILead } from "./lead.model";

export enum TaskStatus {
  pending = "pending",
  completed = "completed",
  cancelled = "cancelled",
}

export enum TaskRepeatInterval {
  none = "none",
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly",
}

export interface LeadTask {
  createdBy: any;
  reminderOption?: string;
  id?: string;
  title: string;
  description: string;
  dueDate: Date;
  reminder: Date | null;
  status: TaskStatus;
  repeatInterval: TaskRepeatInterval;
  createdAt: Date;
  updatedAt: Date;
  leadId: string;
  createdById: string;
  timezone?: string;
  reminderStatus?: string;
  lead: ILead;
}
