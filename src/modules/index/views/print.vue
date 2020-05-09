<template>
  <el-card>
    <div style="margin-bottom: 10px;">
      <h1>附近所有商家</h1>
      <el-table :data="merchantlist" v-loading="getMerchantLoading" stripe style="width: 100%" highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column prop="m_name" label="店铺名称">
        </el-table-column>
        <el-table-column prop="m_address" label="店铺地址">
        </el-table-column>
      </el-table>
    </div>

    <el-button type="primary" @click='createPrint'>
      新建打印任务
    </el-button>
    <el-dialog :title="'已选择店铺：' + currentRow.m_name" @close="dialogClose" width="500px" ref="dialog" :visible.sync="dialogVisible">
      <el-upload class="upload-demo" action="/index/print/upload" :headers="{'authorization':authorization}"
        :on-success="uploadFile" :multiple="false" :file-list="fileList">
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传 docx/pdf 文件</div>
        <!-- <div slot="tip" class="el-upload__tip">只能上传 txt/doc/xls/ppt/docx/xlsx/pptx/jpg/png/pdf/tiff/swf 文件</div> -->
      </el-upload>
      <el-card class="print-box-card">
        <div slot="header">
          <span>打印参数</span>
        </div>
        <div>
          <el-form :model="printOptions" ref="printOptionsRef" label-width="100px" size="mini">
            <el-form-item label="打印份数" prop="number" size="mini">
              <template>
                <el-input-number v-model="printOptions.number" @change="handleChangeSetNumber" :min="1" :max="10" label="描述文字"></el-input-number>
              </template>
            </el-form-item>
            <el-form-item label="打印纸张" prop="paper" size="mini">
              <template>
                <el-radio v-model="printOptions.paper" label="A4">A4</el-radio>
                <el-radio v-model="printOptions.paper" label="B4">B4</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="打印色彩" prop="color" size="mini">
              <template>
                <el-radio v-model="printOptions.color" @change="changeColor" label="黑白">黑白</el-radio>
                <el-radio v-model="printOptions.color" @change="changeColor" label="彩印">彩印</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="单双面" prop="sided" size="mini">
              <template>
                <el-radio v-model="printOptions.sided" @change="changeSided" label="单面">单面</el-radio>
                <el-radio v-model="printOptions.sided" @change="changeSided" label="双面">双面</el-radio>
              </template>
            </el-form-item>
            <el-form-item label="打印页" prop="page" size="mini">
              <template>
                <el-radio v-model="printOptions.page" @change="changePageNum" label="全部">全部</el-radio>
                <el-radio v-model="printOptions.page" label="">范围
                  <template>
                    <el-input style="width: 80%;" @input="changePageNum" placeholder="2-4页或1,2页" v-model="printOptions.page" />
                  </template>
                </el-radio>
              </template>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <label style="margin-top: 10px;">总价： {{totalPrice}} 元</label>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        hasFile: false,
        ids: [], //文件id集合
        pages_num: 1, //文件的页数
        print_pages_num: 1, // 需要打印的页数
        aPrint: 0,
        bPrint: 0,
        totalPrice: 0, //打印总价格
        optionPrice: {}, //打印价格 如黑白打印：1员
        getMerchantLoading: false, //获取商家列表加载动画
        authorization: '', //上传请求header
        currentRow: {}, //选中行
        merchantlist: [], //商家列表
        printOptions: { //打印配置
          number: 1,
          paper: 'A4',
          color: '黑白',
          sided: '单面',
          page: '全部'
        },
        radius: 3000, //半径
        dialogVisible: false,
        fileList: [] //文件列表
      };
    },
    created() {
      this.getMerchantList()
      this.setHeaders()
    },
    methods: {
      countPrice(nums = this.print_pages_num) {
        this.totalPrice = (this.aPrint + this.bPrint + parseFloat(this.optionPrice.double_color)) * this.printOptions.number *
          nums
      },
      changeColor(val) {
        if (val == '彩印') {
          this.aPrint = parseFloat(this.optionPrice.many_color)
        } else {
          this.aPrint = 0
        }
        this.countPrice()
      },
      changeSided(val) {
        if (val == '双面') {
          this.bPrint = parseFloat(this.optionPrice.double_sided)
        } else {
          this.bPrint = 0
        }
        this.countPrice()
      },

      changePageNum() {
        let p = this.printOptions.page
        let pages = []
        if (p.indexOf(",") !== -1) {
          pages = p.split(",")
          this.print_pages_num = pages.length
        }
        if (p.indexOf("，") !== -1) {
          pages = p.split("，")
          this.print_pages_num = pages.length
        } else if (p.indexOf("-") !== -1) {
          pages = p.split("-")
          this.print_pages_num = pages[1] - pages[0] + 1
        } else if (p == '全部') {
          this.print_pages_num = this.pages_num
        } else {
          this.print_pages_num = 1
        }
        this.countPrice()
      },
      //添加份数
      handleChangeSetNumber(value) {
        this.countPrice()
      },
      //获取商户列表
      getMerchantList() {
        this.getMerchantLoading = true
        this.$get('/index/print', {
          radius: this.radius
        }).then(
          res => {
            this.getMerchantLoading = false
            this.merchantlist = res.data
            console.log('附近商户', res.data)
          }).catch(err => {
          console.log(err)
        })
      },

      // 设置上传的header
      setHeaders() {
        this.authorization = window.sessionStorage.getItem('userToken')
      },

      // 出示数据
      dialogClose() {
        this.hasFile = false
        this.ids = []
        this.pages_num = 1
        this.print_pages_num = 1
        this.aPrint = 0
        this.bPrint = 0
        this.totalPrice = 0
        this.optionPrice = {}
        this.printOptions = {
            number: 1,
            paper: 'A4',
            color: '黑白',
            sided: '单面',
            page: '全部'
          },
          this.fileList = []
      },

      // 提交表单
      submitForm() {
        if (!this.hasFile) {
          return this.$message.error('请先上传文件')
        }
        let param = {
          'mid': this.currentRow.id,
          'file_id': this.ids,
          'p_options': JSON.stringify(this.printOptions),
          'total_price': this.totalPrice
        }
        this.$confirm('本次打印需要' + this.totalPrice + '元，是否立即支付？', '付款', {
          showConfirmButton:true,
          showCancelButton: true,
          confirmButtonText: '立即支付',
          cancelButtonText: '稍后支付',
          type: 'info'
        }).then(() => {
          param.order_status = 2
          this.confirmSubmit(param)
        }).catch(() => {
          this.confirmSubmit(param)
        })
      },

      confirmSubmit(param) {
        this.$post('/index/print/save', param).then(
          res => {
            console.log(res)
            if (res.code !== 200) return this.$message.error(res.msg)

            this.$message.success(res.msg)
            this.dialogVisible = false
            this.$router.replace({
              path: '/order'
            }).catch(err => {
              console.log('all good')
            })
          }).catch(err => {
          console.log(err)
        })
      },

      createPrint() {
        if (!this.currentRow.id) {
          this.$message('请先选择打印店')
          return
        }
        this.getPrice(this.currentRow.id)
        this.dialogVisible = true
      },

      getPrice(mid) {
        this.$get('/index/print/get_price/' + mid).then(
          res => {
            console.log(res)
            if (res.code !== 200) return this.$message.error(res.msg)
            console.log(res.data)
            this.optionPrice = JSON.parse(res.data.options)
            this.totalPrice = this.optionPrice.double_color
          }).catch(err => {
          console.log(err)
        })
      },

      handleCurrentChange(val) {
        this.currentRow = val;
        console.log(val)
      },
      //上传成功回调
      uploadFile(response, file, fileList) {
        if (response.code === 1) {
          this.hasFile = true
          this.ids.push(response.data.annex_id)
          this.print_pages_num = response.data.pages_num
          this.pages_num = response.data.pages_num
          this.countPrice(this.pages_num)
        }
        console.log('response', response)
        console.log('file', file)
        console.log('fileList', fileList)
        // this.fileList = fileList.slice(-3);
      }
    }
  }
</script>

<style lang="scss">
  .el-upload__tip {
    color: #C9302C !important;
  }

  .print-box-card {
    margin-top: 10px;

    .el-card__header {
      padding: 0 10px !important;
    }

    .el-card__body {
      padding: 10px !important;
    }

    .el-form-item.el-form-item--mini {
      margin-bottom: 0 !important;
    }
  }
</style>
