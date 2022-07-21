<template>
  <div class="columns">
    <div class="column is-full">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span><i class="fa fa fa-book"> 文章 / 发布文章</i></span>
        </div>
        <div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
            <el-form-item prop="title">
              <el-input v-model="ruleForm.title" placeholder="输入文章名称" />
            </el-form-item>

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
// import store from '@/store';
// import user from '@/store/modules/user'
export default {
  name: 'TopicPost',
  data() {
    return {
      contentEditor: {},
      ruleForm: {
        title: '', // 标题
        tags: [], // 标签
        content: '' // 内容
      },
      rules: {
        title: [
          { required: true, message: '请输入文章名称', trigger: 'blur' },
          {
            min: 1,
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
          // this.$message({
          //   message: "处理文章数据...",
          //   duration: 0,
          //   iconClass: "el-icon-loading"
          // })
          this.ruleForm.content = content
          post(this.ruleForm).then((response) => {
            const { data } = response
            // this.$message.closeAll()
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.contentEditor.setValue('')
      this.ruleForm.tags = ''
    }
  },

}
</script>

<style>
</style>