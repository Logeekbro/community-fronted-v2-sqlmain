<template>
    <div>
        <div v-if="direction == 'v'">
            <a-card>
                <a-card-grid @click="handleLike" v-if="liked" style="width:100%;text-align:center">
                    <a-icon theme="filled" type="like" style="font-size: 18px;color: cornflowerblue;" />
                    {{ likeCount ? likeCount : 0 }}
                </a-card-grid>
                <a-card-grid @click="handleLike" v-else style="width:100%;text-align:center">
                    <a-icon ref="myLike" type="like-o" style="font-size: 18px;color: cornflowerblue;" />
                    {{ likeCount ? likeCount : 0 }}
                </a-card-grid>
                <a-card-grid style="width:100%;text-align:center">
                    <a-icon type="message" style="font-size: 18px;color: cornflowerblue;" />
                    {{ commentCount ? commentCount : 0 }}
                </a-card-grid>

                <a-card-grid style="width:100%;text-align:center">
                    <a-icon type="eye-o" style="font-size: 18px;color: cornflowerblue;" />
                    {{ viewCount ? viewCount : 0 }}
                </a-card-grid>
            </a-card>
        </div>
        <div v-else>
            <span v-for="{ type, text } in scores" :key="type" @click="handleClick(type)">
                <a-icon :type="type" style="margin-right: 8px" />
                {{ text ? text : 0 }}
                <a-divider type="vertical" />
            </span>
        </div>
    </div>


</template>

<script>
import store from '@/store'
import { getLikeCount, getCommentCount, getViewCount } from '@/api/count';
import { doLike, isLiked, doGuestLike } from '@/api/action'

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
            trueId: this.articleId,
            likeCount: '-',
            commentCount: '-',
            viewCount: '-',
            liked: false
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
                    this.likeCount = rep.data.value
                    rep = await getCommentCount(id)
                    this.commentCount = rep.data.value
                    rep = await getViewCount(id)
                    this.viewCount = rep.data.value
                    rep = await isLiked(id)
                    this.liked = rep.data.value
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
        },
        handleLike() {
            if (store.getters.token) {
                doLike(this.trueId).then(rep => {
                    if (this.liked) {
                        this.likeCount--
                    }
                    else {
                        this.likeCount++
                    }
                    this.liked = !this.liked
                }).catch(error => {
                    this.msg.error("点赞失败：" + error.message, 1500)
                })
            }
            else {
                doGuestLike(this.trueId).then(rep => {
                    this.msg.success("由于您未登录，本次点赞不会增加点赞数，但会发送消息通知作者，以表示您对作者的肯定", 5000)
                })
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