// import homeIndex from "../views/home/index.vue"
import home from "../views/home/home.vue"
import index from "../views/index.vue"

const routes = [
  {
    path: "/home",
    component: index,
    children: [
      {
        path: '',
        redirect: 'home'
      },
      {
        path: "home",
        name: "home",
        component: home,
        meta: {
          keepAlive: true
        }
      }
    ]
  }
]

export default routes
