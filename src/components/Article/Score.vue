<template>
    <div>
        <span v-for="{ type, text } in scores" :key="type" @click="handleClick(type)">
            <a-icon :type="type" style="margin-right: 8px" />
            {{ text }}
            <a-divider type="vertical" />
        </span>

    </div>

</template>

<script>
import { getLikeCount, getCommentCount, getViewCount } from '@/api/count';

export default {
    name: "HScore",
    components: {},
    props: {
        articleId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            scores: [
                { type: 'like-o', text: '-' },
                { type: 'message', text: '-' },
                { type: 'eye-o', text: '-' },
            ],
        };
    },
    watch: {
        articleId: function (n, o) { 
            this.setScore(n)
        }
    },
    computed: {},
    methods: {
        async setScore(id) {

            let rep
            rep = await getLikeCount(id)
            this.scores[0].text = rep.data.value
            rep = await getCommentCount(id)
            this.scores[1].text = rep.data.value
            rep = await getViewCount(id)
            this.scores[2].text = rep.data.value
        }
    },
    created() {

    },
    mounted() {
        this.setScore(this.articleId)
    }
};
</script>
<style scoped>
</style>