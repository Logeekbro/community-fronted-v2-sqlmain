<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="content">
      <h4>🌡 活跃作者Top{{ Math.min(authors.length, n) }}</h4>
    </div>
    <div>
      <div v-for="(item, index) in authors" :key="index">
        <router-link :to="{ path: `/member/${item.authorId}/home` }">
          <div class="content">
            <Avatar style="display: inline-block; margin-right: 10px" :userId="item.authorId" shape="square"></Avatar>
            <strong>
              <NickName style="display: inline-block;" :userId="item.authorId"></NickName>
            </strong>
          </div>
        </router-link>

        <el-divider direction="vertical" />
        文章数量：<code>{{ item.articleCount }}</code>


        <vs-divider></vs-divider>
      </div>
      <!-- <div class="has-text-right mt-5 block">
        ——{{ tip.author }}
      </div> -->
    </div>
  </el-card>
</template>

<script>
import { getActiveAuthors } from '@/api/post'
import Avatar from '@/components/User/Avatar'
import NickName from '@/components/User/NickName';

export default {
  name: "ActiveAuthor",
  data() {
    return {
      n: 10,
      authors: []
    };
  },
  created() {
    this.fetchActiveAuthors();
  },
  methods: {
    fetchActiveAuthors() {
      getActiveAuthors(this.n).then(response => {
        const { data } = response;
        this.authors = data;
      });
    }
  },
  components: { Avatar, NickName }
}
</script>

<style scoped>

</style>
