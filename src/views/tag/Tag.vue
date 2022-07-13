<template>
  <div id="tag" class="columns">
    <div class="column is-three-quarters">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="">
          🔍 检索到 <span class="has-text-info">{{ topics.length }}</span> 篇含有标签
          <span class="has-text-info">{{ '#' + this.$route.params.name }}</span>
          的文章
        </div>

        <div class="text item">
          <article v-for="(item, index) in topics" :key="index" class="media">
              <div class="media-left">
                <!-- <figure class="image is-48x48">
                  <img :src="item.author.avatar + '?' + avatarTS" style="border-radius: 5px;">
                </figure> -->
                <a-avatar shape="square" :size="48" :src="item.author.avatar + '?' + avatarTS" />
              </div>
              <div class="media-content">
                <div class="">
                  <p class="ellipsis is-ellipsis-1">
                    <el-tooltip :open-delay="500" class="item" effect="dark" :content="item.article.title"
                      placement="top">
                      <router-link :to="{ name: 'post-detail', params: { id: item.article.articleId } }">
                        <span class="is-size-6"><strong>{{ item.article.title }}</strong></span>
                      </router-link>
                    </el-tooltip>
                  </p>
                </div>
                <nav class="level has-text-grey is-mobile  is-size-7 mt-2">
                  <div class="level-left">
                    <div class="level-left">
                      <router-link class="level-item" :to="{ path: `/member/${item.author.userId}/home` }">
                        {{ item.author.nickName }}
                      </router-link>

                      <span class="mr-1">
                        发布于:{{ dayjs(item.article.createTime).format("YYYY/MM/DD HH:mm") }}
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
      </el-card>
    </div>

    <div class="column">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          🤙 关于标签
        </div>
        <div>
          <ul>
            <li class="content">标签由平台用户发布使用</li>
            <li class="content">系统每周会定时清理无用标签</li>
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

export default {
  name: 'Tag',
  data() {
    return {
      topics: [],
      tags: [],
      paramMap: {
        name: this.$route.params.name,
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList: function() {
      getTopicsByTag(this.paramMap).then(response => {
        const { data } = response
        this.topics = data
      })
    }
  }
}
</script>

<style scoped>
#tag {
  min-height: 500px;
}
</style>
