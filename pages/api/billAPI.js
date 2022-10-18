import axios from "axios";

import { API_URL } from "./url";

const getBills = () => {
  return axios({
    method: "GET",
    url: API_URL + "/bills",
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getBillById = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/bills/find-bill-by-id/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
const getBillByCode = (data) => {
  return axios({
    method: "GET",
    url: API_URL + `/bills/find-bill-by-code/${data}`,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

const getAllBillsByCustomerId = (data) => {
    return axios({
        method: "GET",
        url: API_URL + `/bills/find-all-bills-by-customer-id/${data}`,
    })
        .then((res) => {
            return res;
        })
        .catch((err) => {
            throw err;
        });
};

export { getBills, getBillById, getBillByCode, getAllBillsByCustomerId };
