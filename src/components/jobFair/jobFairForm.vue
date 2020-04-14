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
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="招聘会介绍(邀请函)" prop="introduction" required>
            <el-input
              type="textarea"
              class="width408"
              :autosize="{minRows: 5}"
              v-model="jobForm.introduction"
              placeholder="请输入招聘会介绍"
            ></el-input>
          </el-form-item>
          <el-form-item label="规模" required>
            <el-input v-model="jobForm.number" class="width408" placeholder="请输入规模">
              <template slot="append">家</template>
            </el-input>
          </el-form-item>
          <el-form-item label="展位审批">
          <el-radio-group v-model="jobForm.status" class="width240">
            <el-radio :label="1">需要</el-radio>
            <el-radio :label="2">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="teamMessage-btn">
          <el-button type="primary" @click="submitForm('jobForm')">{{id?'保存':'发布'}}</el-button>
          <el-button @click="resetForm('jobForm')">取消</el-button>
        </el-form-item>
        </section>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getConstant } from '@/api/dictionary'
import districtSelet from '../districtSelet'
import { edit_team, getTeamInfo } from '@/api/team'
import { uploadFile } from '@/api/upload'
export default {
  components: {
    districtSelet
  },
  data () {
    return {
      jobForm: {
        title: '',
        number: 1
      },
      rules: {
        title: [
          { required: true, message: '请输入招聘会标题', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请输入招聘会介绍', trigger: 'blur' }
        ]
      },
      id: ''
    };
  },
  created () {
    if (this.id) {
      this.getInfo(this.id)
    }
  },
  methods: {
    getInfo (id) {
      getTeamInfo({ id }).then(res => {
        if (res.data) {
          this.jobForm = res.data || {}
        }
      })
    },
    submitForm (jobForm) {
      this.$refs[jobForm].validate((valid) => {
        if (valid) {
          edit_team(this.jobForm).then(res => {
            if (res.status.code == 200) {
              this.$router.push('/jobFairList')
            }
          })
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
.teamMessage {
  padding-bottom: 80px;
  height: 100%;
  .title {
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #333;
    padding-left: 15px;
    background: #fff;
    box-shadow: 0px 4px 4px 0px rgba(106, 106, 106, 0.1);
    border-radius: 5px;
  }
  .section-box {
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    .password-tip {
      color: #6a6a6a;
      margin-left: 20px;
    }
    .landline-tip {
      position: absolute;
      top: 0;
      right: 0;
      color: #999999;
      font-size: 14px;
    }
  }
  .manager-form-row {
    width: 100%;
    margin: 0 auto;
    .teamMessage-form {
      width: 100%;
      font-size: 14px;
      margin-bottom: 70px;
      .width408 {
        width: 408px;
        position: relative;
      }
      .width60 {
        width: 60px;
      }
      .width150 {
        width: 150px;
      }
      .landline {
        width: 20px;
        height: 1px;
        background: #6a6a6a;
        margin: 0 10px;
        display: inline-block;
      }
      .el-input__inner {
        border: 1px solid #eee;
      }
      .team-address {
        margin-top: 5px;
      }
    }
   }
  }
</style>
