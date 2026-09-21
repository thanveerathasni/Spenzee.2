import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationState {
  items: Notification[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: {
      prepare: (message: string, type: NotificationType): { payload: Notification } => ({
        payload: { id: nanoid(), message, type },
      }),
      reducer: (state, action: PayloadAction<Notification>) => {
        state.items.push(action.payload);
      },
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((notification) => notification.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
