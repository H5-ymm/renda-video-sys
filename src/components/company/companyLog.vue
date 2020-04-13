<template>
  <el-dialog title="企业日志" :visible.sync="dialogTableVisible" :before-close="handleClose">
    <el-timeline v-if="logList.length">
      <el-timeline-item
        v-for="(item, index) in logList"
        :key="index"
        color="#1890FF"
        :timestamp="$moment(item.ctime).format('YYYY-MM-DD HH:mm')"
      >{{item.content}}</el-timeline-item>
    </el-timeline>
    <p v-else>暂无日志</p>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getLogList } from '../../api/user'
export default {
  props: ['dialogTableVisible', 'uid'],
  data () {
    return {
      logList: []
    }
  },
  watch: {
    uid (val) {
      if (val) {
        this.getLog(val)
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('handleClose')
    },
    getLog (uid) {
      getLogList({ uid }).then(res => {
        console.log(res.data)
        this.logList = res.data
      })
    }
  }
}
</script>

<style>

</style>

