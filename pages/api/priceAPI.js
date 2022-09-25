import axios from "axios";

import { API_URL } from "./url";

const getPrices = () => {
    return axios({
      method: "GET",
      url: API_URL + `/prices`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const getPricesByParent = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/prices/parent=${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const getPricesByHeader = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/prices/header=${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

  const getPriceById = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/prices/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const createPrice = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/prices`,
      data: data,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };


export { getPriceById,getPricesByHeader,getPricesByParent, getPrices, createPrice };