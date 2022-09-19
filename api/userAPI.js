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

export { getUsers };