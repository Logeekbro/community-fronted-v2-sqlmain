<template>

  <div class="member">
    <div class="columns">
      <div class="column is-one-quarter">
        <el-card shadow="never">
          <div slot="header" class="has-text-centered">
            <!-- <el-avatar  :fit="'fill'" :size="64" :src='topicUser.avatar' /> -->
            <user-avatar :size="65" :userId="topicUser.userId" :clickable="false"></user-avatar>
            <!-- <a-avatar shape="circle" :size="65" :src="topicUser.avatar" /> -->
            <p class="mt-3"><strong>{{ topicUser.nickName }}</strong></p>
            <br v-if="!isSelf">
            <follow-button :authorId="topicUser.userId"></follow-button>
            <br v-if="!isSelf">
            <b-button v-if="token && !isSelf" @click="handleCreateChat(topicUser.userId)"
              type="is-info is-light is-link button-center is-fullwidth">发送消息</b-button>
          </div>

          <div>
            <p class="content">注册日期：{{ dayjs(topicUser.createTime).format("YYYY/MM/DD") }}</p>
            <p class="content">简介：{{ topicUser.introduce }}</p>
          </div>
        </el-card>
      </div>

      <div class="column">

        <!-- tabs -->
        <vs-tabs alignment="fixed" style="z-index: 0">
          <!--用户发布的文章-->
          <vs-tab label="文 章" style="padding: 0;" @click="fetchUserById" icon="article">
            <el-card style="height: 509.5px; overflow-y: scroll;overflow-x: hidden;">
              <!-- 浏览本页面的用户不是已登录用户本人时显示的页面 -->
              <div v-if="!isSelf">
                <div v-if="loadText != ''">
                  {{ loadText }}
                </div>
                <div v-if="topics.length === 0">
                  <el-empty description="暂无文章">
                    <!-- <a v-if="topicUser.userId == user.userId" href="/post/create" style="color: blue">点击去发表</a> -->
                  </el-empty>
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
                    <!-- <div v-if="token" class="media-right">
                      <div v-if="topicUser.account === user.account" class="level">
                        <div class="level-item mr-1">
                          <router-link :to="{ name: 'topic-edit', params: { id: item.articleId } }">
                            <span class="tag is-info">编辑</span>
                          </router-link>
                        </div>
                        <div class="level-item">
                          <a-popconfirm title="确定要删除该文章吗?" ok-text="确认" cancel-text="取消"
                            @confirm="handleDelete(item.articleId)">
                            <a>
                              <span class="tag is-danger">删除</span>
                            </a>
                          </a-popconfirm>
                        </div>
                      </div>
                    </div> -->
                  </article>
                </div>
                <!-- 分页 -->
                <pagination v-show="page.total > 0" class="mt-5" :total="page.total" :page.sync="page.current"
                  :limit.sync="page.size" @pagination="fetchUserById" />
              </div>
              <!-- 登录用户本人浏览此页面时显示的内容 -->
              <div v-else>
                <!-- 垂直标签页 -->
                <a-tabs :default-active-key="defaultOpenKey ?  defaultOpenKey : '1'" tab-position="left">
                  <!-- 已发布文章 -->
                  <a-tab-pane key="1" :tab="'已发布' + `(${page.total})`">
                    <div v-if="loadText != ''">
                      {{ loadText }}
                    </div>
                    <div v-if="topics.length === 0">
                      <el-empty description="暂无文章">
                        <router-link v-if="topicUser.userId == user.userId" :to="{path: '/post/create'}" style="color: #167df0">点击去发表</router-link>
                      </el-empty>
                    </div>
                    <div v-else class="topicUser-info">
                      <article v-for="(item, index) in topics" :key="index" class="media">
                        <div class="media-content">
                          <div class="content ellipsis is-ellipsis-1">
                            <el-tooltip :open-delay="700" class="item" effect="dark" :content="item.title"
                              placement="top">
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
                        <div class="media-right">
                          <div v-if="topicUser.account === user.account" class="level">
                            <div class="level-item mr-1">
                              <router-link :to="{ name: 'topic-edit', params: { id: item.articleId } }">
                                <span class="tag is-info">编辑</span>
                              </router-link>
                            </div>
                            <div class="level-item">
                              <a-popconfirm title="确定要删除该文章吗?" ok-text="确认" cancel-text="取消"
                                @confirm="handleDelete(item.articleId)">
                                <a>
                                  <span class="tag is-danger">删除</span>
                                </a>
                              </a-popconfirm>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <!-- 分页 -->
                    <pagination v-show="page.total > 0" class="mt-5" :total="page.total" :page.sync="page.current"
                      :limit.sync="page.size" @pagination="fetchUserById" />
                  </a-tab-pane>
                  <!-- 待审核文章 -->
                  <a-tab-pane key="2" :tab="'待审核' + `(${needReviewArticleCount})`">
                    <div v-if="needReviewArticles.length === 0">
                      <el-empty description="暂无数据">
                        <!-- <a v-if="isSelf" href="/post/create" style="color: blue">点击去发表</a> -->
                      </el-empty>
                    </div>
                    <div v-else class="topicUser-info">
                      <article v-for="(item, index) in needReviewArticles" :key="index" class="media">
                        <div class="media-content">
                          <div class="content ellipsis is-ellipsis-1">
                            <el-tooltip :open-delay="700" class="item" effect="dark" :content="item.title"
                              placement="top">
                              <!-- <router-link :to="{ name: 'post-detail', params: { id: item.articleId } }"> -->
                                <strong>{{ item.title }}</strong>
                              <!-- </router-link> -->
                            </el-tooltip>
                          </div>
                          <nav class="level has-text-grey is-size-7">
                            <div class="level-left">
                              <span class="mr-3">
                                提交时间:{{ dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss") }}
                              </span>
                            </div>
                          </nav>
                        </div>
                        <!-- <div class="media-right">
                          <div v-if="topicUser.account === user.account" class="level">
                            <div class="level-item mr-1">
                              <router-link :to="{ name: 'topic-edit', params: { id: item.articleId } }">
                                <span class="tag is-info">编辑</span>
                              </router-link>
                            </div>
                            <div class="level-item">
                              <a-popconfirm title="确定要删除该文章吗?" ok-text="确认" cancel-text="取消"
                                @confirm="handleDelete(item.articleId)">
                                <a>
                                  <span class="tag is-danger">删除</span>
                                </a>
                              </a-popconfirm>
                            </div>
                          </div>
                        </div> -->
                      </article>
                    </div>
                  </a-tab-pane>
                  <!-- 已退回文章 -->
                  <a-tab-pane key="3" :tab="'已退回' + `(${unPassArticleCount})`">
                    <div v-if="unPassArticles.length === 0">
                      <el-empty description="暂无数据">
                        <!-- <a v-if="isSelf" href="/post/create" style="color: blue">点击去发表</a> -->
                      </el-empty>
                    </div>
                    <div v-else class="topicUser-info">
                      <article v-for="(item, index) in unPassArticles" :key="index" class="media">
                        <div class="media-content">
                          <div class="content ellipsis is-ellipsis-1">
                            <el-tooltip :open-delay="700" class="item" effect="dark" :content="item.title"
                              placement="top">
                              <!-- <router-link :to="{ name: 'post-detail', params: { id: item.articleId } }"> -->
                                <strong>{{ item.title }}</strong>
                              <!-- </router-link> -->
                            </el-tooltip>
                          </div>
                          <nav class="level has-text-grey is-size-7">
                            <div class="level-left">
                              <span class="mr-3">
                                提交时间:{{ dayjs(item.createTime).format("YYYY/MM/DD HH:mm:ss") }}
                              </span>
                            </div>
                          </nav>
                        </div>
                        <div class="media-right">
                          <div v-if="topicUser.account === user.account" class="level">
                            <div class="level-item mr-1">
                              <router-link :to="{ name: 'topic-edit', params: { id: item.articleId }, query: {reEdit: true} }">
                                <span class="tag is-info">重新编辑</span>
                              </router-link>
                            </div>
                            <!-- <div class="level-item">
                              <a-popconfirm title="确定要删除该文章吗?" ok-text="确认" cancel-text="取消"
                                @confirm="handleDelete(item.articleId)">
                                <a>
                                  <span class="tag is-danger">删除</span>
                                </a>
                              </a-popconfirm>
                            </div> -->
                          </div>
                        </div>
                      </article>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </div>

            </el-card>
          </vs-tab>

          <!-- 关注列表 -->
          <vs-tab style="padding: 0" label="关  注" @click="fectchUserFollows" icon="group_work">
            <el-card style="height: 509.5px; overflow-y: scroll; overflow-x: hidden;">
              <div v-if="follows.length == 0" style="text-align: center">
                <el-empty description="暂无关注">
                </el-empty>
              </div>
              <vs-list v-else>
                <router-link v-for="(item, index) in follows" :key="index"
                  :to="{ path: `/member/${item.userId}/home` }">
                  <vs-list-item :title="item.nickName" :subtitle="'简介：' + item.introduce" style="height: 80px">
                    <template slot="avatar">
                      <user-avatar :size="54" :userId="item.userId" style="margin-right: 20px"></user-avatar>
                      <!-- <a-avatar shape="circle" :size="54" :src="item.avatar" style="margin-right: 20px" /> -->
                    </template>
                  </vs-list-item>
                </router-link>
                <!-- <a :href="`/member/${item.userId}/home`">
                  
                </a> -->
              </vs-list>
            </el-card>
          </vs-tab>
        </vs-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { getOpenInfo, getFollows } from '@/api/user'
import { getInfoByName, deleteTopic, getNeedReviewArticleListByUserId, getUnPassReviewListByUserId } from '@/api/post'
import pagination from '@/components/Pagination/index'
import FollowButton from '@/components/Follow/FollowButton'
import { mapGetters } from 'vuex'
import store from '@/store'
import UserAvatar from '@/components/User/Avatar'

export default {
  name: 'Profile',
  components: { pagination, FollowButton, UserAvatar },
  data() {
    return {
      topicUser: {
        userId: -1
      },
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
      follows: [],
      isSelf: false,
      needReviewArticles: [],
      unPassArticles: [],
      defaultOpenKey: this.$route.query.articleType,
      needReviewArticleCount: 0,
      unPassArticleCount: 0
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  watch: {
    topicUser: function (n, o) {
      this.isSelf = n.userId == store.getters.user.userId
    },
    needReviewArticles: function(n, o) {
      this.needReviewArticleCount = n.length
    },
    unPassArticles: function(n, o) {
      this.unPassArticleCount = n.length
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    this.fetchUserById()
    this.fetchNeedReviewArticleList()
    this.fetchUnPassReviewArticleList()
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
    handleCreateChat(userId) {
      this.$router.push({ path: '/message?targetId=' + userId })
    },
    async fetchNeedReviewArticleList() {
      getNeedReviewArticleListByUserId().then(rep => {
        this.needReviewArticles = rep.data
      })
    },
    async fetchUnPassReviewArticleList() {
      getUnPassReviewListByUserId().then(rep => {
        this.unPassArticles = rep.data
      })
    }
  }
}
</script>

<style scoped>

</style>
