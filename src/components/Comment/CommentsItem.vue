<template>

  <article class="media">
    <!-- 回复框 -->
    <!-- <el-dialog title="回复" :visible.sync="replyVisible" width="30%" @close="handleClose">
      <el-input :rows="5" type="textarea" v-model="replyContent" placeholder="回复内容..."></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="replyVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddReply()">回 复</el-button>
      </span>
    </el-dialog> -->
    <vs-prompt color="primary" @close="handleClose('replyContent')" :active.sync="replyVisible" title="|||||||"
      :buttons-hidden="true">
      <div>
        <vs-textarea :rows="6" placeholder="输入回复内容..." v-model="replyContent" />
      </div>
      <vs-button @click="doAddReply" color="primary" type="filled" style="width: 20%; height: 10%">回 复</vs-button>
    </vs-prompt>

    <!-- 回复列表 -->
    <b-modal v-model="replyListVisible" :width="800" @close="handleClose('replyList')">
      <div class="card" @scroll="handleLoadReply" style="height: 600px; overflow: scroll;">
        <p class="card-header-title">
          评论详情
        </p>
        <lv-reply-item v-for="reply in replyList" :key="`reply-${reply.reply.replyId}`" :reply="reply"
          @doReply="handleReply" @reloadReply="loadMore" :myUserId="myUserId" :authorId="authorId"></lv-reply-item>
        <div v-show="hasMore" style="text-align: center; padding-bottom: 3%;">
          <a @click="loadMore"><strong>{{ replyBottomText }}</strong></a>
        </div>
        <div v-show="!hasMore" style="text-align: center; padding-bottom: 3%;">
          <strong>已加载所有评论</strong>
        </div>
        <span id="bottom"></span>
      </div>
    </b-modal>

    <figure class="media-left">
      <a-avatar shape="square" :size="52" :src="comment.user.avatar + '?' + ts" />
    </figure>
    <div class="media-content">
      <div class="content">
        <div style="white-space: pre-wrap;word-break: break-all">
          <el-tag v-if="comment.user.userId == authorId" size="mini">作者</el-tag>
          <router-link :to="{ path: `/member/${comment.user.userId}/home` }">
            <strong>{{ ' ' + comment.user.nickName + ' ' }}</strong>
          </router-link>

          <span>发表于</span>
          <small class="ml-2">{{ dayjs(comment.comment.createTime).format('YYYY/MM/DD HH:mm') }}</small>

          <br>
          <b-message type="is-info" style="margin-top:10px;">
            {{ comment.comment.content }}
          </b-message>

        </div>

        <!-- 功能区 -->
        <nav class="level" style="margin-top: 10px">
          <div class="level-left">
            <a class="level-item">
              <b-button size="is-small" @click="handleReply(null)">
                回复
              </b-button>
            </a>
          </div>
          <!-- <div v-if="comment.user.userId === myUserId" class="level-right">
            <a class="level-item">
              <b-button size="is-small" type="is-danger" @click="handleDelete(comment.comment.commentId)">
                删除
              </b-button>
            </a>
          </div> -->
        </nav>

      </div>
      <div>
        <vs-button style="width: 100%" v-if="replyCount > 0" @click="showReplyList" type="line">{{ '共' + replyCount +
            '条回复, 点击查看'
        }}</vs-button>
        <vs-button v-else color="dark" :disabled="true" type="line" style="width: 100%">暂无回复</vs-button>
      </div>
    </div>
  </article>

</template>

<script>
import store from '@/store'
import { deleteComment } from '@/api/comment'
import { addReply, getReplyList, getReplyCount } from '@/api/reply'
import LvReplyItem from './ReplyItem'

export default {
  name: 'LvCommentsItem',
  components: {
    LvReplyItem
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    ts: {
      type: Number,
      required: true
    },
    authorId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      myUserId: store.getters.user.userId,
      replyVisible: false,
      replyContent: '',
      replyListVisible: false,
      replyList: [],
      nowTarget: null,
      replyCount: 0,
      page: {
        current: 1,
        size: 10,
        total: 0,
        records: [],
        totalPage: 0,
      },
      hasMore: false,
      replyBottomText: '下滑加载更多',
      onLoading: false
    }
  },
  mounted() {
    this.getReplyCounts()
  },
  methods: {
    handleDelete(commentId) {
      deleteComment(commentId).then((response) => {
        this.msg.success("删除成功")
        this.$emit('loadComments')
      })
    },
    handleReply(target) {
      this.replyVisible = true;
      if (target != null) {
        this.nowTarget = target
      }
      else {
        this.nowTarget = null
      }
    },
    doAddReply() {
      const target = this.nowTarget
      addReply(this.comment.comment.commentId, this.replyContent, target).then((response) => {
        this.replyVisible = false
        // if (this.lastPageRecordsCount < 5) {
        //   this.replyList.splice(this.lastRecordIndex)
        //   this.current = this.lastPage - 1
        // }
        this.page.size = this.page.total + 20
        this.showReplyList()
        this.msg.success("回复成功")
        setTimeout(function () {
          var element_to_scroll_to = document.getElementById('bottom');
          element_to_scroll_to.scrollIntoView();
        }, 200)

        this.replyContent = ''
        this.getReplyCounts()

      })
    },
    showReplyList() {
      this.replyListVisible = true
      getReplyList(this.comment.comment.commentId, this.page.current, this.page.size).then((response) => {
        const { data } = response
        this.page = data
        this.replyList = this.page.records
        this.page.totalPage = Math.ceil(this.page.total / this.page.size)
        if (this.page.total == 0) {
          this.replyListVisible = false
          this.getReplyCounts()
        }
        if (this.page.current < this.page.totalPage) {
          this.hasMore = true
        }
        else {
          this.hasMore = false
        }
      })
    },
    loadMore(call = null) {
      this.replyBottomText = "加载中..."
      this.page.current++
      getReplyList(this.comment.comment.commentId, this.page.current, this.page.size).then((response) => {
        const { data } = response
        this.page = data
        this.page.totalPage = Math.ceil(this.page.total / this.page.size)
        if (this.page.current < this.page.totalPage) {
          this.replyList = this.replyList.concat(this.page.records)
          this.hasMore = true
        }
        else if (this.page.current == this.page.totalPage) {

          this.replyList = this.replyList.concat(this.page.records)
          this.hasMore = false
        }
        else {
          this.page.current--
          this.hasMore = false
        }
        this.replyBottomText = "下滑加载更多"
        if (call != null) call()
      })
    },
    handleClose(type) {
      if (type == "replyContent") {
        this.replyContent = ''
      }
      else if (type == "replyList") {
        this.getReplyCounts()
        this.page.current = 1
      }

    },
    async getReplyCounts() {
      getReplyCount(this.comment.comment.commentId).then((response) => {
        const { data } = response
        this.replyCount = data.value
      })
    },
    handleLoadReply(e) {
      if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight && this.hasMore && !this.onLoading) {
        this.onLoading = true
        this.loadMore(() => {
          this.onLoading = false
        })

      }

    }
  }
}
</script>


