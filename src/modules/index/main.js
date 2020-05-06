import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
  api,
  fetch,
  post,
  put,
  del
} from '../../common/api.js'
// 引入Element组件库
import {
  MessageBox,
  Message
} from 'element-ui'
import '../../plugins/element.js'
// 引入字体图标
import '../../assets/fonts/iconfont.css'
// 引入全局样式
import '../../assets/css/global.css'

// 请求拦截
api.interceptors.request.use(config => {
    // 给headers添加Token验证的Authorization字段
    config.headers.common['authorization'] = window.sessionStorage.getItem('userToken')
    return config
  },
  err => {
    return Promise.resolve(err)
  })

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log('响应拦截错误', error.response)
    const res = error.response
    if (res.status === 401) {
      Message.error('登录已失效')
      window.sessionStorage.clear()
      router.push('/login')
    }
    if (res.status === 500) {
      // 服务器维护
      Message.error(res.msg)
    }
    console.log('err', error.data)
    return Promise.reject(error)
  }
)

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
