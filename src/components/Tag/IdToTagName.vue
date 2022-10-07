<template>
</template>

<script>
import { getTagNameByTagId } from '@/api/tag';

export default {
  components: {},
  props: {
    tagId: {
        type: String,
        default: null
    }
  },
  data() {
    return {
        name: "-"
    };
  },
  watch: {
    tagId: function(n, o) {

    }
  },
  computed: {},
  methods: {
    getTagName(tagId) {
        getTagNameByTagId(tagId).then(rep => {
            this.name = rep.data.value
        })
    }
  },
  created() {},
  mounted() {
    if(this.tagId) this.getTagName(this.tagId)
  }
};
</script>
<style scoped>
</style>