import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import orgReducer from "./slices/orgSlice";
import leadReducer from "./slices/leadSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    org: orgReducer,
    leads: leadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
