<template>
  <el-card>
  <el-button type="primary" @click="goToPrint">
    去打印
  </el-button></el-card>
</template>

<script>
  export default {
    mounted() {

    },
    methods: {
      goToPrint() {
        this.$router.push('/home')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
