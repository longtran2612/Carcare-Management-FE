import axios from "axios";
import {API_URL ,FACEBOOK_ID, GOOGLE_ID } from "./url";
import axiosClient from "./index";
import Cookies from "js-cookie";

const login = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/auth/login`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const logout = async () => {
 let refreshToken = Cookies.get("refreshToken");
  return axios({
    method: "POST",
    url: API_URL + `/auth/logout`,
    data:{
      refreshToken: refreshToken
    }
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const onRegister = (data) => {
  console.log("data:", data);
  return axios({
    method: "POST",
    url: API_URL + `/auth/register`,
    data: {
      fullName: data.fullname,
      username: data.phone,
      password: data.password
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const loadUser = async () => {
  let username = Cookies.get("username");
  console.log("username:", username);
  return (await axiosClient())({
    method: "GET",
    url: API_URL + `/users/phone=${username}`,
  })
    .then((res) => {
      return res;
      console.log("res:", res);
    })
    .catch((err) => {
      throw err;
    });
};



export {
  onRegister,
  login,
  logout,
  loadUser
};
