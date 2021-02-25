import Vue from "vue"
import VueRouter from "vue-router"

import login from './modules/login.js'
import main from './modules/main.js'
import drug from './modules/drug.js'
import order from './modules/order.js'
import system from './modules/system.js'


Vue.use(VueRouter);

const routes = [
  ...login,
  ...main,
  ...drug,
  ...order,
  ...system
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
