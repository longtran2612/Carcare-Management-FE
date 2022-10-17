
import axios from "axios";

import { API_URL } from "./url";

const getPromotionHeaders = () => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-headers`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getPromotionHeaderById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-headers/find-promotion-header-by-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionHeaderByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-headers/find-promotion-header-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createPromotionHeader = (data) => {
    return axios({
        method: "POST",
        url: API_URL + `/promotion-headers/create`,
        data: data,
    })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
};

export { getPromotionHeaders,getPromotionHeaderByCode, getPromotionHeaderById, createPromotionHeader };
