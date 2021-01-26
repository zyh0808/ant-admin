import Login from "../views/login/Login.vue"

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
]

export default routes
