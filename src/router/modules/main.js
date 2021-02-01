import Vue from "vue"
import VueRouter from "vue-router"
import main from "../../views/main.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/main",
    name: 'main',
    component: main
  }
];

export default routes

