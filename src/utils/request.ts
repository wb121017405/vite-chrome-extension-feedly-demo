import axios from 'axios'; // 引入axios
import { message } from 'antd';

const service = axios.create({
  baseURL:
    // @ts-ignore
    process.env.NODE_ENV === 'development'
      ? 'https://sandbox7.feedly.com/v3'
      : 'https://sandbox7.feedly.com/v3',
  // : 'https://cloud.feedly.com/v3',
  timeout: 99999,
});
let acitveAxios = 0;
let timer: number | undefined;
const showLoading = () => {
  acitveAxios++;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (acitveAxios > 0) {
      message.loading({
        content: 'Loading...',
        duration: 0,
        key: 'loading',
      });
    }
  }, 400);
};

const closeLoading = () => {
  acitveAxios--;
  if (acitveAxios <= 0) {
    clearTimeout(timer);
    message.destroy('loading');
  }
};
// http request 拦截器
service.interceptors.request.use(
  (config) => {
    // @ts-ignore
    if (!config.donNotShowLoading) {
      showLoading();
    }
    if (config.url === '/auth/auth') {
      return false;
    }
    let token = null;
    // @ts-ignore
    if (process.env.NODE_ENV === 'development') {
      // 浏览器插件环境
      chrome.storage.sync.get(['accessToken'], (result) => {
        token = result.accessToken;
      });
    } else {
      // 本地调试环境，每次手动获取后调试此处
      token =
        'A5byBOk2KdJvW8i00BngMRZsBQibBoTwMJN-8EQlAFz9pwNkv2JztUR12VEd1pYFoKCVKApsRKsHwKdYpHrJ50KlKJA2OQqj4aMoMjmQIvr88bmNNhC8OGCgOTqc6HaxanG3buzaxxr6_nCS_7s6MLdvPkLPoSaeeI_DZvqU_JDbpExByO8FJLlCqmQ5pfMcsX2rwuX-udgoVtecg7JgblbH8GN5nC21sVjzCt-G6V6sg5cAzDMG9PiU6LETNE1zkn6SRrPT:sandbox';
    }
    config.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'OAuth ' + token,
      ...config.headers,
    };

    return config;
  },
  (error) => {
    closeLoading();
    message.error(error);
    return error;
  },
);

// http response 拦截器
service.interceptors.response.use(
  (response) => {
    closeLoading();
    if (response.data.code === 0 || response.headers.success === 'true') {
      if (response.headers.msg) {
        response.data.msg = decodeURI(response.headers.msg);
      }
      return response.data;
    } else {
      message.error(response.data.msg || decodeURI(response.headers.msg));

      if (response.data.data && response.data.data.reload) {
        localStorage.clear();
        // router.push({ name: 'Login', replace: true });
      }
      return response.data.msg ? response.data : response;
    }
  },
  (error) => {
    closeLoading();
    switch (error?.response?.status) {
      case 500:
        message.error('服务器错误');
        break;
      case 404:
        message.error('请求路径错误');
        break;
    }

    return error;
  },
);
export default service;
