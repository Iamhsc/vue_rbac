<template>
  <el-container>
    <el-header>
      <div>
        <span style="color: #BFCBD9;">个人中心</span>
      </div>
      <el-dropdown @command="handleCommand">
        <span style="color: #B3D4FC; font-weight: bold;">
          libai<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">
            个人信息修改
          </el-dropdown-item>
          <el-dropdown-item command="2">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-card>
      <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">信息管理</el-menu-item>
        <el-menu-item index="3">新建打印</el-menu-item>
        <el-menu-item index="4">订单管理</a></el-menu-item>
      </el-menu>
    </el-card>
    <el-container>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view />
      </el-main>
      <!-- 底部 -->
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case '1':
            this.dialogVisible = true
            break
          case '2':
            this.logout()
            break
        }
      },
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #0077AA;
    display: flex;
    justify-content: space-between;
    padding-left: 3px;
    align-items: center;
    font-size: 20px;

    >div {
      display: flex;
      align-items: center;

      img {
        width: 35px;
        height: 35px;
      }

      span {
        margin-left: 10px;
      }
    }
  }
</style>
