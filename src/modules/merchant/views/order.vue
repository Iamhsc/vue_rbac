<template>
  <el-card>
    <el-table :data="orderlist" v-loading="getOrdersLoading" stripe style="width: 100%">
      <el-table-column prop="order_number" label="订单号" align="center"></el-table-column>
      <el-table-column prop="create_time" label="提交时间" align="center"></el-table-column>
      <el-table-column prop="user_name" label="收货人" align="center"></el-table-column>
      <el-table-column prop="options" label="打印参数">
        <template v-slot="{row}">
          <div>份数：{{row.options.number}}</div>
          <div>规格：{{row.options.paper}} {{row.options.sided}} {{row.options.color}}</div>
          <div>页面：{{row.options.page}} </div>
        </template>
      </el-table-column>
      <el-table-column prop="m_address" label="文件" align="center">
        <template v-slot="{row}">
          <div v-for="item in row.files" :key="item.index">
            <a v-if="row.order_status == 1 || row.order_status == 4 || row.order_status == 5" href="#">{{item.file_name}}</a>
            <a v-else :download="item.file_name" @click="downloadFile(row.id)" :href="item.file_url">{{item.file_name}}</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="total_price" label="订单金额" align="center"></el-table-column>
      <el-table-column prop="order_status" label="订单状态" align="center">
        <template v-slot="{row}">
          <span v-if="row.order_status == 1" style="color: #31B0D5;">已提交</span>
          <span v-else-if="row.order_status == 2" style="color: #9A6E3A;">已支付</span>
          <span v-else-if="row.order_status == 3" style="color: #777777;">打印中</span>
          <span v-else-if="row.order_status == 4" style="color: #3E8F3E;">已完成</span>
          <span v-else-if="row.order_status == 5" style="color: #737373;">已取消</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" align="center">
        <template v-slot="{row}">
          <el-button type="primary" @click="goToDetails(row.id)" icon="el-icon-view" size="mini" />
          <el-button type="danger" @click="delOrder(row)" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        orderlist: [],
        getOrdersLoading: false
      }
    },
    created() {
      this.getMerchantOrderList()
    },
    methods: {
      getMerchantOrderList() {
        this.getOrdersLoading = true
        this.$get('/merchant/order').then(
          res => {
            this.getOrdersLoading = false
            this.orderlist = res.data
            console.log('订单列表', res.data)
          }).catch(err => {
          console.log(err)
        })
      },
      goToDetails(id) {
        this.$router.replace({
          path: '/order_details',
          query: {
            id: id,
            m: 'merchant'
          }
        }).catch(err => {
          console.log('all good', err)
        })
      },
      downloadFile(id) {
        this.$put('/merchant/order/' + id, {
          'order_status': 3
        }).then(
          res => {
            if (res.code !== 200) {
              return this.$message.error(res.msg)
            }
            this.getMerchantOrderList()
          }).catch(err => {
          console.log(err)
        })
      },
      delOrder(info) {
        if (info.order_status === 4 || info.order_status === 5) {
          this.$confirm('永久删除该订单, 是否继续?', '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$put('/merchant/order/' + info.id, {
              'delete_for_merchant': 1
            }).then(
              res => {
                if (res.code !== 200) {
                  return this.$message.error(res.msg)
                }
                this.getMerchantOrderList()
              }).catch(err => {
              console.log(err)
            })
          }).catch((e) => {
            console.log(e)
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          return this.$message.error('正在进行中的订单不能删除')
        }
      }
    }
  }
</script>

<style>
</style>
