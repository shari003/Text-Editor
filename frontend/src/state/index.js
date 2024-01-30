import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  currentUrl: null,
  collaboratorMode: true,
  doc: {
    docId: '',
    title: ''
  }
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
      state.currentUrl = null;
      state.doc.docId = null;
      state.doc.title = null;
    },
    setCurrentURL: (state, action) => {
      state.currentUrl = action.payload.path;
    },
    setCollaboratorMode: (state, action) => {
      state.collaboratorMode = action.payload.collaboratorMode;
    },
    setDocDetails: (state, action) => {
      state.doc.docId = action.payload.docId;
      state.doc.title = action.payload.docTitle;
    }
  },
});

export const { setLogin, setLogout, setCurrentURL, setCollaboratorMode, setDocDetails } =
  authSlice.actions;
export default authSlice.reducer;
