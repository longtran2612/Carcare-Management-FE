import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken:"",
    refreshToken:"",
    user: {},
    isLogin: false,
  },
  reducers: {
    setLogin(state, action) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload;
      state.refreshToken = action.payload.refreshToken;
      state.isLogin = true;
    },
  },
});

const { reducer, actions } = authSlice;

export const { setLogin } = actions;
export default reducer;