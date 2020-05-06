<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../../../assets/logo.png" alt="头像">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-member" placeholder="请输入用户名或邮箱" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">
            登录
          </el-button>
          <el-button type="info" @click="resetLoginRorm">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: 'admin'
        },
        loginRules: {
          username: [{
              required: true,
              message: '请输入用户名或邮箱',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 11,
              message: '长度在 2 到 11 个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 5,
              max: 16,
              message: '长度在 5 到 16 个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
		created() {
			console.log('this.$route.path', this.$route.path)
		},
    methods: {
      resetLoginRorm() {
        console.log(this)
        this.$refs.loginFormRef.resetFields()
      },
      login() {
        // 验证表单成功后才提交
        this.$refs.loginFormRef.validate(async valid => {
          // 验证不成功直接return
          if (!valid) return
          // 提交表单拿到响应数据res
          this.$post('/index/login', this.loginForm).then(
            res => {
              console.log(res)
              if (res.code !== 200) return this.$message.error(res.msg)
              // 提示消息
              this.$message.success(res.msg)
              // 登录成功后将token保存到客户端的sessionStorage中
              window.sessionStorage.setItem('userToken', res.data.token)
              window.sessionStorage.setItem('userInfo', JSON.stringify(res.data.info))
              // 跳转到后台主页，路由地址是/home
              this.$router.push('/home')
            }).catch(err => {
            console.log(err)
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login-container {
    height: 100%;
    background-color: #2b4b6b;
  }

  .login-box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar-box {
      height: 130px;
      width: 130px;
      border: 1px solid #111;
      border-radius: 50%;
      padding: 5px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        background-color: #eee;
      }
    }

    .btns {
      display: flex;
      justify-content: flex-end;
    }

    .login-form {
      padding: 20px;
      width: 100%;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
    }
  }
</style>
