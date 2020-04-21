<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">
				首页
			</el-breadcrumb-item>
			<el-breadcrumb-item>角色管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<el-row :gutter="20">
				<!-- gutter:列与列之间间隙 -->
				<el-col :span="8">
					<el-input placeholder="请输入角色名" v-model="queryInfo.query" clearable @clear="getRoleList">
						<el-button slot="append" icon="el-icon-search" @click="getRoleList" />
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="showDialog(null)">
						添加角色
					</el-button>
				</el-col>
			</el-row>
			<!-- 角色列表 -->
			<el-table v-loading="getRoleListLoading" :data="rolelist" border stripe>
				<el-table-column label="#" type="index" />
				<el-table-column label="角色名" prop="name" />
				<el-table-column label="角色简介" prop="intro" />
				<el-table-column label="创建时间" prop="create_time" />
				<el-table-column label="更新时间" prop="update_time" />
				<el-table-column label="状态" width="63px">
					<template v-slot="{row}">
						<el-switch @change="roleStatusChanged(row)" :active-value="1" :inactive-value="0" v-model="row.status" />
					</template>
				</el-table-column>
				<el-table-column label="操作" width="176px">
					<template v-slot="{row}">
						<el-button type="primary" @click="showDialog(row)" icon="el-icon-edit" size="mini" />
						<el-tooltip effect="dark" content="权限分配" :enterable="false" placement="top">
							<el-button type="warning" @click="showAssignAuthDialog(row.id)" icon="el-icon-s-tools" size="mini" />
						</el-tooltip>
						<el-button type="danger" @click="delRole(row.id)" icon="el-icon-delete" size="mini" />
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<div class="pagination">
				<el-pagination :hide-on-single-page="total / queryInfo.pagesize < 2" @size-change="handleSizeChange"
				 @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
				 layout="total, sizes, prev, pager, next, jumper" :total="total" />
			</div>
		</el-card>
		<!-- 添加\编辑角色对话框 -->
		<el-dialog :title="dialogTitle" width="500px" ref="dialog" :visible.sync="dialogVisible" @close="dialogClose">
			<el-form :model="roleInfoRorm" :rules="roleInfoRormRules" ref="roleInfoRormRef" label-width="100px">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="roleInfoRorm.name" />
				</el-form-item>
				<el-form-item label="角色简介" prop="intro">
					<el-input v-model="roleInfoRorm.intro" type="intro" />
				</el-form-item>
				<el-form-item label="角色状态" prop="status">
					<el-radio v-model="roleInfoRorm.status" label="1">启用</el-radio>
					<el-radio v-model="roleInfoRorm.status" label="0">禁用</el-radio>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="权限分配" width="300px" ref="dialog" :visible.sync="assignAuthDialogVisible" @close="resetAssignAuth">
			<el-form>
				<el-tree v-loading="loadingAuth" :default-expanded-keys="[1]" :data="authlist" show-checkbox node-key="id" :default-expand-all="false"
				 :default-checked-keys="defaultCheckedKeys" :props="defaultProps">
				</el-tree>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button> -->
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 获取角色列表请求参数
				queryInfo: {
					query: '',
					pagenum: 1,
					pagesize: 5
				},
				// 添加角色表单参数
				roleInfoRorm: {
					name: '',
					intro: '',
					status: '1'
				},
				// 添加角色表单验证规则
				roleInfoRormRules: {
					name: [{
							required: true,
							message: '请输入角色名',
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
				rolelist: [], // 角色列表
				defaultProps: {
					children: 'children',
					label: 'title'
				},
				authlist: [],
				total: 0, // 获取数据总条数
				dialogTitle: '', // dialog标题
				getRoleListLoading: false, // 获取角色集合动画
				dialogVisible: false, // 弹窗是否开启
				assignAuthDialogVisible: false,
				defaultCheckedKeys: [],
				loadingAuth: false
			}
		},
		created() {
			this.getRoleList()
		},
		methods: {
			// 提交表单
			submitForm() {
				console.log('ok', this)
				// 验证表单成功后才提交
				this.$refs.roleInfoRormRef.validate(async valid => {
					// 验证不成功直接return
					if (!valid) return
					this.$post('role', this.roleInfoRorm).then(
						res => {
							console.log(res)
							if (res.code === 0) return this.$message.error(res.msg)
							this.$message.success(res.msg)
							this.dialogVisible = false
							this.getRoleList()
						}).catch(err => {
						console.log(err)
					})
				})
			},

			// 删除角色
			delRole(id) {
				this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
					confirmButtonText: '继续',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log('ssss')
					this.$del('role/' + id).then(
						res => {
							console.log(res)
							if (res.code === 0) return this.$message.error(res.msg)
							this.$message.success(res.msg)
							this.getRoleList()
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
				this.$get('role', {
					params: this.queryInfo
				}).then(
					res => {
						this.rolelist = res.data.data
						this.total = res.data.count
						this.getRoleListLoading = false
						console.log('角色列表', res.data.data)
					}).catch(err => {
					console.log(err)
				})
			},

			showAssignAuthDialog(roleId) {
				this.loadingAuth = true
					this.$get('auth/' + roleId).then(
						res => {
							this.authlist = res.data
							this.getKeys(this.authlist, this.defaultCheckedKeys)
							console.log('角色权限树', res.data)
							this.loadingAuth = false
						}).catch(err => {
						console.log(err)
					})
				this.assignAuthDialogVisible = true
			},

			getKeys(nodes, arr) {
				for (let index in nodes) {
					if (!nodes[index].children && nodes[index].selected) {
						arr.push(nodes[index].id)
					} else {
						this.getKeys(nodes[index].children, arr)
					}
				}
			},

			resetAssignAuth() {
				this.authlist = []
				this.defaultCheckedKeys = []
			},

			// 监听每页条数改变事件
			handleSizeChange(newSize) {
				console.log(newSize)
				this.queryInfo.pagesize = newSize
				this.getRoleList()
			},
			// 监听页数改变事件
			handleCurrentChange(newPage) {
				console.log(newPage)
				this.queryInfo.pagenum = newPage
				this.getRoleList()
			},

			showDialog(e) {
				if (e === null || e === undefined) {
					this.dialogTitle = '添加角色'
				} else {
					this.dialogTitle = '编辑角色'
					this.roleInfoRorm.id = e.id
					this.roleInfoRorm.name = e.name
					this.roleInfoRorm.intro = e.intro
					this.roleInfoRorm.status = e.status + ''
				}
				this.dialogVisible = true
			},
			// 关闭添加角色表单事件
			dialogClose() {
				this.$refs.roleInfoRormRef.resetFields()
				this.roleInfoRorm = {
					name: '',
					intro: '',
					status: '1'
				}
			},
			// 监听状态按钮修改事件
			roleStatusChanged(info) {
				this.$put('role/' + info.id, {
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
