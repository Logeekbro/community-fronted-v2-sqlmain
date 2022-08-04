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

            <div style="margin-top: 20px; margin-bottom: 20px;">
              <strong>选择分区：</strong>
              <a-select ref="section" default-value="点击选择" style="width: 120px" @change="handleSectionChange">
                <a-select-option v-for="(item, index) in sectionList" :key="index" :value="item.sectionId">
                  {{ item.sectionName }}
                </a-select-option>
              </a-select>
            </div>

            <!--Markdown-->
            <div id="vditor" />

            <div style="margin-top: 20px;">
              <strong>文章摘要（用于在文章列表中显示本文的主要内容）：</strong>
              <br>
              <br>
              <el-input maxlength="255" type="textarea" :rows="4" placeholder="输入文章摘要" show-word-limit v-model="ruleForm.summary">
              </el-input>
            </div>


            <div style="margin-top: 20px;">
              <strong>文章标签（可以有多个）：</strong>

              <div style="margin-top: 15px">
                <a-tag v-if="ruleForm.tags.length > 0" v-for="tag in ruleForm.tags" :key="tag.tagId" closable
                  @close="() => handleRemoveTag(tag)">
                  {{ tag.tagName }}
                </a-tag>
              </div>
            </div>
            <br>

            <el-autocomplete value-key="tagName" class="inline-input" v-model="inputTagName"
              :fetch-suggestions="handleSearch" placeholder="请输入标签" :trigger-on-focus="false" @select="onSelect">
            </el-autocomplete>
            <el-button style="margin-left: 10px" type="primary" @click="handleInputConfirm">确认
            </el-button>

            <el-form-item style="margin-top: 20px">
              <el-button type="primary" @click="submitForm('ruleForm')">发布文章
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
import { getSectionList } from "@/api/section"
import { getSimilarTagListByTagName } from '@/api/tag'
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
        file: null,
        sectionId: null,
        summary: ''
      },
      submitToast: null,
      sectionList: [],
      imageUrl: '',
      inputVisible: false,
      inputTagName: '',
      tagData: [],
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'change' },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'change'
          }
        ]
      },

    }
  },
  mounted() {
    this.contentEditor = new Vditor('vditor', vditorConfig)
    this.fetchSectionList()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.file == null) {
            this.msg.warn("请上传文章封面")
            window.scrollTo(0, 0)
            return false
          }
          if (this.ruleForm.sectionId == null) {
            this.msg.warn("请选择分区")
            this.$refs.section.focus()
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
          this.$refs.myTitle.focus()
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
    fetchSectionList() {
      getSectionList().then(rep => {
        this.sectionList = rep.data
      })
    },
    handleSectionChange(value) {
      this.ruleForm.sectionId = value
    },
    handleInputConfirm() {
      const tagName = this.inputTagName.trim()
      const exist = this.ruleForm.tags.some(tag => tag.tagName == tagName)
      if (tagName.trim() != '' && !exist) {
        this.inputTagName = ''
        const tag = this.tagData.find((item, index) => item.tagName == tagName)
        if (tag) {
          this.ruleForm.tags.push(tag)
        }
        else {
          this.ruleForm.tags.push({
            tagId: null,
            tagName: tagName
          })
        }
      }
      else {
        this.msg.error("标签已存在或为空", 1500)
      }
      this.tagData = []
    },
    handleRemoveTag(removeTag) {
      const tags = this.ruleForm.tags.filter(tag => tag !== removeTag);
      this.ruleForm.tags = tags;
    },
    handleSearch(text, cb) {
      const tagName = text.trim()
      this.tagData = []
      if (tagName != '') {
        getSimilarTagListByTagName(tagName).then(rep => {
          this.tagData = rep.data
          cb(this.tagData)
        })
      }
      else {
        cb([])
      }
    },
    onSelect(tag) {
      this.inputTagName = tag.tagName
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