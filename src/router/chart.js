// import chartIndex from "../views/list/index.vue"
import chartOne from "../views/chart/chartOne.vue"
import chartTwo from "../views/chart/chartTwo.vue"
import index from "../views/index.vue"

const routes = [
  {
    path: "/chart",
    name: "chart",
    component: index,
    children: [
      {
        path: "chartOne",
        name: "chartOne",
        component: chartOne
      },
      {
        path: "chartTwo",
        name: "chartTwo",
        component: chartTwo
      }
    ]
  }
]

export default routes
