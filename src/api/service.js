import axios from "axios";
import store from "@/store";
import { Notice } from "view-design";
import router from "@/router";

const service = axios.create({
  baseURL: "",
  timeout: 0
});

service.interceptors.request.use(config => {
  if (store.state.user.token) {
    config.headers.Authorization = store.state.user.token;
  } else {
    config.headers.Authorization = "Basic bWFsbC1hZG1pbjoxMjM0NTY="; // base64明文：mall-admin:123456
  }
  return config;
});

service.interceptors.response.use(
  response => {
    console.log(response);
    let data = response.data;
    if (data.code === null) {
    } else if (data.code === "0") {
      if (response.config.method !== "get") {
        Notice.success({
          title: "Tip",
          desc: "操作成功！",
          duration: 1
        });
      }
      return response;
    } else {
      Notice.error({
        title: "Tip",
        desc: data.msg,
        duration: 3
      });
    }
  },
  error => {
    let data = error.response.data;
    if (data.code === "10002") {
      Notice.error({
        title: "Tip",
        desc: data.msg
      });
      store.dispatch("handleLogOut");
      router.replace({ name: "login" });
    }
    return Promise.reject(error);
  }
);

export default service;
