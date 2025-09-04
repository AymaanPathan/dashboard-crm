import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import orgReducer from "./slices/orgSlice";
import kanbanReducer from "./slices/kanbanSlice";
import userReducer from "./slices/userSlice";
import stageReducer from "./slices/stagesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    user: userReducer,
    kanban: kanbanReducer,
    stages: stageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
