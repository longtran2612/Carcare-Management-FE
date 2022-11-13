import axios from "axios";
import moment from "moment";

import { API_URL } from "./url";
const dateFormat = "DD/MM/YYYY";

const handleType = (data) => {
  console.log(data);
  let fromDate = moment(data.fromDate).format("DD/MM/YYYY");
  let toDate = moment(data.toDate).format("DD/MM/YYYY");

  switch (data?.reportType) {
    case 0:
      return "bang_ke_hoa_don("+fromDate+"-"+toDate+").xlsx";
    case 1:
      return "bang_ke_hoa_don_huy("+fromDate+"-"+toDate+").xlsx";
    case 2:
      return "bang_ke_hoa_don("+fromDate+"-"+toDate+").xlsx";
    case 3:
      return "bang_ke_theo_khach_hang("+fromDate+"-"+toDate+").xlsx";
    case 4:
      return "bang_ke_khuyen_mai("+fromDate+"-"+toDate+").xlsx";
  }
};

const getReport = (data) => {
  return axios({
    method: "POST",
    url: API_URL + `/report/get-report-in-range-date`,
    data: data,
    responseType: "blob",
  })
    .then((res) => {
      console.log(res);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        handleType(data)
      );
      document.body.appendChild(link);
      link.click();
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export { getReport };
