import drugDetail from "../../views/drug/drugDetail.vue"
import drugIn from "../../views/drug/drugIn.vue"
import drugOut from "../../views/drug/drugOut.vue"
import drugBackin from "../../views/drug/drugBackin.vue"
import main2 from "../../views/main2.vue"

const routes = [
  {
    path: "/drug",
    name: "drug",
    component: main2,
    children: [
      {
        path: "drugDetail",
        name: "drugDetail",
        component: drugDetail
      },
      {
        path: "drugIn",
        name: "drugIn",
        component: drugIn
      },
      {
        path: "drugOut",
        name: "drugOut",
        component: drugOut
      },
      {
        path: "drugBackin",
        name: "drugBackin",
        component: drugBackin
      }
    ]
  },
]

export default routes
