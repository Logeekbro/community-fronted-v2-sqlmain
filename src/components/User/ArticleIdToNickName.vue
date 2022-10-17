<template>
    
    <router-link v-if="name && isLink" :to="{ path: `/member/${userId}/home` }">
        <strong>{{ name }}</strong>
    </router-link>
    <span v-else>{{ name ? name : "[用户不存在]" }}</span>
</template>

<script>

import { getAuthorIdAndNickNameByArticleId } from '@/api/user'

export default {
    name: "ArticleIdToNickName",
    components: {},
    props: {
        articleId: {
            type: String,
            default: null
        },
        // 是否为超链接
        isLink: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            name: "-",
            userId: null
        };
    },
    watch: {
        articleId: function (n, o) {
            this.getNickName(n)
        }
    },
    computed: {},
    methods: {
        getNickName(articleId) {
            getAuthorIdAndNickNameByArticleId(articleId).then(rep => {
                this.userId = rep.data.userId
                this.name = rep.data.nickName
            })
        }
    },
    created() { },
    mounted() {
        if (this.articleId) this.getNickName(this.articleId)
    }
};
</script>
<style scoped>

</style>