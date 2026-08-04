import { createListenerMiddleware } from "@reduxjs/toolkit";

import { authStorage } from "@/shared/api";

import { clearSession, setSession } from "./authSlice";

export const authPersistenceMiddleware = createListenerMiddleware();

authPersistenceMiddleware.startListening({
  actionCreator: setSession,
  effect: (action) => {
    authStorage.setSession(action.payload);
  },
});

authPersistenceMiddleware.startListening({
  actionCreator: clearSession,
  effect: () => {
    authStorage.clearSession();
  },
});
