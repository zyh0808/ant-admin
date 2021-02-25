import systemList from "../../views/system/systemList.vue"
import systemRole from "../../views/system/systemRole.vue"
import main2 from "../../views/main2.vue"

const routes = [
  {
    path: "/system",
    name: "system",
    component: main2,
    children: [
      {
        path: "systemList",
        name: "systemList",
        component: systemList
      },
      {
        path: "systemRole",
        name: "systemRole",
        component: systemRole
      }
    ]
  },
]

export default routes
