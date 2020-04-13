<template>
  <div class="teamMessage">
    <div class="title">查看企业信息</div>
    <div class="manager-form-row">
      <el-form
        :model="companyForm"
        :rules="rules"
        ref="companyForm"
        label-width="100px"
        class="teamMessage-form"
      >
        <userCard :name="companyForm.com_name" @resetPassword="resetPassword"></userCard>
        <p class="company-title">基本信息</p>
        <section class="section-box">
          <el-form-item label="企业名称" prop="com_name">
            <el-input v-model="companyForm.com_name" class="width408" placeholder="请输入团队名称"></el-input>
          </el-form-item>
          <el-form-item label="企业logo" required>
            <el-upload
              class="avatar-uploader"
              action="customize"
              ref="upload"
              :show-file-list="false"
              :http-request="upload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-circle-plus avatar-uploader-icon"></i>
              <p>上传</p>
            </el-upload>
          </el-form-item>
          <el-form-item label="营业执照">
            <el-upload
              class="uploader-card avatar-uploader"
              action="customize"
              :show-file-list="false"
              :http-request="uploadLicense"
            >
              <img v-if="license_img" :src="license_img" class="avatar">
              <i v-else class="el-icon-circle-plus avatar-uploader-icon"></i>
              <p>上传</p>
            </el-upload>
          </el-form-item>
          <el-form-item label="从事行业" prop="industry">
            <el-select v-model="companyForm.com_sort" class="width408" placeholder="请选择企业从事行业">
              <el-option :label="item" :value="key" v-for="(item,key) in jobList" :key="key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业性质" prop="enterprise">
            <el-select v-model="companyForm.com_type" class="width408" placeholder="请选择企业性质">
              <el-option
                :label="item"
                :value="index+1"
                v-for="(item,index) in comTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业规模" prop="scale">
            <el-select v-model="companyForm.com_scale" class="width408" placeholder="请选择企业规模">
              <el-option
                :label="item"
                :value="index+1"
                v-for="(item,index) in comScaleList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司地址" required>
            <div class="width408">
              <districtSelet @change="change" :address="address"></districtSelet>
            </div>
            <el-input
              v-model="companyForm.address"
              class="width408 team-address"
              placeholder="请填写详细地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="companyForm.link_man" class="width408" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="companyForm.link_phone" class="width408" placeholder="请输入联系人姓名"></el-input>
          </el-form-item>
          <el-form-item label="公司座机" prop="desc">
            <div class="x-flex-start-justify width408">
              <el-input type="text" class="width60" v-model="landlineStart" placeholder="区号"></el-input>
              <span class="landline"></span>
              <el-input type="text" class="width150" v-model="landlineEnd" placeholder="座机号码"></el-input>
              <span class="landline-tip">如：021-66041618</span>
            </div>
          </el-form-item>
          <el-form-item label="企业简介" prop="introduction">
            <el-input
              type="textarea"
              class="width408"
              :autosize="{minRows: 5}"
              v-model="companyForm.introduction"
              placeholder="请输入企业简介"
            ></el-input>
          </el-form-item>
          <el-form-item class="teamMessage-btn">
            <el-button type="primary" @click="submitForm('companyForm')">保存</el-button>
            <el-button @click="resetForm('companyForm')">取消</el-button>
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
import { getCompanyInfo, companyEdit, reset_password } from '../../api/company'
import { uploadFile } from '../../api/upload'
export default {
  components: {
    districtSelet,
    userCard
  },
  data() {
    return {
      address: [],
      companyForm: {
        type: 1
      },
      imageUrl: '',
      license_img: '',
      landlineStart: '',
      landlineEnd: '',
      rules: {
        team_name: [
          { required: false, message: '请输入团队名称', trigger: 'blur' }
        ],
        industry: [
          { required: false, message: '请选择从事行业', trigger: 'blur' }
        ]
      },
      comScaleList: [],
      comTypeList: [],
      jobList: {},
      companyTeamId: ''
    };
  },
  created() {
    console.log(this.$route.query)
    this.companyTeamId = this.$route.query.uid
    let params = 'com_type,com_scale,job_array'
    this.getList(params)
    this.getInfo(this.companyTeamId)
  },
  methods: {
    getList(filed) {
      getConstant({ filed }).then(res => {
        console.log(res, 'res')
        console.log(res.data, 'res.data')
        const { com_scale, com_type, job_array } = res.data
        this.comScaleList = com_scale
        this.comTypeList = com_type
        this.jobList = job_array
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
    getInfo(uid) {
      getCompanyInfo({ uid }).then(res => {
        this.companyForm = res.data
        if (res.data.provinceid) {
          let provinceid = res.data.provinceid + ''
          let cityid = res.data.cityid + ''
          let three_cityid = res.data.three_cityid + ''
          this.address = [provinceid, cityid, three_cityid]
          console.log(this.address, 'this.address')
        }
        if (res.data.link_tel) {
          let link = res.data.link_tel.split('-')
          if (link.length) {
            this.landlineStart = link[0]
            this.landlineEnd = link[1]
          }
        }
      })
    },
    upload(params) {
      console.log(params, 'params')
      const _file = params.file;
      const isLt2M = _file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("请上传2M以下的.xlsx文件");
        return false;
      }
      uploadFile(_file).then(res => {
        this.imageUrl = this.getImg(_file)
        this.companyForm.log = res.data.url
      })
    },
    getImg(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(_file)
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url;
    },
    uploadLicense(params) {
      const _file = params.file;
      const isLt2M = _file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("请上传2M以下的.xlsx文件");
        return false;
      }
      uploadFile(_file).then(res => {
        this.license_img = this.getImg(_file)
        this.companyForm.license_img = res.data.url
      })
    },
    change(val) {
      this.companyForm.provinceid = val[0]
      this.companyForm.cityid = val[1]
      this.companyForm.three_cityid = val[2]
    },

    submitForm(companyForm) {
      this.companyForm.landline = this.landlineStart + '-' + this.landlineEnd
      this.$refs[companyForm].validate((valid) => {
        console.log(valid, 'validdd')
        if (valid) {
          companyEdit(this.companyForm).then(res => {
            if (res.status.code == 200) {
              this.$message.success('修改成功')
              this.$router.go(-1)
              // this.$router.push('userlist')
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm(companyForm) {
      this.$refs[companyForm].resetFields()
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
    .uploader-card {
      display: inline-block;
      margin-right: 20px;
      .idcard-text {
        color: #6a6a6a;
        text-align: center;
        font-size: 14px;
      }
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
}
</style>
