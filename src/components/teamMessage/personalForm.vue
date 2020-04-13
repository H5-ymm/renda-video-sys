<template>
  <div class="teamMessage">
    <div class="title">查看个人团队信息</div>
    <div class="manager-form-row">
      <el-form
        :model="personalForm"
        :rules="rules"
        ref="personalForm"
        label-width="100px"
        class="teamMessage-form"
      >
        <userCard :name="personalForm.team_name" @resetPassword="resetPassword"></userCard>
        <p class="company-title">基本信息</p>
        <section class="section-box">
          <el-form-item label="团队名称" prop="team_name">
            <el-input v-model="personalForm.team_name" class="width408" placeholder="请输入团队名称"></el-input>
          </el-form-item>
          <el-form-item label="团队logo" required>
            <el-upload
              class="avatar-uploader"
              action="customize"
              ref="upload"
              :show-file-list="false"
              :http-request="upload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-circle-plus avatar-uploader-icon"></i>
              <p>上传logo</p>
            </el-upload>
          </el-form-item>
          <el-form-item label="申请人姓名" required>
            <el-input v-model="personalForm.user_name" class="width408" placeholder="请输入申请人姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证" required>
            <el-input v-model="personalForm.id_card" class="width408" placeholder="请输入身份证"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="delivery">
            <el-radio-group class="width408" v-model="personalForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄" require>
            <el-input v-model="personalForm.age" class="width408" placeholder="请输入年龄"></el-input>
          </el-form-item>
          <el-form-item label="学历" prop="education">
            <el-select v-model="personalForm.education" class="width408" placeholder="请选择学历">
              <el-option :label="item" :value="index" v-for="(item,index) in edu_type" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地址" prop="region">
            <div class="width408">
              <districtSelet @change="change" :address="address"></districtSelet>
            </div>
          </el-form-item>
          <el-form-item label="团队简介" prop="introduction">
            <el-input
              type="textarea"
              class="width408"
              :autosize="{minRows: 5}"
              v-model="personalForm.introduction"
              placeholder="请输入团队介绍"
            ></el-input>
          </el-form-item>
          <el-form-item class="teamMessage-btn">
            <el-button type="primary" @click="submitForm('personalForm')">保存</el-button>
            <el-button @click="resetForm('personalForm')">取消</el-button>
          </el-form-item>
        </section>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getConstant } from '../../api/dictionary'
import districtSelet from '../districtSelet'
import userCard from '../userCard'
import { getImg, getImgUrl } from '../../util/util'
import { edit_team, getTeamInfo } from '../../api/team'
import { uploadFile } from '../../api/upload'
import { reset_password } from '../../api/company'
export default {
  components: {
    districtSelet,
    userCard
  },
  data() {
    return {
      personalForm: {
        type: 2,
        id: ''
      },
      imageUrl: '',
      rules: {
        team_name: [
          { required: true, message: '请输入团队名称', trigger: 'blur' }
        ]
      },
      edu_type: [],
      uid: localStorage.getItem('sys_uid'),
      address: []
    };
  },
  created() {
    this.personalForm.id = this.$route.query.id
    let params = 'edu_type'
    this.getList(params)
    if (this.personalForm.id) {
      this.getInfo(this.personalForm.id)
    }
  },
  methods: {
    getInfo(id) {
      getTeamInfo({ id }).then(res => {
        if (res.data) {
          this.personalForm = res.data || {}
          if (this.personalForm.log) {
            this.imageUrl = getImgUrl(this.personalForm.log)
          }
          this.personalForm.age = this.personalForm.age || ''
          console.log(this.imageUrl)
          this.address.push(this.personalForm.provinceid, this.personalForm.cityid, this.personalForm.three_cityid)
          console.log(this.address)
        }
      })
    },
    getList(filed) {
      getConstant({ filed }).then(res => {
        this.edu_type = res.data.edu_type
      })
    },
    resetPassword() {
      let uid = this.companyForm.uid
      reset_password({ uid }).then(res => {
        this.$message.success('重置成功')
      }).catch(error => {
        this.$message.error('重置失败')
      })
    },
    upload(params) {
      const _file = params.file;
      const isLt2M = _file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("请上传2M以下的.xlsx文件");
        return false;
      }
      uploadFile(_file).then(res => {
        this.imageUrl = getImg(_file)
        this.personalForm.log = res.data.url
      })
    },
    change(val) {
      this.personalForm.provinceid = val[0]
      this.personalForm.cityid = val[1]
      this.personalForm.three_cityid = val[2]
    },

    submitForm(personalForm) {
      this.$refs[personalForm].validate((valid) => {
        if (valid) {
          edit_team(this.personalForm).then(res => {
            if (res.status.code == 200) {
              this.$router.push('teamlist')
            }
          }).catch(error => {
            this.$message.error(error.status.remind)
          })
        } else {
          return false
        }
      });
    },
    resetForm(personalForm) {
      this.$refs[personalForm].resetFields();
    },
    handleAvatarSuccess() { }
  }
}
</script>
<style lang="scss">
.teamMessage {
  padding-bottom: 80px;
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
  .teamMessage-form-row {
    background: #fff;
    width: 100%;
    margin: 15px auto;
    padding: 20px 6px;
    border-radius: 10px;
    .teamMessage-form {
      width: 50%;
      margin: 0 auto;
      .width408 {
        width: 408px;
      }
      .width300 {
        width: 300px;
      }
      .el-input__inner {
        height: 38px;
        line-height: 38px;
        border: 1px solid #eee;
        border-radius: 0;
      }
      .send-code-btn {
        width: 98px;
        margin-left: 10px;
        padding: 10px 20px;
        border-radius: 0;
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
      width: 91px;
      height: 91px;
      > p {
        margin-top: -10px;
      }
    }
    .avatar-uploader-card {
      display: inline-block;
      margin-right: 20px;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
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
      width: 91px;
      height: 91px;
      display: block;
    }
  }
  .teamMessage-btn {
    padding-top: 30px;
    padding-bottom: 36px;
    .el-button {
      margin-right: 35px;
    }
  }
}
</style>