<template>
    <a-list item-layout="vertical" size="large" :data-source="articleList" :loading="listLoading">
        <div v-if="showLoadMore" slot="loadMore"
            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
            <a-spin v-if="loadingMore" />
            <a-button v-else @click="doLoadMore">
                点击加载更多
            </a-button>
        </div>
        <a-list-item slot="renderItem" key="index" slot-scope="item, index">
            <img slot="extra" style="height: 150px" width="272" alt="封面"
                :src="!item.mainPic ? 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png' : item.mainPic" />
            <div style="margin-bottom: 25px">
                <a style="font-size: 18px" slot="title" :href="'/post/' + item.articleId"><strong>{{ item.title
                }}</strong></a>
                <br>
                <div
                    style="width: 400px;overflow:hidden;margin-top: 10px;white-space: nowrap; text-overflow: ellipsis;">
                    {{ !item.summary ? '[无摘要，点击文章标题查看详情]' : item.summary }}
                </div>
            </div>
            <div class="level-left">
                <user-avatar :userId="item.authorId" :size="25" style="margin-right: 8px"></user-avatar>
                <router-link class="level-item" :to="{ path: `/member/${item.authorId}/home` }">
                    <strong>{{ item.nickName }}</strong>
                </router-link>
                <el-divider direction="vertical" />
                <span class="mr-1 ml-2">
                    {{ parseTime(item.createTime) }}
                </span>
                <br />
            </div>
            <div style="margin-top: 15px">
                <tag :articleId="item.articleId"></tag>
            </div>
            <div style="margin-top: 15px">
                <score :articleId="item.articleId"></score>
            </div>
        </a-list-item>
    </a-list>
</template>

<script>
import UserAvatar from '@/components/User/Avatar'
import dayjs from 'dayjs'
import Score from '@/components/Article/Score'
import Tag from '@/components/Tag/index'


export default {
    name: 'ArticlePreview',
    components: { UserAvatar, Score, Tag },
    props: {
        loadData: {
            type: Function,
            default: null
        },
        loadMore: {
            type: Function,
            default: null
        },
        total: {
            type: Number,
            default: 0
        },
        change: {
            type: String,
            default: ''
        }

    },
    data() {
        return {
            listLoading: false,
            loadingMore: false,
            showLoadMore: false,
            articleList: [],
        };
    },
    watch: {
        change: function() {
            this.fetchData()
        }
    },
    computed: {

    },
    methods: {
        async fetchData() {
            this.listLoading = true
            this.articleList = await this.loadData()
            this.listLoading = false
            this.checkHaveMore()
        },
        async doLoadMore() {
            this.loadingMore = true
            const tmpList = await this.loadMore()
            console.log(tmpList)
            this.loadingMore = false
            this.articleList = this.articleList.concat(tmpList)
            this.checkHaveMore()
        },
        checkHaveMore() {
            if (this.articleList.length >= this.total) {
                this.showLoadMore = false
            }
            else {
                this.showLoadMore = true
            }
        },
        parseTime(publishTime) {
            // 拿到当前时间戳和发布时的时间戳
            var curTime = new Date()
            var postTime = new Date(publishTime)
            //计算差值
            var timeDiff = curTime.getTime() - postTime.getTime()
            // 单位换算
            var min = 60 * 1000
            var hour = min * 60
            var day = hour * 24
            // 计算发布时间距离当前时间的 天、时、分
            var exceedDay = Math.floor(timeDiff / day)
            // 最后判断时间差
            if (exceedDay > 0) {
                if (exceedDay <= 3) {
                    return exceedDay + "天前"
                }
                else if (curTime.getFullYear() == postTime.getFullYear()) {
                    return dayjs(publishTime).format("MM-DD HH:mm")
                }
                return dayjs(publishTime).format("YYYY-MM-DD HH:mm")
            } else {
                var exceedHour = Math.floor(timeDiff / hour)
                var exceedMin = Math.floor(timeDiff / min)
                if (exceedHour < 24 && exceedHour > 0) {
                    return exceedHour + '小时前'
                } else if (exceedMin < 60 && exceedMin > 0) {
                    return exceedMin + '分钟前'
                } else {
                    return '刚刚'
                }
            }
        }
    },
    created() { },
    mounted() {
        this.fetchData()
    }
};
</script>
<style scoped>
</style>