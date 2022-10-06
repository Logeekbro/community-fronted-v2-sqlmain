<template>
    <a-layout>

        <a-layout-sider theme="light">

            <a-menu mode="inline" :openKeys="['sub1', 'sub2']" :inlineIndent="5">
                <a-sub-menu key="sub2" class="chat-scroll2">
                    <span slot="title">
                        <span id="system-chat">系统消息</span>
                        <a-badge dot v-if="unReadSystemMessageCount > 0"></a-badge>
                    </span>
                    <!-- 聊天列表 -->
                    <a-menu-item style="height: 60px; line-height: 60px; width: 98%" @click="showSystemMessage()">
                        <a-badge :overflowCount="99" :count="unReadSystemMessageCount">
                            <a-avatar shape="square" :size="40"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                style="margin-right: 5px" />
                            <!-- <user-avatar shape="square" :size="40" :userId="item.targetInfo.userId"
                                style="margin-right: 5px"></user-avatar> -->
                        </a-badge>
                        <span><strong>系统通知</strong></span>
                    </a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub1" class="chat-scroll">
                    <span slot="title">
                        <span id="user-chat">用户消息</span>
                        <a-badge dot v-if="haveNewUserMessage"></a-badge>
                    </span>
                    <!-- 聊天列表 -->
                    <a-menu-item style="height: 60px; line-height: 60px; width: 98%" v-for="(item, index) in chatDetail"
                        :key="'user-' + index" :id="'user-' + item.targetInfo.userId"
                        @click="showMessageDetail(index, item)">
                        <a-badge :overflowCount="99"
                            :count.sync="unReadMessageMap.get(item.targetInfo.userId) == null ? 0 : unReadMessageMap.get(item.targetInfo.userId).length">
                            <!-- <a-avatar shape="square" :size="40" :src="item.targetInfo.avatar"
                                style="margin-right: 5px" /> -->
                            <user-avatar shape="square" :size="40" :userId="item.targetInfo.userId"
                                style="margin-right: 5px"></user-avatar>
                        </a-badge>
                        <span><strong>{{ item.targetInfo.nickName }}</strong></span>
                    </a-menu-item>
                </a-sub-menu>
            </a-menu>

        </a-layout-sider>

        <a-layout>

            <a-layout-header style="background: white;height: 50px">
                <div style="text-align: center; font-size: 18px;">
                    <strong>{{ targetInfo == null ? "-" : targetInfo.nickName }}</strong>
                </div>
            </a-layout-header>

            <a-layout-content>
                <el-card shadow="never" style="margin-bottom: 0; height: 728px">
                    <div ref="messageBoxLoading" class="vs-con-loading__container">
                        <!-- 私信消息区域 -->
                        <div v-if="chatType == 'private'">
                            <div style="height: 440px; overflow-y: scroll; white-space: pre-wrap;word-break: break-all"
                                :id="'messageContainer-' + targetInfo.userId">
                                <div v-for="(item, index) in messageMap.get(targetInfo.userId)" :key="index">
                                    <!-- 自己发的消息 -->
                                    <div v-if="item.senderId == user.userId" class="level-left"
                                        style="margin-bottom: 20px">
                                        <user-avatar class="ava" :size="36" :userId="user.userId" :clickable="false"
                                            style="margin-left: 5px"></user-avatar>
                                        <!-- <a-avatar shape="circle" :size="36" :src="user.avatar + '?' + avatarTS"
                                            style="margin-right: 5px" /> -->
                                        <b-message style="width: 50%" size="is-small" type="is-success"
                                            :title="dayjs(item.createTime).format('YYYY/MM/DD HH:mm')"
                                            :closable="false">
                                            <div style="font-size: 18px">
                                                {{ item.content }}
                                            </div>
                                        </b-message>
                                    </div>

                                    <!-- 对方发的消息 -->
                                    <div v-else class="level-right" style="margin-bottom: 20px">
                                        <b-message style="width: 50%;" size="is-small" type="is-info"
                                            :title="dayjs(item.createTime).format('YYYY/MM/DD HH:mm')"
                                            :closable="false">
                                            <div style="font-size: 18px">
                                                {{ item.content }}
                                            </div>
                                        </b-message>
                                        <user-avatar :size="36" :userId="targetInfo.userId" style="margin-left: 5px">
                                        </user-avatar>
                                        <!-- <router-link :to="{ path: `/member/${targetInfo.userId}/home` }">
                                            <a-avatar shape="circle" :size="36" :src="targetInfo.avatar"
                                                style="margin-left: 5px" />
                                        </router-link> -->
                                    </div>
                                </div>
                            </div>
                            <vs-divider></vs-divider>
                            <!-- 消息发送框 -->
                            <div style="margin-top: 5px; height: 288px;">
                                <vs-textarea @input="fetchNewMessage()" v-model="content" width="100%; border: none"
                                    :rows="5" />
                                <vs-button @click="handleSendMessage()" color="primary" type="relief" size="medium"
                                    :disabled="content == ''">
                                    发 送</vs-button>
                            </div>
                        </div>

                        <!-- 系统消息区域 -->
                        <div v-if="chatType == 'system'">
                            <div style="height: 600px; overflow-y: scroll; white-space: pre-wrap;word-break: break-all"
                                id='messageContainer-system' ref="systemMessage">
                                <div v-for="(item, index) in systemMessageList" :key="index">
                                    <!-- 系统消息 -->
                                    <div class="level-right" style="margin-bottom: 20px;">
                                        <b-message style="width: 50%;margin-right: 10px;" size="is-small" type="is-info"
                                            :title="dayjs(item.createTime).format('YYYY/MM/DD HH:mm')"
                                            :closable="false">
                                            <div style="font-size: 18px">
                                                <span v-if="item.likeUserId == guestUserId">一名游客</span>
                                                <span v-else>用户 <a :href="'/member/' + item.likeUserId + '/home'">
                                                        <nick-name :userId="item.likeUserId"></nick-name>
                                                    </a></span>
                                                <span> 点赞了你的</span>
                                                <span v-if="item.notionType == 'ARTICLE'">
                                                    文章： <a :href='"/post/"+item.beLikeId'>
                                                        <article-title :articleId="item.beLikeId"></article-title>
                                                    </a>
                                                </span>
                                            </div>
                                        </b-message>
                                        <a-avatar shape="square" :size="40"
                                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                            style="margin-right: 5px" />
                                        <!-- <router-link :to="{ path: `/member/${targetInfo.userId}/home` }">
                                            <a-avatar shape="circle" :size="36" :src="targetInfo.avatar"
                                                style="margin-left: 5px" />
                                        </router-link> -->
                                    </div>
                                </div>
                            </div>
                            <vs-divider></vs-divider>
                            <!-- 消息发送框 -->
                            <!-- <div style="margin-top: 5px; height: 288px;">
                                <vs-textarea @input="fetchNewMessage()" v-model="content" width="100%; border: none"
                                    :rows="5" />
                                <vs-button @click="handleSendMessage()" color="primary" type="relief" size="medium"
                                    :disabled="content == ''">
                                    发 送</vs-button> -->
                        </div>
                    </div>
                </el-card>
            </a-layout-content>
        </a-layout>

    </a-layout>
</template>

<script>
import store from '@/store'
import { getOpenInfo } from '@/api/user'
import { sendMessage, getAllMessage, updateReadStatus, getAllUnReadMessage, getAllSystemMessage } from '@/api/message'
import UserAvatar from '@/components/User/Avatar'
import ArticleTitle from '@/components/Article/ArticleTitle'
import NickName from '@/components/User/NickName'

export default {
    name: 'message',
    components: { UserAvatar, ArticleTitle, NickName },
    data() {
        return {
            list: [],
            avatarTS: store.getters.avatarTS,
            targetId: this.$route.query.targetId,
            user: store.getters.user,
            chatDetail: [],
            messageMap: new Map(),
            targetInfo: null,
            content: '',
            unReadMessageMap: new Map(),
            haveNewUserMessage: false,
            cycleIdList: [],
            idList: [],
            systemId: -1,
            systemMessageList: [],
            guestUserId: -1,
            chatType: "",
            unReadSystemMessageCount: 0,
        }
    },
    mounted() {
        // window.scrollTo(0, 0);
        // document.getElementById('user-chat').click()
        this.fetchChatInfo()

    },
    destroyed() {
        this.closeAllCycle()
    },
    methods: {
        async fetchChatInfo() {
            this.handleMessages()
            this.loadSystemMessage()
        },
        async handleMessages() {
            // 加载聊天列表
            let { data } = await getAllMessage()
            let messageList = data
            this.messageMap = await this.generateMessageMapByMessageList(messageList)
            await this.translateNewMessageToMap()
            this.handleInitPoen()
            this.cycleFetchNewMessage()
        },
        loadSystemMessage() {
            getAllSystemMessage().then(rep => {
                const { data } = rep
                this.systemMessageList = data
                const len = this.systemMessageList.length
                for (let i = 0; i < len; i++) {
                    if (!this.systemMessageList[i].isRead) {
                        this.unReadSystemMessageCount++;
                    }
                }
            })
        },
        async generateMessageMapByMessageList(messageList) {
            const userId = this.user.userId
            let messageMap = new Map()
            let message
            for (let i = 0; i < messageList.length; i++) {
                message = messageList[i]
                if (message.targetId != userId && messageMap.has(message.targetId)) {
                    messageMap.get(message.targetId).push(message)
                }
                else if (message.senderId != userId && messageMap.has(message.senderId)) {
                    messageMap.get(message.senderId).push(message)
                }
                else {
                    const id = message.targetId == userId ? message.senderId : message.targetId;
                    messageMap.set(id, [message])
                    // 如果idList中不存在该id则将id放入
                    if (this.idList.indexOf(id) == -1) {
                        this.idList.unshift(id)
                        // 将用户信息放入聊天列表
                        const response = await getOpenInfo(id)
                        this.chatDetail.unshift({
                            targetInfo: response.data,
                        })
                    }
                }
            }
            return messageMap
        },
        handleInitPoen() {
            let targetId = this.targetId
            // 带id时进行的操作
            if (targetId != 'undefined' && targetId != null && targetId.trim() != '' && targetId != this.user.userId) {
                targetId = Number(targetId)
                // 如果不存在该聊天则创建
                if (!this.messageMap.has(targetId)) {
                    getOpenInfo(targetId).then(r => {
                        this.chatDetail.unshift({
                            targetInfo: r.data,
                        })
                        this.messageMap.set(targetId, [])
                        this.idList.unshift(targetId)
                        this.$nextTick(() => {
                            var div = document.getElementById('user-' + targetId)
                            div.scrollIntoViewIfNeeded()
                            div.click()
                        })

                    })
                }
                // 反之直接打开对应的聊天窗口即可
                else {
                    for (var i = 0; i < this.idList.length; i++) {
                        if (this.idList[i] == targetId) {
                            this.targetInfo = this.chatDetail[i].targetInfo
                            document.getElementById('user-' + targetId).click()
                            return
                        }
                    }
                }
            }
        },
        focusToId(id) {
            // document.getElementById(id).scrollIntoViewIfNeeded()
        },
        async showMessageDetail(index, item) {
            this.$vs.loading({
                container: this.$refs.messageBoxLoading,
                type: "sound"
            })
            this.chatType = "private"
            this.targetInfo = item.targetInfo
            var id = `messageContainer-${this.targetInfo.userId}`
            this.loadNewMessage()
            this.$nextTick(() => {
                // 数据渲染完成后的回调方法
                this.$vs.loading.close(this.$refs.messageBoxLoading)
                updateReadStatus(this.targetInfo.userId)
                var div = document.getElementById(id)
                div.scrollTop = div.scrollHeight
            })
        },
        handleSendMessage() {
            const message = {
                targetId: this.targetInfo.userId,
                content: this.content
            }
            sendMessage(message).then(r => {
                const { data } = r
                this.content = ""
                this.msg.success("发送成功")
                this.messageMap.get(this.targetInfo.userId).push(data)
                this.scrollMessageBoxToBottom()
            })
        },
        checkHaveNewUserMessage() {
            let targetId
            for (var i = 0; i < this.chatDetail.length; i++) {
                targetId = Number(this.chatDetail[i].targetInfo.userId)
                const unReadMessage = this.unReadMessageMap.get(targetId)
                // console.log(unReadMessage)
                if (unReadMessage == null) {
                    continue
                }
                else if (unReadMessage.length > 0) {
                    this.haveNewUserMessage = true
                    return
                }
            }
            this.haveNewUserMessage = false
        },
        loadNewMessage() {
            const targetId = Number(this.targetInfo.userId)
            // 获取当前active聊天的未读消息
            const unReadMessageList = this.unReadMessageMap.get(targetId)
            if (unReadMessageList != null && unReadMessageList.length > 0) {
                if (this.messageMap.get(targetId) != null) {
                    // 如果原来有消息，则将新消息拼接到原消息的末尾
                    this.messageMap.set(targetId, this.messageMap.get(targetId).concat(unReadMessageList))
                }
                else {
                    // 否则直接将新消息赋值给消息列表
                    this.messageMap.set(targetId, unReadMessageList)
                }
                this.$nextTick(() => {
                    // 将未读消息置为空
                    this.unReadMessageMap.set(targetId, [])
                    const id = `messageContainer-${this.targetInfo.userId}`
                    const div = document.getElementById(id)
                    updateReadStatus(this.targetInfo.userId)
                    // 只有当滚动条到底部的距离小于1000时才滚动到底部，防止用户在浏览历史消息时直接滚动到底部
                    if (div.scrollHeight - div.scrollTop <= 1000) {
                        this.scrollMessageBoxToBottom()
                    }
                    this.checkHaveNewUserMessage()
                })

            }

        },
        async translateNewMessageToMap() {
            const { data } = await getAllUnReadMessage()
            const messageList = data
            this.unReadMessageMap = await this.generateMessageMapByMessageList(messageList)
            if (this.targetInfo != null) {
                this.loadNewMessage()
            }
            this.checkHaveNewUserMessage()
        },
        scrollMessageBoxToBottom() {
            this.$nextTick(() => {
                const id = `messageContainer-${this.targetInfo.userId}`
                const div = document.getElementById(id)
                div.scrollTop = div.scrollHeight
            })
        },
        showSystemMessage() {
            this.targetInfo = {
                nickName: "系统消息"
            }
            updateReadStatus(this.systemId).then(rep => {
                this.unReadSystemMessageCount = 0
                this.chatType = 'system'
                // 此处有bug，不能滚动到底部，待解决
                this.$nextTick(() => {
                    this.$refs.systemMessage.scrollTop = this.$refs.systemMessage.scrollHeight;
                })
                
            })

        },
        cycleFetchNewMessage(cycleTime = 7000) {
            this.cycleIdList[0] = setInterval(this.translateNewMessageToMap, cycleTime)
        },
        cycleLoadNewMessage(cycleTime = 7000) {
            this.cycleIdList[1] = setInterval(this.loadNewMessage, cycleTime)
        },
        closeCycleFetchNewMessage() {
            if (this.cycleIdList[0] != null) clearInterval(this.cycleIdList[0])
        },
        closeCycleLoadNewMessage() {
            if (this.cycleIdList[1] != null) clearInterval(this.cycleIdList[1])
        },
        closeAllCycle() {
            for (var i = 0; i < this.cycleIdList.length; i++) {
                clearInterval(this.cycleIdList[i])
            }
        }
    },
}
</script>
<style>
.message-body {
    border-radius: 0;
}

/*滚动条*/
.chat-scroll {
    height: 612px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: auto;
}

/* 定义滚动条样式 */
::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background-color: #e4e7ea;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0px #e2e4e7;
    border-radius: 10px;
    background-color: #e4e7ea;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
    background-color: #167df0;
}
</style>