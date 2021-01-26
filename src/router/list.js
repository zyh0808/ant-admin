// import ListIndex from "../views/list/index.vue"
import ListOne from "../views/list/ListOne.vue"
import ListTwo from "../views/list/ListTwo.vue"
import index from "../views/index.vue"

const routes = [
  {
    path: "/list",
    name: "list",
    component: index,
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
