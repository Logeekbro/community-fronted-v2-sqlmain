<template>
  <header class="header has-background-white has-text-black">
    <b-navbar class="container is-white" :fixed-top="true" style="height: 7%">
      <template slot="brand">
        <b-navbar-item tag="div">
          <img :src="doubaoImg" alt="logo">
        </b-navbar-item>

        <b-navbar-item class="is-hidden-desktop" tag="router-link" :to="{ path: '/' }">
          主页
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          🌐 主页
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div" style="margin-top: 15px">
          <b-field position="is-centered">
            <b-input v-model="searchKey" class="s_input" width="80%" placeholder="搜索文章、标签和用户" rounded clearable
              @keyup.enter.native="search()" />

            <p class="control">
              <b-button class="is-info" @click="search()">检索
              </b-button>
            </p>
          </b-field>
        </b-navbar-item>

        <b-navbar-item tag="div">
          <b-switch v-model="darkMode" passive-type="is-warning" type="is-dark" style="font-size: 20px">
            {{ darkMode ? "🌙" : "☀" }}
          </b-switch>
        </b-navbar-item>

        <b-navbar-item v-if="token == null || token === ''" tag="div">
          <div class="buttons">
            <b-button class="is-light" tag="router-link" :to="{ path: '/register' }">
              注册
            </b-button>
            <b-button class="is-light" tag="router-link" :to="{ path: '/login' }">
              登录
            </b-button>
          </div>
        </b-navbar-item>
        <b-navbar-item v-else>
          <!-- <el-avatar :size="30" :fit="'fill'" :src="user.avatar" /> -->
          <!-- <b-navbar-item>
            <a-avatar shape="square" :size="25" :src="user.avatar" />
          </b-navbar-item> -->
          <b-navbar-dropdown :label="user.nickName">
            <b-navbar-item tag="router-link" :to="{ path: `/member/${user.userId}/home` }">
              🧘 个人中心
            </b-navbar-item>
            <hr class="dropdown-divider">
            <b-navbar-item tag="router-link" :to="{ path: `/member/${user.userId}/setting` }">
              ⚙ 设置中心
            </b-navbar-item>
            <hr class="dropdown-divider">
            <b-navbar-item tag="a" @click="logout"> 👋 退出登录
            </b-navbar-item>
          </b-navbar-dropdown>
        </b-navbar-item>

      </template>
    </b-navbar>
  </header>
</template>

<script>
import { disable as disableDarkMode, enable as enableDarkMode } from 'darkreader'
import { getDarkMode, setDarkMode } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      logoUrl: require('@/assets/logo.png'),
      doubaoImg: require('@/assets/image/doubao.png'),
      searchKey: '',
      darkMode: false,
    }
  },
  computed: {
    ...mapGetters(['token', 'user'])
  },
  watch: {
    // 监听Theme模式
    darkMode(val) {
      if (val) {
        enableDarkMode({})
      } else {
        disableDarkMode()
      }
      setDarkMode(this.darkMode)
    }
  },
  created() {
    // 获取cookie中的夜间还是白天模式
    this.darkMode = getDarkMode()
    if (this.darkMode) {
      enableDarkMode({})
    } else {
      disableDarkMode()
    }
  },
  methods: {
    async logout() {
      this.$store.dispatch('user/logout').then(() => {
        setTimeout(() => {
          this.$router.push({ path: this.redirect || '/login' })
        }, 500)
      })
    },
    search() {
      if (this.searchKey.trim() === null || this.searchKey.trim() === '') {
        this.msg.warn('请输入关键字搜索！')
        return false
      }
      this.$router.push({ path: '/search?key=' + this.searchKey })
    },
    async getUserInfo() {
      this.$store.dispatch('user/getInfo');
    }
  }
}
</script>

<style scoped>
input {
  width: 80%;
  height: 86%;
}
</style>
