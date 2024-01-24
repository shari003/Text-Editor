import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  currentUrl: null,
  collaboratorMode: true
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setCurrentURL: (state, action) => {
      state.currentUrl = action.payload.path;
    },
    setCollaboratorMode: (state, action) => {
      state.collaboratorMode = action.payload.collaboratorMode;
    }
  },
});

export const { setLogin, setLogout, setCurrentURL, setCollaboratorMode } =
  authSlice.actions;
export default authSlice.reducer;
