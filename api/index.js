import axios from "axios";
import Cookies from "js-cookie";

import { API_URL } from "./url";

const axiosClient = () => {
  const token = Cookies.get("token");

  const axiosOptions = axios.create({
    baseURL: API_URL,
    headers: {
      "content-type": "application/json",
      "Access-Token": token,
    },
  });
  return axiosOptions;
};
export default axiosClient;
