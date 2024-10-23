import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { UsersDataType } from "@/shared/types";

import { getUsers, updateUser } from "@/shared/api/users.api";
import { stat } from "fs";

interface UsersState {
  data: UsersDataType[];
  details: UsersDataType | null;
  loading: boolean;
  userSuccessMesage: string;
  userErrorMessage: string;
}

const initialState: UsersState = {
  data: [],
  details: null,
  loading: false,
  userSuccessMesage: "",
  userErrorMessage: "",
};

// Thunk for users
export const getUsersThunk = createAsyncThunk("users/getUsers", async () => {
  try {
    // get all users
    const res = await getUsers();
    console.log("Users:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("Users error:", error);
    return error.response.data ?? error.response.message;
  }
});

export const updateUserThunk = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }: { id: string; data: any }) => {
    try {
      // Update user
      const res = await updateUser(id, data);
      console.log("Update user:", res.data);
      return res.data;
    } catch (error: any) {
      console.log("Update user error:", error);
      return error.response.data ?? error.response.message;
    }
  },
);

const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserStateMessages: (state) => {
        state.userSuccessMesage = "";
        state.userErrorMessage = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getUsersThunk.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.details = action.payload;
        state.loading = false;
      })
      .addCase(updateUserThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {resetUserStateMessages} = UsersSlice.actions;

export default UsersSlice.reducer;
