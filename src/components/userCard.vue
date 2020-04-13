<template>
  <div>
    <p class="company-title">账户信息</p>
    <section class="section-box">
      <el-form-item label="账户名称">
        <el-input v-model="name" readonly class="width408" placeholder="请输入团队名称"></el-input>
      </el-form-item>
      <el-form-item label="账号密码">
        <el-button type="primary" @click="handlePassword">重置密码</el-button>
        <span class="password-tip">
          <i class="el-icon-warning-outline" /> 密码重置:12345，不可逆转，谨慎操作
        </span>
      </el-form-item>
    </section>
  </div>
</template>
<script>
import { resetPassword } from '../api/company'
export default {
  props: ['name'],
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    if (localStorage.getItem('sys_userInfo')) {
      this.userInfo = JSON.parse(localStorage.getItem('sys_userInfo'))
    }
    console.log(this.userInfo,'userInfo')
  },
  methods: {
    handlePassword () {
      this.$alert('密码将设置为123456<br>确定重置吗?', '密码重置', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('resetPassword')
        // let uid = this.userInfo.id
        // resetPassword({ uid }).then(res => {
        //   this.$message.success('重置成功')
        // })
      }).catch(() => {
        console.log(2)
      })
    },
  }
}
</script>