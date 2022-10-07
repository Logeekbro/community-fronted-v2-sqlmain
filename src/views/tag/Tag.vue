<template>
  <div id="tag" class="columns">
    <div class="column is-three-quarters">
      <el-card class="box-card" shadow="never">
        <div slot="header">
          🔍 检索到 <span class="has-text-info">{{ page.total }}</span> 篇含有标签
          <span class="has-text-info">{{ '#' + this.$route.params.name }}</span>
          的文章
        </div>
        <article-preview :loadData="fetchList" :loadMore="loadMore" :total="page.total"></article-preview>
        
      </el-card>
    </div>

    <div class="column">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          🤙 关于标签
        </div>
        <div>
          <ul>
            <li class="content">标签由用户发布使用</li>
            <!-- <li class="content">系统每周会定时清理无用标签</li> -->
          </ul>
        </div>
      </el-card>
      <!-- <el-card shadow="hover">
        <div slot="header">
          🏷 热门标签
        </div>
        <div>
          <ul>
            <li v-for="(tag,index) in tags" :key="index" style="padding: 6px 0">
              <router-link :to="{name:'tag',params:{name:tag.name}}">
                <span v-if="index<9" class="tag">
                  0{{ parseInt(index) + 1 }}
                </span>
                <span v-else class="tag">
                  {{ parseInt(index) + 1 }}
                </span>
                {{ tag.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </el-card> -->
    </div>
  </div>

</template>

<script>
import { getTopicsByTag } from '@/api/search'
import ArticlePreview from '@/components/Article/ArticlePreview'

export default {
  name: 'Tag',
  components: {ArticlePreview},
  data() {
    return {
      topics: [],
      tags: [],
      page: {
        name: this.$route.params.name,
        current: 1,
        size: 10,
        total: 0
      },
      showResult: false
    }
  },
  mounted() {
    // this.fetchList()
    window.scrollTo(0, 0);
  },
  methods: {
    async fetchList() {
      const { data } = await getTopicsByTag(this.page)
      this.page.current = data.current
      this.page.size = data.size
      this.page.total = data.total
      return data.records
    },
    async loadMore() {
      this.page.current += 1
      return await this.fetchList()
    }
  }
}
</script>

<style scoped>
#tag {
  min-height: 500px;
}
</style>
