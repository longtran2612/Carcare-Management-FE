import axios from "axios";

import { API_URL } from "./url";

const getCategories = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/service-categories`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createCategory = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/service-categories`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCategoryById = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/service-categories/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getCategories, createCategory, getCategoryById };
