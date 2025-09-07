import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import orgReducer from "./slices/orgSlice";
import kanbanReducer from "./slices/kanbanSlice";
import userReducer from "./slices/userSlice";
import stageReducer from "./slices/stagesSlice";
import leadTasksReducer from "./slices/leadTaskSlice";
import leadReducer from "./slices/leadSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    leadTasks: leadTasksReducer,
    lead: leadReducer,
    user: userReducer,
    kanban: kanbanReducer,
    stages: stageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
