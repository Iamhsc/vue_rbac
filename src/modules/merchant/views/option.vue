<template>
  <el-card>
    <el-form ref="form" :model="optionForm" label-width="100px" size="mini">
      <el-form-item label="黑白打印价格">
        <el-row :gutter="15">
          <el-col :span="5">
            <el-input class="input" v-model="optionForm.double_color"></el-input>
          </el-col>
          <el-col :span="15">
            <label>最低价格</label>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="彩色打印加价">
        <el-row :gutter="15">
          <el-col :span="5">
            <el-input class="input" v-model="optionForm.many_color"></el-input>
          </el-col>
          <el-col :span="15">
            <label>最低价格基础上多的价格</label>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="双面打印加价">
        <el-row :gutter="15">
          <el-col :span="5">
            <el-input class="input" v-model="optionForm.double_sided"></el-input>
          </el-col>
          <el-col :span="15">
            <label>最低价格基础上多的价格</label>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">设置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        optionForm: {
          double_color: 1,
          many_color: 0.5,
          double_sided: 0.5
        }
      }
    },
    created() {
      this.getPrice()
    },
    methods: {
      onSubmit() {
        this.$post('/merchant/option', {
          options: JSON.stringify(this.optionForm)
        }).then(
          res => {
            this.$message.success(res.msg)
          }).catch(err => {
          console.log(err)
        })
      },
      getPrice() {
        this.$get('/merchant/option').then(
          res => {
            this.optionForm = JSON.parse(res.data.options)
          }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss">
  label {
    color: #aaa
  }
</style>
