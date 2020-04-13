<template>
  <el-dialog
    width="500px"
    center
    class="member-dialog record-dialog"
    :show-close="false"
  >
    <div class="member-row" id="top">
      <img src="../assets/img/member/cancel.png" alt class="cancel-icon" @click="handleClose" />
      <section class="member-col1">
        <p>跟进记录</p>
      </section>
      <section class="record-col3">
        <ul>
          <li v-for="(item,index) in trackList" :key="index" class="record-item">
            <p class="record-time">{{$moment(item.addtime).format('YYYY-MM-DD')}}</p>
            <el-divider>
              <img src="../assets/img/icon9.png" class="line-icon" alt />
            </el-divider>
            <p class="record-title">{{item.title}}</p>
            <div class="record-content">
              <span class="record-text">{{item.operator}}</span>
              {{item.type}}
              <span class="record-text">{{item.username}}</span>
              {{item.remark}}
            </div>
            <p class="record-footer">{{$moment(item.addtime).format('HH:mm:ss')}}</p>
          </li>
        </ul>
        <div class="resume-btn">
          <a href="#top">
            <el-button @click="handleClose">返回顶部</el-button>
          </a>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </section>
    </div>
    <div slot="footer" class="resume-footer-btn x-flex-center">
      <el-button type="text" @click="show=true">添加跟进记录</el-button>
      <img src="../assets/img/icon10.png" alt />
    </div>
    <transition name="el-zoom-in-bottom">
      <div v-show="show" class="transition-box">
        <el-button @click="show=false" type="text" class="transition-close">收起</el-button>
        <div class="record-submit">
          <p>添加跟进记录</p>
          <el-input
            type="textarea"
            :autosize="{ minRows: 4}"
            placeholder="请输入跟进记录"
            v-model="reason"
          ></el-input>
          <div class="resume-btn">
            <el-button @click="show=false,reason=''">取消</el-button>
            <el-button type="primary" @click="save">保存</el-button>
          </div>
        </div>
      </div>
    </transition>
  </el-dialog>
</template>
<script>
  // import { addTrackingInfo } from '@/api/resume'
  export default {
    props: ['trackList', 'id'],
    created () {
      console.log(this.trackList,'trackList')
    },
    data () {
      return {
        reason: '',
        list: [
          {
            title: '跟进记录',
            addtime: 1576569206,
            id: 7,
            operator: "人才推荐",
            reason: "",
            remark: "内部推送职位",
            resume_id: 2,
            uid: 6,
          },
          {
            title: '跟进记录',
            addtime: 1576569206,
            id: 7,
            operator: "人才推荐",
            reason: "",
            remark: "内部推送职位",
            resume_id: 2,
            uid: 6,
          }
        ],
        show: false,
        resumeId: ''
      }
    },
    watch: {
      id (val) {
        if (val) {
          this.resumeId = val
        }
      }
    },
    created () {
  
    },
    methods: {
      handleClose () {
        this.$emit('handleClose')
      },
      submitForm () {
        this.$emit('submitRecord', this.reason)
      },
      save () {
        this.show = false
        let params = {
          uid: localStorage.getItem('sys_uid'),
          resumeId: this.resumeId,
          remark: this.reason
        }
        addTrackingInfo(params).then(res => {
          console.log(res)
          this.reason = ''
        })
      }
    }
  }
</script>