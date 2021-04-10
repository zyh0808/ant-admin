// import login from "../../views/login/login.vue"

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    // component: login,
    component: resolve => require(['../../views/login/login'], resolve),
    meta: {
      title: "用户登录"
    }
  }
]

export default routes
