<template>
  <div>
    <div class="upload_now">
      <span class="upload_slogan">教练，我想现在就...</span>

      <div class="upload_box" @click="goToPrint">
        <span>上传文件</span>
        <input type="button" class="upload_file" id="upload_file" name="upload_file">
      </div>
    </div>
    <div class="avail_info">
      <div class="step_intro">
        <div class="step_bar">
          <img :src="img.step_bar" />
        </div>
        <div class="step_detail step1">
          <h3>Step1</h3>

          <p class="step_describe">用户登陆后，在线提交需要打印的文件，或去<a href="javascript:;" class="font_red">文库</a>选择所需文件打印。</p>

          <p class="add_text">
            *支持的格式包括：
            doc,docx,ppt,pptx,pdf,csv,xls,txt
          </p>
        </div>
        <div class="step_detail step2">
          <h3>Step2</h3>

          <p class="step_describe">在线编辑、确认。设置打印格式，属性。</p>

          <div class="add_img">
            <img :src="img.step_2" />
          </div>
        </div>
        <div class="step_detail step3">
          <h3>Step3</h3>
          <p class="step_describe">在线提交文件到打印店。</p>

          <div class="add_img">
            <img :src="img.step_3" />
          </div>
        </div>
        <div class="step_detail step4">
          <h3>Step4</h3>

          <p class="step_describe">按照约定的时间，线下领取打印的资料。</p>

          <div class="add_img">
            <img :src="img.step_4" />
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
        <div class="about_web">
            <a href="javascript:;">联系我们</a>
            |
            <a href="javascript:;">版权信息</a>
            |
            <a href="javascript:;">反馈信息</a>
        </div>
    </footer>
  </div>
</template>

<script>
  require('../assets/index/js/publicScript.js')
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap/dist/js/bootstrap.min.js'
  import '../assets/index/css/index.css'
  import '../assets/index/css/publicStyle.css'
  export default {
    data() {
      return {
        img: {
          text_taoyinyin: require("../assets/index/images/text_taoyinyin.png"),
          page1_lc: require('../assets/index/images/page1_lc.png'),
          step_bar: require('../assets/index/images/step_bar.png'),
          step_2: require('../assets/index/images/step_2.jpg'),
          step_3: require('../assets/index/images/step_3.png'),
          step_4: require('../assets/index/images/step_4.png'),
          reason_img: require('../assets/index/images/reason_img.jpg')
        }
      }
    },
    methods: {
      goToPrint() {
				this.$router.replace({ path: '/home' }).catch(err => {
				   console.log('all good')
				}) 
        // this.$router.push('/home')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
