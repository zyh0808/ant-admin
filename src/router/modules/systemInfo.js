import index from "../../views/systemInfo/index.vue"
import main from "../../views/main.vue"
// import main2 from "../../views/main2.vue"

const routes = [
  {
    path: "/system",
    name: "system",
    component: main,
    children: [
      {
        path: "systemInfo",
        name: "systemInfo",
        component: index
      }
    ]
  },
]

export default routes
