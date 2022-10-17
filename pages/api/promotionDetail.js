import create from "@ant-design/icons/lib/components/IconFont";
import axios from "axios";

import { API_URL } from "./url";

const getPromotionDetail = () => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-details`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getPromotionDetailById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-details/find-promotion-detail-by-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionDetailByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/promotion-details/find-promotion-detail-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getPromotionDetailByLineId = (data) => {
  return axios({
    method: "GET",
    url:
      API_URL +
      `/promotion-details/find-all-promotion-detail-by-promotion-line-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const createPromotionDetail = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/promotion-details/create`,
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
  getPromotionDetail,
  getPromotionDetailByLineId,
  getPromotionDetailById,
  getPromotionDetailByCode,
  createPromotionDetail,
};
