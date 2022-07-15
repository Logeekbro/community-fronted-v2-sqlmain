<template>
  <footer class="footer has-text-grey-light has-background-grey-darker">
    <div class="container" style="padding: 20px">
      <div class="">
        <!-- <span>越小卡，越大莎，这句话用来形容卡勾真是再合适不过了😋</span> -->

        <!-- <span style="float: right">
          <router-link :to="{path:'/admin/login'}">
            管理员登录
          </router-link>
          |
          <a href="/?lang=zh_CN">中文</a> |
          <a href="/?lang=en_US">English</a>
        </span> -->
      </div>

      <div>
        <span>{{ title }} ALL RIGHTS RESERVED</span>
        <div style="float: right">
          <template>
            <b-taglist attached>
              <b-tag type="is-dark" size="is-normal">Design</b-tag>
              <b-tag type="is-info" size="is-normal">{{ author }}</b-tag>
            </b-taglist>
          </template>
        </div>
      </div>
    </div>
    <back-top></back-top>
  </footer>
</template>

<script>
import BackTop from "@/components/Backtop/BackTop";

export default {
  name: "Footer",
  components: {
    BackTop
  },
  data() {
    return {
      title: "© " + new Date().getFullYear() + ' db',
      author: 'db',
    };
  },
};
</script>

<style scoped>

footer {
  margin-top: 50px;
  height: 30px;
}
footer a{
  color: #bfbfbf;
}

</style>