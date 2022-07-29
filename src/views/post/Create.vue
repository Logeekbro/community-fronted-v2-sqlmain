<template>
  <div class="columns">
    <div class="column is-full">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span><i class="fa fa fa-book"> 发布文章</i></span>
        </div>
        <div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
            <el-form-item prop="title">
              <el-input ref="myTitle" v-model="ruleForm.title" placeholder="输入文章标题" />
            </el-form-item>

            <div>
              <strong style="display: block;">文章封面：</strong>
              <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="customRequest"
                :before-upload="beforeUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>

            <!--Markdown-->
            <div id="vditor" />

            <b-taginput v-model="ruleForm.tags" class="my-3" maxlength="10" maxtags="5" ellipsis
              placeholder="请输入标签，限制为 10 个字符和 5 个标签" />

            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建
              </el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { post } from '@/api/post'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import vditorConfig from '@/config/vditor'


function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name: 'TopicPost',
  data() {
    return {
      contentEditor: {},
      ruleForm: {
        title: '',
        tags: [],
        content: '',
        file: null
      },
      submitToast: null,
      imageUrl: '',
      rules: {
        title: [
          { required: false, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 0,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'change'
          }
        ]
      },

    }
  },
  mounted() {
    this.contentEditor = new Vditor('vditor', vditorConfig)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if (this.ruleForm.title == "") {
            this.msg.warn("请输入文章标题")
            window.scrollTo(0, 0)
            this.$refs.myTitle.focus()
            return false
          }
          if (this.ruleForm.file == null) {
            this.msg.warn("请上传文章封面")
            window.scrollTo(0, 0)
            return false
          }
          const content = this.contentEditor.getValue()
          if (
            content.length === 1 ||
            content == null ||
            content === ''
          ) {
            this.msg.warn("文章内容不能为空")
            return false
          }
          if (this.ruleForm.tags == null || this.ruleForm.tags.length === 0) {
            this.msg.warn("标签不能为空")
            return false
          }
          this.submitToast = this.msg.indefiniteInfo("<i class='el-icon-loading'></i>正在处理文章...")
          this.ruleForm.content = content
          post(this.ruleForm).then((response) => {
            this.submitToast.close()
            const { data } = response
            setTimeout(() => {
              this.$router.push({
                name: 'post-detail',
                params: { id: data.value }
              })
            }, 1)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    customRequest(info) {
      this.ruleForm.file = info.file
      getBase64(info.file, imageUrl => {
        this.imageUrl = imageUrl
      })
    },
    beforeUpload(file) {
      const accept = ['image/jpg', 'image/jpeg', 'image/png']
      const isJPG = accept.includes(file.type);
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.msg.error('封面图片只能是 JPG/PNG 格式!', 1500);
      }
      if (!isLt5M) {
        this.msg.error('封面图片大小不能超过 5MB!', 1500);
      }
      return isJPG && isLt5M;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.contentEditor.setValue('')
      this.ruleForm.tags = ''
    }
  },

}
</script>

<style>
.ant-upload.ant-upload-select-picture-card>.ant-upload {
  width: 350px;
  height: 200px;
  padding: 0;
}

.mainPic {
  width: 350px;
  height: 200px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 350px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}

.avatar {
  width: 350px;
  height: 200px;
  display: block;
}
</style>