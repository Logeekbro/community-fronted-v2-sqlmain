<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="content">
      <h4>🔥 热门标签</h4>
    </div>
    <div>
      <b-taglist>
        <span v-for="(item, index) in list" :key="index" class="tag is-hidden-mobile is-success is-light mr-5 mt-15">
            <router-link :to="{ name: 'tag', params: { name: item.tagName } }">
                {{ '#' + item.tagName + '(' + item.articleCount + ')' }}
            </router-link>
        </span>
    </b-taglist>
    </div>
  </el-card>
</template>

<script>
import { getHotTags } from '@/api/tag'

export default {
    name: "HotTags",
    data() {
        return {
            list: [],
            n: 10
        };
    },
    created() {
        this.fetchList();
    },
    methods: {
        fetchList() {
            getHotTags(this.n).then((response) => {
                const { data } = response;
                this.list = data;
            });
        }
    },
}
</script>

<style scoped>
</style>
