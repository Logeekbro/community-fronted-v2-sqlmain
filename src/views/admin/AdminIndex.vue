<template>
  <el-card>

    <a-tabs default-active-key="1" tab-position="left">
      <a-tab-pane key="1" tab="文章">
        <a-tabs default-active-key="1-1" :animated="{inkBar:true, tabPane:false}">
          <a-tab-pane key="1-1" tab="待审核" style="width: 900px">
            <!-- 显示文章详情的弹窗 -->
            <a-modal :width="700" v-model="showArticleDetail" title="文章详情" :footer="null" :mask="false"
              :forceRender="true">
              <div class="content">
                <h3>封面</h3>
                <img v-if="detailArticle.mainPic" :src="detailArticle.mainPic" style="height: 200px; width: 350px" />
                <p v-else>暂无</p>
              </div>
              <div>
                <a-card title="摘要">
                  <strong>{{ detailArticle.summary }}</strong>
                </a-card>
              </div>
              <br />
              <div>
                <a-card title="内容">
                  <div id="preview" />
                </a-card>
              </div>
            </a-modal>

            <!-- 选择退回理由的弹窗 -->
            <a-modal v-model="unPassReasonChoser" title="退回理由" centered okText="确定" cancelText="取消"
              @ok="doUpass()">
              <div style="margin: 24px 0" />
              <a-textarea v-model="unPassReasonText" placeholder="请输入退回的理由..." :auto-size="{ minRows: 3, maxRows: 5 }" />
            </a-modal>

            <el-table :data="needReviewArticleList" border>
              <el-table-column label="文章标题" width="250">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.title }}</span>
                </template>
              </el-table-column>
              <el-table-column label="文章封面/摘要/内容">
                <template slot-scope="scope">

                  <el-link type="primary" @click="handleShowArticleDetail(scope.row)">
                    点击查看
                  </el-link>

                </template>
              </el-table-column>
              <el-table-column label="作者" width="100">
                <template slot-scope="scope">
                  <router-link :to="{ path: `/member/${scope.row.authorId}/home` }">
                    <NickName :userId="scope.row.authorId"></NickName>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" width="180">
                <template slot-scope="scope">
                  <span>{{ dayjs(scope.row.createTime).format('YYYY-MM-DD HH:mm') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="分区">
                <template slot-scope="scope">
                  <SectionIdToName :sectionId="scope.row.sectionId"></SectionIdToName>
                </template>
              </el-table-column>
              <el-table-column label="标签">
                <template slot-scope="scope">
                  <Tag :articleId="scope.row.articleId"></Tag>
                </template>
              </el-table-column>
              <el-table-column label="审核">
                <template slot-scope="scope">
                  <el-button type="text" @click="updateArticleStatus(scope.$index, scope.row.articleId, true)">通过
                  </el-button>
                  <el-button type="text" @click="handleUnpassArticle(scope.$index, scope.row.articleId)">退回
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

          </a-tab-pane>
          <a-tab-pane key="1-2" tab="新发布">
            <ArticleIdToNickName articleId="1581199845740265474"/>
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>
      <a-tab-pane key="2" tab="评论">
        Content of Tab 2
      </a-tab-pane>
      <a-tab-pane key="3" tab="用户">
        Content of Tab 3
      </a-tab-pane>
    </a-tabs>
  </el-card>
</template>

<script>
import { getNeedReviewArticleList, updateReviewArticleStatus } from '@/api/post'
import NickName from '../../components/User/NickName.vue';
import Vditor from 'vditor'
import SectionIdToName from '../../components/Section/SectionIdToName.vue';
import Tag from '@/components/Tag/index'
import ArticleIdToNickName from '../../components/User/ArticleIdToNickName.vue';

export default {
  name: "AdminIndex",
  components: { NickName, SectionIdToName, Tag, ArticleIdToNickName },
  props: {},
  data() {
    return {
      needReviewArticleList: [],
      showArticleDetail: false,
      detailArticle: {},
      unPassReasonChoser: false, // 是否打开退回原因对话框
      unPassReasonText: '',
      unPassIndex: null,
      unPassArticleId: null
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleShowArticleDetail(article) {
      this.detailArticle = article
      this.showArticleDetail = true
      Vditor.preview(document.getElementById('preview'), article.content, {
        hljs: { style: 'github' }
      })
    },
    updateArticleStatus(index, articleId, isPass) {
      updateReviewArticleStatus(articleId, this.unPassReasonText, isPass).then(rep => {
        this.msg.success("操作成功")
        this.needReviewArticleList.splice(index, 1)
      })
    },
    handleUnpassArticle(index, articleId) {
      this.unPassReasonChoser = true
      this.unPassIndex = index
      this.unPassArticleId = articleId
    },
    doUpass() {
      this.updateArticleStatus(this.unPassIndex, this.unPassArticleId, false)
      this.unPassReasonChoser = false
    } 
  },
  created() { },
  mounted() {
    getNeedReviewArticleList().then(rep => {
      this.needReviewArticleList = rep.data
    })

  }
};
</script>
<style scoped>

</style>