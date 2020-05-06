import axios from 'axios'

// 创建axios实例
export const api = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  withCredentials: true // 表示跨域请求时是否需要使用凭证
})

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
      .catch((reject) => {
        console.log(reject)
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
        console.log(reject)
      })
  })
}
