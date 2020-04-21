<template>
	<div id="app">
		<treeselect v-model="value" :multiple="false" :normalizer="normalizer" :options="op" />
	</div>
</template>

<script>
	// import the component 
	import Treeselect from '@riophae/vue-treeselect'
	// import the styles
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	export default {
		// register the component 
		components: {
			Treeselect
		},
		data() {
			return {
				// define the default value
				value: null,
				// define options
				op: [{
					'id': 1,
					'title': '主页',
					'icon': 'el-icon-menu',
					'ctrl': '#',
					'children': [{
						'id': 2,
						'title': '后台首页',
						'icon': 'el-icon-menu',
						'ctrl': 'index',
						'children': []
					}]
				}]
			}
		},
		methods: {
			normalizer(node) {
				return {
					id: node.id,
					label: node.title,
					children: node.children
				}
			}
		}
	}
</script>
