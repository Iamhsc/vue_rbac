<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <!-- gutter:列与列之间间隙 -->
        <el-col :span="8">
          <el-input placeholder="请输入登录名" v-model="queryInfo.query" clearable @clear="getAdminList">
            <el-button slot="append" icon="el-icon-search" @click="getAdminList" />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog(null)">
            添加管理员
          </el-button>
        </el-col>
      </el-row>
      <!-- 管理员列表 -->
      <el-table v-loading="getAdminListLoading" :data="adminlist" ref="adminListRef" border stripe :row-class-name="rowIndex">
        <el-table-column label="#" type="index" />
        <el-table-column label="登录名" prop="admin_name" />
        <el-table-column label="角色" prop="role_name" />
        <el-table-column label="手机号" prop="mobile" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="状态" width="63px">
          <template v-slot="{row}">
            <el-switch @change="adminStatusChanged(row)" :active-value="1" :inactive-value="0" v-model="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="上次登录IP" prop="last_login_ip" />
        <el-table-column label="上次登录时间" prop="last_login_time" />
        <el-table-column label="操作"  width="130px" align="center">
          <template v-slot="{row}">
            <el-button type="primary" @click="showDialog(row)" icon="el-icon-edit" size="mini" />
            <el-button type="danger" @click="delAdmin(row.id)" icon="el-icon-delete" size="mini" />
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
    <!-- 添加\编辑管理员对话框 -->
    <el-dialog :title="dialogTitle" width="500px" ref="dialog" :visible.sync="dialogVisible" @close="dialogClose">
      <el-form :model="adminInfoRorm" :rules="adminInfoRormRules" ref="adminInfoRormRef" label-width="100px">
        <el-form-item label="登录名称" prop="admin_name">
          <el-input v-model="adminInfoRorm.admin_name" />
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="adminInfoRorm.password" type="password" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="adminInfoRorm.mobile" />
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="adminInfoRorm.role_id" :loading="getRoleListLoading" @focus="getRoleList" placeholder="请选择">
            <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
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
      // 表单规则
      var formRules = {
        admin_name: [{
            required: true,
            message: '请输入登录名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        mobile: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            validator: formRule.checkMobile,
            trigger: 'blur'
          }
        ],
        email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: formRule.checkEmail,
            trigger: 'blur'
          }
        ]
      }

      return {
        // 获取管理员列表请求参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 8
        },
        // 添加管理员表单参数
        adminInfoRorm: {
          admin_name: '',
          password: '',
          mobile: '',
          role_id: ''
        },
        // 添加管理员表单验证规则
        adminInfoRormRules: {
          admin_name: formRules.admin_name,
          password: formRules.password,
          mobile: formRules.mobile
        },
        adminlist: [], // 管理员列表
        rolelist: [], // 角色列表
        total: 0, // 获取数据总条数
        dialogTitle: '', // dialog标题
        getAdminListLoading: false, // 获取管理员集合加载动画
        getRoleListLoading: false, // 获取角色集合动画
        dialogVisible: false // 添加弹窗是否开启
      }
    },
    created() {
      this.getAdminList()
    },
    methods: {
      // 获取管理员列表
      getAdminList() {
        this.getAdminListLoading = true
        this.$get('/admin/v1/admin', {
          params: this.queryInfo
        }).then(
          res => {
            this.adminlist = res.data.data
            this.total = res.data.count
            this.getAdminListLoading = false
            console.log('管理员列表', res.data)
          }).catch(err => {
          console.log(err)
        })
      },

      method() {
        return this.adminInfoRorm.id ? this.$put : this.$post
      },
      // 提交表单
      submitForm() {
        console.log('ok', this)
        // 验证表单成功后才提交
        this.$refs.adminInfoRormRef.validate(async valid => {
          // 验证不成功直接return
          if (!valid) return
          let id = this.adminInfoRorm.id ? '/' + this.adminInfoRorm.id : ''
          this.method()('/admin/v1/admin' + id, this.adminInfoRorm).then(
            res => {
              console.log(res)
              if (res.code === 0) return this.$message.error(res.msg)
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getAdminList()
            }).catch(err => {
            console.log(err)
          })
        })
      },

      // 删除管理员
      delAdmin(id) {
        this.$confirm('此操作将永久删除该管理, 是否继续?', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('ssss')
          this.$del('/admin/v1/admin/' + id).then(
            res => {
              console.log(res)
              if (res.code === 0) return this.$message.error(res.msg)
              this.$message.success(res.msg)
              this.getAdminList()
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

      // 获取角色列表
      getRoleList() {
        this.getRoleListLoading = true
        this.$get('/admin/v1/role').then(
          res => {
            this.rolelist = res.data.data
            this.getRoleListLoading = false
            console.log('角色列表', res.data.data)
          }).catch(err => {
          console.log(err)
        })
      },

      // 监听每页条数改变事件
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getAdminList()
      },
      // 监听页数改变事件
      handleCurrentChange(newPage) {
        console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getAdminList()
      },

      showDialog(e) {
        if (e === null || e === undefined) {
          this.dialogTitle = '添加管理员'
          this.adminInfoRormRules.password = [{
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
          if (this.rolelist.length === 0) this.getRoleList()
          this.dialogTitle = '编辑管理员'
          this.adminInfoRorm = e
          this.adminInfoRormRules.password = []
        }
        this.dialogVisible = true
      },
      // 关闭添加管理员表单事件
      dialogClose() {
        this.$refs.adminInfoRormRef.resetFields()
        this.adminInfoRorm = {
          admin_name: '',
          password: '',
          mobile: '',
          role_id: ''
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
      adminStatusChanged(info) {
        this.$put('/admin/v1/admin/' + info.id, {
          'status': info.status
        }).then(
          res => {
            if (res.code !== 200) {
              this.adminlist[info.rowIndex].status = 1 - info.status
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
