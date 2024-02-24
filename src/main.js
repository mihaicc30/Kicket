import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import CJS from "vue-cryptojs";
import VueCookies from "vue-cookies";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(CJS);

app.config.globalProperties.$cookies = VueCookies;

app.mount("#app");
