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

const getServiceApi = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/services/${id}`,
  });
};
const createService = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/services`,
    data: data,
  });
};

const removeServiceApi = (id) => {
  return axios({
    method: "DELETE",
    url: API_URL + `/services/${id}`,
  });
};

const updateServiceApi = (data, id) => {
  return axios({
    method: "PUT",
    url: API_URL + `/services/${id}`,
    data: data,
  });
};

const searchService = (params) => {
  return axios({
    method: "GET",
    url: API_URL + "/services/search",
    params: params,
  });
};

// category service

const fetchCategoryServiceApi = () => {
  return axios({
    method: "GET",
    url: API_URL + `/service-categories`,
  });
};

export {
  getServices,
  getServiceApi,
  createService,
  removeServiceApi,
  updateServiceApi,
  fetchCategoryServiceApi,
  searchService,
};
