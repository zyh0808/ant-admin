// import main from "../../views/main.vue"
// import entryInput from "../../views/entry/entryInput.vue"
// import entryCheckList from "../../views/entry/entryCheckList.vue"
// import entryCheck from "../../views/entry/entryCheck.vue"
// import entryCheckDetail from "../../views/entry/entryCheckDetail.vue"
// import entrySearch from "../../views/entry/entrySearch.vue"
// import entryReceiveList from "../../views/entry/entryReceiveList.vue"
// import entryReceive from "../../views/entry/entryReceive.vue"
// import entryTaskOrder from "../../views/entry/entryTaskOrder.vue"

const routes = [
  {
    path: "/entry",
    name: "entry",
    // component: main,
    component: resolve => require(['../../views/main'], resolve),
    children: [
      {
        path: "entry_input",
        name: "entry_input",
        // component: entryInput,
        component: resolve => require(['../../views/entry/entryInput'], resolve),
        meta: {
          title: "入库订单录入"
        }
      },
      {
        path: "entry_checklist",
        name: "entry_checklist",
        // component: entryCheckList,
        component: resolve => require(['../../views/entry/entryCheckList'], resolve),
        meta: {
          title: "入库订单审核列表"
        }
      },
      {
        path: "entry_check",
        name: "entry_check",
        // component: entryCheck,
        component: resolve => require(['../../views/entry/entryCheck'], resolve),
        meta: {
          title: "入库订单审核"
        }
      },
      {
        path: "entry_checkdetail/:from",
        name: "entry_checkdetail",
        // component: entryCheckDetail,
        component: resolve => require(['../../views/entry/entryCheckDetail'], resolve),
        meta: {
          title: "入库订单详情"
        }
      },
      {
        path: "entry_search",
        name: "entry_search",
        // component: entrySearch,
        component: resolve => require(['../../views/entry/entrySearch'], resolve),
        meta: {
          title: "入库订单查询"
        }
      },
      {
        path: "entry_receivelist",
        name: "entry_receivelist",
        // component: entryReceiveList,
        component: resolve => require(['../../views/entry/entryReceiveList'], resolve),
        meta: {
          title: "入库订单收货列表"
        }
      },
      {
        path: "entry_receive",
        name: "entry_receive",
        // component: entryReceive,
        component: resolve => require(['../../views/entry/entryReceive'], resolve),
        meta: {
          title: "入库订单收货"
        }
      },
      {
        path: "entry_taskorder",
        name: "entry_taskorder",
        // component: entryTaskOrder,
        component: resolve => require(['../../views/entry/entryTaskOrder'], resolve),
        meta: {
          title: "入库任务单"
        }
      },
      {
        path: "drug_receive_confirm",
        name: "drug_receive_confirm",
        // component: entryTaskOrder,
        component: resolve => require(['../../views/entry/drugReceiveConfirm'], resolve),
        meta: {
          title: "药品收货确认"
        }
      },
      {
        path: "pack_up_allot_list",
        name: "pack_up_allot_list",
        // component: entryTaskOrder,
        component: resolve => require(['../../views/entry/packUpAllotList'], resolve),
        meta: {
          title: "装箱上架分配列表"
        }
      },
      {
        path: "pack_up_allot",
        name: "pack_up_allot",
        component: resolve => require(['../../views/entry/packUpAllot'], resolve),
        meta: {
          title: "装箱上架分配"
        }
      }
    ]
  }
]

export default routes