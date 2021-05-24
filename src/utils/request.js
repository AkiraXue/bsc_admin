import axios from "axios";
import qs from 'qs'
import store from "@/store";
import { Modal } from "antd";
import { getToken } from "@/utils/auth";
import { logout } from "@/store/actions";

const baseUrl = "https://api.akiraxue.com";
const BearerToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1RfVE9LRU4iLCJpYXQiOjE2MjE2NzAzMzYsIm5iZiI6MTYyMTY3MDMzNiwiZXhwIjoxNjI0MjYyMzM2LCJhY2NvdW50X2lkIjoiZmY4NWI1YWEwM2EwNDFjZWE5MzFkMTNlMWQ3NGYyNDQiLCJvcGVuaWQiOiJvcGVuaWQgMjIyMiIsInNlc3Npb25fa2V5Ijoic2Vzc2lvbl9rZXkgMzMzMyJ9.c-yXs7Sj6S4enyq3bgLOjMzSIF-mPn8OXeuUtYOzFys)';

//创建一个axios示例
const service = axios.create({
  //baseURL: process.env.REACT_APP_BASE_API, // api 的 base_url
  baseURL: baseUrl,
  timeout: 5000, // request timeout,
  method: 'POST',
  headers: {
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "OPTIONS,POST,GET,HEAD,DELETE,PUT",
    // "Access-Control-Allow-Headers": "Access-Control-*, Origin, X-Requested-With, Content-Type, Access-Token, Accept",
    // "Access-Control-Max-Age": 300,
    // "Access-Control-Allow-Credentials" : true,
    // "Allow": "OPTIONS,POST,GET,HEAD,DELETE,PUT",
    "Content-Type": 'application/x-www-form-urlencoded'
  },
  // withCredentials: true,
  // proxy: {
  //   host: "localhost",
  //   port: 3000,
  //   protocol: "http"
  // }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    if (store.getState().user.token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      config.headers.Authorization = BearerToken;
    }
    if (JSON.stringify(config.data) === '{}') {
      config.data.is_admin = 1;
    }
    config.data = JSON.stringify(config.data) === '{}' ? qs.stringify(config.data) : config.data; // 得到转换后的数据为 string 类型
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  (error) => {
    console.log("err" + error); // for debug
    const { status } = error.response;
    if (status == 403) {
      Modal.confirm({
        title: "确定登出?",
        content:
          "由于长时间未操作，您已被登出，可以取消继续留在该页面，或者重新登录",
        okText: "重新登录",
        cancelText: "取消",
        onOk() {
          let token = store.getState().user.token;
          store.dispatch(logout(token));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    }
    return Promise.reject(error);
  }
);

export default service;
