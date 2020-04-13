<template>
  <div class="webMessage">
    <div class="webMessage-form-row">
      <div class="web-title">基本信息</div>
      <el-form :model="webForm" ref="webForm" label-width="130px" class="webMessage-form web-form">
        <el-form-item label="网站名称" prop="team_name">
          <div class="width408">
            <el-input v-model="webForm.webname" class="width408" placeholder="请输入网站名称"></el-input>
            <span class="landline-tip">如：便利聘人才网</span>
          </div>
        </el-form-item>

        <el-form-item label="网站logo">
          <el-upload
            class="avatar-uploader"
            action="customize"
            ref="upload"
            :show-file-list="false"
            :http-request="upload"
          >
            <img v-if="weblogo" :src="weblogo" class="avatar" />
            <i v-else class="el-icon-circle-plus avatar-uploader-icon"></i>
            <p>上传logo</p>
          </el-upload>
        </el-form-item>
        <el-form-item label="网站地址">
          <el-input v-model="webForm.weburl" class="width408" placeholder="请输入申请人姓名"></el-input>
        </el-form-item>
        <el-form-item label="网站开启">
          <el-switch
            v-model="webForm.is_open ? true : false"
            class="web-switch"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开启"
            inactive-text="关闭"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="!webForm.is_open" label="网站关闭原因" prop="introduction">
          <el-input
            type="textarea"
            class="width408"
            :autosize="{minRows: 5}"
            v-model="webForm.offreason"
            placeholder="请输入网站关闭原因"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站版权信息" prop="introduction">
          <el-input
            type="textarea"
            class="width408"
            :autosize="{minRows: 3}"
            v-model="webForm.CopyrightInfo"
            placeholder="请输入网站版权信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="站长EMAIL">
          <el-input v-model="webForm.owenerEmail" class="width408" placeholder="请输入申请人姓名"></el-input>
        </el-form-item>
        <el-form-item label="站长电话">
          <el-input v-model="webForm.owenerTel" class="width408" placeholder="请输入申请人姓名"></el-input>
        </el-form-item>
        <el-form-item label="备案号">
          <el-input v-model="webForm.recordNumber" class="width408" placeholder="请输入申请人姓名"></el-input>
        </el-form-item>
        <el-form-item label="客服电话" prop="desc">
          <div class="x-flex-start-justify width408">
            <el-input type="text" v-model="webForm.customerTel" placeholder="请输入客服电话"></el-input>
            <span class="landline-tip">如：021-66041618</span>
          </div>
        </el-form-item>
        <el-form-item label="工作时间" prop="desc">
          <div class="x-flex-start-justify width408">
            <el-time-picker
              is-range
              class="width408"
              format="HH:mm"
              value-format="HH:mm"
              v-model="time"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </div>
        </el-form-item>
        <el-form-item label="客服QQ" prop="desc">
          <div class="width408">
            <el-input type="text" v-model="webForm.customerQQ" placeholder="请输入客服电话"></el-input>
            <span class="landline-tip">多个则用;隔开</span>
          </div>
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="webForm.address" class="width408" placeholder="请输入申请人姓名"></el-input>
        </el-form-item>
        <el-form-item class="webMessage-btn">
          <el-button type="primary" @click="submitForm('webForm')">保存</el-button>
          <el-button @click="getWebInfo()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '../api/upload'
import { getConfig, changeConfig } from '../api/setting'
import { getImgUrl, getImg } from '../util/util'
export default {
  data () {
    return {
      webForm: {
        type: 1
      },
      webForm: {},
      time: [],
      weblogo: ''
    };
  },
  created () {
    this.getWebInfo()
  },
  watch:{
    weblogo(v){
      console.log(v,'weblogo')
    }
  },
  methods: {
    getWebInfo () {
      getConfig().then(res => {
        this.webForm = res.data
        console.log(res.data,'res.data')
        // this.weblogo = res.data.weblogo
        this.weblogo = res.data.weblogo
        console.log(this.weblogo,'this.weblogo')
        this.time = this.webForm.workTime ? this.webForm.workTime.split('-') : []
        console.log(this.time)
      })
    },
    upload (params) {
      console.log(params,'uploads params')
      const _file = params.file;
      uploadFile(_file).then(res => {
        this.weblogo = getImgUrl(res.data.url)
        this.webForm.weblogo = getImgUrl(res.data.url)
      })
    },
    uploadLicense (params) {
      const _file = params.file;
      const isLt2M = _file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("请上传2M以下的.xlsx文件");
        return false;
      }
      uploadFile(_file).then(res => {
        this.license_img = this.getImg(_file)
        this.webForm.license_img = res.data.url
      })
    },
    submitForm () {
      // this.webForm.weblogo = this.weblogo
      this.webForm.workTime = this.time.join('-')
      changeConfig(this.webForm).then(res => {
        if (res.status.code == 200) {
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  img{margin: 0 !important;}
  .webMessage {
    padding-bottom: 80px;
    overflow: auto;
    height: 100%;
    .webMessage-form-row {
      background:#fff;
      width: 100%;
      margin:  15px auto 50px;
      padding: 20px 6px;
      border-radius: 10px;
      .web-title {
        width: 100%;
        font-size:20px;
        color: #000;
        margin: 0 50px 30px;
      }
      .webMessage-form {
        width: 50%;
        margin: 0 auto;
        font-size: 14px;
         &.web-form {
           width: 100%;
           margin: 0;
         }
        .width408 {
          width: 408px;
          position: relative;
        }
        .landline-tip {
          position: absolute;
          top: 0;
          right: -200px;
          color: #999999;
          font-size: 14px;
          text-align: left;
          width: 180px;
        }
        .webMessage-btn {
          .el-button {
            margin-right: 30px;
          }
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
}
</style>
