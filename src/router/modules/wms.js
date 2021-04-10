// import main from "../../views/main.vue"
// import wmsClient from "../../views/wms/wmsClient.vue"
// import wmsClientDetail from "../../views/wms/wmsClientDetail.vue"
// import wmsProjectDetail from "../../views/wms/wmsProjectDetail.vue"
// import wmsDrug from "../../views/wms/wmsDrug.vue"
// import wmsSite from "../../views/wms/wmsSite.vue"
// import wmsHouse from "../../views/wms/wmsHouse.vue"
// import wmsTempRange from "../../views/wms/wmsTempRange.vue"
// import wmsShelfKind from "../../views/wms/wmsShelfKind.vue"
// import wmsShelf from "../../views/wms/wmsShelf.vue"
// import wmsCell from "../../views/wms/wmsCell.vue"
// import wmsBoxKind from "../../views/wms/wmsBoxKind.vue"
// import wmsBox from "../../views/wms/wmsBox.vue"
// import wmsBoxKindDrug from "../../views/wms/wmsBoxKindDrug.vue"
// import wmsCellBox from "../../views/wms/wmsCellBox.vue"

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
        // component: wmsClient,
        component: resolve => require(['../../views/wms/wmsClient'], resolve),
        meta: {
          title: "申办方管理"
        }
      },
      {
        path: "wms_client_detail/:id",
        name: "wms_client_detail",
        // component: wmsClientDetail,
        component: resolve => require(['../../views/wms/wmsClientDetail'], resolve),
        meta: {
          title: "申办方详情"
        }
      },
      {
        path: "wms_project_detail/:id",
        name: "wms_project_detail",
        // component: wmsProjectDetail,
        component: resolve => require(['../../views/wms/wmsProjectDetail'], resolve),
        meta: {
          title: "申办方项目详情"
        }
      },
      {
        path: "wms_drug",
        name: "wms_drug",
        // component: wmsDrug,
        component: resolve => require(['../../views/wms/wmsDrug'], resolve),
        meta: {
          title: "药品管理"
        }
      },
      {
        path: "wms_site",
        name: "wms_site",
        // component: wmsSite,
        component: resolve => require(['../../views/wms/wmsSite'], resolve),
        meta: {
          title: "实验中心管理"
        }
      },
      {
        path: "wms_house",
        name: "wms_house",
        // component: wmsHouse,
        component: resolve => require(['../../views/wms/wmsHouse'], resolve),
        meta: {
          title: "仓库管理"
        }
      },
      {
        path: "wms_temprange",
        name: "wms_temprange",
        // component: wmsTempRange,
        component: resolve => require(['../../views/wms/wmsTempRange'], resolve),
        meta: {
          title: "温区管理"
        }
      },
      {
        path: "wms_shelfkind",
        name: "wms_shelfkind",
        // component: wmsShelfKind,
        component: resolve => require(['../../views/wms/wmsShelfKind'], resolve),
        meta: {
          title: "货架种类"
        }
      },
      {
        path: "wms_shelf",
        name: "wms_shelf",
        // component: wmsShelf,
        component: resolve => require(['../../views/wms/wmsShelf'], resolve),
        meta: {
          title: "货架管理"
        }
      },
      {
        path: "wms_cell",
        name: "wms_cell",
        // component: wmsCell,
        component: resolve => require(['../../views/wms/wmsCell'], resolve),
        meta: {
          title: "货位管理"
        }
      },
      {
        path: "wms_boxkind",
        name: "wms_boxkind",
        // component: wmsBoxKind,
        component: resolve => require(['../../views/wms/wmsBoxKind'], resolve),
        meta: {
          title: "箱型管理"
        }
      },
      {
        path: "wms_box",
        name: "wms_box",
        // component: wmsBox,
        component: resolve => require(['../../views/wms/wmsBox'], resolve),
        meta: {
          title: "药品箱管理"
        }
      },
      {
        path: "wms_boxkinddrug",
        name: "wms_boxkinddrug",
        // component: wmsBoxKindDrug,
        component: resolve => require(['../../views/wms/wmsBoxKindDrug'], resolve),
        meta: {
          title: "箱型药品配置"
        }
      },
      {
        path: "wms_cellbox",
        name: "wms_cellbox",
        // component: wmsCellBox,
        component: resolve => require(['../../views/wms/wmsCellBox'], resolve),
        meta: {
          title: "货位药品箱"
        }
      }
    ]
  }
]

export default routes