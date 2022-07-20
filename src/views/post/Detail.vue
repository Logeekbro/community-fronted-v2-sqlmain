<template>
  <div class="columns">
    <!--文章详情-->
    <div class="column is-three-quarters">
      <!--主题-->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="has-text-centered">
          <p class="is-size-5 has-text-weight-bold">{{ topic.title }}</p>
          <div class="has-text-grey is-size-7 mt-3">
            <span>{{ dayjs(topic.createTime).format('YYYY/MM/DD HH:mm:ss') }}</span>
            <!-- <el-divider direction="vertical" />
            <span>发布者：{{ topicUser.nickName }}</span> -->
            <el-divider direction="vertical" />
            <span>浏览：{{ topic.viewCount }}</span>
          </div>
        </div>

        <!--Markdown-->
        <div id="preview" />

        <!--标签-->
        <nav class="level has-text-grey is-size-7 mt-6">
          <div class="level-left">
            <p class="level-item">
              <b-taglist>
                <router-link v-for="(tag, index) in tags" :key="index" :to="{ name: 'tag', params: { name: tag } }">
                  <b-tag type="is-info is-light mr-1">
                    {{ "#" + tag }}
                  </b-tag>
                </router-link>
              </b-taglist>
            </p>
          </div>
          <div v-if="token && user.userId === topicUser.userId" class="level-right">
            <router-link class="level-item" :to="{ name: 'topic-edit', params: { id: topic.articleId } }">
              <!-- <span class="tag">编辑</span> -->
              <b-tag type="is-info">编辑</b-tag>
            </router-link>
            <a class="level-item">
              <!-- <span class="tag" @click="handleDelete(topic.articleId)">删除</span> -->
              <a-popconfirm title="确定要删除该文章吗?" ok-text="确认" cancel-text="取消" @confirm="handleDelete(topic.articleId)">
                <b-tag type="is-danger">删除</b-tag>
              </a-popconfirm>
            </a>
          </div>
        </nav>
      </el-card>

      <lv-comments :slug="topic.id" :authorId="topicUser.userId" />
    </div>

    <div class="column">
      <!--作者-->
      <Author v-if="flag" :user="topicUser" />
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
import store from '@/store/'

export default {
  name: 'TopicDetail',
  components: { Author, Recommend, LvComments },
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
      window.scrollTo(0, 0);
      getTopicDetail(this.topic.id).then(response => {
        const { data } = response
        // =============java 版==================
        // document.title = data.article.title
        // this.topic = data.article
        // this.tags = data.tags
        // data.author.avatar += "?" + store.getters.avatarTS
        // this.topicUser = data.author
        // this.flag = true
        // ======================================

        // =============sql版==================
        document.title = data.title
        this.topic = data
        this.tags = data.tags
        this.setTopicUser(data.authorId)
        this.renderMarkdown(this.topic.content)
        // ====================================
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