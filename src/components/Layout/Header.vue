<template>
  <header class="header has-background-white has-text-black">
    <b-navbar class="container is-white" style="height: 10%;">
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
      <!-- <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/section' }">
          🌗 分区
        </b-navbar-item>
      </template> -->
      <template slot="end">
        <b-navbar-item tag="div" style="margin-top: 15px">
          <b-field position="is-centered">
            <b-input v-model="searchKey" class="s_input" width="80%" placeholder="搜索文章、标签和用户" rounded clearable
              @keyup.enter.native="search()" />

            <p class="control">
              <b-button class="is-info" @click="search()">搜 索
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
          <el-badge :hidden="unReadCount <= 0" value="new" class="item">
            <b-navbar-dropdown :label="user.nickName">
              <b-navbar-item tag="router-link" :to="{ path: `/member/${user.userId}/home` }">
                🧘 个人中心
              </b-navbar-item>
              <hr class="dropdown-divider">
              <b-navbar-item tag="router-link" :to="{ path: `/history` }">
                ⏳ 浏览记录
                <!-- <vs-icon icon="history" style="margin-right: 5px"></vs-icon> 浏览记录 -->
              </b-navbar-item>
              <hr class="dropdown-divider">
              <b-navbar-item tag="router-link" :to="{ path: `/message` }">
                <el-badge :hidden="unReadCount <= 0" :value="unReadCount" :max="99" class="item">
                  📧 消息中心
                </el-badge>
              </b-navbar-item>
              <hr class="dropdown-divider">
              <b-navbar-item tag="router-link" :to="{ path: `/member/setting` }">
                ⚙ 设置中心
              </b-navbar-item>
              <hr class="dropdown-divider">
              <b-navbar-item tag="router-link" :to="{ path: `/custom` }">
                🔧 个性化
              </b-navbar-item>
              <hr class="dropdown-divider">
              <b-navbar-item tag="a" @click="logout"> 👋 退出登录
              </b-navbar-item>
            </b-navbar-dropdown>
          </el-badge>
        </b-navbar-item>

      </template>
    </b-navbar>
  </header>
</template>

<script>
import { disable as disableDarkMode, enable as enableDarkMode } from 'darkreader'
import { getAllUnReadCount } from '@/api/message'
import { getDarkMode, setDarkMode } from '@/utils/auth'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'Header',
  data() {
    return {
      logoUrl: require('@/assets/logo.png'),
      doubaoImg: require('@/assets/image/doubao.png'),
      searchKey: '',
      darkMode: false,
      unReadCount: 0,
      cycleId: 0,
      cycleTime: 10 * 1000
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
  mounted() {
    // 获取cookie中的夜间还是白天模式
    this.darkMode = getDarkMode()
    if (this.darkMode) {
      enableDarkMode({})
    } else {
      disableDarkMode()
    }

    if (store.getters.token != null && store.getters.token != '') {
      this.getMessageCount()
      const isDoCycle = localStorage.getItem('openMessageFetch') == null ? true : Boolean(localStorage.getItem('openMessageFetch'))
      if (isDoCycle) {
        this.cycleTime = (localStorage.getItem('messageCycleTime') == null ? 10 : localStorage.getItem('messageCycleTime')) * 1000
        this.cycleGetMessageCount()
      }

    }

  },
  destroyed() {
    clearInterval(this.cycleId)
  },
  methods: {
    async logout() {
      this.$store.dispatch('user/logout').then(() => {
        setTimeout(() => {
          this.$router.push({ path: this.redirect || '/login' })
        }, 1)
      })
    },
    search() {
      if (this.searchKey.trim() === null || this.searchKey.trim() === '') {
        this.searchKey = ''
        this.msg.warn('请输入关键字搜索！')
        return false
      }

      this.$router.push({ path: '/search?key=' + this.searchKey })
      this.searchKey = ''
    },
    async getUserInfo() {
      this.$store.dispatch('user/getInfo');
    },
    getMessageCount() {
      if (store.getters.token == null || store.getters.token == '') {
        clearInterval(this.cycleId)
      }
      else {
        getAllUnReadCount().then(r => {
          this.unReadCount = r.data.value
        })
      }

    },
    cycleGetMessageCount() {
      this.cycleId = setInterval(this.getMessageCount, this.cycleTime)
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
