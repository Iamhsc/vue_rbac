// 手机号验证规则L
let checkMobile = (rule, value, callback) => {
  if (!(/^1[3456789]\d{9}$/.test(value))) {
    return callback(new Error('请输入合法的手机号'))
  }
  return callback()
}
// 邮箱验证规则
let checkEmail = (rule, value, callback) => {
  if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(value))) {
    return callback(new Error('请输入合法的邮箱'))
  }
  return callback()
}

export { checkMobile, checkEmail }
