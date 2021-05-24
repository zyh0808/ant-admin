// import main from "../../views/main.vue"
// import client from "../../views/wms/client.vue"
// import clientDetail from "../../views/wms/clientDetail.vue"
// import projectDetail from "../../views/wms/projectDetail.vue"
// import drug from "../../views/wms/drug.vue"
// import site from "../../views/wms/site.vue"
// import house from "../../views/wms/house.vue"
// import tempRange from "../../views/wms/tempRange.vue"
// import shelfKind from "../../views/wms/shelfKind.vue"
// import shelf from "../../views/wms/shelf.vue"
// import cell from "../../views/wms/cell.vue"
// import boxKind from "../../views/wms/boxKind.vue"
// import box from "../../views/wms/box.vue"
// import boxKindDrug from "../../views/wms/boxKindDrug.vue"
// import cellBox from "../../views/wms/cellBox.vue"

const routes = [
  {
    path: "/wms",
    name: "wms",
    // component: main,
    component: resolve => require(['../../views/main'], resolve),
    children: [
      {
        path: "wms_client",
        name: "wms_client",
        // component: client,
        component: resolve => require(['../../views/wms/client'], resolve),
        meta: {
          title: "申办方管理"
        }
      },
      {
        path: "wms_client_detail/:id",
        name: "wms_client_detail",
        // component: clientDetail,
        component: resolve => require(['../../views/wms/clientDetail'], resolve),
        meta: {
          title: "申办方详情"
        }
      },
      {
        path: "wms_project_detail/:id",
        name: "wms_project_detail",
        // component: projectDetail,
        component: resolve => require(['../../views/wms/projectDetail'], resolve),
        meta: {
          title: "申办方项目详情"
        }
      },
      {
        path: "wms_drug",
        name: "wms_drug",
        // component: drug,
        component: resolve => require(['../../views/wms/drug'], resolve),
        meta: {
          title: "药品管理"
        }
      },
      {
        path: "wms_site",
        name: "wms_site",
        // component: site,
        component: resolve => require(['../../views/wms/site'], resolve),
        meta: {
          title: "实验中心管理"
        }
      },
      {
        path: "wms_house",
        name: "wms_house",
        // component: house,
        component: resolve => require(['../../views/wms/house'], resolve),
        meta: {
          title: "仓库管理"
        }
      },
      {
        path: "wms_temprange",
        name: "wms_temprange",
        // component: tempRange,
        component: resolve => require(['../../views/wms/tempRange'], resolve),
        meta: {
          title: "温区管理"
        }
      },
      {
        path: "wms_shelfkind",
        name: "wms_shelfkind",
        // component: shelfKind,
        component: resolve => require(['../../views/wms/shelfKind'], resolve),
        meta: {
          title: "货架种类"
        }
      },
      {
        path: "wms_shelf",
        name: "wms_shelf",
        // component: shelf,
        component: resolve => require(['../../views/wms/shelf'], resolve),
        meta: {
          title: "货架管理"
        }
      },
      {
        path: "wms_cell",
        name: "wms_cell",
        // component: cell,
        component: resolve => require(['../../views/wms/cell'], resolve),
        meta: {
          title: "货位管理"
        }
      },
      {
        path: "wms_boxkind",
        name: "wms_boxkind",
        // component: boxKind,
        component: resolve => require(['../../views/wms/boxKind'], resolve),
        meta: {
          title: "箱型管理"
        }
      },
      {
        path: "wms_box",
        name: "wms_box",
        // component: box,
        component: resolve => require(['../../views/wms/box'], resolve),
        meta: {
          title: "药品箱管理"
        }
      },
      {
        path: "wms_boxkinddrug",
        name: "wms_boxkinddrug",
        // component: boxKindDrug,
        component: resolve => require(['../../views/wms/boxKindDrug'], resolve),
        meta: {
          title: "箱型药品配置"
        }
      },
      {
        path: "wms_cellbox",
        name: "wms_cellbox",
        // component: cellBox,
        component: resolve => require(['../../views/wms/cellBox'], resolve),
        meta: {
          title: "货位药品箱"
        }
      },
      {
        path: "wms_inkscreen",
        name: "wms_inkscreen",
        component: resolve => require(['../../views/wms/inkscreen'], resolve),
        meta: {
          title: "墨水屏管理"
        }
      },
      {
        path: "wms_inkscreen_code_log",
        name: "wms_inkscreen_code_log",
        component: resolve => require(['../../views/wms/inkscreenCodeLog'], resolve),
        meta: {
          title: "墨水屏条码日志"
        }
      },
      {
        path: "box_inkscreen_log",
        name: "box_inkscreen_log",
        component: resolve => require(['../../views/wms/boxInkscreenLog'], resolve),
        meta: {
          title: "箱子墨水屏日志"
        }
      },
      {
        path: "box_open_log",
        name: "box_open_log",
        component: resolve => require(['../../views/wms/boxOpenLog'], resolve),
        meta: {
          title: "药品箱开锁日志"
        }
      }
    ]
  }
]

export default routes