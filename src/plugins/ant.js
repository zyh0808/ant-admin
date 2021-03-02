import Vue from 'vue'
import {
  Button, message, Layout, Menu, Icon, Tabs, Form, Input, Row, Col, Modal,
  Table, Popconfirm, TreeSelect, FormModel, Checkbox, DatePicker, Upload, Dropdown,
  Avatar, Space, Tooltip, Breadcrumb,
  PageHeader, AutoComplete, List, Spin, Switch, Divider, InputNumber, Pagination, ConfigProvider, Card
} from 'ant-design-vue'

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)

Vue.use(Button).use(Layout).use(Menu).use(Icon)
  .use(Tabs).use(Form).use(Input).use(Row)
  .use(Col).use(Table).use(Popconfirm).use(TreeSelect)
  .use(FormModel).use(Checkbox).use(DatePicker).use(Upload).use(Modal)
  .use(Dropdown).use(Avatar).use(Space).use(Tooltip).use(Breadcrumb)
  .use(PageHeader).use(AutoComplete).use(List).use(Spin).use(Switch)
  .use(Divider).use(InputNumber).use(Pagination).use(ConfigProvider)
  .use(Card)
Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm