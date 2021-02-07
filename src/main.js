import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import moment from "moment";
import lodash from "lodash";
import axios from "axios";
import "./assets/css/index.scss";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { showLoading, hideLoading } from "@/components/utils/loading";

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.prototype._ = lodash;

import QueryForm from "./components/QueryForm";
import QueryItem from "./components/QueryItem";

Vue.component(QueryForm.name, QueryForm);
Vue.component(QueryItem.name, QueryItem);

// 配置请求的跟路径
axios.defaults.baseURL = process.env.VUE_APP_SERVER_URL;
axios.defaults.timeout = 30000;

axios.interceptors.request.use(
  config => {
    // NProgress.start();
    // console.log(config,"config");
    // config.headers.Authorization = window.sessionStorage.getItem("token");
    if (!config.headers.hideNotice) {
      showLoading();
    }
    return config;
  },
  error => {
    console.error(error);
    hideLoading();
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  res => {
    // NProgress.done();
    // if (res.data.code === -2004) {
    //   // 登录失效，清楚token，刷新页面
    //   util.localStorage.remove("token");
    //   window.location.href = window.location.origin + "/#/login";
    //   return;
    // }
    if (res.status !== 200 || res.data.code === "-1") {
      return Promise.reject(res);
    }
    if (!res.config.headers.hideNotice) {
      hideLoading();
    }
    return res;
  },
  error => {
    hideLoading();
    console.log(error);
    return Promise.reject(error);
  }
);

Vue.prototype.$http = axios;
Vue.prototype.$moment = moment;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
