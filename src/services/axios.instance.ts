import axiosLib from 'axios';
import { ENV } from '../constants/constants';

const axios = axiosLib.create({
  baseURL: ENV.base_url,
  timeout: 300000,
});

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (err) {
    // Do something with the response error
    return Promise.reject(err);
  },
);

export default axios;
