import axios from 'axios'; // 引入axios
import { message } from 'antd';

const service = axios.create({
  baseURL:
    // @ts-ignore
    process.env.NODE_ENV === 'development'
      ? 'https://sandbox7.feedly.com/v3'
      : 'https://cloud.feedly.com/v3',
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
const getMethodUrl = (methodName: string, parameters: any) => {
  if (methodName === undefined) {
    return '';
  }
  let methodUrl = methodName;

  let queryString = '?';
  for (let parameterName in parameters) {
    queryString += parameterName + '=' + parameters[parameterName] + '&';
  }

  let browserPrefix;
  // @if BROWSER='chrome'
  browserPrefix = 'c';
  // @endif

  // @if BROWSER='opera'
  browserPrefix = 'o';
  // @endif

  // @if BROWSER='firefox'
  browserPrefix = 'f';
  // @endif

  queryString += 'av=' + browserPrefix + 1;

  methodUrl += queryString;
  window.open(methodUrl);
};
// http request 拦截器
service.interceptors.request.use(
  (config) => {
    // @ts-ignore
    if (!config.donNotShowLoading) {
      showLoading();
    }
    if (config.url === '/auth/auth') {
      getMethodUrl(config.baseURL + config.url, config.params);
      return false;
    }
    config.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'OAuth ' + 'token',
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
    switch (error.response.status) {
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
