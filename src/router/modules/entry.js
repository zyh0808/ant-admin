const routes = [
  {
    path: "/entry",
    name: "entry",
    component: resolve => require(['../../views/main'], resolve),
    children: [
      {
        path: "entry_import",
        name: "entry_import",
        component: resolve => require(['../../views/entry/order/orderImport'], resolve),
        meta: {
          title: "入库前置订单录入"
        }
      },
      {
        path: "entry_input/:mode/:orderId",
        name: "entry_input",
        component: resolve => require(['../../views/entry/order/orderInput'], resolve),
        meta: {
          title: "入库订单录入"
        }
      },
      {
        path: "entry_order",
        name: "entry_order",
        component: resolve => require(['../../views/entry/order/inOrders'], resolve),
        meta: {
          title: "入库订单"
        }
      },
      {
        path: "entry_checklist",
        name: "entry_checklist",
        component: resolve => require(['../../views/entry/order/orderCheckList'], resolve),
        meta: {
          title: "入库订单审核列表"
        }
      },
      {
        path: "entry_check/:orderId",
        name: "entry_check",
        component: resolve => require(['../../views/entry/order/orderCheck'], resolve),
        meta: {
          title: "入库订单审核"
        }
      },
      {
        path: "entry_checkdetail/:from",
        name: "entry_checkdetail",
        component: resolve => require(['../../views/entry/order/orderCheckDetail'], resolve),
        meta: {
          title: "入库订单详情"
        }
      },
      {
        path: "entry_search",
        name: "entry_search",
        component: resolve => require(['../../views/entry/order/orderSearch'], resolve),
        meta: {
          title: "入库订单查询"
        }
      },
      {
        path: "entry_receivelist",
        name: "entry_receivelist",
        component: resolve => require(['../../views/entry/order/orderReceiveList'], resolve),
        meta: {
          title: "入库订单收货列表"
        }
      },
      {
        path: "entry_receive/:orderId",
        name: "entry_receive",
        component: resolve => require(['../../views/entry/order/orderReceive'], resolve),
        meta: {
          title: "入库订单收货"
        }
      },
      {
        path: "entry_taskorder",
        name: "entry_taskorder",
        component: resolve => require(['../../views/entry/entryTaskOrder'], resolve),
        meta: {
          title: "入库任务单"
        }
      },
      {
        path: "drug_receive_confirm",
        name: "drug_receive_confirm",
        component: resolve => require(['../../views/entry/inhouse/drugReceiveConfirm'], resolve),
        meta: {
          title: "药品收货确认"
        }
      },
      {
        path: "pack_up_allot_list",
        name: "pack_up_allot_list",
        component: resolve => require(['../../views/entry/inhouse/packUpAllotList'], resolve),
        meta: {
          title: "装箱上架分配列表"
        }
      },
      {
        path: "pack_up_allot/:drugName",
        name: "pack_up_allot",
        component: resolve => require(['../../views/entry/inhouse/packUpAllot'], resolve),
        meta: {
          title: "装箱上架分配"
        }
      },
      {
        path: "pack_task_order",
        name: "pack_task_order",
        component: resolve => require(['../../views/entry/inhouse/packTaskOrder'], resolve),
        meta: {
          title: "装箱任务单"
        }
      },
      {
        path: "up_task_order",
        name: "up_task_order",
        component: resolve => require(['../../views/entry/inhouse/upTaskOrder'], resolve),
        meta: {
          title: "上架任务单"
        }
      },
      // {
      //   path: "pack_task_list",
      //   name: "pack_task_list",
      //   component: resolve => require(['../../views/entry/inhouse/packTaskList'], resolve),
      //   meta: {
      //     title: "装箱任务单"
      //   }
      // },
      {
        path: "entry_pack/:taskNo",
        name: "entry_pack",
        component: resolve => require(['../../views/entry/inhouse/pack'], resolve),
        meta: {
          title: "入库装箱"
        }
      },
      {
        path: "entry_packcheck/:taskNo",
        name: "entry_packcheck",
        component: resolve => require(['../../views/entry/inhouse/packCheck'], resolve),
        meta: {
          title: "入库装箱审核"
        }
      }
    ]
  }
]

export default routes