import Vue from 'vue'
import {
  Button, message, Layout, Menu, Icon, Tabs, Form, Input, Row, Col, Modal,
  Table
} from 'ant-design-vue'

Vue.use(Button).use(Layout).use(Menu).use(Icon)
  .use(Tabs).use(Form).use(Input).use(Row)
  .use(Col).use(Table)
Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm