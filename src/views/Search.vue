<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        检索到 <code>{{ getInfoCount() }}</code>
        条关于 <code class="has-text-info">{{ articleQuery.keyword }}</code> 的信息
      </div>
      <b-tabs type="is-boxed" v-model="activeTab">
        <b-tab-item>
          <template #header :disabled="articleList == null || articleList.length == 0">
            <vs-icon icon="article"></vs-icon>
            <span> 文章 <b-tag rounded> {{ articleList.length }} </b-tag> </span>
          </template>

          <div>
            <article v-for="(item, index) in articleList" :key="index" class="media">
              <div class="media-left">
                <user-avatar shape="square" :size="48" :userId="item.author.userId" ></user-avatar>
                <!-- <a-avatar shape="square" :size="48" :src="item.author.avatar + '?' + avatarTS" /> -->
              </div>
              <div class="media-content">
                <div class="">
                  <p class="ellipsis is-ellipsis-1">
                    <el-tooltip :open-delay="700" class="item" effect="dark" :content="item.article.title"
                      placement="top">
                      <router-link :to="{ name: 'post-detail', params: { id: item.article.articleId } }">
                        <span class="is-size-6" v-html="highlightKeyword(item.article.title)"></span>
                      </router-link>
                    </el-tooltip>
                  </p>
                </div>
                <nav class="level has-text-grey is-mobile  is-size-7 mt-2">
                  <div class="level-left">
                    <div class="level-left">
                      <router-link class="level-item" :to="{ path: `/member/${item.author.account}/home` }">
                        {{ item.nickName }}
                      </router-link>

                      <span class="mr-1">
                        发布于:{{ dayjs(item.article.createTime).format("YYYY/MM/DD") }}
                      </span>

                      <span v-for="(tag, index) in item.tags" :key="index"
                        class="tag is-hidden-mobile is-success is-light mr-1">
                        <router-link :to="{ name: 'tag', params: { name: tag } }">
                          {{ "#" + tag }}
                        </router-link>
                      </span>

                      <span class="is-hidden-mobile">浏览:{{ item.article.viewCount }}</span>
                    </div>
                  </div>
                </nav>
              </div>
              <div class="media-right" />
            </article>
          </div>

          <!--分页-->
          <pagination v-show="articleQuery.total > 0" :total="articleQuery.total" :page.sync="articleQuery.pageNum"
            :limit.sync="articleQuery.pageSize" @pagination="fetchArticle" />
        </b-tab-item>

        <b-tab-item>
          <template #header>
              <vs-icon icon="label"></vs-icon>
              <span> 标签 <b-tag rounded> {{ tagList.length }} </b-tag> </span>
          </template>
          <vs-list>
            <a :href="`/tag/${item.tagName}`" v-for="(item, index) in tagList" :key="index">
              <vs-list-item icon="grid_3x3" size="large" :title="item.tagName" :subtitle="item.articleCount + '篇相关文章'">
              </vs-list-item>
            </a>
            <pagination v-show="tagQuery.total > 0" :total="tagQuery.total" :page.sync="tagQuery.pageNum"
              :limit.sync="tagQuery.pageSize" @pagination="fetchTag" />
          </vs-list>
        </b-tab-item>

        <b-tab-item>
          <template #header>
            <vs-icon icon="perm_identity"></vs-icon>
            <span> 用户 <b-tag rounded> {{ userList.length }} </b-tag> </span>
          </template>
          <vs-list>
            <a :href="`/member/${item.userId}/home`" v-for="(item, index) in userList" :key="index">
              <vs-list-item :title="item.nickName" :subtitle="'简介：' + item.introduce" style="height: 80px">
                <template slot="avatar">
                  <user-avatar :size="54" :userId="item.userId" style="margin-right: 20px" ></user-avatar>
                  <!-- <a-avatar shape="circle" :size="54" :src="item.avatar" style="margin-right: 20px" /> -->
                </template>
              </vs-list-item>
            </a>
          </vs-list>
        </b-tab-item>
      </b-tabs>

    </el-card>
  </div>
</template>

<script>
import { searchByKeyword, searchByTagName, searchByUserIdOrName } from '@/api/search'
import Pagination from '@/components/Pagination'
import store from '@/store'
import UserAvatar from '@/components/User/Avatar'

export default {
  name: 'Search',
  components: { Pagination, UserAvatar },
  data() {
    return {
      activeTab: 0,
      articleList: [],
      tagList: [],
      userList: [],
      articleQuery: {
        keyword: this.$route.query.key,
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      tagQuery: {
        keyword: this.$route.query.key,
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      userQuery: {
        keyword: this.$route.query.key,
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      avatarTS: store.getters.avatarTS,
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.fetchArticle()
      this.fetchTag()
      this.fetchUser()
    },
    fetchArticle() {
      searchByKeyword(this.articleQuery).then(value => {
        const { data } = value
        this.articleList = data.records
        this.articleQuery.total = data.total
        this.articleQuery.pageSize = data.size
        this.articleQuery.pageNum = data.current
      })
    },
    fetchTag() {
      searchByTagName(this.tagQuery).then(value => {
        const { data } = value
        this.tagList = data.records
        this.tagQuery.total = data.total
        this.tagQuery.pageSize = data.size
        this.tagQuery.pageNum = data.current
      })
    },
    fetchUser() {
      searchByUserIdOrName(this.userQuery).then(value => {
        const { data } = value
        this.userList = data.records
        this.userQuery.total = data.total
        this.userQuery.pageSize = data.size
        this.userQuery.pageNum = data.current
      })
    },
    highlightKeyword(title) {
      return title.replaceAll(this.articleQuery.keyword, "<strong style='color: rgba(31,116,255,1)'>" + this.articleQuery.keyword + "</strong>")
    },
    getInfoCount() {
      const count = this.articleList.length + this.tagList.length + this.userList.length
      return count
    }
  }
}
</script>

<style scoped>
</style>
