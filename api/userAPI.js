import axios from "axios";
import axiosClient from "./index";

import { API_URL } from "./url";


const getUsers = async () => {
  return axiosClient()({
    method: "GET",
    url: API_URL + `/users`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const createUser = async (data) => {
  return axiosClient()({
    method: "POST",
    url: API_URL + `/users`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const updateUser = async (data) => {
  return axiosClient()({
    method: "PUT",
    url: API_URL + `/users`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getUsers , createUser, updateUser};