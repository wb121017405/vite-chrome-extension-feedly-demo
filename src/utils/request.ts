import axios from 'axios'; // 引入axios
import { message } from 'antd';

const service = axios.create({
  baseURL:
    // @ts-ignore
    process.env.NODE_ENV === 'development'
      ? 'https://sandbox7.feedly.com'
      : 'https://sandbox7.feedly.com',
  // : 'https://cloud.feedly.com',
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
  async (config) => {
    // @ts-ignore
    if (!config.donNotShowLoading) {
      showLoading();
    }
    let token = null;
    // @ts-ignore
    if (process.env.NODE_ENV !== 'development') {
      console.log(33333222111);
      // 浏览器插件环境
      const res = await chrome.storage.sync.get(['accessToken']);
      token = res.accessToken;
    } else {
      // 本地调试环境，每次手动获取后调试此处
      token =
        'AylagpCGzvKbuLtBg96Nz2-Tzvu_QkJeSW9AnMxJEyT4ZF1__dZeqbI1FIQ4b947nGXyd__LuNKJ8x3te5YSsyFYPDTquY-iDq6-016j8xQi6KS4wctgr4jVp8zcpNkSaDGVT4Wf8UdylAHPlrjaKpljQW__YPXTGbFZR128JIYvL1GNGawEDlRDBmAjYsDLoUqdnCbkRrpKxk9wl8ksnqD0D_cw4KuWV2I58wm6PJ18LdYbJS52ZrUsC49o0IwTgcnUVXA:sandbox';
    }
    console.log(token);
    config.headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'OAuth ' + token,
      // Authorization:
      //   'Bearer A7PsJjyl3njDggINsptEt4GALF-j-aKlRWQBnEeuiLNH6JK6nYAf1kJ3X4nJt2Nttmqae5cbgyjIaT8yYUauzew_DA4KkHabAlAwOr7pOt9XCj6qUEDP_bgpc7gdr1OlWOU32rTGQrdkhMVg1JtLOP54UGJScmn7bCtixxA1zwILnarNfFH3BxA4MVxDgJ23HP5IXQEL2yRVIOAtVGhpGt2Cc6-vY0rzABDKtGG3cyiz0E_AEFHo8PEixBGV:feedlydev',
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
    // if (response.data.code === 0 || response.headers.success === 'true') {
    //   if (response.headers.msg) {
    //     response.data.msg = decodeURI(response.headers.msg);
    //   }
    //   return response.data;
    // } else {
    //   message.error(response.data.msg || decodeURI(response.headers.msg));

    //   if (response.data.data && response.data.data.reload) {
    //     localStorage.clear();
    //     // router.push({ name: 'Login', replace: true });
    //   }
    //   return response.data.msg ? response.data : response;
    // }
    if (response?.status !== 200) {
      message.error(response?.status);
    }
    return response;
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
