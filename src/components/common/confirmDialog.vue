<template>
  <el-dialog title="审核" width="400px" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form :model="form" class="lock-form">
      <el-form-item :label="`审核结果`">
        <el-radio-group v-model="form.status">
          <el-radio :label="item.value" v-for="item in labelList" :key="item.value" @change="choose_change">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="`拒绝理由`" v-if="form.status==2">
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
  props: ['dialogVisible', 'objRow'],
  data () {
    return {
      form: {
        status: 0,
        reason: ''
      },
      dialogType: '审核',
      labelList: [{
        label: '通过', value: 1
      }, {
        label: '不通过', value: 2
      }]
    }
  },
  watch: {
    objRow(val) {
      console.log(val)
      if (val) {
        this.form = val
      }
    }
  },
  methods: {
    handleClose () {
      this.form.status = this.objRow.status
      this.$emit('handleClose')
    },
    submit () {
      if(!this.form.status) {
        return this.$message.warning('请选择审核状态')
      }
      this.$emit('submit', this.form)
      this.form = {
        status: 0,
        reason: ''
      }
    },
    choose_change (v) {
      this.form.status = v
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

