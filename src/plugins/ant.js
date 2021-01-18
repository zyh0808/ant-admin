import Vue from 'vue'
import { Button, message, Layout, Menu, Icon, Tabs, Form, Input} from 'ant-design-vue'

Vue.use(Button).use(Layout).use(Menu).use(Icon).use(Tabs).use(Form).use(Input)
Vue.prototype.$message = message