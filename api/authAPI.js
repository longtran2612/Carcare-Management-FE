import axios from "axios";
import { ECOMOS_URL, PARTNER_ID, STORE_CHANNEL } from "./url";
import axiosClient from "./index";
import { host } from "../utils";

const onRegister = (data) => {
  return axios({
    method: "POST",
    url: ECOMOS_URL + `/customers/${PARTNER_ID}/${STORE_CHANNEL}/register`,
    data: {
      fullName: data.ho + data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      platform: "WEB",
      url_active_account: `${host}/xac-thuc-tai-khoan`,
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const activeAccount = (code, email) => {
  return axios({
    method: "POST",
    url: ECOMOS_URL + `/customers/${PARTNER_ID}/${STORE_CHANNEL}/active-account`,
    params: email,
    data: code,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const reSendCode = (email, data) => {
  return axios({
    method: "POST",
    url: ECOMOS_URL + `/customers/${PARTNER_ID}/${STORE_CHANNEL}/send-code`,
    params: email,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const login = (data) => {
  return axios({
    method: "POST",
    url: ECOMOS_URL + `/auth/${PARTNER_ID}/login`,
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
  return (await axiosClient())({
    method: "POST",
    url: ECOMOS_URL + `/auth/${PARTNER_ID}/logout`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const loadUser = async () => {
  return (await axiosClient())({
    method: "GET",
    url: ECOMOS_URL + `/customers/${PARTNER_ID}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateProfile = async (data) => {
  return (await axiosClient())({
    method: "PUT",
    url: ECOMOS_URL + `/customers/${PARTNER_ID}`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

const changeAvatar = (data) => {
  return axiosClient()({
    method: "POST",
    url: ECOMOS_URL + `/customers/${PARTNER_ID}/change-avatar`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const changePassword = async (data) => {
  return (await axiosClient())({
    method: "PUT",
    url: ECOMOS_URL + `/customers/${PARTNER_ID}/change-password`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const forgotPassword = (data) => {
  return axios({
    method: "POST",
    url:
      ECOMOS_URL + `/customers/${PARTNER_ID}/${STORE_CHANNEL}/forgot-password`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const resetPassword = (data, params) => {
  return axios({
    method: "POST",
    url: ECOMOS_URL + `/customers/${PARTNER_ID}/reset-password`,
    data: data,
    params: params,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const loginFacebook = (data) => {
  return axios({
    method: "POST",
    url: ECOMOS_URL + `/auth/${PARTNER_ID}/${STORE_CHANNEL}/login-facebook`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const loginGoogle = (data) => {
  return axios({
    method: "POST",
    url: ECOMOS_URL + `/auth/${PARTNER_ID}/${STORE_CHANNEL}/login-google`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export {
  onRegister,
  activeAccount,
  reSendCode,
  login,
  logout,
  loadUser,
  updateProfile,
  changeAvatar,
  changePassword,
  forgotPassword,
  resetPassword,
  loginFacebook,
  loginGoogle,
};
