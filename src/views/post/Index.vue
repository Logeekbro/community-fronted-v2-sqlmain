<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="最新文章" name="latest">
            <vs-divider v-if="articleList == null && articleList.length == 0">
              <strong>暂无数据</strong>
            </vs-divider>
            <article v-else v-for="(item, index) in articleList" :key="index" class="media">
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
          </el-tab-pane>
          <el-tab-pane label="热门文章" name="popular">
            <vs-divider v-if="articleList == null && articleList.length == 0">
              <strong>暂无数据</strong>
            </vs-divider>
            <article v-else v-for="(item, index) in articleList" :key="index" class="media">
              <div class="media-left">
                <a-avatar shape="square" :size="48" :src="item.author.avatar + '?' + avatarTS" />
              </div>
              <div class="media-content">
                <div class="">
                  <p class="ellipsis is-ellipsis-1">
                    <el-tooltip :open-delay="700" class="item" effect="dark" :content="item.article.title"
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
          </el-tab-pane>
        </el-tabs>

      </div>
      <vs-divider v-if="articleList == null && articleList.length == 0">
        <strong><a @click="loadMore">点击加载更多</a></strong>
      </vs-divider>
      <!-- <div style="text-align: center;" v-show="hasMore">
        <a @click="loadMore">点击加载更多</a>
      </div> -->

      <!--分页-->
      <!-- <pagination
        v-show="page.total > 0"
        :total="page.total"
        :page.sync="page.current"
        :limit.sync="page.size"
        @pagination="init(tab)"
      /> -->
    </el-card>
  </div>
</template>

<script>
import { getList } from '@/api/post'
import Pagination from '@/components/Pagination'
import store from '@/store'

export default {
  name: 'TopicList',
  components: { Pagination },
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
      hasMore: true
    }
  },
  created() {
    this.init(this.tab)
  },
  methods: {
    init(tab) {
      getList(this.page.current, this.page.size, tab).then((response) => {
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
      this.page.current += 1
      getList(this.page.current, this.page.size, this.tab).then((response) => {
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
