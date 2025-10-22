import { LeadTask } from "./leadTask.model";
import { IKanbanLoadingState } from "./loadings.model";

export interface IAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ILead {
  name: string;
  email: string;
  mobileNumber: string;
  source: string;
  address: IAddress;
  leadType: string;
  contactPersonName: string;
  requirements?: string;
  assignedToId: string;
  stageId?: string;
  createdBy?: string;
  organizationId?: string;
  id?: string;
  position?: number;
  stage?: string;
}

export interface ILeadNotes {
  id: string;
  leadId: string;
  lead: ILead;
  userId: string;
  userName: string;
  note: string;
  timestamp?: Date;
  createdById: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface ILeadLogs {
  id?: string;
  leadId: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: Date;
  type:
    | "status_change"
    | "task"
    | "communication"
    | "note"
    | "meeting"
    | "other";
  metadata?: {
    from?: string;
    to?: string;
    taskTitle?: string;
    duration?: string;
  };
}

export interface Status {
  stageId: string;
  stageName: string;
  leads?: string[];
}

export interface KanbanState {
  leads: ILead[];
  statuses: Status[];
  kanbanData: [];
  loading: IKanbanLoadingState;
  error: string | null;
}

export interface LeadFilters {
  search?: string;
  stageId?: string;
  assignedToId?: string;
  category?: string;
  leadType?: "hot" | "cold" | "warm" | "All" | null;
}

interface LeadDistributionByType {
  type?: string;
  count?: number;
  percentage?: number;
}
interface LeadDistributionBySource {
  source?: string;
  count?: number;
  percentage?: number;
}
interface LeadDistributionByStage {
  stage?: string;
  count?: number;
  percentage?: number;
}

export interface LeadStats {
  totalLeads?: number;
  currentMonthLeads?: number;
  lastMonthLeads?: number;
  percentGrowth?: number;
  percentWon?: number;
  wonLeads?: number;
  wonPercentGrowth?: number;
  totalWonLeads?: number;
  currentMonthWonLeads?: number;
  lastMonthWonLeads?: number;
  leadDistribution: LeadDistributionByType[];
  sourceDistribution: LeadDistributionBySource[];
  stageDistribution: LeadDistributionByStage[];
}

export interface TaskStats {
  totalTasks?: number;
  totalPendingTasks?: number;
  todaysPendingTasks?: number;
  totalCompletedTasks?: number;
  todaysCompletedTasks?: number;
  overdueTasks?: number;
  todaysSchedule?: LeadTask[];
}
