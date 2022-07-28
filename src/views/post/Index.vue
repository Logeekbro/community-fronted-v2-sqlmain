<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="最新文章" name="latest">
            <vs-divider v-if="articleList == null && articleList.length == 0">
              <strong>暂无数据</strong>
            </vs-divider>
            <!-- <article v-else v-for="(item, index) in articleList" :key="index" class="media"> -->
              <!-- java 版 -->
              <!-- <article-preview :article="item.article" :author="item.author" :tags="item.tags"></article-preview> -->

              <!-- sql 版 -->
              <!-- <article-preview :article="item" :author="item" :tags="item.tags"></article-preview>
            </article> -->

            
              <article-preview v-else :articleList="articleList" :listLoading="listLoading" :showLoadMore="hasMore"
              :loadingMore="loadingMore" @doLoadMore="loadMore"></article-preview>
            

            
          </el-tab-pane>
          <el-tab-pane label="热门文章" name="popular">
            <vs-divider v-if="articleList == null && articleList.length == 0">
              <strong>暂无数据</strong>
            </vs-divider>
            <!-- <article v-else v-for="(item, index) in articleList" :key="index" class="media"> -->
              <!-- java 版 -->
              <!-- <article-preview :article="item.article" :author="item.author" :tags="item.tags"></article-preview> -->
              
              <!-- sql 版 -->
              <!-- <article-preview :article="item" :author="item" :tags="item.tags"></article-preview>
            </article> -->
            <article-preview v-else :articleList="articleList" :listLoading="listLoading" :showLoadMore="hasMore"
              :loadingMore="loadingMore" @doLoadMore="loadMore"></article-preview>
          </el-tab-pane>
        </el-tabs>

      </div>
      <!-- <vs-divider v-show="hasMore">
        <div style="text-align: center;">
          <strong><a @click="loadMore">点击加载更多</a></strong>
        </div>
      </vs-divider> -->
    </el-card>
  </div>
</template>

<script>
import { getList } from '@/api/post'
import Pagination from '@/components/Pagination'
import ArticlePreview from '@/components/Article/ArticlePreview'
import store from '@/store'

export default {
  name: 'TopicList',
  components: { Pagination, ArticlePreview },
  data() {
    return {
      activeName: 'latest',
      articleList: [],
      page: {
        current: 1,
        size: 5,
        total: 0,
      },
      tab: 'latest',
      avatarTS: store.getters.avatarTS,
      hasMore: false,
      listLoading: false,
      loadingMore: false
    }
  },
  mounted() {
    this.init(this.tab)
  },
  methods: {
    init(tab) {
      this.listLoading = true
      getList(this.page.current, this.page.size, tab).then((response) => {
        this.listLoading = false
        const { data } = response
        this.page.current = data.current
        this.page.total = data.total
        this.page.size = data.size
        this.articleList = data.records
        if (this.articleList.length >= data.total) {
          this.hasMore = false
        }
        else {
          this.hasMore = true
        }
      })
    },
    handleClick(tab) {
      this.tab = tab.name
      this.page.current = 1
      this.init(tab.name)
    },
    loadMore() {
      this.loadingMore = true
      this.page.current += 1
      getList(this.page.current, this.page.size, this.tab).then((response) => {
        this.loadingMore = false
        const { data } = response
        this.page.current = data.current
        this.page.total = data.total
        this.page.size = data.size
        this.articleList = this.articleList.concat(data.records)
        if (this.articleList.length >= data.total) {
          this.hasMore = false
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
