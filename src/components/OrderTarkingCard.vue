<template>
  <div class="teamMessage create-orderTaking-view">
    <div class="teamMessage-form-row create-orderTaking">
      <el-form
        :model="orderTakingForm"
        :rules="rules"
        ref="orderTakingForm"
        label-width="100px"
        class="teamMessage-form"
      >
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="orderTakingForm.name" class="width408" readonly placeholder="请输入职位名称"></el-input>
          <!-- <span class="error el-icon-warning">发单：只有团队可以接单，岗位需求人数由团队统一提供，个人无法接取。</span> -->
        </el-form-item>
        <el-form-item label="职位类别" prop="job_type" required>
          <el-select
            v-model="orderTakingForm.job_type"
            @change="selectJob"
            class="width408"
            placeholder="请选择职位类别"
          >
            <el-option v-for="(value,key) in jobList" :key="value" :value="Number(key)" :label="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求人数" required>
          <el-input
            type="number"
            v-model="orderTakingForm.required_number"
            class="width408"
            @input="numberChange(arguments[0],orderTakingForm.required_number)"
            :min="2"
            placeholder="请输入申请人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="工作地址" required>
          <div class="width408">
            <districtSelet @change="change" :address="address"></districtSelet>
          </div>
          <el-input
            v-model="orderTakingForm.address"
            class="width408 team-address"
            placeholder="请填写详细地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="desc">
          <div class="x-flex-start-justify width408">
            <el-input
              type="number"
              class="width80"
              :min="16"
              v-model="orderTakingForm.min_age"
              placeholder="请输入"
            ></el-input>
            <span class="landline"></span>
            <el-input
              type="number"
              class="width80"
              :max="45"
              v-model="orderTakingForm.max_age"
              placeholder="请输入"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="orderTakingForm.sex">
            <el-radio :label="3">男女不限</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>

          </el-radio-group>
        </el-form-item>
        <el-form-item label="缴纳五险" prop="is_five_risks">
          <el-radio-group v-model="orderTakingForm.is_five_risks">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
            <el-radio :label="3">试用期后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="缴纳公积金" prop="desc">
          <el-radio-group v-model="orderTakingForm.is_fund">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
            <el-radio :label="3">试用期后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学历" prop="education" required>
          <el-select v-model="orderTakingForm.education" class="width408" placeholder="请选择学历">
            <el-option :label="item" :value="index" v-for="(item,index) in eduList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!-- 薪资和返利模式 -->
        
        <salaryAndRebate :moneyList="moneyList" :form="orderTakingForm"></salaryAndRebate>
        <!-- 薪资和返利模式 -->
        <el-form-item label="职位描述" prop="job_content" required>
          <span class="error el-icon-warning">职位描述，最低输入30个字。</span>
          <el-input
            type="textarea"
            class="width408"
            :autosize="{minRows: 6}"
            v-model="orderTakingForm.job_content"
            placeholder="请输入职位描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" required>
          <el-input v-model="orderTakingForm.link_name" class="width408" placeholder="请输入联系人姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="orderTakingForm.tel" class="width408" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" >
          <el-input v-model="orderTakingForm.email" class="width408" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item class="teamMessage-btn">
          <el-button type="primary" @click="submitForm('orderTakingForm')">修改</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
// 团队 团队性质选择跳转
// 企业从账户资料跳转
import { getConstant } from '@/api/dictionary'
import districtSelet from './districtSelet'
import { getJobInfo, updateInvoice, } from '@/api/orderTarking'
import salaryAndRebate from './orderTaking/salaryAndRebate'
export default {
  components: {
    districtSelet,
    salaryAndRebate
  },
  data () {
    return {
      address: [],
      orderTakingForm: {
        type: 1,
        required_number: 2,
        max_age: 45,
        min_age: 16,
        is_five_risks: 1,
        sex: 3,
        is_fund: 1
      },
      imageUrl: '',
      license_img: '',
      landlineStart: '',
      landlineEnd: '',
      rules: {
        team_name: [
          { required: true, message: '请输入团队名称', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择从事行业', trigger: 'blur' }
        ]
      },
      moneyList: [],
      jobList: {},
      eduList: [],
      jobName: ''
    };
  },
  created () {
    let params = 'edu_type,money_array,job_array'
    this.getList(params)
    this.orderTakingForm.id = this.$route.query.id
    this.getInfo(this.orderTakingForm.id)
  },
  methods: {
    getInfo (id) {
      getJobInfo({ id }).then(res => {
        this.orderTakingForm = res.data
        this.orderTakingForm.job_type = Number(this.orderTakingForm.job_type)
        if(res.data.provinceid){
          let provinceid = res.data.provinceid + ''
          let cityid = res.data.cityid + ''
          let three_cityid = res.data.three_cityid + ''
          this.address = [provinceid,cityid,three_cityid]
          console.log(this.address,'this.address')
        }
      })
    },
    getList (filed) {
      getConstant({ filed }).then(res => {
        const { edu_type, money_array, job_array } = res.data
        // console.log(job_array,'job_array')
        // for(var i in job_array){
        //   Number(i)
        // }
        this.jobList = job_array
        this.eduList = edu_type
        this.moneyList = money_array
        console.log(this.jobList,'jobList')
      })
    },
    // getSortType (val) {
    //     let obj = this.commentSort.find(item => {
    //       return val == item.value
    //     })
    //     if (obj) {
    //       return obj.label
    //     }
    //   },
    selectJob (val) {
      // val: orderTakingForm.job_type
      // console.log(val,'selectjob val')
      for (let key in this.jobList) {
        // console.log(key,'joblist key')
        if (key == val) {
          // console.log(this.jobList[key],'this.jobList[key]')
          this.jobName = this.jobList[key]
        }
      }
      if (!this.orderTakingForm.name) {
        this.orderTakingForm.name = this.jobName
      }
    },
    change (val) {
      console.log(val,'change val')
      this.orderTakingForm.provinceid = val[0]
      this.orderTakingForm.cityid = val[1]
      this.orderTakingForm.three_cityid = val[2]
    },
    submitForm (orderTakingForm) {
      this.$refs[orderTakingForm].validate((valid) => {
        if (valid) {
          console.log(valid,'valid2')
          updateInvoice(this.orderTakingForm).then(res => {
            if (res.status.code == 200) {
              this.$router.push('userlist')
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm (orderTakingForm) {
      this.$refs[orderTakingForm].resetFields()
    }
  }
}
</script>
<style lang="scss">
  .teamMessage {
    padding-bottom: 80px;
    .teamMessage-form-row {
      background:#fff;
      // width: 100%;
      // margin:  0 auto;
      padding: 20px 6px;
      border-radius: 10px;
      &.create-orderTaking {
        padding: 40px 6px 20px;
        .el-input__inner,.el-textarea__inner {
          border-radius:2px!important;
        }
        .el-form-item__label {
          padding: 0 20px 0 0 ;
        }
        .teamMessage-btn {
          padding-bottom: 0;
        }
      }
      .teamMessage-form {
        width: 100%;
        margin: 0 20px;
        font-size: 14px;
        .width408 {
          width: 408px;
        }
        .width80 {
          width: 80px;
        }
        .width150 {
          width:150px;
        }
        .landline {
          width:20px;
          height:1px;
          background: #6a6a6a;
          margin: 0 10px;
        }
        .landline-tip {
          position: absolute;
          top: 0;
          right: -20px;
          color: #999999;
          font-size: 14px;
        }
        .el-input__inner {
          height: 38px;
          line-height: 38px;
          border: 1px solid #eee;
          border-radius: 0;
        }
        .team-address {
          margin-top: 5px;
        }
      }
      .avatar-uploader .el-upload {
        background: #eee;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        color: #999999;
        font-size: 14px;
        width:91px;
        height:91px;
        >p {
          margin-top: -10px;
        }
      }
      .uploader-card {
        display: inline-block;
        margin-right: 20px;
        .idcard-text  {
          color:#6A6A6A;
          text-align: center;
          font-size: 14px;
        }
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        text-align: center;
        color: #999999;
        font-size: 42px;
        margin-top: 10px;
      }
      .avatar {
        width:91px;
        height:91px;
        display: block;
      }
    }
    .card-uploader-icon {
      width: 162px;
      height: 128px;
    }
    .idcard-tip {
      position: absolute;
      right: -100px;
      top: 30px;
      font-size: 14px;
      color: #999;
    }
    .error {
      position:absolute;
      top: -16px;
      left:0;
      color:#FE2A00;
      font-size:12px;
    }
  }
</style>
