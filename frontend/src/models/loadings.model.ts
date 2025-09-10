export interface IKanbanLoadingState {
  fetchingKanban: boolean;
  addingLead: boolean;
  updatingLeadStatus: boolean;
  updatingAssignee: boolean;
}


export interface ILeadTaskLoadingState {
  addingTask: boolean;
  updatingTask: boolean;
  deletingTask: boolean;
}