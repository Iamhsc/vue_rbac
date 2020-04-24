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
						<el-button slot="append" icon="el-icon-search" @click="getMenuList" />
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="showDialog(null)">
						添加菜单
					</el-button>
				</el-col>
			</el-row>
			<!-- 菜单列表 -->
			<el-table v-loading="getMenuListLoading" :data="menulist" row-key="id" border stripe>
				<el-table-column label="#" type="index" />
				<el-table-column label="菜单名" prop="title" header-align="center" />
				<el-table-column label="图标" width="80px" align="center" :cell-style="{'vertical-align':'top'}">
					<template v-slot="{row}">
						<i :class="row.icon" />
					</template>
				</el-table-column>
				<el-table-column label="控制" prop="ctrl" align="center" />
				<el-table-column label="方法" prop="action" align="center" />
				<el-table-column label="创建时间" prop="create_time" align="center" />
				<el-table-column label="更新时间" prop="update_time" align="center" />
				<el-table-column label="菜单显示" width="100px" align="center">
					<template v-slot="{row}">
						{{ row.status == 1 ? '显示' : '隐藏' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120px" align="center">
					<template v-slot="{row}">
						<el-button type="primary" @click="showDialog(row)" icon="el-icon-edit" size="mini" />
						<el-button type="danger" @click="delMenu(row.id)" :disabled="row.system == 1" icon="el-icon-delete" size="mini" />
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 添加\编辑菜单对话框 -->
		<el-dialog :title="dialogTitle" width="500px" ref="dialog" :visible.sync="dialogVisible" @close="dialogClose">
			<el-form :model="menuInfoRorm" :rules="menuInfoRormRules" ref="menuInfoRormRef" label-width="100px">
				<el-form-item label="上级菜单" prop="pid">
					<treeselect placeholder="不选则为顶级菜单" active-value="menuInfoRorm.pid" v-model="menuInfoRorm.pid" :normalizer="normalizer" :options="menulist" />
				</el-form-item>
				<el-form-item label="菜单名称" prop="title">
					<el-input v-model="menuInfoRorm.title" />
				</el-form-item>
				<el-form-item label="菜单图标" prop="icon">
					<el-popover placement="bottom-start" v-model="visible" width="360" trigger="click">
						<el-input v-model="menuInfoRorm.icon" slot="reference" clearable placeholder="请输入图标名称"/>
						<div class="icon-body">
							<div class="icon-list">
								<div v-for="item in elIcons.icon" :key="item.index" @click="selectedIcon(item)">
									<i :class="item" style="height: 26px;width: 26px;" />
								</div>
							</div>
						</div>
					</el-popover>
				</el-form-item>
				<el-form-item label="控制" prop="ctrl">
					<el-input v-model="menuInfoRorm.ctrl" />
				</el-form-item>
				<el-form-item label="方法" prop="action">
					<el-input v-model="menuInfoRorm.action" />
				</el-form-item>
				<el-form-item label="排序" prop="sort">
					<el-input-number v-model="menuInfoRorm.sort" :min="1" :max="100"></el-input-number>
				</el-form-item>
				<el-form-item label="菜单状态" prop="status">
					<el-radio v-model="menuInfoRorm.status" label='1'>显示</el-radio>
					<el-radio v-model="menuInfoRorm.status" label='0'>隐藏</el-radio>
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
	// import the component 
	import Treeselect from '@riophae/vue-treeselect'
	// import the styles
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	var icons = require('../../assets/js/el-icon.js')
	export default {
		// register the component 
		components: {
			Treeselect
		},
		data() {
			return {
				// 获取菜单列表请求参数
				queryInfo: {
					query: ''
				},
				// 菜单表单参数
				menuInfoRorm: {
					// pid: '',
					// title: '',
					// icon: '',
					// ctrl: '',
					// action: '',
					sort: 1,
					status: '0'
				},
				// 菜单表单验证规则
				menuInfoRormRules: {
					title: [{
						required: true,
						message: '请输入菜单名',
						trigger: 'blur'
					}],
					ctrl: [{
						required: true,
						message: '请输入控制器名',
						trigger: 'blur'
					}],
					action: [{
						required: true,
						message: '请输入方法名',
						trigger: 'blur'
					}]
				},
				visible: false,
				menulist: [], // 菜单列表
				total: 0, // 获取数据总条数
				dialogTitle: '', // dialog标题
				getMenuListLoading: false, // 获取菜单集合动画
				dialogVisible: false, // 弹窗是否开启
				elIcons: []
			}
		},
		created() {
			this.getMenuList()
		},
		methods: {
			// treeselect键名转换
			normalizer(node) {
				return {
					id: node.id,
					label: node.title,
					children: node.children
				}
			},

			selectedIcon(iconName) {
				this.menuInfoRorm.icon = iconName
				this.visible = false
			},

			// 显示dialog
			showDialog(e) {
				this.elIcons = icons
				if (e === null || e === undefined) {
					this.dialogTitle = '添加菜单'
				} else {
					this.dialogTitle = '编辑菜单'
					this.menuInfoRorm = e
					if(this.menuInfoRorm.pid === 0)
						delete this.menuInfoRorm.pid
					this.menuInfoRorm.pid = e.pid
					this.menuInfoRorm.status = e.status + ''
				}
				this.dialogVisible = true
				console.log('表单关闭', this)
			},

			// 关闭添加菜单表单事件
			dialogClose() {
				// this.$refs.menuInfoRormRef.resetFields()
				this.menuInfoRorm = {
					id: undefined,
					// pid: 0,
					title: undefined,
					icon: undefined,
					ctrl: undefined,
					sort: 1,
					action: undefined,
					status: '0'
				},
				this.elIcons = []
				console.log('表单关闭', this)
			},

			method() {
				return this.menuInfoRorm.id ? this.$put : this.$post
			},
			// 提交表单
			submitForm() {
				if (!this.menuInfoRorm.pid) {
					this.menuInfoRorm.pid = 0
				}
				// 验证表单成功后才提交
				this.$refs.menuInfoRormRef.validate(async valid => {
					// 验证不成功直接return?
					if (!valid) return

					let id = this.menuInfoRorm.id ? '/' + this.menuInfoRorm.id : ''

					this.method()('menu' + id, this.menuInfoRorm).then(
						res => {
							console.log(res)
							if (res.code !== 200) return this.$message.error(res.msg)
							this.$message.success(res.msg)
							this.dialogVisible = false
							this.getMenuList()
							this.getAuthMenuList()
						}).catch(err => {
						console.log(err)
					})
				})
				console.log('menuInfoRorm', this.menuInfoRorm)
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
							this.getAuthMenuList()
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

			getAuthMenuList() {
				this.$get('auth').then(
					res => {
						console.log('res', res)
						if (res.code !== 200) return this.$message.error(res.data.msg)
						this.menuList = res.data
						window.sessionStorage.setItem('managementMenu', JSON.stringify(res.data))
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

	.icon-body {
		width: 100%;
		padding: 10px 0;

		.icon-list {
			height: 200px;
			overflow-y: scroll;

			div {
				height: 26px;
				// line-height: 26px;
				// margin-bottom: -5px;
				cursor: pointer;
				width: 26px;
				float: left;
				padding: 2px;
			}

			span {
				display: inline-block;
				vertical-align: -0.15em;
				fill: currentColor;
				overflow: hidden;
			}
		}
	}
</style>
