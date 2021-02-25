import orderCheck from "../../views/order/orderCheck.vue"
import main2 from "../../views/main2.vue"

const routes = [
  {
    path: "/order",
    name: "order",
    component: main2,
    children: [
      {
        path: "orderCheck",
        name: "orderCheck",
        component: orderCheck
      }
    ]
  }
]

export default routes
