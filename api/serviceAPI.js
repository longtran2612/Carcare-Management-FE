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

const getService = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/services/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createService = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/services`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const removeServiceApi = (id) => {
  return axios({
    method: "DELETE",
    url: API_URL + `/services/${id}`,
  });
};

export { getServices, getService, createService, removeServiceApi };
