<template>
  <div class="edit-card">
    <p class="edit-card-title border-bottom x-flex-between">
      <!-- 2019年12月1日晨会-查看详情 -->
      {{commentInfo.title}}
      <el-dropdown @command="handleCommand">
        <el-button class="dropdown-button">
          <i class="el-icon-more"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
          <el-dropdown-item class="el-icon-refresh-right" command="0">&nbsp;刷新</el-dropdown-item>
          <el-dropdown-item class="el-icon-delete" command="1" v-if="commentInfo.uid==uid">&nbsp;删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </p>
    <ul class="edit-card-content">
      <li class="edit-card-item x-flex-start border-bottom">
        <p>发布者：</p>
        <p class="edit-input">{{commentInfo.user_name}}</p>
      </li>
      <li class="edit-card-item x-flex-start border-bottom">
        <p>标题：</p>
        <p class="edit-input">{{commentInfo.title}}</p>
      </li>
      <li class="edit-card-item x-flex-start border-bottom">
        <p>分类：</p>
        <p class="sort">
          <span class="tag">{{getSortType(commentInfo.type)}}</span>
        </p>
      </li>
      <li class="edit-card-item x-flex-start border-bottom">
        <p>置顶：</p>
        <p>{{commentInfo.is_top==1?'置顶':'不置顶'}}</p>
      </li>
      <li class="edit-card-item x-flex-start x-flex-wap border-bottom">
        <p>内容：</p>
        <p class="edit-card-item-content" v-if="commentInfo.content" v-html="unescaped(commentInfo.content)">

        </p>
        <p class="edit-card-comment x-flex-between text-light">
          <span v-if="commentInfo.addtime">{{$moment.unix(commentInfo.addtime).format('YYYY-MM-DD HH:mm')}}</span>
          <!-- <span v-if="commentList.length" class="el-icon-chat-dot-square">&nbsp;评论</span> -->
        </p>
      </li>
      <!-- 评论 -->
      <div class="reply-card">
        <ReplyCard
          :commentList="commentList"
          :username="commentInfo.user_name"
          @delelteReply="delelteReply"
          @deleteComment="deleteReplyfirst"
        ></ReplyCard>
      </div>
    </ul>
  </div>
</template>
<script>
import { commentSort } from '../../base/base'
import ReplyCard from './ReplyCard'
import { getReply, delReplyfirst, delReply, getDiscussInfo } from '../../api/comment'
export default {
  components: {
    ReplyCard
  },
  data () {
    return {
      commentSort,
      commentList: [], //评论列表
      uid: localStorage.getItem('sys_uid'),
      username: localStorage.getItem('username'),
      discuss_id: '',
      commentInfo: {},
      id: ''
    }
  },
  created () {
    this.id = this.$route.query.id
    console.log(this.id)
    this.getDetail(this.id)
    this.getCommentList(this.id)
  },
  methods: {
    unescaped (v) {
      return unescape(v)
    },
    // 获取文章评论列表
    getCommentList (discuss_id) {
      getReply({ discuss_id }).then(res => {
        const { data } = res.data
        this.$nextTick(() => {
          this.commentList = data
        })
      })
    },
    getDetail (id) {
      getDiscussInfo({ id }).then(res => {
        this.commentInfo = res.data || {}
      })
    },
    handleCommand (index) {
      if (index == 0) {
        this.getCommentList(this.id)
      }
      else {
        this.deleteDiscuss(this.id)
      }
    },
    // 删除文章
    deleteDiscuss (id) {
      delDiscuss({ id }).then(res => {
        const { status } = res
        this.$router.go(-1)
        this.delTip(status.code, res.status.remind)
      }).catch(error => {
        this.delTip(error.status.code, error.status.remind)
      })
    },
    // 删除一级评论
    deleteReplyfirst (id) {
      // let params = {
      //   id,
      //   uid: this.uid
      // }
      delReplyfirst({ id }).then(res => {
        this.getCommentList(this.id)
        this.delTip(res.status.code, res.status.remind)
      }).catch(error => {
        this.delTip(error.status.code, error.status.remind)
      })
    },
    delTip (code, message) {
      if (code == 200) {
        this.$message.success('删除成功')
      }
      else {
        this.$message.error(message)
      }
    },
    // 删除二级评论
    delelteReply (id) {
      delReply({ id }).then(res => {
        this.getCommentList(this.discuss_id)
        this.delTip(res.status.code, res.status.remind)
      }).catch(error => {
        this.delTip(error.status.code, error.status.remind)
      })
    },
    // 分类
    getSortType (val) {
      let obj = this.commentSort.find(item => {
        return val == item.value
      })
      if (obj) {
        return obj.label
      }
    }
  }
}
</script>
<style lang="scss">
  .border-bottom {
    border-bottom: 1px solid#eee;
  }
  .edit-card {
    font-size: 14px;
    color: #333;
    background: #fff;
    overflow: auto;
    height: calc(100% - 100px );
    border-radius:10px 10px 0px 0px;
  }
  .edit-card-content {
    width: 100%
  }
  .edit-input {
    border: none;
    width: 70%;
    text-align: left;
    outline: none;
    &.add-title {
      color: #999;
    }
  }
  .edit-card-title{
    font-weight:bold;
    padding-left:30px;
    height: 44px;;
  }
  .edit-card-item {
    padding: 12px 30px;
  }
  .edit-btn-box {
    margin: 40px 70px;
  }
  .edit-btn-box .el-buton {
    border-radius: 0;
    margin-right: 30px;
  }
  .el-dropdown .dropdown-button {
    background:rgba(255,255,255,1);
    border:1px solid rgba(238,238,238,1);
    box-shadow:0px 4px 4px 0px rgba(106,106,106,0.1);
    border-radius: 0;
    color: #333333;
    border-radius:0px 5px 5px 0px;
    font-size: 18px;
    padding: 12px 40px 11px;
  }
  .edit-card-item > p:nth-of-type(1) {
    margin-right: 10px;
    text-align: right;
    width: 60px;
  }
  .sort span{
    padding:0 22px;
  }
  .sort .tag {
    height:26px;
    color: #1890FF;
    line-height: 26px;
    background:rgba(220,238,254,1);
    border-radius:13px;
    display: inline-block;
  }
  .edit-card-item-content {
    width: 200px;
    line-height: 20px;
  }
  .x-flex-wap {
    flex-wrap: wrap
  }
  .edit-card-comment {
    width: 100%;
    padding: 15px 15px 0 70px;
  }
  .text-light {
    color: #999999;
    font-size: 12px;
    margin: 5px 0 10px;
  }
  .reply-card {
    margin-right: 32px;
  }
</style>