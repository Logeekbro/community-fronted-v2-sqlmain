<template>
  <div class="columns">
    <div style="position: fixed; z-index: 2; left: 6%; top: 30%">
        <score style="width: 100px; cursor: pointer;" :articleId="topic.articleId" direction="v"></score>
    </div>
    <!--文章详情-->
    <div class="column is-three-quarters">
      <!--主题-->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="has-text-centered">
          <p class="is-size-5 has-text-weight-bold">{{ topic.title }}</p>
          <div class="has-text-grey is-size-7 mt-3">
            <span>{{ dayjs(topic.createTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
            <el-divider direction="vertical" />
            <span>分区：{{ sectionInfo.sectionName }}</span>
            <!-- <el-divider direction="vertical" />
            <span>浏览：{{ topic.viewCount }}</span> -->
          </div>
        </div>

        <!--Markdown-->
        <div ref="contentLoading" class="vs-con-loading__container" id="preview" />

        <!--标签-->
        <nav class="level has-text-grey is-size-7 mt-6">
          <div class="level-left" style="width: 50%">
            <p style="width: 50%">
              <tag :articleId="topic.articleId"></tag>
            </p>
          </div>
          <div v-if="token && user.userId === topicUser.userId" class="level-right" style="width: 50%">
            <router-link class="level-item" :to="{ name: 'topic-edit', params: { id: topic.articleId } }">
              <b-tag type="is-info">编辑</b-tag>
            </router-link>
            <a class="level-item">
              <a-popconfirm title="确定要删除该文章吗?" ok-text="确认" cancel-text="取消" @confirm="handleDelete(topic.articleId)">
                <b-tag type="is-danger">删除</b-tag>
              </a-popconfirm>
            </a>
          </div>
        </nav>
      </el-card>

      <lv-comments :slug="topic.id" :authorId="topicUser.userId" />
    </div>

    <div class="column is-one-quarter">
      <!--作者-->
      <Author :user="topicUser" />
      <!--推荐-->
      <!-- <recommend v-if="flag" :topic-id="topic.id" /> -->

    </div>
  </div>
</template>

<script>
import { deleteTopic, getTopicDetail } from '@/api/post'
import { addView } from '@/api/view'
import { getOpenInfo } from '../../api/user'
import { mapGetters } from 'vuex'
import { getViewCache, setViewCache } from '@/utils/view-cache'
import Author from '@/views/post/Author'
import Recommend from '@/views/post/Recommend'
import LvComments from '@/components/Comment/Comments'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import Score from '@/components/Article/Score'
import Tag from '@/components/Tag/index'
import { getSectionInfoByArticleId } from '@/api/section'

export default {
  name: 'TopicDetail',
  components: { Author, Recommend, LvComments, Score, Tag },
  computed: {
    ...mapGetters([
      'token', 'user'
    ])
  },
  data() {
    return {
      flag: false,  // 是否显示作者模块
      topic: {
        content: '',
        id: this.$route.params.id
      },
      tags: [],
      topicUser: {},
      views: "",
      sectionInfo: {
        sectionId: 1,
        sectionName: '-'
      }
    }
  },
  mounted() {
    this.fetchTopic()
  },
  methods: {
    renderMarkdown(md) {
      Vditor.preview(document.getElementById('preview'), md, {
        hljs: { style: 'github' }
      })
    },
    // 初始化
    fetchTopic() {
      this.$vs.loading({
        container: this.$refs.contentLoading,
        type: "corners",
      })
      window.scrollTo(0, 0);
      getTopicDetail(this.topic.id).then(response => {
        const { data } = response
        document.title = data.title
        this.topic = data
        this.setTopicUser(data.authorId)
        this.renderMarkdown(this.topic.content)
        this.$vs.loading.close(this.$refs.contentLoading)
        getSectionInfoByArticleId(this.topic.articleId).then(rep => {
          this.sectionInfo = rep.data
        })
        if (getViewCache() != this.topic.articleId) {
          setViewCache(this.topic.articleId)
          addView(this.topic.articleId)
        }

      })
    },
    handleDelete(id) {
      deleteTopic(id).then(value => {
        const { code, message } = value
        if (code === 200) {
          this.msg.success(
            message,
            1000
          )
          window.location.href = "/"
        }
        else {
          this.msg.error(
            message,
            1500
          )
        }
      })
    },
    async setTopicUser(id) {
      const { data } = await getOpenInfo(id)
      this.topicUser = data
      this.flag = true
    }
  }
}
</script>

<style>
#preview {
  min-height: 300px;
}
</style>