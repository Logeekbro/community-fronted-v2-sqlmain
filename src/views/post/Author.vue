<template>
  <section id="author">
    <el-card class="" shadow="never">
      <div slot="header">
        <span class="has-text-weight-bold">👨‍💻 关于作者</span>
      </div>
      <div class="has-text-centered">
        <!-- <el-avatar :fit="'fill'" :size="64" :src='user.avatar' /> -->
        <user-avatar :size="65" :userId="user.userId" ></user-avatar>
        <!-- <a-avatar shape="circle" :size="65" :src="user.avatar" /> -->
        <p class="is-size-5 mb-5">
          <router-link :to="{ path: `/member/${user.userId}/home` }">
            {{ user.nickName }} <span class="is-size-7 has-text-grey">{{ '@' + user.account }}</span>
          </router-link>
        </p>
        <div class="columns is-mobile">
          <div class="column is-half">
            <code>{{ articleCount }}</code>
            <p>文章</p>
          </div>
          <div class="column is-half">
            <code>{{ followerCount }}</code>
            <p>粉丝</p>
          </div>
        </div>
        <div>
          <follow-button :authorId="user.userId" @addFollower="addFollower" @reduceFollower="reduceFollower"></follow-button>
        </div>
      </div>
    </el-card>
  </section>
</template>

<script>
import { getFollowerCount } from '@/api/follow'
import FollowButton from '@/components/Follow/FollowButton'
import { getArticleCount } from '@/api/post'
import { mapGetters } from 'vuex'
import store from '@/store'
import UserAvatar from '@/components/User/Avatar'

export default {
  name: 'Author',
  components: {FollowButton, UserAvatar},
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      hasFollow: false,
      userId: store.getters.user.userId,
      followerCount: 0,
      articleCount: 0
    }
  },
  mounted() {
    this.fetchInfo()
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  methods: {
    fetchInfo() {
      this.getArticleCount(this.user.userId)
      this.getFollowerCount(this.user.userId)
    },
    getFollowerCount: function (id) {
      getFollowerCount(id).then(response => {
        const { data } = response
        this.followerCount = data.followerCount
      })
    },
    getArticleCount: function (id) {
      getArticleCount(id).then(response => {
        const { data } = response
        this.articleCount = data.articleCount
      })
    },
    addFollower(){
      this.followerCount++
    },
    reduceFollower() {
      this.followerCount--
    }
  }
}
</script>

<style scoped>
</style>
