import listOne from "../../views/list/listOne.vue"
import listTwo from "../../views/list/listTwo.vue"
import main from "../../views/main.vue"

const routes = [
  {
    path: "/list",
    name: "list",
    component: main,
    children: [
      {
        path: "in",
        name: "in",
        component: listOne
      },
      {
        path: "out",
        name: "out",
        component: listTwo
      }
    ]
  },
]

export default routes
