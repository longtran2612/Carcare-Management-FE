import axios from "axios";

import { API_URL } from "./url";

const getStatisticCustomer = (id) => {
  return axios({
    method: "GET",
    url: API_URL + `/statistic/get-customer-statistic/${id}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getStatisticCustomer };
