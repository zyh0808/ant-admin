import Vue from "vue"
import VueRouter from "vue-router"
import main2 from "../../views/main2.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/main",
    name: 'main',
    component: main2
  }
];

export default routes

