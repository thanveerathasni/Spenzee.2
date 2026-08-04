import { configureStore } from "@reduxjs/toolkit";


import { authPersistenceMiddleware } from "./authPersistenceMiddleware";
import { authReducer } from "./authSlice";
import { notificationReducer } from "./notificationSlice";
import { themeReducer } from "./themeSlice";
import { userReducer } from "./userSlice";

import { configureInterceptors, apiClient } from "@/shared/api";

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
