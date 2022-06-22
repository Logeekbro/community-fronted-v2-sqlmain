<template>
  <section>
    <div class="columns">
      <div class="column is-full">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span><i class="fa fa fa-book"> 文章 / 更新文章</i></span>
          </div>
          <div>
            <el-form :model="topic" ref="topic" class="demo-topic">
              <el-form-item prop="title">
                <el-input v-model="topic.title" placeholder="输入新的文章名称"></el-input>
              </el-form-item>

              <!--Markdown-->
              <div id="vditor" />

              <b-taginput size="is-medium" :closable="false" :readonly="true" v-model="tags" class="my-3" ellipsis
                placeholder="文章标签不支持修改" />
              <el-form-item class="mt-3">
                <el-button type="primary" @click="handleUpdate()">更新
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
import Vditor from "vditor";
import "vditor/dist/index.css";
import vditorConfig from '@/config/vditor';
import store from '@/store'

export default {
  name: "TopicEdit",
  components: {},
  data() {
    return {
      topic: {},
      tags: [],
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
      getTopicDetail(this.$route.params.id).then((value) => {
        const { data } = value
        this.topic = data.article;
        this.tags = data.tags;
        if(data.author.userId != store.getters.user.userId){
          window.location.href = "/"
          return
        }
        this.renderMarkdown(this.topic.content);
      });
    },
    handleUpdate: function () {
      this.topic.content = this.contentEditor.getValue();
      update(this.topic).then((response) => {
        const { data } = response;
        setTimeout(() => {
          this.$router.push({
            name: "post-detail",
            params: { id: this.topic.articleId },
          });
        }, 100);
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.contentEditor.setValue("");
    },
  },
};
</script>

<style>
.vditor-reset pre>code {
  font-size: 100%;
}
</style>