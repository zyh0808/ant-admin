import chartOne from "../../views/chart/chartOne.vue"
import chartTwo from "../../views/chart/chartTwo.vue"
import main from "../../views/main.vue"

const routes = [
  {
    path: "/chart",
    name: "chart",
    component: main,
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
