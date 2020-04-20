<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="logo" />
        <span>后台管理系统</span>
      </div>
      <el-button type="infor" @click="logout">logout</el-button>
    </el-header>
    <!-- 页面主题 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-btn" @click="toggleCollapse">☰</div>
        <el-menu router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#708090"
          text-color="#fff" active-text-color="red" :collapse="isCollapse" :collapse-transition="false">

          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.ctrl" v-for="subItem in item.children" :key="subItem.id">
              <i :class="subItem.icon"></i>
              <span>{{subItem.title}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区 -->
      <el-container :style="'height:'+ windowHeight + 'px;'">
        <!-- 右侧内容 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
        <!-- 底部 -->
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        windowHeight: `${document.documentElement.clientHeight}` - 60,
        menuList: [],
        isCollapse: false
      }
    },
    created() {
      this.getMenuList()
      console.log(this.windowHeight)
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      getMenuList() {
        let menuStr = window.sessionStorage.getItem('managementMenu')
        if (menuStr) {
          this.menuList = JSON.parse(menuStr)
          return
        }
        this.$get('auth').then(
          res => {
            console.log('res', res)
            if (res.code !== 200) return this.$message.error(res.data.msg)
            this.menuList = res.data
            window.sessionStorage.setItem('managementMenu', JSON.stringify(res.data))
          }).catch(err => {
          console.log(err)
        })
      },
      // 菜单折叠
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
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

  .el-aside {
    background: #708090;

    .toggle-btn {
      background-color: #404040;
      color: #fefefe;
      font-size: 15px;
      line-height: 24px;
      text-align: center;
      cursor: pointer;
    }

    .el-menu {
      border-right: 0;
    }
  }

  .el-main {
    background-color: #EAedf1;
  }

  .el-footer {
    background-color: #666666;
  }
</style>
