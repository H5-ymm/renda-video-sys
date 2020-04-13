<template>
  <el-dialog width="500px" :visible="dialogTableVisible" class="manager-dialog" title="添加管理员">
    <div class="manager-row">
        <el-form
          :model="formMember"
          :rules="rules"
          ref="formMember"
          label-position="right"
          label-width="90px"
        >
          <el-form-item label="账号" required prop="name">
            <el-input v-model="formMember.name" class="width240" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="密码" required prop="password">
            <el-input v-model="formMember.password" class="width240" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="formMember.username" class="width240" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="权限">
            <el-select placeholder="请选择" class="width240" v-model="formMember.role_id">
              <el-option
                label="管理员"
                value="15"
              >管理员</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="登录权限">
            <el-radio-group v-model="status" class="width240">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
    </div>
    <div slot="footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['dialogTableVisible','formMember'],
  data () {
    return {
      rules: {
        name: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      status: 1,
    }
  },
  created () {
    console.log(this.$store.state)
  },
  methods: {
    getList (filed) {
      getConstant({ filed }).then(res => {
        this.edu_type = res.data.edu_type
      })
    },
    handleClose () {
      this.$parent.visible = false
    },
    submitForm () {
      this.$refs['formMember'].validate((valid) => {
        if (valid) {
          let params = {
            uid: this.formMember.id,
            username: this.formMember.username,
            password: this.formMember.password,
            role_id: this.formMember.role_id
          }
          this.$emit('submitForm', params)
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.manager-dialog {
 .manager-row {
    width: 80%;
    margin: 0 auto;
    color: #333333;
    position: relative;
    .manager-col2 {
      margin: 10px auto;
      width: 65%;
    }
    .width240 {
      width: 240px;
    }
    .el-form-item__content {
      margin-left: 20px!important;
      text-align:left;
    }
  }
}
 
</style>