import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入字体图标
import './assets/fonts/iconfont.css'
// 引入全局样式
import './assets/css/global.css'
import { fetch, post, put, del } from './common/api'
import { MessageBox } from 'element-ui'
// import axios from 'axios'
// // 配置请求根路径
// axios.defaults.baseURL = 'http://local.api.com/admin.php/v1/'
// // axios请求拦截
// axios.interceptors.request.use(config => {
//   // 给headers添加Token验证的Authorization字段
//   config.headers.common['authorization'] = window.sessionStorage.getItem('token')
//   return config
// },
// err => {
//   return Promise.resolve(err)
// })

// Vue.prototype.$http = axios

Vue.prototype.$get = fetch
Vue.prototype.$post = post
Vue.prototype.$put = put
Vue.prototype.$del = del
Vue.prototype.$confirm = MessageBox
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
