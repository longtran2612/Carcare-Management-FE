import axios from "axios";

import { API_URL } from "./url";

const getCar = () => {
    return axios({
      method: "GET",
      url: API_URL + `/car`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  
  const getCarById = (data) => {
    return axios({
      method: "GET",
      url: API_URL + `/car/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const createCar = (data) => {
    return axios({
      method: "POST",
      url: API_URL + `/cars`,
      data: data,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };
  const deleteCar = (data) => {
    return axios({
      method: "DELETE",
      url: API_URL + `/cars/${data}`,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  };

export { getCar, getCarById, createCar, deleteCar };