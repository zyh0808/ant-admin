import main from "../../views/main.vue"
import home from "../../views/home.vue"

const routes = [
  {
    path: "/main",
    component: main,
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