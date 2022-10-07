<template>
  <section>
    <!--是否登录-->
    <login-welcome />

    <!--活跃作者-->
    <active-author></active-author>

    <!--热门标签-->
    <HotTags />
  </section>
</template>

<script>
import ActiveAuthor from '@/views/card/ActiveAuthor'
import HotTags from '@/views/card/HotTags'
import LoginWelcome from '@/views/card/LoginWelcome'

export default {
  name: 'CardBar',
  components: { LoginWelcome, HotTags, ActiveAuthor }
}
</script>

<style scoped>
</style>
