<template>
  <el-card>
    <h1>订单详情</h1>
    <el-table :data="tableData" :show-header="false" v-loading="Loading" stripe style="width: 100%">
      <el-table-column prop="orderkey" label="" align="right" width="100px">
      </el-table-column>
      <el-table-column prop="ordervalue" label="">
      </el-table-column>
    </el-table>
    <el-button type="primary" style="margin-top: 15px;" @click="back">返回</el-button>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        orderId: 0,
        tableData: [],
        Loading: false
      };
    },
    created() {
      this.orderId = this.$route.query.id
      this.module = this.$route.query.m
      this.$api.headers = {
        'authorization': window.sessionStorage.getItem(this.module + 'Token')
      }
      this.getOrderDetails()
    },
    methods: {
      getOrderDetails() {
        let m
        if (this.module == 'user') {
          m = 'index'
        } else {
          m = 'merchant'
        }

        this.Loading = true
        this.$get('/' + m + '/order_details/' + this.orderId).then(
          res => {
            this.Loading = false
            this.setData(res.data)
          }).catch(err => {
          console.log(err)
        })
      },

      back() {
        this.$router.replace({
          path: '/order'
        }).catch(err => {
          console.log('all good', err)
        })
      },

      setData(data) {
        let strfile = ''
        for (let i = 0; i < data.files.length; i++) {
          strfile += data.files[i].file_name + "\n"
        }
        this.tableData = [{
          orderkey: '订单号：',
          ordervalue: data.order_number
        }, {
          orderkey: '提交时间：',
          ordervalue: data.create_time
        }, {
          orderkey: '更新时间：',
          ordervalue: data.update_time
        }, {
          orderkey: '订单状态：',
          ordervalue: data.order_status == 1 ? '已提交' : data.order_status == 2 ? '已支付' : data.order_status == 3 ?
            '打印中' : data.order_status == 4 ? '已完成' :  '已取消'
        }, {
          orderkey: '订单金额：',
          ordervalue: data.total_price + ' 元'
        }, {
          orderkey: '商铺名称：',
          ordervalue: data.m_name
        }, {
          orderkey: '客户名称：',
          ordervalue: data.user_name
        }, {
          orderkey: '打印参数：',
          ordervalue: '份数：' + data.options.number + 'ㅤㅤ页码：' + data.options.page + 'ㅤㅤ规格：' + data.options.paper +
            ' ' + data.options.color +
            ' ' + data.options.sided
        }, {
          orderkey: '文件：',
          ordervalue: strfile
        }]
        console.log('this.tableData', this.tableData)
      }
    }
  }
</script>

<style lang="scss">
</style>
