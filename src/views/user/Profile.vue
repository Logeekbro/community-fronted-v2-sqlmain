<template>
  <div class="member">
    <div class="columns">
      <div class="column is-one-quarter">
        <el-card shadow="never">
          <div slot="header" class="has-text-centered">
            <!-- <el-avatar  :fit="'fill'" :size="64" :src='topicUser.avatar' /> -->
            <a-avatar shape="circle" :size="65" :src="topicUser.avatar" />
            <p class="mt-3"><strong>{{ topicUser.nickName }}</strong></p>
            <br>
            <follow-button :authorId="topicUser.userId"></follow-button>
          </div>

          <div>
            <!-- <p class="content">积分：<code>{{ topicUser.score }}</code></p> -->
            <p class="content">注册日期：{{ dayjs(topicUser.createTime).format("YYYY/MM/DD") }}</p>
            <p class="content">简介：{{ topicUser.introduce }}</p>
          </div>
        </el-card>
      </div>

      <div class="column">

        <!-- tabs -->
        <vs-tabs alignment="fixed">
          <!--用户发布的文章-->
          <vs-tab label="文章" style="padding: 0" @click="fetchUserById">
            <el-card>
              <div v-if="loadText != ''">
                {{ loadText }}
              </div>
              <div v-if="topics.length === 0">
                暂无
              </div>
              <div v-else class="topicUser-info">
                <article v-for="(item, index) in topics" :key="index" class="media">
                  <div class="media-content">
                    <div class="content ellipsis is-ellipsis-1">
                      <el-tooltip :open-delay="700" class="item" effect="dark" :content="item.title" placement="top">
                        <router-link :to="{ name: 'post-detail', params: { id: item.articleId } }">
                          <strong>{{ item.title }}</strong>
                        </router-link>
                      </el-tooltip>
                    </div>
                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-3">
                          发布时间:{{ dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss") }}
                        </span>
                        <span class="mr-1">
                          修改时间:{{ dayjs(item.modifyTime).format("YYYY/MM/DD HH:mm:ss") }}
                        </span>
                      </div>
                    </nav>
                  </div>
                  <div v-if="token" class="media-right">
                    <div v-if="topicUser.account === user.account" class="level">
                      <div class="level-item mr-1">
                        <router-link :to="{ name: 'topic-edit', params: { id: item.articleId } }">
                          <span class="tag is-info">编辑</span>
                        </router-link>
                      </div>
                      <div class="level-item">
                        <a @click="handleDelete(item.articleId)">
                          <span class="tag is-danger">删除</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
              <!-- 分页 -->
              <pagination v-show="page.total > 0" class="mt-5" :total="page.total" :page.sync="page.current"
                :limit.sync="page.size" @pagination="fetchUserById" />
            </el-card>
          </vs-tab>

          <!-- 关注列表 -->
          <vs-tab label="关注" @click="fectchUserFollows">
            <el-card>
              <div v-if="follows.length == 0" style="text-align: center">
                <strong>暂无关注</strong>
              </div>
              <vs-list v-else>
                <a :href="`/member/${item.userId}/home`" v-for="(item, index) in follows" :key="index">
                  <vs-list-item :title="item.nickName" :subtitle="'简介：' + item.introduce" style="height: 80px">
                    <template slot="avatar">
                      <a-avatar shape="circle" :size="54" :src="item.avatar" style="margin-right: 20px" />
                    </template>
                  </vs-list-item>
                </a>
              </vs-list>
            </el-card>
          </vs-tab>

          <!-- 浏览历史记录 -->
          <vs-tab label="浏览记录" v-if="topicUser.userId == user.userId" @click="fetchUserHistory">
            <el-card>
              <div v-if="loadText != ''">
                {{ loadText }}
              </div>
              <div v-if="historys.length === 0">
                暂无浏览记录
              </div>
              <div v-else class="topicUser-info">
                <article v-for="(item, index) in historys" :key="index" class="media">
                  <div class="media-content">
                    <div class="content ellipsis is-ellipsis-1">
                      <el-tooltip :open-delay="700" class="item" effect="dark" :content="item.article.title"
                        placement="top">
                        <router-link :to="{ name: 'post-detail', params: { id: item.article.articleId } }">
                          <strong>{{ item.article.title }}</strong>
                        </router-link>
                      </el-tooltip>
                    </div>
                    <nav class="level has-text-grey is-size-7">
                      <div class="level-left">
                        <span class="mr-3">
                          作者:{{ item.author.nickName }}
                        </span>
                        <el-divider direction="vertical" />
                        <span class="mr-1">
                          浏览时间:{{ dayjs(item.view.createTime).format("YYYY/MM/DD HH:mm:ss") }}
                        </span>
                      </div>
                    </nav>
                  </div>
                  <!-- <div v-if="token" class="media-right">
                    <div v-if="topicUser.account === user.account" class="level">
                      <div class="level-item mr-1">
                        <router-link :to="{ name: 'topic-edit', params: { id: item.articleId } }">
                          <span class="tag is-info">编辑</span>
                        </router-link>
                      </div>
                      <div class="level-item">
                        <a @click="handleDelete(item.articleId)">
                          <span class="tag is-danger">删除</span>
                        </a>
                      </div>
                    </div>
                  </div> -->
                </article>
              </div>
              <!-- 分页 -->
              <pagination v-show="historyPage.total > 0" class="mt-5" :total="historyPage.total"
                :page.sync="historyPage.current" :limit.sync="historyPage.size" @pagination="fetchUserHistory" />
            </el-card>
          </vs-tab>
        </vs-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { getOpenInfo, getFollows } from '@/api/user'
import pagination from '@/components/Pagination/index'
import FollowButton from '@/components/Follow/FollowButton'
import { mapGetters } from 'vuex'
import { getInfoByName, deleteTopic, getUserHistory } from '@/api/post'
import store from '@/store'

export default {
  name: 'Profile',
  components: { pagination, FollowButton },
  data() {
    return {
      topicUser: null,
      topics: {},
      page: {
        current: 1,
        size: 5,
        total: 0,
      },
      historyPage: {
        current: 1,
        size: 10,
        total: 0,
      },
      historys: [],
      loadText: '',
      follows: []
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  created() {
    this.fetchUserById()
    getOpenInfo(this.$route.params.username).then((res) => {
      const { data } = res
      data.avatar += "?" + store.getters.avatarTS
      this.topicUser = data
    });
  },
  methods: {
    async fetchUserById() {
      this.loadText = "加载中..."
      getInfoByName(this.$route.params.username, this.page.current, this.page.size).then((res) => {
        const { data } = res
        this.page.current = data.current
        this.page.size = data.size
        this.page.total = data.total
        this.topics = data.records
        this.loadText = ''
      });
    },
    async fectchUserFollows() {
      getFollows(this.$route.params.username).then((res) => {
        const { data } = res
        this.follows = data
      })
    },
    handleDelete(id) {
      deleteTopic(id).then(value => {
        const { code, message } = value
        if (code === 200) {
          this.msg.success(
            message
          )
          this.fetchUserById()
        }
        else {
          this.msg.error(
            message,
            1500
          )
        }
      })
    },
    async fetchUserHistory(event, current = this.historyPage.current, size = this.historyPage.size) {
      getUserHistory(current, size).then((rep) => {
        const { data } = rep
        this.historyPage = data
        this.historys = data.records
      })
    }
  }
}
</script>

<style scoped>
</style>
