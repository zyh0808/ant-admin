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
        path: "listOne",
        name: "listOne",
        component: listOne
      },
      {
        path: "listTwo",
        name: "listTwo",
        component: listTwo
      }
    ]
  },
]

export default routes
