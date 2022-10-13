import axios from "axios";
import axiosClient from "./index";
import { API_URL } from "./url";
import Cookies from "js-cookie";

const getCustomers = async () => {
  return axios({
    method: "GET",
    url: API_URL + `/customer`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getCustomerById = async (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/customer/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getCustomerByCode = async (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/customer/find-customner-by-code/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  


const createCustomer = async (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/customer/create`,
    data: data,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};




export { createCustomer, getCustomerById,getCustomers,getCustomerByCode};
