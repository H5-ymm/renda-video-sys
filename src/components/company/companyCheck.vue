<template>
  <el-dialog
    title="审核"
    width="400px"
    :visible.sync="dialogTableVisible"
    :before-close="handleClose"
  >
    <el-form :model="form" class="lock-form">
      <el-form-item label="审核结果">
        <el-radio-group v-model="form.status">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="3">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核说明">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 2}" v-model="form.reason"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ['dialogTableVisible'],
  data () {
    return {
      form: {
      }
    }
  },
  methods: {
    handleClose () {
      this.$emit('handleClose')
    },
    submit () {
      console.log(this.form)
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style lang="scss">
 .lock-form {
   .el-radio-group {
     width: 100%;
   }
 }
</style>

