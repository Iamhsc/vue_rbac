<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>商户管理</el-breadcrumb-item>
      <el-breadcrumb-item>商户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <!-- gutter:列与列之间间隙 -->
        <el-col :span="8">
          <el-input placeholder="请输入登录名" v-model="queryInfo.query" clearable @clear="getmerchantList">
            <el-button slot="append" icon="el-icon-search" @click="getmerchantList" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog(null)">添加商户</el-button>
        </el-col>
      </el-row>
      <!-- 商户列表 -->
      <el-table v-loading="getMerchantListLoading" :data="merchantList" ref="merchantListRef" border stripe
        :row-class-name="rowIndex">
        <el-table-column label="#" type="index" />
        <el-table-column label="登录名" prop="m_login_name" />
        <el-table-column label="店铺名" prop="m_name" />
        <el-table-column label="地址" prop="m_address" />
        <el-table-column label="电话" prop="m_tel" />
        <el-table-column label="状态" width="63px">
          <template v-slot="{row}">
            <el-switch @change="merchantStatusChanged(row)" :active-value="1" :inactive-value="0" v-model="row.m_status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="{row}">
            <el-button type="primary" @click="showDialog(row)" icon="el-icon-edit" size="mini" />
            <el-button type="danger" @click="delMerchant(row.id)" icon="el-icon-delete" size="mini" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination :hide-on-single-page="total / queryInfo.pagesize < 2" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[8, 30, 50, 100]"
          :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" />
      </div>
    </el-card>
    <!-- 添加\编辑商户对话框 -->
    <el-dialog :title="dialogTitle" width="500px" ref="dialog" :visible.sync="dialogVisible" @close="dialogClose">
      <el-form :model="merchantInfoForm" :rules="merchantInfoFormRules" ref="merchantInfoFormRef" label-width="100px">
        <el-form-item label="电话" prop="m_tel">
          <el-input v-model="merchantInfoForm.m_tel" />
        </el-form-item>
        <el-form-item label="店铺名" prop="m_name">
          <el-input v-model="merchantInfoForm.m_name" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="merchantInfoForm.password" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  let formRule = require('../../common/form_rules.js')
  export default {
    data() {
      return {
        // 获取商户列表请求参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 8
        },
        // 添加商户表单参数
        merchantInfoForm: {
          m_tel: '',
          m_name: '',
          password: ''
        },
        // 添加商户表单验证规则
        merchantInfoFormRules: {
          m_tel: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: formRule.checkMobile,
              trigger: 'blur'
            }
          ],
          m_name: [{
            required: true,
            message: '请输入店铺名',
            trigger: 'blur'
          }]
        },
        merchantList: [], // 商户列表
        total: 0, // 获取数据总条数
        dialogTitle: '', // dialog标题
        getMerchantListLoading: false, // 获取商户集合加载动画
        dialogVisible: false // 添加弹窗是否开启
      }
    },
    created() {
      this.getmerchantList()
    },
    methods: {
      // 获取商户列表
      getmerchantList() {
        this.getMerchantListLoading = true
        this.$get('merchant', {
          params: this.queryInfo
        }).then(
          res => {
            this.merchantList = res.data.data
            this.total = res.data.count
            this.getMerchantListLoading = false
            console.log('商户列表', res.data)
          }).catch(err => {
          console.log(err)
        })
      },

      method() {
        return this.merchantInfoForm.id ? this.$put : this.$post
      },
      // 提交表单
      submitForm() {
        console.log('ok', this)
        // 验证表单成功后才提交
        this.$refs.merchantInfoFormRef.validate(async valid => {
          // 验证不成功直接return
          if (!valid) return
          let id = this.merchantInfoForm.id ? '/' + this.merchantInfoForm.id : ''
          this.method()('merchant' + id, this.merchantInfoForm).then(
            res => {
              console.log(res)
              if (res.code === 0) return this.$message.error(res.msg)
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getmerchantList()
            }).catch(err => {
            console.log(err)
          })
        })
      },

      // 删除商户
      delMerchant(id) {
        this.$confirm('永久删除该商户, 是否继续?', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('ssss')
          this.$del('merchant/' + id).then(
            res => {
              console.log(res)
              if (res.code === 0) return this.$message.error(res.msg)
              this.$message.success(res.msg)
              this.getmerchantList()
            }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      // 监听每页条数改变事件
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getmerchantList()
      },
      // 监听页数改变事件
      handleCurrentChange(newPage) {
        console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getmerchantList()
      },

      showDialog(e) {
        if (!e) {
          this.dialogTitle = '添加商户'
          this.merchantInfoFormRules.password = [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 16,
              message: '长度在 6 到 16 个字符',
              trigger: 'blur'
            }
          ]
        } else {
          this.dialogTitle = '编辑商户'
          this.merchantInfoForm = e
          delete this.merchantInfoFormRules.password
        }
        this.dialogVisible = true
      },
      // 关闭添加商户表单事件
      dialogClose() {
        this.$refs.merchantInfoFormRef.resetFields()
        this.merchantInfoForm = {
          m_tel: '',
          m_name: '',
          password: ''
        }
      },

      // 把数据表每行index 放到row
      rowIndex({
        row,
        rowIndex
      }) {
        row.rowIndex = rowIndex
      },
      // 监听状态按钮修改事件
      merchantStatusChanged(info) {
        this.$put('merchant/' + info.id, {
          'm_status': info.m_status
        }).then(
          res => {
            if (res.code !== 200) {
              this.merchantList[info.rowIndex].m_status = 1 - info.m_status
              return this.$message.error(res.msg)
            }
            this.$message.success(res.msg)
          }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  body {
    margin: 0;
  }

  .el-table {
    margin-top: 10px;
  }

  .pagination {
    margin-top: 15px;
  }
</style>
