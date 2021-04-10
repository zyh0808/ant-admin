import Vue from "vue"
import VueRouter from "vue-router"

import login from './modules/login.js'
import employee from './modules/employee.js'
import wms from './modules/wms.js'
import entry from './modules/entry.js'


Vue.use(VueRouter);
// if (!window.VueRouter) Vue.use(Router)

const routes = [
  ...login,
  ...employee,
  ...wms,
  ...entry
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
