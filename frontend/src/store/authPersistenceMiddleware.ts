import { createListenerMiddleware } from "@reduxjs/toolkit";

import { clearSession, setSession } from "./authSlice";

import { authStorage } from "@/shared/api";


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
