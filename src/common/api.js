import axios from 'axios'
import router from '@/router'
import {
  baseUrl
} from '../../config/env'
import {
  Message
} from 'element-ui'

// 创建axios实例
const api = axios.create({
  baseURL: baseUrl, // api的base_url
  timeout: 15000 // 请求超时时间
})

// 请求拦截
api.interceptors.request.use(config => {
    // 给headers添加Token验证的Authorization字段
    config.headers.common['authorization'] = window.sessionStorage.getItem('token')
    return config
  },
  err => {
    return Promise.resolve(err)
  })

// 响应拦截器
api.interceptors.response.use(
  response => {
    console.log('响应拦截', response)
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
    console.log('err', error)
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    api.get(url, params)
      .then(response => {
        resolve(response)
      })
      .catch((e) => {
        console.log('promise catch err', e)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    api.post(url, data)
      .then(response => {
        resolve(response)
      }).catch(reject => {
        reject(reject)
        console.log(reject)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    api.put(url, data)
      .then(response => {
        resolve(response)
      }).catch(reject => {
        reject(reject)
        console.log(reject)
      })
  })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del(url) {
  return new Promise((resolve, reject) => {
    api.delete(url)
      .then(response => {
        resolve(response)
      }).catch(reject => {
        reject(reject)
        console.log(reject)
      })
  })
}
