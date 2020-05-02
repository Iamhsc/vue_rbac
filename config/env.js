// 根据不同的环境更改不同的baseUrl
let baseUrl = 'http://local.printing.com/admin/v1/'

// if (process.env.NODE_ENV === 'development') {
//   baseUrl = '/api';

// } else if (process.env.NODE_EsNV === 'production') {
//   // baseUrl = '测试地址';
//   // baseUrl = '预发布地址';
//   baseUrl = 'http://local.api.com/admin.php/v1/'
// }

export {
  baseUrl
}
