<template>
  <section class="box comments">
    <hr />
    
    <h3 class="title is-5">评论</h3>
    <div id="top"></div>
    <lv-comments-form :slug="slug" @loadComments="fetchComments" />
    
    <lv-comments-item @loadComments="fetchComments" v-for="comment in comments"
      :key="`comment-${comment.comment.commentId}`" :comment="comment" :ts="Date.now()" :authorId="authorId" />

    <pagination v-show="page.total > 0" class="mt-5" :total="page.total" :page.sync="page.current"
      :limit.sync="page.size" :autoScroll="false" @pagination="fetchComments" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import pagination from '@/components/Pagination/index'
import { fetchCommentsByTopicId } from '@/api/comment'
import LvCommentsForm from './CommentsForm'
import LvCommentsItem from './CommentsItem'

export default {
  name: 'LvComments',
  components: {
    LvCommentsForm,
    LvCommentsItem,
    pagination
  },
  data() {
    return {
      comments: [],
      topicId: this.slug,
      page: {
        current: 1,
        size: 10,
        total: 0
      },
    }
  },
  props: {
    slug: {
      type: String,
      default: null
    },
    authorId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  async mounted() {
    this.fetchComments(false)
  },
  methods: {
    // 初始化, autoScroll:是否自动滚动到评论区顶部，toFirst:是否跳转到第一页
    async fetchComments(autoScroll=true, toFirst=false) {
      if(toFirst){
        this.page.current = 1
      }
      fetchCommentsByTopicId(this.topicId, this.page.current, this.page.size).then(response => {
        const { data } = response
        this.page = data
        this.comments = data.records
        if(autoScroll){
          var element_to_scroll_to = document.getElementById('top');
          element_to_scroll_to.scrollIntoView();
        }
      })
    }
  }
}
</script>
