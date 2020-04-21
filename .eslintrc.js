module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/strongly-recommended',
		'@vue/standard'
	],
	rules: {
		'no-tabs': 'off',
		'indent': 'off'
		'space-before-function-paren': 0,
		'vue/script-indent': 'warning'
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
}
