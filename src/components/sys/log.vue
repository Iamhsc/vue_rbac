<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">
				首页
			</el-breadcrumb-item>
			<el-breadcrumb-item>系统</el-breadcrumb-item>
			<el-breadcrumb-item>日志</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card>
			<!-- 日志列表 -->
			<el-table v-loading="getLogListLoading" :data="loglist" stripe>
				<el-table-column label="#" type="index" />
				<el-table-column label="登录名" prop="admin_name" />
				<el-table-column label="登录时间" prop="login_time" />
				<el-table-column label="IP" prop="login_ip" />
				<el-table-column label="地区" prop="login_area" />
				<el-table-column label="状态" width="63px">
					<template v-slot="{row}">
						{{row.login_status === 1 ? '成功' : '失败'}}
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loglist: [], 
				getLogListLoading: false, 
			}
		},
		created() {
			this.getLogList()
		},
		methods: {
			// 删除日志
			delLog(id) {
				this.$confirm('永久删除该日志, 是否继续?', '提示', {
					confirmButtonText: '继续',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log('ssss')
					this.$del('log/' + id).then(
						res => {
							console.log(res)
							if (res.code === 0) return this.$message.error(res.msg)
							this.$message.success(res.msg)
							this.getLogList()
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

			// 获取日志列表
			getLogList() {
				this.getLogListLoading = true
				this.$get('log').then(
					res => {
						console.log(res)
						this.loglist = res.data
						this.getLogListLoading = false
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
