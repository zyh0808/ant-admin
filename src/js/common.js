export const drug_show_columns = [
  {
    title: '药品名称',
    dataIndex: 'drug_name',
    value: 'drug_name',
    width: 150,
    ellipsis: true
  },
  {
    title: '药品规格',
    dataIndex: 'spec',
    value: 'spec',
    width: 150,
    ellipsis: true
  },
  {
    title: '药品批号',
    dataIndex: 'drug_batch',
    value: 'drug_batch',
    width: 150,
    ellipsis: true
  },
  {
    title: '有效期至',
    dataIndex: 'drug_date',
    value: 'drug_date',
    width: 150,
    ellipsis: true
  },
  {
    title: '药品数量',
    dataIndex: 'count',
    value: 'count',
    width: 100,
    ellipsis: true
  },
  {
    title: '药品包装',
    dataIndex: 'pck_unit',
    value: 'pck_unit',
    width: 100,
    ellipsis: true
  },
  {
    title: '作业模式',
    dataIndex: 'op_type',
    value: 'op_type',
    width: 100,
    ellipsis: true
  },
  {
    title: '存储条件',
    dataIndex: 'env',
    value: 'env',
    width: 100,
    ellipsis: true
  },
  {
    title: '温度区间',
    dataIndex: 'temp_range',
    value: 'temp_range',
    width: 100,
    ellipsis: true
  },
  {
    title: '药品明细',
    dataIndex: 'drugDetail',
    value: 'drugDetail',
    width: 100,
    scopedSlots: { customRender: 'drugDetail' }
  }
]
export const drug_action_columns = [
  {
    title: '药品名称',
    dataIndex: 'drug_name',
    value: 'drug_name',
    width: 150,
    ellipsis: true
  },
  {
    title: '药品规格',
    dataIndex: 'spec',
    value: 'spec',
    width: 150,
    ellipsis: true
  },
  {
    title: '药品批号',
    dataIndex: 'drug_batch',
    value: 'drug_batch',
    width: 150,
    ellipsis: true
  },
  {
    title: '有效期',
    dataIndex: 'drug_date',
    value: 'drug_date',
    width: 150,
    ellipsis: true
  },
  {
    title: '药品数量',
    dataIndex: 'count',
    value: 'count',
    width: 100,
    ellipsis: true
  },
  {
    title: '药品包装',
    dataIndex: 'pck_unit',
    value: 'pck_unit',
    width: 100,
    ellipsis: true
  },
  {
    title: '作业模式',
    dataIndex: 'op_type',
    value: 'op_type',
    width: 100,
    ellipsis: true
  },
  {
    title: '存储条件',
    dataIndex: 'env',
    value: 'env',
    width: 100,
    ellipsis: true
  },
  {
    title: '温度区间',
    dataIndex: 'temp_range',
    value: 'temp_range',
    width: 100,
    ellipsis: true
  },
  {
    title: '药品明细',
    dataIndex: 'drugDetail',
    value: 'drugDetail',
    width: 100,
    scopedSlots: { customRender: 'drugDetail' }
  },
  {
    title: '操作',
    key: 'action',
    value: 'action',
    fixed: 'right',
    width: 150,
    scopedSlots: { customRender: 'action' }
  }
]
