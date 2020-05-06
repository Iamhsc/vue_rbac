<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <!-- gutter:列与列之间间隙 -->
        <el-col :span="8">
          <el-input placeholder="请输入登录名" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog(null)">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table v-loading="getUserListLoading" :data="userList" ref="userListRef" border stripe :row-class-name="rowIndex">
        <el-table-column label="#" type="index" />
        <el-table-column label="登录名" prop="user_name" />
        <el-table-column label="手机号" prop="user_tel" />
        <el-table-column label="地址" prop="user_address" />
        <el-table-column label="状态" width="63px">
          <template v-slot="{row}">
            <el-switch @change="userStatusChanged(row)" :active-value="1" :inactive-value="0" v-model="row.user_status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" />
        <el-table-column label="操作"  width="130px" align="center">
          <template v-slot="{row}">
            <el-button type="primary" @click="showDialog(row)" icon="el-icon-edit" size="mini" />
            <el-button type="danger" @click="delUser(row.id)" icon="el-icon-delete" size="mini" />
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
    <!-- 添加\编辑用户对话框 -->
    <el-dialog :title="dialogTitle" width="500px" ref="dialog" :visible.sync="dialogVisible" @close="dialogClose">
      <el-form :model="userInfoForm" :rules="userInfoFormRules" ref="userInfoFormRef" label-width="100px">
        <el-form-item label="手机号" prop="user_tel">
          <el-input v-model="userInfoForm.user_tel" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="userInfoForm.password" type="password" />
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
    </el-dialog>
  </div>
</template>

<script>
  let formRule = require('../../../../common/form_rules.js')
  export default {
    data() {
      return {
        // 获取用户列表请求参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 8
        },
        // 添加用户表单参数
        userInfoForm: {
          user_tel: '',
          password: ''
        },
        // 添加用户表单验证规则
        userInfoFormRules: {
          user_tel: [{
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              validator: formRule.checkMobile,
              trigger: 'blur'
            }
          ]
        },
        userList: [], // 用户列表
        total: 0, // 获取数据总条数
        dialogTitle: '', // dialog标题
        getUserListLoading: false, // 获取用户集合加载动画
        dialogVisible: false // 添加弹窗是否开启
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      // 获取用户列表
      getUserList() {
        this.getUserListLoading = true
        this.$get('/admin/v1/user', {
          params: this.queryInfo
        }).then(
          res => {
            this.userList = res.data.data
            this.total = res.data.count
            this.getUserListLoading = false
            console.log('用户列表', res.data)
          }).catch(err => {
          console.log(err)
        })
      },

      method() {
        return this.userInfoForm.id ? this.$put : this.$post
      },
      // 提交表单
      submitForm() {
        console.log('ok', this)
        // 验证表单成功后才提交
        this.$refs.userInfoFormRef.validate(async valid => {
          // 验证不成功直接return
          if (!valid) return
          let id = this.userInfoForm.id ? '/' + this.userInfoForm.id : ''
          this.method()('/admin/v1/user' + id, this.userInfoForm).then(
            res => {
              console.log(res)
              if (res.code === 0) return this.$message.error(res.msg)
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getUserList()
            }).catch(err => {
            console.log(err)
          })
        })
      },

      // 删除用户
      delUser(id) {
        this.$confirm('此操作将永久删除该管理, 是否继续?', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('ssss')
          this.$del('/admin/v1/user/' + id).then(
            res => {
              console.log(res)
              if (res.code === 0) return this.$message.error(res.msg)
              this.$message.success(res.msg)
              this.getUserList()
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
        this.getUserList()
      },
      // 监听页数改变事件
      handleCurrentChange(newPage) {
        console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },

      showDialog(e) {
        if (!e) {
          this.dialogTitle = '添加用户'
          this.userInfoFormRules.password = [{
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
          this.dialogTitle = '编辑用户'
          this.userInfoForm = e
          delete this.userInfoForm.create_time
          delete this.userInfoFormRules.password
        }
        this.dialogVisible = true
      },
      // 关闭添加用户表单事件
      dialogClose() {
        this.$refs.userInfoFormRef.resetFields()
        this.userInfoForm = {
          user_tel: '',
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
      userStatusChanged(info) {
        this.$put('/admin/v1/user/' + info.id, {
          'user_status': info.user_status
        }).then(
          res => {
            if (res.code !== 200) {
              this.userList[info.rowIndex].user_status = 1 - info.user_status
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
