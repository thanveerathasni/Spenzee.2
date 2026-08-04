import { configureStore } from "@reduxjs/toolkit";

import { configureInterceptors, apiClient } from "@/shared/api";

import { authReducer } from "./authSlice";
import { authPersistenceMiddleware } from "./authPersistenceMiddleware";
import { notificationReducer } from "./notificationSlice";
import { themeReducer } from "./themeSlice";
import { userReducer } from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    theme: themeReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(authPersistenceMiddleware.middleware),
});

configureInterceptors(apiClient);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
