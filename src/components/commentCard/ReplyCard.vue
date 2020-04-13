<template>
  <div>
    <div
      class="edit-card-item x-flex-start"
      v-for="(item,index) in commentList"
      :key="index"
      v-show="commentList.length"
    >
      <div class="edit-card-comment-col1">
        <img src="../../assets/img/img1.png" alt class="head-img" v-if="item.head_img" />
        <span v-if="!item.head_img" class="head-img">{{item.username}}</span>
      </div>
      <div class="edit-card-comment-col2">
        <p>
          <span class="user-name">{{item.username}}: </span>
          
          <span v-if="item.content" v-html="unescaped(item.content)"></span>
        </p>
        <div class="x-flex-between text-light reply-btn">
          <span>{{$moment(item.addTime).format('YYYY-MM-DD')}}</span>
          <span @click="handleComment(item,1)" v-if="uid==item.user_id">删除</span>
        </div>
        <section
          class="edit-card-comment-section"
          v-for="(val,ind) in item.replyList"
          :key="ind"
          v-show="item.replyList.length"
        >
          <div class="x-flex-start">
            <div class="edit-card-comment-col2">
              <p>
                <span class="user-name">{{val.r_name}}</span>
                <span class="reply">回复</span>
                <span class="user-name">{{val.username}}</span>
                <span v-if="val.content" v-html="unescaped(val.content)"></span>
              </p>
              <p class="x-flex-between text-light">
                <span>2019-12-01</span>
                <span v-if="val.user_id==uid" class="reply-active" @click="handleComment(val,2)">删除</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['commentList', 'username'],
  name: 'reply',
  data () {
    return {
      uid: localStorage.getItem('sys_uid')
    }
  },
  created () {
    console.log(this.commentList)
  },
  methods: {
    unescaped (v) {
      return unescape(v)
    },
    handleComment (item, type) {
      if (type == 2) {
        // 二级删除
        this.$emit('delelteReply', item.comment_id)
      } else {
        // 一级删除
        this.$emit('deleteComment', item.id)
      }
    }
  }
}
</script>
<style lang="scss">
 .edit-card-comment-col1 {
    margin: 0 10px;
    .head-img {
      width:50px;
      height:50px;
      border-radius:50%;
      display: inline-block;
    }
    >span {
      background: #1890FF;
      color: #fff;
      text-align: center;
      line-height: 50px;
      overflow: hidden;
      font-size: 12px;
    }
  }
  .edit-card-comment-col2 {
    font-size:14px;
    padding-top: 5px;
    width: 100%;
  }
  .edit-card-comment-section {
    width:100%;
    background:#F4F4F4;
    border-radius:5px;
    padding: 5px 15px 5px 10px;
  }
  // .reply-btn > p{
  //   margin-right: -15px;
  //   span {
  //     margin-left: 5px;
  //   }
  // }
  .text-light.reply-btn {
    margin: 5px -10px 10px 0;
  }
  .reply-active {
    color: #333;
  }
  .user-name {
    color: #1890FF;
  }
  .reply {
    margin: 0 4px;
    color: #333;
    font-weight:400;
  }

</style>
