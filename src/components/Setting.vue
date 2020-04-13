<template>
  <div class="settingView">
    <div class="title">基本信息</div>
    <div class="settingView-form-row">
      <el-form
        :model="form"
        label-position="top"
        ref="personalForm"
        label-width="100px"
        class="settingView-form"
      >
      <el-form-item label="关键词过滤：" prop="introduction" class="x-flex-start settingContent">
        <el-input
          type="textarea"
          class="width408"
          :autosize="{minRows: 5}"
          v-model="form.fkeyword"
          placeholder="香港"
        ></el-input>
        <span class="keyword"> <i class="el-icon-warning-outline"/>  如： 香港，暴动</span>
      </el-form-item>   
       <el-form-item class="settingView-btn">
          <el-button type="primary" :disabled="!form.fkeyword" @click="submitForm()">保存</el-button>
          <el-button @click="form.fkeyword=''">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getFkeyword, saveFkeyword } from '@/api/setting'
export default {
  data () {
    return {
      form: {}
    };
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      getFkeyword().then(data => {
        this.form = data.data
      })
    },
    submitForm () {
      saveFkeyword(this.form).then(res => {
        if (res.status.code == 200) {
          this.$message.success('保存成功')
        }
      }).catch(error => {
        this.$message.error(error.status.remind)
      })
    }
  }
}
</script>
<style lang="scss">
  .settingView {
    padding-bottom: 80px;
    .title {
      // width: 100%;
      height:44px;
      line-height: 44px;
      font-size:14px;
      color: #333;
      padding-left: 32px;
      background:#fff;
      box-shadow:0px 4px 4px 0px rgba(106,106,106,0.1);
      border-radius:5px;
    }
    .settingView-form-row {
      background:#fff;
      width: 100%;
      margin: 20px auto;
      padding: 20px 0;
      height: 60%;
      border-radius: 10px;
      .settingView-form {
        position: relative;
        padding-left: 32px;
        .width408 {
          width: 408px;
        }
        .el-form-item__label {
          line-height: 14px;
          margin-right: 20px;
        }
        .settingContent {
          height: 360px;
        }
        .keyword {
          position: absolute;
          right: -140px;
          top: -10px;
          color: #6a6a6a;
        }
      }
    }
    .settingView-btn {
      padding-top: 30px;
      padding-bottom: 36px;
      .el-button {
        margin-right: 35px;
      }
    }
}
</style>
