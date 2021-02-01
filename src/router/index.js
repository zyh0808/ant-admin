import Vue from "vue"
import VueRouter from "vue-router"

import login from './modules/login.js'
import main from './modules/main.js'
import list from './modules/list.js'
import chart from './modules/chart.js'
import home from './modules/home.js'


Vue.use(VueRouter);

const routes = [
  ...login,
  ...home,
  ...main,
  ...list,
  ...chart
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
