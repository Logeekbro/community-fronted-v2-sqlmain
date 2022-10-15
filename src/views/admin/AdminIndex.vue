<template>
  <el-card>

    <a-tabs default-active-key="1" tab-position="left">
      <a-tab-pane key="1" tab="文章">
        <a-tabs default-active-key="1-1" :animated="{inkBar:true, tabPane:false}">
          <a-tab-pane key="1-1" tab="待审核" style="width: 900px">
            <a-modal :width="700" v-model="showArticleDetail" title="文章详情" :footer="null" :mask="false"
              :forceRender="true">
              <div class="content">
                <h3>封面</h3>
                <img :src="detailArticle.mainPic" style="height: 200px; width: 350px" />
              </div>

              <div>
                <a-card title="摘要">
                  <strong>{{ detailArticle.summary }}</strong>
                </a-card>
              </div>

              <br/>

              <div>
                <a-card title="内容">
                  <div id="preview" />
                </a-card>
              </div>
              

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
                  <el-button type="text" @click="updateArticleStatus(scope.$index, scope.row.articleId, true)">通过</el-button>
                  <el-button type="text" @click="updateArticleStatus(scope.$index, scope.row.articleId, false)">退回</el-button>
                </template>
              </el-table-column>
            </el-table>

          </a-tab-pane>
          <a-tab-pane key="1-2" tab="新发布">
            Content of Tab Pane 2
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

export default {
  name: "AdminIndex",
  components: { NickName, SectionIdToName, Tag },
  props: {},
  data() {
    return {
      needReviewArticleList: [],
      showArticleDetail: false,
      detailArticle: {}
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
    updateArticleStatus(index, articleId, isPss) {
      updateReviewArticleStatus(articleId,isPss).then(rep => {
        this.msg.success("操作成功")
        this.needReviewArticleList.splice(index, 1)
      })
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