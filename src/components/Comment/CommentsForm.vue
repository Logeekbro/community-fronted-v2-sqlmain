<template>
  <article class="media">
    <div class="media-content">
      <form @submit.prevent="onSubmit">
        <b-field>
          <b-input
            v-model.lazy="commentText"
            type="textarea"
            maxlength="400"
            :placeholder="token ? '输入评论...' : '以游客身份发表评论...'"
            :disabled="isLoading"
          ></b-input>
        </b-field>
        <nav class="level">
          <div class="level-left">
            <b-button
              type="is-primary"
              native-type="submit"
              class="level-item"
              :disabled="isLoading"
            >
              发表评论
            </b-button>
          </div>
        </nav>
      </form>
    </div>
  </article>
</template>

<script>
import { pushComment } from '@/api/comment'
import { mapGetters } from 'vuex'

export default {
  name: 'LvCommentsForm',
  data() {
    return {
      commentText: '',
      isLoading: false,
      mySlug: 1
    }
  },
  props: {
    slug: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  created() {
    this.mySlug = this.slug
  },
  methods: {
    async onSubmit() {
      this.isLoading = true
      if(this.commentText.trim() === ''){
        this.msg.warn("评论内容不能为空！");
        this.isLoading = false
        this.commentText = ''
        return
      }
      try {
        let postData = {}
        postData['content'] = this.commentText
        postData['articleId'] = this.mySlug
        await pushComment(postData)
        this.$emit('loadComments', true, true)
      } catch (e) {
        this.msg.error(`评论失败: ${e}`);
      } finally {
        this.isLoading = false
        this.commentText = ''
      }
    }
  }
}
</script>
