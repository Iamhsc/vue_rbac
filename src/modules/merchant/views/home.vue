<template>
  <el-container>
    <el-header>
      <div>
        <a href="/">
          <span style="color: #BFCBD9;">BAIYUNYIN</span>
        </a>
      </div>
      <el-dropdown @command="handleCommand">
        <span style="color: #B3D4FC; font-weight: bold;">
          {{merchantInfo.name}}<i class="el-icon-arrow-down el-icon--right" />
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
      <el-dialog title="个人信息修改" width="500px" ref="dialog" :visible.sync="dialogVisible">
        <el-form :model="merchantInfo" ref="merchantInfoRef" label-width="100px">
          <el-form-item label="登录名称" prop="username">
            <el-input v-model="merchantInfo.username" readonly />
          </el-form-item>
          <el-form-item label="登录密码" prop="password">
            <el-input v-model="merchantInfo.password" type="password" placeholder="为空则不修改" />
          </el-form-item>
          <el-form-item label="手机号" prop="m_tel">
            <el-input v-model="merchantInfo.m_tel" />
          </el-form-item>
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="merchantInfo.name"/>
          </el-form-item>
          <!-- <el-form-item label="位置">
            <el-input v-model="merchantInfo.user_address" @focus="getLocation" suffix-icon="el-icon-location" />
          </el-form-item> -->
          <el-form-item label="店铺地址" prop="m_address">
            <el-input v-model="merchantInfo.m_address" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">
            取 消
          </el-button>
          <el-button type="primary" @click="submitForm">
            确 定
          </el-button>
        </div>
        <div slot="footer">
          <el-dialog title="定位" width="600px" append-to-body :visible.sync="mapDialogVisible">
            <div slot="footer">
              <div id="LocationDialog" ref="LocationDialogRef" style="width:560px;height:460px;"></div>
            </div>
          </el-dialog>
        </div>
      </el-dialog>
    </el-header>
    <el-main>
      <div style="box-shadow: 0 0 10px #ddd;">
        <el-menu router :default-active="$route.path" class="el-menu-demo" mode="horizontal">
          <el-menu-item :key="3" index="/order">订单管理</a></el-menu-item>
          <el-menu-item :key="2" index="/option">价格设置</el-menu-item>
        </el-menu>
      </div>
      <div class="usercenter">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

<script>
  // import TMap from "TMap"
  export default {
    data() {
      return {
        center: {
          lng: 0,
          lat: 0
        },
        zoom: 11,
        merchantInfo: {},
        dialogVisible: false,
        mapDialogVisible: false
      };
    },
    mounted() {
      // this.initMap()
    },
    created() {
      let merchantInfo = window.sessionStorage.getItem('merchantInfo')
      this.merchantInfo = JSON.parse(merchantInfo)
    },
    methods: {
      //初始化地图
      initMap() {
        //定义地图中心点坐标
        var center = new TMap.LatLng(23.890311, 106.606790)
        //定义map变量，调用 TMap.Map() 构造函数创建地图
        var map = new TMap.Map(document.getElementById('LocationDialog'), {
          center: center, //设置地图中心点坐标
          zoom: 17.2, //设置地图缩放级别
          pitch: 45, //设置俯仰角
          rotation: 45 //设置地图旋转角度
        })
      },

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
      // getLocation() {
      //   console.log('打开地图', document.getElementById('LocationDialog'))
      //   this.mapDialogVisible = true
      // },
      submitForm() {
        this.$put('/merchant/my/' + this.merchantInfo.uid, this.merchantInfo).then(
          res => {
            console.log(res)
            if (res.code === 0) return this.$message.error(res.msg)
            this.$message.success(res.msg)
            window.sessionStorage.setItem('merchantInfo', JSON.stringify(this.merchantInfo))
            this.dialogVisible = false
            this.getAdminList()
          }).catch(err => {
          console.log(err)
        })
      },
      logout() {
        window.sessionStorage.clear()
        // this.$router.push('/login')
        this.$router.replace({
          path: '/login'
        }).catch(err => {
          console.log('all good')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-header {
    background: linear-gradient(to right, #40306B, #3E326D, #3D3670, #3B3A73, #3A3D76, #384079, #37437A, #36447C, #36467D, #35487F, #344980, #334B81, #324D83, #324E83);
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

  .usercenter {
    margin-top: 10px;
  }
</style>
