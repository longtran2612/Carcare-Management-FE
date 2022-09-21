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

const updateServiceApi = (data) => {
  console.log(data);
  return axios({
    method: "PUT",
    url: API_URL + `/services/${data.id}`,
    data: data,
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
  getService,
  createService,
  removeServiceApi,
  updateServiceApi,
  fetchCategoryServiceApi,
};
