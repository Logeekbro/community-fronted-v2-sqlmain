<template>
  <section>
    <!--是否登录-->
    <login-welcome />

    <!--活跃作者-->
    <active-author></active-author>

    <!--资源推介-->
    <!-- <PromotionCard /> -->
  </section>
</template>

<script>
import ActiveAuthor from '@/views/card/ActiveAuthor'
import PromotionCard from '@/views/card/Promotion'
import LoginWelcome from '@/views/card/LoginWelcome'

export default {
  name: 'CardBar',
  components: { LoginWelcome, PromotionCard, ActiveAuthor }
}
</script>

<style scoped>
</style>
