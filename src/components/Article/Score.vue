<template>
    <div>
        <div v-if="direction == 'v'">
            <a-card>
                <a-card-grid v-for="{ type, text } in actions" :key="type" style="width:100%;text-align:center">
                    <a-icon :type="type" style="font-size: 18px;" />
                    {{ text }}
                </a-card-grid>
            </a-card>
        </div>
        <div v-else>
            <span v-for="{ type, text } in scores" :key="type" @click="handleClick(type)">
                <a-icon :type="type" style="margin-right: 8px" />
                {{ text }}
                <a-divider type="vertical" />
            </span>
        </div>
    </div>


</template>

<script>
import { getLikeCount, getCommentCount, getViewCount } from '@/api/count';

export default {
    name: "Score",
    components: {},
    props: {
        articleId: {
            type: String,
            default: null
        },
        direction: {
            type: String,
            default: "h"
        }
    },
    data() {
        return {
            scores: [
                { type: 'like-o', text: '-' },
                { type: 'message', text: '-' },
                { type: 'eye-o', text: '-' },
            ],
            actions: [
                { type: 'like-o', text: '-' },
                { type: 'message', text: '-' },
                { type: 'eye-o', text: '-' },
            ],
            trueId: this.articleId
        };
    },
    watch: {
        articleId: function (n, o) {
            this.trueId = n
            this.setScore(this.trueId)
        },
        direction: function (n, o) {
            this.setScore(this.trueId)
        }
    },
    computed: {},
    methods: {
        async setScore(id) {
            if (id != null) {
                let rep
                if (this.direction == "v") {
                    rep = await getLikeCount(id)
                    this.actions[0].text = rep.data.value
                    rep = await getCommentCount(id)
                    this.actions[1].text = rep.data.value
                    rep = await getViewCount(id)
                    this.actions[2].text = rep.data.value
                }
                else {
                    rep = await getLikeCount(id)
                    this.scores[0].text = rep.data.value
                    rep = await getCommentCount(id)
                    this.scores[1].text = rep.data.value
                    rep = await getViewCount(id)
                    this.scores[2].text = rep.data.value
                }
            }
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