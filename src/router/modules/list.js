import ListOne from "../../views/list/ListOne.vue"
import ListTwo from "../../views/list/ListTwo.vue"
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
        component: ListOne
      },
      {
        path: "listTwo",
        name: "listTwo",
        component: ListTwo
      }
    ]
  },
]

export default routes
