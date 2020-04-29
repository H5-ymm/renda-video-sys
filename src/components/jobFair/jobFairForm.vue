<template>
  <div class="teamMessage">
    <div class="manager-form-row">
      <el-form
        :model="jobForm"
        :rules="rules"
        ref="jobForm"
        label-width="150px"
        label-position="right"
        class="teamMessage-form"
      >
        <section class="section-box">
          <el-form-item label="招聘会标题" prop="title">
            <el-input v-model="jobForm.title" class="width408" placeholder="请输入招聘会标题"></el-input>
          </el-form-item>
          <el-form-item label="起止时间" required>
             <el-date-picker
              class="width408"
              type="daterange"
              unlink-panels
              value-format="timestamp"
              @change="changeDate" 
              v-model="timeList"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="招聘会介绍(邀请函)" prop="invitation_letter" required>
            <el-input
              type="textarea"
              class="width408"
              :autosize="{minRows: 5}"
              v-model="jobForm.invitation_letter"
              placeholder="请输入招聘会介绍"
            ></el-input>
          </el-form-item>
          <el-form-item label="规模" prop="scale">
            <el-input v-model="jobForm.scale" class="width408" placeholder="请输入规模">
              <template slot="append">家</template>
            </el-input>
          </el-form-item>
          <el-form-item label="展位审批">
          <el-radio-group v-model="jobForm.is_audit" class="width240">
            <el-radio :label="1">需要</el-radio>
            <el-radio :label="2">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="teamMessage-btn">
          <el-button type="primary" @click="submitForm('jobForm')">{{id?'保存':'发布'}}</el-button>
          <!-- <el-button @click="resetForm('jobForm')">取消</el-button> -->
        </el-form-item>
        </section>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addJobFair, editJobFair, jobFairDetail } from '@/api/jobFair'
export default {
  data () {
    return {
      jobForm: {
        title: '',
        scale: 1,
        is_audit: 1,
        invitation_letter: '',
        starttime:'',
        endtime:''
      },
      rules: {
        title: [
          { required: true, message: '请输入招聘会标题', trigger: 'blur' }
        ],
        invitation_letter: [
          { required: true, message: '请输入招聘会介绍', trigger: 'blur' }
        ],
        scale: [
          { required: true, message: '请输入规模', trigger: 'blur' }
        ]
      },
      id: '',
      timeList: []
    };
  },
  created () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getInfo(this.id)
    }
  },
  methods: {
    pickerOptions: {
      disabledDate: (time) => {
        if (this.endTime !== '' && this.endTime != null) {
          return time.getTime() > this.endTime
          } else {
          return time.getTime() < this.endTime
        }
      }
    },
    getInfo(id) {
      jobFairDetail({ id }).then(res => {
        if (res.data) {
          let data = res.data
          for(let key in this.jobForm) {
            this.jobForm[key] = data[key]
          }
          this.jobForm.id =  this.id
          let starttime = this.$moment.unix(data.starttime)
          let endtime = this.$moment.unix(data.endtime)
          this.timeList = [starttime, endtime]
        }
      })
    },
    changeDate(val) {
      let starttime = val ? val[0] + '' : ''
      let endtime =  val ?  val[1] + '' : ''
      this.jobForm.starttime = starttime ? starttime.substring(0, 10) : ''
      this.jobForm.endtime = endtime ? endtime.substring(0, 10) : ''
    },
    add() {
      addJobFair(this.jobForm).then(res => {
        if (res.data) {
          this.$router.push('/jobFairList')
        } else {
          this.$message.error('发布失败')
        }
      }).catch(error =>{
        if (error && error.status) {
          this.$message.error(error.status.remind)
        }        
      })
    },
    edit() {
       editJobFair(this.jobForm).then(res => {
        if (res.data) {
          this.$router.push('/jobFairList')
        }  else {
          this.$message.error('保存失败')
        }
      }).catch(error =>{
        if (error && error.status) {
          this.$message.error(error.status.remind)
        }        
      })
    },
    submitForm (jobForm) {
      this.$refs[jobForm].validate((valid) => {
        if (valid) {
          if(this.id) {
            this.edit()
          } else {
            this.add()
          }
        } else {
          return false;
        }
      });
    },
    resetForm (jobForm) {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/form';
</style>
