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
}

export interface LeadTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  reminder: Date;
  status: TaskStatus;
  repeatInterval: TaskRepeatInterval;
  createdAt: Date;
  updatedAt: Date;
  leadId: string;
  createdById: string;
}
