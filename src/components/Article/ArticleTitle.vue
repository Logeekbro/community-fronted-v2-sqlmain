<template>
    <span>{{ title ? title : "[文章不存在或已被删除]" }}</span>
</template>

<script>
import { getTitleByArticleId } from '@/api/post';

export default {
  name: "ArticleTitle",
  props: {
    articleId: {
        type: String,
        default: null
    }
  },
  data() {
    return {
        title: "-"
    };
  },
  watch: {
    articleId: function(n, o) {
        console.log("新的articleId:")
        console.log(n)
        this.getTitle(n);
    }
  },
  computed: {},
  methods: {
    getTitle(articleId) {
        getTitleByArticleId(articleId).then(rep => {
            this.title = '《' + rep.data.value + '》'
        })
    }
  },
  created() {},
  mounted() {
    if(this.articleId) {
        this.getTitle(this.articleId)
    }
  }
};
</script>
<style scoped>
</style>