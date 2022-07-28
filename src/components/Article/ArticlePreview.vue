<template>
    <div class="media">
        <div class="media-left">
            <user-avatar :userId="author.authorId" :size="48" :shape="'square'"></user-avatar>
        </div>
        <div class="media-content">
            <div class="">
                <p class="ellipsis is-ellipsis-1">
                    <el-tooltip :open-delay="700" class="item" effect="dark" :content="article.title" placement="top">
                        <router-link :to="{ name: 'post-detail', params: { id: article.articleId } }">
                            <span class="is-size-6"><strong>{{ article.title }}</strong></span>
                        </router-link>
                    </el-tooltip>
                </p>
            </div>
            <nav class="level has-text-grey is-mobile  is-size-7 mt-2">
                <div class="level-left">
                    <div class="level-left">
                        <router-link class="level-item" :to="{ path: `/member/${author.authorId}/home` }">
                            {{ author.nickName }}
                        </router-link>

                        <span class="mr-1">
                            发布于:{{ dayjs(article.createTime).format("YYYY/MM/DD HH:mm") }}
                        </span>

                        <span v-for="(tag, index) in tags" :key="index"
                            class="tag is-hidden-mobile is-success is-light mr-1">
                            <router-link :to="{ name: 'tag', params: { name: tag } }">
                                {{ "#" + tag }}
                            </router-link>
                        </span>

                        <span class="is-hidden-mobile">浏览:{{ article.viewCount }}</span>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>

<script>
import UserAvatar from '@/components/User/Avatar'



export default {
    name: 'ArticlePreview',
    components: {UserAvatar},
    props: {
        article: {
            type: Object,
            default: {}
        },
        author: {
            type: Object,
            default: {}
        },
        tags: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            
        };
    },
    watch: {},
    computed: {
        
    },
    methods: {},
    created() { },
    mounted() {

    }
};
</script>
<style scoped>
</style>