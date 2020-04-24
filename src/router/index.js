import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import index from '../components/index.vue'
import manage from '../components/admin/manage.vue'
import role from '../components/admin/role.vue'
import menu from '../components/sys/menu.vue'
import log from '../components/sys/log.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: 'index',
    children: [{
        path: '/index',
        component: index
      },
      {
        path: '/admin',
        component: manage
      },
      {
        path: '/role',
        component: role
      },
      {
        path: '/menu',
        component: menu
      },
      {
        path: '/log',
        component: log
      }
    ]
}]

const router = new VueRouter({
  routes
})

// 路由导航守卫控制访问权限
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转而来
  // next 放行函数
  // next()表示放行; next('/login')表示强制跳转
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
