import Vue from "vue"
import VueRouter from "vue-router"

import login from './login.js'
import home from './home.js'
import list from './list.js'
import chart from './chart.js'

import index from "../views/index.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/index",
    name: 'index',
    component: index
  },
  ...login,
  ...home,
  ...list,
  ...chart
  // {
  //   path: "/",
  //   redirect: "/login"
  // },
  // {
  //   path: "/login",
  //   name: "login",
  //   component: Login
  // },
  // {
  //   path: "/home",
  //   name: "home",
  //   redirect: "/home/index",
  //   component: Home,
  //   children: [
  //     {
  //       path: "index",
  //       name: "index",
  //       component: Index
  //     }
  //   ]
  // },
  // {
  //   path: "/list",
  //   name: "list",
  //   component: Home,
  //   children: [
  //     {
  //       path: "listOne",
  //       name: "listOne",
  //       component: ListOne
  //     },
  //     {
  //       path: "listTwo",
  //       name: "listTwo",
  //       component: ListTwo
  //     }
  //   ]
  // },
  // {
  //   path: "/chart",
  //   name: "chart",
  //   component: Home,
  //   children: [
  //     {
  //       path: "chartOne",
  //       name: "chartOne",
  //       component: ChartOne
  //     },
  //     {
  //       path: "chartTwo",
  //       name: "chartTwo",
  //       component: ChartTwo
  //     }
  //   ]
  // }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (location) {
  return originalReplace.call(this, location).catch(err => err)
}
export default router
