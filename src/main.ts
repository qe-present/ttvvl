import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
const app=createApp(App);
app.use(router);
app.config.globalProperties.$L = L;

app.mount("#app");