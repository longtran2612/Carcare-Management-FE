import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

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
      Cookies.set("accessToken", action.payload.accessToken);
      Cookies.set("refreshToken", action.payload.refreshToken);
    },
    setLogout(state,action) {
      state.accessToken = "";
      state.user = "";
      state.refreshToken = "";
      state.isLogin = false;
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
  },
  
});

const { reducer, actions } = authSlice;

export const { setLogin ,setLogout } = actions;
export default reducer;