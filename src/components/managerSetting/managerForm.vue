<template>
  <el-dialog
    width="500px"
    :visible="dialogTableVisible"
    :before-close="handleClose"
    class="manager-dialog"
    title="添加/编辑管理员"
  >
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

          <el-alert type="warning" size="small" :closable="false" title="账号一经设置不可修改" style="height: 20px;margin-top: 5px;"></el-alert>
        </el-form-item>
        <!-- 只有管理员和超级管理员可以修改 -->
        <!-- v-if="!formMember.id" -->
        <el-form-item label="密码" required >
          <el-input v-model="formMember.password" class="width240" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="formMember.username" class="width240" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-select class="width240" v-model="formMember.description" @change="selChange">
            <el-option
              :label="item.description"
              :value="item.id"
              v-for="(item,index) in roleList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录权限">
          <el-radio-group v-model="status" class="width240" @change="qingJinChange">
            <el-radio :label="1">禁用</el-radio>
            <el-radio :label="2">启用</el-radio>
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
import { getRoleList } from '../../api/role'
import { adminUserLocking } from '../../api/userLock'
export default {
  props: ['dialogTableVisible', 'formMember'],
  data () {
    return {
      para:{},
      rules: {
        name: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      status: 0,
      roleList: [],
      params: {},
      role_id: ''
    }
  },
  watch:{
    formMember(v){
      console.log(v,'formMember')
    }
  },
  created () {
    this.getRole()
    // console.log(this.formMember,'formMember')
    // let para = {
    //     id: this.formMember.id,
    //     status: this.status
    //   };
    //   adminUserLocking(para).then(res => {
    //     console.log('锁定成功')
    //     this.$parent.getList(this.$parent.formParams)
    //   }).catch(err => {
    //     console.log('锁定失败')
    //   })
  },
  mounted () {
    console.log(this.formMember,'formMember2')
    console.log(this.status,'status')
    // let qingJin = this.formMember.prohibit
  },
  // watch:{
    // qingJin(v){
    //   console.log(v,'v3')
    //   if(v==0){
    //     this.status=2
    //   }else{
    //     this.status=1
    //   }
    // }
    // status(v){
    //   console.log(v)
    //   this.formMember.prohibit = 1 ? v=1 : v=2
    // }
  // },
  // computed:{
  //   getstatus(){
  //     let status = 0;
  //     this.formMember.prohibit==1 ? status = 1 : status = 2;
  //     return status;
  //   } 
  // },
  methods: {
    
    qingJinChange(){
      this.para = {
        id: this.formMember.id,
        status: this.status
      }
      adminUserLocking(this.para).then(res => {
        console.log('锁定成功')
        this.$parent.getList(this.$parent.formParams)
      }).catch(err => {
        console.log('锁定失败')
      })
    },
    getRole () {
      getRoleList().then(res => {
        console.log(res)
        this.roleList = res.data.data
        console.log(this.roleList,'this.roleList')
      })
    },
    getList (filed) {
      getConstant({ filed }).then(res => {
        this.edu_type = res.data.edu_type
      })
    },
    handleClose () {
      this.$parent.visible = false
    },
    selChange (v) {
      console.log(v,'change')
      this.role_id = v
    },
    submitForm () {
      this.$refs['formMember'].validate((valid) => {
        if (valid) {
          console.log(valid,'valid')
          
          this.params = {
            name: this.formMember.name,
            username: this.formMember.username,
            password: this.formMember.password,
            role_id: this.role_id
          }
            console.log(this.formMember,'this.formMember')
          if(this.formMember.id){
            console.log('2.if')
            // this.params.uid = this.formMember.id
            // password: this.formMember.password
            this.params = {
              uid: this.formMember.id,
              username: this.formMember.username,
              password: this.formMember.password,
              role_id: this.role_id
            }
              // params.uid=this.formMember.id
          }
          console.log(this.params,'pppprams')
          this.$emit('submitForm', this.params)
          this.$parent.formMember={}
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