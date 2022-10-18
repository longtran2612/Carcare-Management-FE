import axios from "axios";

import { API_URL } from "./url";

const getCarSlots = () => {
  return axios({
    method: "GET",
    url: API_URL + `/car-slots`,
  });
};
const getCarSlotDetail = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/car-slots/${id}`,
  });
};
const executeCarSlot = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/execute`,
    data: data,
  });
};
const completeCarSlot = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/complete`,
    data: data,
  });
};
const createCarSlot = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/create`,
    data: data,
  });
};
const getCarSlotByCode = (code) => {
  return axios({
    method: "GET",
    url: API_URL + `/car-slots/find-car-slot-by-code/${code}`,
  });
};
const cancelCarSlot = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/cancel/${data}`,
  })
  .then((res) => {
    return res;
  })
  .catch((err) => {
    throw err;
  });
};

export { cancelCarSlot,getCarSlots, getCarSlotDetail, executeCarSlot, completeCarSlot, createCarSlot, getCarSlotByCode };
