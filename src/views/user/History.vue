<template>
    <div class="scroll-box">
        <!-- <div v-if="historys.length === 0" style="font-size: 25px;text-align: center; min-height: 550px">
            <strong>无浏览记录</strong>
        </div> -->
        <el-empty v-if="historys.length === 0" description="无浏览记录">
        </el-empty>
        <div v-else>
            <el-alert title="注意" type="warning" description="点击删除按钮后会直接删除记录，没有确认弹窗，请谨慎操作" show-icon>
            </el-alert>
            <h3 :style="{ margin: '16px 0' }" class="level">
                <div class="level-left">
                    <strong style="font-size: 20px">浏览记录按日期加载</strong>
                </div>
                <div class="level-right">
                    <vs-button @click="handleDeleteAll()" color="danger" size="small" type="gradient">清除浏览记录</vs-button>
                </div>
            </h3>
            <a-list size="large" v-for="(history, pindex) in historys" :key="pindex" bordered
                style="background-color: aliceblue;">
                <div slot="header">
                    <span style="font-size: 25px; color: orange">{{ getDisplayDate(history.targetDate) }}</span>
                </div>
                <a-list-item v-for="(item, index) in history.records" :key="index">
                    <div class="media-content">
                        <div class="content ellipsis is-ellipsis-1">
                            <el-tooltip :open-delay="700" class="item" effect="dark" :content="item.title"
                                placement="top">
                                <router-link :to="{ name: 'post-detail', params: { id: item.articleId } }">
                                    <strong>{{ item.title }}</strong>
                                </router-link>
                            </el-tooltip>
                        </div>
                        <nav class="level has-text-grey is-size-7">
                            <div class="level-left">
                                <span class="mr-3">
                                    作者: {{ item.nickName }}
                                </span>
                                <el-divider direction="vertical" />
                                <span class="mr-1">
                                    浏览时间: {{ dayjs(item.createTime).format("HH:mm:ss") }}
                                </span>
                            </div>
                        </nav>
                    </div>
                    <div class="media-right">
                        <div class="level">
                            <div class="level-item">
                                <a @click="handleDeleteView(item.viewId, item.articleId, pindex, index)">
                                    <span class="tag is-danger">删除</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </a-list-item>
            </a-list>
            <div style="font-size: 15px;text-align: center;margin-top: 20px">
                <strong>{{ loadText }}</strong>
            </div>
        </div>
    </div>
</template>
<script>


import { getViewCache, setViewCache } from '@/utils/view-cache'
import { deleteView, deleteAll, getUserHistoryByDate } from '@/api/view'
import dayjs from 'dayjs';

export default {
    data() {
        return {
            targetDate: dayjs().format("YYYY-MM-DD"),
            historys: [],
            dateList: [],
            loadText: '下滑加载更多',
            fetchTime: new Date().getTime()
        };
    },
    mounted() {
        this.fetchUserHistoryByDate()
        this.init()
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        fetchUserHistoryByDate() {
            if (this.targetDate != null) {
                getUserHistoryByDate(this.targetDate).then(rep => {
                    const { data } = rep
                    this.targetDate = data.beforeDate
                    if (this.targetDate == null) {
                        this.loadText = "已加载所有数据"
                    }
                    if (data.records.length == 0) {
                        this.fetchUserHistoryByDate()
                    }
                    else if (data.records.length <= 3) {
                        this.historys.push(data)
                        this.fetchUserHistoryByDate()
                    }
                    else {
                        this.historys.push(data)
                    }
                })
            }
        },
        async handleDeleteView(id, articleId, pindex, index) {
            await deleteView(id).then(() => {
                // 从列表中删除下标为index的元素
                this.historys[pindex].records.splice(index, 1)
                if (this.historys[pindex].records.length == 0) {
                    this.historys.splice(pindex, 1)
                }
                if (getViewCache() == articleId) setViewCache("-1")
                this.msg.success("删除成功")
            })
        },
        handleDeleteAll() {
            this.$buefy.dialog.confirm({
                title: '清除所有记录',
                message: '确定要清除所有记录吗？数据将无法恢复',
                confirmText: '确认',
                cancelText: '取消',
                type: 'is-danger',
                onConfirm: () => this.doDeleteAll()
            })
        },
        doDeleteAll() {
            deleteAll().then(() => {
                this.msg.success("清除成功")
                setViewCache("-1")
                this.historys = []
            })
        },
        init() {
            this.$nextTick(() => {
                window.addEventListener('scroll', this.handleScroll)
            })
        },
        handleScroll() {
            this.$nextTick(() => {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                if (scrollHeight - scrollTop - windowHeight <= 0.5 && (new Date().getTime()- this.fetchTime) > 400) {
                    this.fetchTime = new Date().getTime()
                    this.fetchUserHistoryByDate()
                }
            })

        },
        getDisplayDate(dt) {
            if (dayjs().format("YYYY-MM-DD") == dt) {
                return "今天"
            }
            else if (dayjs().subtract(1, 'day').format("YYYY-MM-DD") == dt) {
                return "昨天"
            }
            else {
                if (dayjs().year() == dayjs(dt).year()) {
                    return dayjs(dt).format("MM-DD")
                }
                return dt
            }
        }
    }
};
</script>
<style>
</style>
