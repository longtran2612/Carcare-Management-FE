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
export { getCarSlots, getCarSlotDetail };
