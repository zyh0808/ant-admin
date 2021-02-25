export const myMenu = [
    {
        key: "drug", name: 'XX药品管理', icon: 'wechat', hasChild: true, children: [
            { key: "drugDetail", name: '药品详情' },
            { key: "drugIn", name: '药品入库' },
            { key: "drugOut", name: '药品出库' },
            { key: "drugBackin", name: '药品反药' }
        ]
    },
    {
        key: "order", name: '订单管理', icon: 'pie-chart', hasChild: true, children: [
            { key: "orderCheck", name: '订单管理' }
        ]
    },
    {
        key: "system", name: '系统管理', icon: 'file-image', hasChild: true, children: [
            { key: 'systemList', name: '系统列表' },
            { key: 'systemRole', name: '角色管理' }
        ]
    }
]