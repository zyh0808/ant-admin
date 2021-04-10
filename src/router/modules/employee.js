// import main from "../../views/main.vue"
// import employeeSys from "../../views/employee/employeeSys.vue"
// import employeeCompany from "../../views/employee/employeeCompany.vue"
// import employeeOrg from "../../views/employee/employeeOrg.vue"
// import employeeRole from "../../views/employee/employeeRole.vue"
// import employeeModule from "../../views/employee/employeeModule.vue"
// import employeeEmp from "../../views/employee/employeeEmp.vue"
// import employeeUser from "../../views/employee/employeeUser.vue"
// import employeeAuth from "../../views/employee/employeeAuth.vue"
// import employeeArea from "../../views/employee/employeeArea.vue"
// import employeeDict from "../../views/employee/employeeDict.vue"
// import employeeSeed from "../../views/employee/employeeSeed.vue"
// import employeeLog from "../../views/employee/employeeLog.vue"

const routes = [
  {
    path: "/employee",
    name: "employee",
    // component: main,
    component: resolve => require(['../../views/main'], resolve),
    children: [
      {
        path: "employee_sys",
        name: "employee_sys",
        // component: employeeSys,
        component: resolve => require(['../../views/employee/employeeSys'], resolve),
        meta: {
          title: "系统管理"
        }
      },
      {
        path: "employee_company",
        name: "employee_company",
        // component: employeeCompany,
        component: resolve => require(['../../views/employee/employeeCompany'], resolve),
        meta: {
          title: "公司信息"
        }
      },
      {
        path: "employee_org",
        name: "employee_org",
        // component: employeeOrg,
        component: resolve => require(['../../views/employee/employeeOrg'], resolve),
        meta: {
          title: "组织机构"
        }
      },
      {
        path: "employee_role",
        name: "employee_role",
        // component: employeeRole,
        component: resolve => require(['../../views/employee/employeeRole'], resolve),
        meta: {
          title: "角色管理"
        }
      },
      {
        path: "employee_module",
        name: "employee_module",
        // component: employeeModule,
        component: resolve => require(['../../views/employee/employeeModule'], resolve),
        meta: {
          title: "模块管理"
        }
      },
      {
        path: "employee_emp",
        name: "employee_emp",
        // component: employeeEmp,
        component: resolve => require(['../../views/employee/employeeEmp'], resolve),
        meta: {
          title: "员工管理"
        }
      },
      {
        path: "employee_user",
        name: "employee_user",
        // component: employeeUser,
        component: resolve => require(['../../views/employee/employeeUser'], resolve),
        meta: {
          title: "用户管理"
        }
      },
      {
        path: "employee_auth",
        name: "employee_auth",
        // component: employeeAuth,
        component: resolve => require(['../../views/employee/employeeAuth'], resolve),
        meta: {
          title: "权限管理"
        }
      },
      {
        path: "employee_area",
        name: "employee_area",
        // component: employeeArea,
        component: resolve => require(['../../views/employee/employeeArea'], resolve),
        meta: {
          title: "行政区域"
        }
      },
      {
        path: "employee_dict",
        name: "employee_dict",
        // component: employeeDict,
        component: resolve => require(['../../views/employee/employeeDict'], resolve),
        meta: {
          title: "字典信息"
        }
      },
      {
        path: "employee_seed",
        name: "employee_seed",
        // component: employeeSeed,
        component: resolve => require(['../../views/employee/employeeSys'], resolve),
        meta: {
          title: "编号种子"
        }
      },
      {
        path: "employee_log",
        name: "employee_log",
        // component: employeeLog,
        component: resolve => require(['../../views/employee/employeeLog'], resolve),
        meta: {
          title: "系统日志"
        }
      }
    ]
  }
]

export default routes