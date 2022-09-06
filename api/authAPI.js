import axios from "axios";
import {API_URL ,FACEBOOK_ID, GOOGLE_ID } from "./url";
import axiosClient from "./index";

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
  return (await axiosClient())({
    method: "POST",
    url: API_URL + `/auth/signout`,
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
      email: data.email,
      username: data.email,
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


// const reSendCode = (email, data) => {
//   return axios({
//     method: "POST",
//     url: ECOMOS_URL + `/customers/${PARTNER_ID}/${STORE_CHANNEL}/send-code`,
//     params: email,
//     data: data,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };





// const loadUser = async () => {
//   return (await axiosClient())({
//     method: "GET",
//     url: ECOMOS_URL + `/customers/${PARTNER_ID}`,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

// const updateProfile = async (data) => {
//   return (await axiosClient())({
//     method: "PUT",
//     url: ECOMOS_URL + `/customers/${PARTNER_ID}`,
//     data: data,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const changeAvatar = (data) => {
//   return axiosClient()({
//     method: "POST",
//     url: ECOMOS_URL + `/customers/${PARTNER_ID}/change-avatar`,
//     data: data,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

// const changePassword = async (data) => {
//   return (await axiosClient())({
//     method: "PUT",
//     url: ECOMOS_URL + `/customers/${PARTNER_ID}/change-password`,
//     data: data,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

// const forgotPassword = (data) => {
//   return axios({
//     method: "POST",
//     url:
//       ECOMOS_URL + `/customers/${PARTNER_ID}/${STORE_CHANNEL}/forgot-password`,
//     data: data,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };
// const resetPassword = (data, params) => {
//   return axios({
//     method: "POST",
//     url: ECOMOS_URL + `/customers/${PARTNER_ID}/reset-password`,
//     data: data,
//     params: params,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

// const loginFacebook = (data) => {
//   return axios({
//     method: "POST",
//     url: ECOMOS_URL + `/auth/${PARTNER_ID}/${STORE_CHANNEL}/login-facebook`,
//     data: data,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };
// const loginGoogle = (data) => {
//   return axios({
//     method: "POST",
//     url: ECOMOS_URL + `/auth/${PARTNER_ID}/${STORE_CHANNEL}/login-google`,
//     data: data,
//   })
//     .then((res) => {
//       return res;
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

export {
  onRegister,
  login,
  logout
};
