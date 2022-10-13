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
const executeCarSlot = (id) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/execute/${id}`,
  });
};
const completeCarSlot = (id) => {
  return axios({
    method: "POST",
    url: API_URL + `/car-slots/complete/${id}`,
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
export { getCarSlots, getCarSlotDetail, executeCarSlot, completeCarSlot, createCarSlot, getCarSlotByCode };
