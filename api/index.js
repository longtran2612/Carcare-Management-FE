import axios from "axios";
import Cookies from "js-cookie";

import { API_URL } from "./url";

const axiosClient = () => {
  const token = Cookies.get("aceesToken");

  const axiosOptions = axios.create({
    baseURL: API_URL,
    headers: {
      "content-type": "application/json",
       Authorization: `Bearer ${token}`,
    },
  });
  return axiosOptions;
};
export default axiosClient;
