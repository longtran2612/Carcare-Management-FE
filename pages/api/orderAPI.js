import axios from "axios";

import { API_URL } from "./url";

const getOrders = () => {
  return axios({
    method: "GET",
    url: API_URL + `/order`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getOrderById = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/order/find-order-by-id/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const createOrder = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/order/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};


export {
    createOrder,
    getOrderById,
    getOrders
};
