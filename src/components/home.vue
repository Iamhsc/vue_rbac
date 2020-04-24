<template>
	<el-container>
		<!-- 头部区域 -->
		<el-header>
			<div>
				<img src="../assets/logo.png" alt="logo">
				<span style="color: #BFCBD9;">后台管理系统</span>
			</div>
			<el-dropdown @command="handleCommand">
			  <span style="color: #B3D4FC; font-weight: bold;">
			    {{adminInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
			  </span>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item command="1">个人信息修改</el-dropdown-item>
			    <el-dropdown-item command="2">退出登录</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
		</el-header>
		<el-dialog title="个人信息修改" width="500px" ref="dialog" :visible.sync="dialogVisible">
			<el-form :model="adminInfo" ref="adminInfoRef" label-width="100px">
				<el-form-item label="登录名称" prop="username">
					<el-input v-model="adminInfo.username" readonly/>
				</el-form-item>
				<el-form-item label="登录密码" prop="password">
					<el-input v-model="adminInfo.password" type="password" placeholder="为空则不修改"/>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="adminInfo.mobile" />
				</el-form-item>
				<el-form-item label="电子邮箱" prop="email">
					<el-input v-model="adminInfo.email" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 页面主题 -->
		<el-container>
			<!-- 侧边栏 -->
			<el-aside :width="isCollapse ? '64px':'200px'">
				<div class="toggle-btn" @click="toggleCollapse">☰</div>
				<el-menu router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#304156"
				 text-color="#BFCBD9" active-text-color="#409EFF" :collapse="isCollapse" :collapse-transition="false">
					<el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id" background-color="#1F2D3D">
						<template slot="title">
							<i :class="item.icon" />
							<span>{{ item.title }}</span>
						</template>
						<el-menu-item :index="'/'+subItem.ctrl" v-for="subItem in item.children" :key="subItem.id"  background-color="#1F2D3D">
							<i :class="subItem.icon" />
							<span>{{ subItem.title }}</span>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<!-- 右侧主体区 -->
			<el-container :style="'height:'+ windowHeight + 'px;'">
				<!-- 右侧内容 -->
				<el-main>
					<!-- 路由占位符 -->
					<router-view />
				</el-main>
				<!-- 底部 -->
				<el-footer>Footer</el-footer>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				windowHeight: `${document.documentElement.clientHeight}` - 60,
				menuList: [],
				isCollapse: false,
				dialogVisible: false,
				adminInfo: {}
			}
		},
		created() {
			console.log('document.documentElement', document.documentElement.client)
			this.getMenuList()
			let adminInfo = window.sessionStorage.getItem('adminInfo')
			this.adminInfo = JSON.parse(adminInfo)
		},
		methods: {
			handleCommand(command){
				switch (command){
					case '1':
					this.dialogVisible = true
						break;
					case '2':
					this.logout()
						break;
				}
			},
			
			submitForm() {
				this.$put('index/' + this.adminInfo.uid, this.adminInfo).then(
					res => {
						console.log(res)
						if (res.code === 0) return this.$message.error(res.msg)
						this.$message.success(res.msg)
						window.sessionStorage.setItem('adminInfo', JSON.stringify(this.adminInfo))
						this.dialogVisible = false
						this.getAdminList()
					}).catch(err => {
					console.log(err)
				})
			},
			
			logout() {
				window.sessionStorage.clear()
				this.$router.push('/login')
			},
			getMenuList() {
				let menuStr = window.sessionStorage.getItem('managementMenu')
				if (menuStr) {
					this.menuList = JSON.parse(menuStr)
					return
				}
				this.$get('auth').then(
					res => {
						console.log('res', res)
						if (res.code !== 200) return this.$message.error(res.data.msg)
						this.menuList = res.data
						window.sessionStorage.setItem('managementMenu', JSON.stringify(res.data))
					}).catch(err => {
					console.log(err)
				})
			},
			// 菜单折叠
			toggleCollapse() {
				this.isCollapse = !this.isCollapse
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-header {
		background-color: #0077AA;
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

	.el-aside {
		background: #304156;

		.toggle-btn {
			background-color: #404040;
			color: #fefefe;
			font-size: 15px;
			line-height: 24px;
			text-align: center;
			cursor: pointer;
		}

		.el-menu {
			border-right: 0;
		}
	}

	.el-main {
		background-color: #EAedf1;
	}

	.el-footer {
		background-color: #666666;
	}
</style>
