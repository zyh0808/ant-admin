import main from "../../views/main.vue"
import employeeSys from "../../views/employee/employeeSys.vue"
import employeeCompany from "../../views/employee/employeeCompany.vue"

const routes = [
  {
    path: "/employee",
    name: "employee",
    component: main,
    children: [
      {
        path: "employee_sys",
        name: "employee_sys",
        component: employeeSys
      },
      {
        path: "employee_company",
        name: "employee_company",
        component: employeeCompany
      }
    ]
  }
]

export default routes