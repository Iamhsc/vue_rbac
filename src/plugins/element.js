import Vue from 'vue'
// 按需导入element-ui
import {
  Button,
  Form,
  FormItem,
  Input,
  Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
