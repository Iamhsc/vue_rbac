import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import option from '../views/option.vue'
import order from '../views/order.vue'
import orderDetails from '../../../compoents/order_details.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: 'order'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: 'order',
    children: [{
        path: '/option',
        component: option
      },
      {
        path: '/order',
        component: order
      },
      {
        path: '/order_details',
        component: orderDetails
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫控制访问权限
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next 放行函数
  // next()表示放行; next('/login')表示强制跳转 && to.path !== '/'
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('merchantToken')
  if (!tokenStr) return next('/login')
  next()
})

export default router
