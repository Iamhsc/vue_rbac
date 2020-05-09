module.exports = {
  configureWebpack: config => {
    config.externals = {
      TMap: 'TMap'
    }
  }
}
