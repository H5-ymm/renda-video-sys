<template>
  <el-dialog
    width="500px"
    max-height="800px"
    top="6vh"
    :visible="dialogTableVisible"
    center
    title="跟进记录"
    class="record-dialog"
    :before-close="handleClose"
  >
    <div class="member-row">
      <section class="record-box">
        <el-timeline v-if="list.length">
          <el-timeline-item
            v-for="(item, index) in list"
            :type="item.type"
            :size="item.size"
            :key="index"
            :timestamp="$moment.unix(item.addtime).format('YYYY-MM-DD')"
            placement="top"
          >
            <div class="record-content">
              <P
                class="record-title"
              >[{{item.title}}] {{item.username}} {{item.remark?item.remark:''}}</P>
              <P v-if="item.com_name">企业名称 : {{item.com_name}}</P>
              <P v-if="item.job_name">职位名称 : {{item.job_name}}</P>
              <P>操作人 : {{item.operator}}</P>
              <P>跟进时间: {{$moment.unix(item.addtime).format('YYYY-MM-DD HH:mm:ss')}}</P>
            </div>
          </el-timeline-item>
        </el-timeline>
      </section>
    </div>
  </el-dialog>
</template>
<script>
import { getTrackingList } from '@/api/cvorder'
export default {
  props: ['dialogTableVisible', 'id'],
  data() {
    return {
      reason: '',
      list: [],
      show: false,
      resumeId: ''
    }
  },
  watch: {
    id(val) {
      if (val) {
        this.getList(val)
      }
    }
  },
  created() {

  },
  methods: {
    getArr(val) {
      let obj = {}
      let newObj = {}
      let arr = []
      val.forEach((item, index) => {
        obj = {
          size: 'large',
          type: 'primary'
        }
        if (index == 0) {
          newObj = Object.assign(item, obj)
        } else {
          newObj = Object.assign(item, {
            size: 'normal ',
            type: 'info'
          })
        }
        arr.push(newObj)
      })
      return arr
    },
    getList(resumeId) {
      getTrackingList({ resumeId }).then(res => {
        this.list = this.getArr(res.data || [])
      })
    },
    handleClose() {
      this.$emit('handleClose')
    },
    submitForm() {
      this.$emit('submitRecord', this.reason)
    }
  }
}
</script>

<style lang="scss">
/* @import '../assets/css/commen'; */

.record-dialog {
  .resume-footer-btn {
    border-top: 1px solid #e8e8e8;
    box-shadow: 1px -2px 5px 0px rgba(106, 106, 106, 0.1);
    border-radius: 0px 0px 5px 5px;
    width: 100%;
    height: 30px;
  }
  .member-row {
    height: 500px;
    overflow: hidden;
  }
  .record-box {
    width: 90%;
    height: 100%;
    overflow: auto;
    padding: 0 20px;
    margin: 0 auto;
    .record-item {
      margin-bottom: 10px;
    }
    .record-time {
      color: #333;
    }
    .el-timeline-item__timestamp {
      text-align: left;
    }
    .record-content {
      line-height: 30px;
      text-align: left;
      margin: 12px 10px;
      p {
        color: #999;
      }
      .record-title {
        color: #333;
      }
    }
    .record-footer {
      text-align: right;
      color: #999999;
      font-size: 12px;
    }
  }
}
.resume-btn {
  text-align: right;
  margin: 20px 0;
  .el-button {
    border-radius: 3px;
    margin-left: 20px;
  }
}
</style>