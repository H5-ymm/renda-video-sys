<template>
  <div class="teamMessage user_form">
    <div class="manager-form-row">
      <el-form
        :model="userForm"
        :inline="true"
        ref="userForm"
        label-width="70px"
        label-position="left"
        class="teamMessage-form"
      >
        <section class="section-box">
          <div class="section-title">基本信息</div>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="姓名" >
                <el-input v-model="userForm.nickname" readonly></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="现住地址" >
                <el-input v-model="addressText" readonly></el-input>
              </el-form-item>
             </el-col>
              <el-col :span="8">
              <el-form-item label="邮箱" >
                <el-input v-model="userForm.email" readonly></el-input>
              </el-form-item>
             </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="性别" >
                <p class="el-input__inner">{{userForm.sex==1?'男':'女'}}</p>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" >
                <el-input v-model="userForm.tel" readonly></el-input>
              </el-form-item>
             </el-col>
             <el-col :span="8"></el-col>
          </el-row>
        </section>
         <section class="section-box">
          <div class="section-title">求职信息</div>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="工作性质" >
                <el-input v-model="userForm.nature_workName" readonly></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="工作地点" >
                <p class="el-input__inner">{{userForm.expected_provinceName}}{{userForm.expected_cityName}}</p>
              </el-form-item>
             </el-col>
              <el-col :span="8">
              <el-form-item label="期望薪资" v-if="userForm&&userForm.expected_salaryMoney">
                <p class="el-input__inner">{{userForm.expected_salaryMoney[0]}}-{{userForm.expected_salaryMoney[1]}}</p>
              </el-form-item>
             </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="期望行业">
                <el-input v-model="userForm.type_name" readonly></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="期望职位" >
                <el-input v-model="userForm.expected_job" readonly></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </section>
         <section class="section-box">
          <div class="section-title">教育背景</div>
          <div v-for="(item, index) in userForm.user_edu" :key="index">
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="8">
                <el-form-item label="学历">
                  <el-input v-model="item.eduName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="毕业时间" >
                  <p class="el-input__inner">{{$moment.unix(item.graduation_date).format('YYYY-MM')}}</p>
                </el-form-item>
              </el-col>
              <el-col :span="8"></el-col>
            </el-row>
            <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="8">
                <el-form-item label="学校名称" >
                  <el-input v-model="item.school"  readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="院系" >
                  <el-input v-model="item.faculty"  readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="专业">
                  <el-input v-model="item.speciality"  readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </section>
         <section class="section-box">
          <div class="section-title"> 工作/实习经历</div>
          <div v-for="(item, index) in userForm.user_jobspeciality" :key="index">
            <el-row type="flex" class="row-bg" justify="space-between" >
            <el-col :span="8">
              <el-form-item label="工作时间" >
                <p class="el-input__inner">{{$moment.unix(item.worktime_start).format('YYYY年MM月')}}-{{$moment.unix(item.worktime_start).format('YYYY年MM月')}}</p>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="工作类型" >
                 <el-input v-model="item.job_typeName"  readonly></el-input>
              </el-form-item>
             </el-col>
              <el-col :span="8">
              <el-form-item label="工作职责" >
                <el-input
                  v-model="item.work_content"
                  type="textarea"
                  :rows="2"
                  readonly/>
              </el-form-item>
             </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="公司名称" >
                <el-input v-model="item.company_name" readonly></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="职位名称" >
                <el-input v-model="item.job_name"  readonly></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8"></el-col>
          </el-row>
          </div>
        </section>
      </el-form>
    </div>
  </div>
</template>
<script>
import { seeConsumerInfo } from '@/api/consumer'
export default {
  data () {
    return {
      userForm: {},
      id: ''
    };
  },
  created () {
   this.id = this.$route.query.id
   this.getDetail(this.id)
  },
  computed: {
    addressText() {
      return this.userForm.provinceName + this.userForm.cityName + ''
    }
  },
  methods: {
    getDetail(id) {
      seeConsumerInfo({id}).then(res => {
        this.userForm = res.data
      })
    },
    resetForm (userForm) {
      this.$refs[userForm].resetFields()
    }
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/form';
 .user_form {
   .section-box { 
     padding: 10px 20px;
   }
   .el-input__inner,.el-textarea__inner {
     border: none;
     width: 200px;
     height: 20px;
     line-height: 20px;
   }
   .el-textarea__inner {
     padding: 10px 15px;
   }
   .el-form-item {
     margin-bottom:0;
   }
   .section-title {
     font-size: 24px;
     padding-bottom: 20px;
     border-bottom: 1px solid #eee;
   }
 }
</style>
