import axios from "axios";

const requestInstance = axios.create({
  baseURL: '/'
})


requestInstance.interceptors.request.use((config) => {
  console.log('config: ', config);
  return config;
}, (error) => {
  console.log('error: ', error);
  return error;
});
requestInstance.interceptors.response.use((response) => {
  if (response?.status === 200) {
    return response.data;
  } else {

    return {
      code: -1,
      msg: '出错了',
      data: null
    }
  }
}, (error) => {
  return Promise.reject(error);
})


export default requestInstance;
