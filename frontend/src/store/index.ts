import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import orgReducer from "./slices/orgSlice";
import leadReducer from "./slices/leadSlice";
import kanbanReducer from './slices/kanbanSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    leads: leadReducer,
    kanban: kanbanReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
