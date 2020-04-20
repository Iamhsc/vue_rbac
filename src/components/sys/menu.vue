<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <!-- gutter:列与列之间间隙 -->
        <el-col :span="8">
          <el-input placeholder="请输入菜单名" v-model="queryInfo.query" clearable @clear="getMenuList">
            <el-button slot="append" icon="el-icon-search" @click="getMenuList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showDialog(null)">添加菜单</el-button>
        </el-col>
      </el-row>
      <!-- 菜单列表 -->
      <el-table v-loading="getMenuListLoading" :data="menulist" row-key="id" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="菜单名" prop="title" header-align="center"></el-table-column>
        <el-table-column label="图标" width="80px" align="center" :cell-style="{'vertical-align':'top'}">
          <template v-slot="{row}">
            <i :class="row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column label="控制" prop="ctrl" align="center"></el-table-column>
        <el-table-column label="方法" prop="action" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" align="center"></el-table-column>
        <el-table-column label="更新时间" prop="update_time" align="center"></el-table-column>
        <el-table-column label="菜单显示" width="100px" align="center">
          <template v-slot="{row}">
            <el-switch @change="menuStatusChanged(row)" :active-value="1" :inactive-value="0" v-model="row.status"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px" align="center">
          <template v-slot="{row}">
            <el-button type="primary" @click="showDialog(row)" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" @click="delMenu(row.id)" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加\编辑菜单对话框 -->
    <el-dialog :title="dialogTitle" width="500px" ref="dialog" :visible.sync="dialogVisible" @close="dialogClose">
      <el-form :model="menuInfoRorm" :rules="menuInfoRormRules" ref="menuInfoRormRef" label-width="100px">
        <el-form-item label="上级菜单" prop="name">
          <el-select v-model="menuInfoRorm.pid" placeholder="请选择">
            <el-option label="作为顶级菜单" :value="0">
              <el-select v-model="menuInfoRorm.pid" placeholder="请选择">
                <el-option label="作为1级菜单" :value="0"></el-option>
              </el-select>
            </el-option>
            <el-option v-for="item in menulist" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuInfoRorm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单简介" prop="intro">
          <el-input v-model="menuInfoRorm.intro" type="intro"></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="status">
          <el-radio v-model="menuInfoRorm.status" label='1'>启用</el-radio>
          <el-radio v-model="menuInfoRorm.status" label='0'>禁用</el-radio>
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
  export default {
    data() {
      return {
        // 获取菜单列表请求参数
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        // 添加菜单表单参数
        menuInfoRorm: {
          name: '',
          intro: '',
          status: '1'
        },
        // 添加菜单表单验证规则
        menuInfoRormRules: {
          name: [{
              required: true,
              message: '请输入菜单名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur'
            }
          ]
        },
        menulist: [], // 菜单列表
        total: 0, // 获取数据总条数
        dialogTitle: '', // dialog标题
        getMenuListLoading: false, // 获取菜单集合动画
        dialogVisible: false // 弹窗是否开启
      }
    },
    created() {
      this.getMenuList()
    },
    methods: {
      // 提交表单
      submitForm() {
        console.log('ok', this)
        // 验证表单成功后才提交
        this.$refs.menuInfoRormRef.validate(async valid => {
          // 验证不成功直接return
          if (!valid) return
          this.$post('menu', this.menuInfoRorm).then(
            res => {
              console.log(res)
              if (res.code === 0) return this.$message.error(res.msg)
              this.$message.success(res.msg)
              this.dialogVisible = false
              this.getMenuList()
            }).catch(err => {
            console.log(err)
          })
        })
      },

      // 删除菜单
      delMenu(id) {
        this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('ssss')
          this.$del('menu/' + id).then(
            res => {
              console.log(res)
              if (res.code === 0) return this.$message.error(res.msg)
              this.$message.success(res.msg)
              this.getMenuList()
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

      // 获取菜单列表
      getMenuList() {
        this.getMenuListLoading = true
        this.$get('menu', {
          params: this.queryInfo
        }).then(
          res => {
            this.menulist = res.data
            this.getMenuListLoading = false
            console.log('菜单列表', res.data)
          }).catch(err => {
          console.log(err)
        })
      },

      // 监听每页条数改变事件
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getMenuList()
      },
      // 监听页数改变事件
      handleCurrentChange(newPage) {
        console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getMenuList()
      },

      showDialog(e) {
        if (e === null || e === undefined) {
          this.dialogTitle = '添加菜单'
        } else {
          this.dialogTitle = '编辑菜单'
          this.menuInfoRorm.id = e.id
          this.menuInfoRorm.name = e.name
          this.menuInfoRorm.intro = e.intro
          this.menuInfoRorm.status = e.status + ''
        }
        this.dialogVisible = true
      },
      // 关闭添加菜单表单事件
      dialogClose() {
        this.$refs.menuInfoRormRef.resetFields()
        this.menuInfoRorm = {
          name: '',
          intro: '',
          status: '1'
        }
      },
      // 监听状态按钮修改事件
      menuStatusChanged(info) {
        this.$put('menu/' + info.id, {
          'status': info.status
        }).then(
          res => {
            console.log('更新状态', res)
            if (res.code !== 200) {
              info.status = !info.status
              return this.$message.error('状态更新失败')
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
