import axios from "axios";

import { API_URL } from "./url";

const getCarModel = () => {
    return axios({
      method: "GET",
      url: API_URL + `/car-models`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  
  const getCarModelById = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/car-models/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const createCarModel = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/car-models`,
      data: data,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const deleteCarModel = (data) => {
    return axios({
      method: "DELETE",
      url: API_URL + `/car-models/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

export {getCarModel,getCarModelById,deleteCarModel,createCarModel};