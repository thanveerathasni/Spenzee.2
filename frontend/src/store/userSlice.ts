import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthenticatedUser } from "@/shared/types";

interface UserState {
  profile: AuthenticatedUser | null;
}

const initialState: UserState = { profile: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<AuthenticatedUser>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { clearProfile, setProfile } = userSlice.actions;
export const userReducer = userSlice.reducer;
