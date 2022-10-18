import axios from "axios";

import { API_URL } from "./url";

const getOrders = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/order/search-order`,
    data: data,
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

const getAllExecuteOrder = () => {
  return axios({
    method: "GET",
    url: API_URL + `/order/get-all-executed-order`,
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
const cancelOrder = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/order/cancel/${data}`,
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
    getOrders,
    getAllExecuteOrder,
    cancelOrder
};
