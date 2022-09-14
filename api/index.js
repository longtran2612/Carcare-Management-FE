import axios from 'axios';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import { API_URL } from './url';

let token = Cookies.get("accessToken");

const axiosClient = () => {
    const axiosOptions = axios.create({
      baseURL: API_URL,
      headers: {
        "content-type": "application/json",
        "Authorization" : `Bearer ${token}`
      },
    });
    return axiosOptions;
  };

export default axiosClient;
