import axios from "axios";

import { API_URL } from "./url";

const getServices = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/services`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getService = (data) => {};
const createService = (data) => {};
export { getServices, getService, createService };
