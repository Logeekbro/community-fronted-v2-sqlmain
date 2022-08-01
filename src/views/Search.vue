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
            <span> 文章 <b-tag rounded> {{ articleQuery.total }} </b-tag> </span>
          </template>

          <article-preview :loadData="fetchArticle" :loadMore="loadMoreArticle" :total="articleQuery.total">
          </article-preview>
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
                  <user-avatar :size="54" :userId="item.userId" style="margin-right: 20px"></user-avatar>
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
import UserAvatar from '@/components/User/Avatar'
import ArticlePreview from '@/components/Article/ArticlePreview'

export default {
  name: 'Search',
  components: { Pagination, UserAvatar, ArticlePreview },
  data() {
    return {
      activeTab: 0,
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
      hasMore: false
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      // this.fetchArticle()
      this.fetchTag()
      this.fetchUser()
    },
    async fetchArticle() {
      const { data } = await searchByKeyword(this.articleQuery)
      this.articleQuery.total = data.total
      this.articleQuery.pageSize = data.size
      this.articleQuery.pageNum = data.current
      return data.records
    },
    async loadMoreArticle() {
      this.articleQuery.pageNum += 1
      return await this.fetchArticle()
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
      const count = this.articleQuery.total + this.tagList.length + this.userList.length
      return count
    },
  }
}
</script>

<style scoped>
</style>
