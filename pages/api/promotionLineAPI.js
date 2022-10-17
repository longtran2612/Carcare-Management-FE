
import axios from "axios";

import { API_URL } from "./url";

const getPromotionLines = () => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-lines`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getPromotionLineById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-lines/find-promotion-line-by-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionLineByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-lines/find-promotion-line-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionLineByHeaderId = (data) => {
  return axios({
    method: "GET",
    url:
      API_URL + `/promotion-lines/find-all-promotion-line-by-header-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createPromotionLine = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-lines/create`,
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
  getPromotionLines,
  getPromotionLineByHeaderId,
  getPromotionLineById,
  getPromotionLineByCode,
  createPromotionLine,
};
