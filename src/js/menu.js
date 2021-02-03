export const myMenu = [
    { key: "home", name: '首页', icon: 'windows', hasChild: false, children: [] },
    {
        key: "list", name: '列表', icon: 'wechat', hasChild: true, children: [
            { key: "listOne", name: '列表一' },
            { key: "listTwo", name: '列表二' }
        ]
    },
    {
        key: "chart", name: '图表', icon: 'pie-chart', hasChild: true, children: [
            { key: "chartOne", name: '图表一' },
            { key: "chartTwo", name: '图表二' }
        ]
    },
    {
        key: "uploadImage", name: '上传图片', icon: 'file-image', hasChild: false
    }
]