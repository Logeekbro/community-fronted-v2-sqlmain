<template>
    <!-- <div class="media">
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
    </div> -->
    <a-list item-layout="vertical" size="large" :data-source="articleList" :loading="listLoading">
        <div v-if="showLoadMore" slot="loadMore"
            :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
            <a-spin v-if="loadingMore" />
            <a-button v-else @click="doLoadMore">
                点击加载更多
            </a-button>
        </div>
        <a-list-item slot="renderItem" key="index" slot-scope="item, index">
            <!-- <template v-for="{ type, text } in actions" slot="actions">
                <span :key="type">
                    <a-icon :type="type" style="margin-right: 8px" />
                    {{ text }}
                </span>
            </template> -->
            <img slot="extra" style="height: 150px" width="272" alt="封面"
                :src="!item.mainPic ? 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png' : item.mainPic" />
            <div style="margin-bottom: 25px">
                <a style="font-size: 18px" slot="title" :href="'/post/' + item.articleId"><strong>{{ item.title
                }}</strong></a>
                <br>
                <div
                    style="width: 400px;overflow:hidden;margin-top: 10px;white-space: nowrap; text-overflow: ellipsis;">
                    {{ item.content }}
                </div>
            </div>
            <div class="level-left">
                <user-avatar :userId="item.authorId" :size="25" style="margin-right: 5px"></user-avatar>
                <router-link class="level-item" :to="{ path: `/member/${item.authorId}/home` }">
                    <strong>{{ item.nickName }}</strong>
                </router-link>
                <el-divider direction="vertical" />
                <span class="mr-1">
                    {{ ' ' + parseTime(item.createTime) }}
                </span>
                <br />
            </div>
            <div style="margin-top: 15px">
                <tag :articleId="item.articleId"></tag>
            </div>
            <div style="margin-top: 15px">
                <score :articleId="item.articleId"></score>
            </div>

            <!-- {{ item.content }} -->
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
        change: {type: String}

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
            this.loadingMore = false
            this.articleList = this.articleList.concat(tmpList)
            this.loading = false
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