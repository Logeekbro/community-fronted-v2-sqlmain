<template>
  <section>
    <div class="columns">
      <div class="column is-full">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span><i class="fa fa fa-book"> {{ isReEdit ? '重新发布' : '更新' }}文章</i></span>
          </div>
          <div>
            <el-form :model="topic" ref="topic" class="demo-topic">
              <el-form-item prop="title">
                <el-input v-model="topic.title" placeholder="输入新的文章名称"></el-input>
              </el-form-item>

              <div>
                <strong style="display: block;">文章封面：</strong>
                <el-upload class="avatar-uploader" action="" :show-file-list="false" :http-request="customRequest"
                  :before-upload="beforeUpload">
                  <img v-if="imageUrl" :src.sync="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>

              <div style="margin-top: 20px; margin-bottom: 20px;">
                <strong>文章分区：</strong>
                <a-select v-model="topic.sectionId" style="width: 120px" @change="handleSectionChange">
                  <a-select-option v-for="item in sectionList" :key="item.sectionId" :value="item.sectionId">
                    {{ item.sectionName }}
                  </a-select-option>
                </a-select>
              </div>

              <div style="margin-top: 20px;margin-bottom: 20px;">
                <strong>更新时间标记
                  <a-popover title="在新增内容与原内容之间增加分隔符并显示更新时间，例如：">
                    <template slot="content">
                      <p>[这是原内容]</p>
                      <p>----以下内容更新于XXXX年XX月XX日 XX:XX-----</p>
                      <p>[这是新内容]</p>
                    </template>
                    <a-icon type="question-circle" />
                  </a-popover> ：
                </strong>
                <!-- <a-switch @change="isAddUpdateTimeMark" /> -->
                <el-button size="small" @click="addUpdateTimeMark()" type="primary">添加</el-button>
              </div>

              <!--Markdown-->
              <div id="vditor" />

              <div style="margin-top: 20px;">
                <strong>文章摘要：</strong>
                <br>
                <br>
                <el-input maxlength="255" show-word-limit type="textarea" :rows="4" placeholder="输入文章摘要"
                  v-model="topic.summary">
                </el-input>
              </div>

              <!-- <div style="margin-top: 20px;margin-bottom: 20px;">
                <strong>增加更新时间标记
                  <a-popover title="在新增内容与原内容之间增加分隔符并显示更新时间，例如：">
                    <template slot="content">
                      <p>[这是原内容]</p>
                      <p>----2022年X月x日更新-----</p>
                      <p>[这是新内容]</p>
                    </template>
                    <a-icon type="question-circle" />
                  </a-popover> ：
                </strong>
                <a-switch @change="isAddUpdateTimeMark" />
              </div> -->

              <!-- 是否进行审核后发布文章 -->
              <div v-if="!isReEdit" style="margin-top: 20px;margin-bottom: 20px;">
                <strong>是否进行审核
                  <a-popover title="Tips:">
                    <template slot="content">
                      <p>社区允许您的文章不经审核直接发布，</p>
                      <p style="color: red">但请注意：如果在未经审核的文章中发现违规内容，文章将会被删除，同时作者会受到惩罚！</p>
                      <p style="color: red">确保您的内容合规后再进行此操作！</p>
                    </template>
                    <a-icon type="question-circle" />
                  </a-popover> ：
                </strong>
                <a-radio-group v-model="needReview" name="radioGroup" :default-value="needReview">
                  <a-radio :value="true">
                    审核
                  </a-radio>
                  <a-radio :value="false">
                    不审核
                  </a-radio>
                </a-radio-group>
              </div>
              <div v-else style="margin-top: 20px;margin-bottom: 20px;">
                <a-alert message="重新发布被退回的文章时默认需要提交审核" type="info" show-icon />
              </div>


              <el-form-item class="mt-3">
                <el-button type="primary" @click="handleUpdate()">{{ isReEdit ? '重新发布' : '更新' }}
                </el-button>
                <el-button @click="resetForm('topic')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </section>
</template>

<script>
import { getTopicDetail, update } from "@/api/post";
import { getSectionList } from "@/api/section";
import Vditor from "vditor";
import "vditor/dist/index.css";
import vditorConfig from '@/config/vditor';
import store from '@/store'
import dayjs from 'dayjs'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  name: "TopicEdit",
  components: {},
  data() {
    return {
      topic: {},
      tags: [],
      imageUrl: '',
      submitToast: null,
      sectionList: [],
      sectionInfo: {},
      needReview: true,
      isReEdit: this.$route.query.reEdit == null ? false : this.$route.query.reEdit
    };
  },
  created() {
    window.scrollTo(0, 0);
    this.fetchTopic();
  },
  methods: {
    renderMarkdown(md) {
      vditorConfig.after = () => {
        this.contentEditor.setValue(md);
      }
      this.contentEditor = new Vditor("vditor", vditorConfig);
    },
    fetchTopic() {
      getTopicDetail(this.$route.params.id, this.isReEdit).then((value) => {
        const { data } = value
        this.topic = data
        this.imageUrl = this.topic.mainPic
        this.renderMarkdown(this.topic.content);
        getSectionList().then(rep => {
          this.sectionList = rep.data
          this.topic.sectionId = this.getSectionInfo().sectionId
        })
      });
    },
    getSectionInfo() {
      return this.sectionList.find((item, index) => {
        return item.sectionId == this.topic.sectionId
      })
    },
    customRequest(info) {
      this.topic.file = info.file
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
    handleUpdate: function () {
      this.submitToast = this.msg.indefiniteInfo("<i class='el-icon-loading'></i>正在处理文章...")
      this.topic.content = this.contentEditor.getValue();
      this.topic.needReview = this.needReview
      update(this.topic).then(() => {
        this.submitToast.close()
        if (!this.needReview) {
          setTimeout(() => {
            this.$router.push({
              name: "post-detail",
              params: { id: this.topic.articleId },
            });
          }, 1);
        }
        else {
          this.msg.success("文章已重新提交审核！")
          setTimeout(() => {
            this.$router.push({
              name: 'user',
              params: { username: store.getters.user.userId },
              query: { articleType: "2" }
            })
          }, 1)
        }
      });
    },
    handleSectionChange(value) {
      this.topic.sectionId = value
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.contentEditor.setValue("");
    },
    addUpdateTimeMark() {
      this.contentEditor.insertValue("\n\r------以下内容更新于" + dayjs().format('YYYY年MM月DD日 HH:mm') + "------")
      this.addUpdateTime = true
    }
  },
};
</script>

<style>
.vditor-reset pre>code {
  font-size: 100%;
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