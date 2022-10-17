<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="最新文章" name="latest">
            <article-preview :change="tab" :loadData="init" :loadMore="loadMore" :total="page.total"></article-preview>
          </el-tab-pane>
          <el-tab-pane label="热门文章" name="popular">
            <article-preview :change="tab" :loadData="init" :loadMore="loadMore" :total="page.total"></article-preview>
          </el-tab-pane>
        </el-tabs>
      </div>

    </el-card>
  </div>
</template>

<script>
import { getList, getIndexTop } from '@/api/post'
import Pagination from '@/components/Pagination'
import ArticlePreview from '@/components/Article/ArticlePreview'

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
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    // this.init()
  },
  methods: {
    async init() {
      const { data } = await getList(this.page.current, this.page.size, this.tab)
      this.page.current = data.current
      this.page.total = data.total
      this.page.size = data.size
      let records = data.records
      if(this.page.current == 1) {
        const topArticle = await getIndexTop()
        if(topArticle.data && topArticle.data.length > 0) records = topArticle.data.concat(records)
      }
      return records
    },
    handleClick(tab) {
      this.tab = tab.name
      this.page.current = 1
    },
    async loadMore() {
      this.page.current += 1
      return await this.init()
    }
  }
}
</script>

<style scoped>
</style>
