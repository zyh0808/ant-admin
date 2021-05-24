// import main from "../../views/main.vue"
// import system from "../../views/employee/system.vue"
// import company from "../../views/employee/company.vue"
// import organization from "../../views/employee/organization.vue"
// import systemRole from "../../views/employee/systemRole.vue"
// import systemModule from "../../views/employee/systemModule.vue"
// import employee from "../../views/employee/employee.vue"
// import user from "../../views/employee/user.vue"
// import authority from "../../views/employee/authority.vue"
// import area from "../../views/employee/area.vue"
// import dictionary from "../../views/employee/dictionary.vue"
// import seed from "../../views/employee/seed.vue"
// import systemLog from "../../views/employee/systemLog.vue"

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
        // component: system,
        component: resolve => require(['../../views/employee/system'], resolve),
        meta: {
          title: "系统管理"
        }
      },
      {
        path: "employee_company",
        name: "employee_company",
        // component: company,
        component: resolve => require(['../../views/employee/company'], resolve),
        meta: {
          title: "公司信息"
        }
      },
      {
        path: "employee_org",
        name: "employee_org",
        // component: organization,
        component: resolve => require(['../../views/employee/organization'], resolve),
        meta: {
          title: "组织机构"
        }
      },
      {
        path: "employee_role",
        name: "employee_role",
        // component: systemRole,
        component: resolve => require(['../../views/employee/systemRole'], resolve),
        meta: {
          title: "角色管理"
        }
      },
      {
        path: "employee_module",
        name: "employee_module",
        // component: systemModule,
        component: resolve => require(['../../views/employee/systemModule'], resolve),
        meta: {
          title: "模块管理"
        }
      },
      {
        path: "employee_emp",
        name: "employee_emp",
        // component: employee,
        component: resolve => require(['../../views/employee/employee'], resolve),
        meta: {
          title: "员工管理"
        }
      },
      {
        path: "employee_user",
        name: "employee_user",
        // component: user,
        component: resolve => require(['../../views/employee/user'], resolve),
        meta: {
          title: "用户管理"
        }
      },
      {
        path: "employee_auth",
        name: "employee_auth",
        // component: authority,
        component: resolve => require(['../../views/employee/authority'], resolve),
        meta: {
          title: "权限管理"
        }
      },
      {
        path: "employee_area",
        name: "employee_area",
        // component: area,
        component: resolve => require(['../../views/employee/area'], resolve),
        meta: {
          title: "行政区域"
        }
      },
      {
        path: "employee_dict",
        name: "employee_dict",
        // component: dictionary,
        component: resolve => require(['../../views/employee/dictionary'], resolve),
        meta: {
          title: "字典信息"
        }
      },
      {
        path: "employee_seed",
        name: "employee_seed",
        // component: seed,
        component: resolve => require(['../../views/employee/system'], resolve),
        meta: {
          title: "编号种子"
        }
      },
      {
        path: "employee_log",
        name: "employee_log",
        // component: systemLog,
        component: resolve => require(['../../views/employee/systemLog'], resolve),
        meta: {
          title: "系统日志"
        }
      }
    ]
  }
]

export default routes