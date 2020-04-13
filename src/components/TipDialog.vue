<template>
  <el-dialog
    title=""
    :visible.sync="tipDialogVisible"
    width="530px"
    top="20vh"
    center class="dialog tipDialog">
    <el-form :model="form">
      <el-form-item label="举报理由:" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="请选择举报原因" style="width:300px">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="举报说明:" :label-width="formLabelWidth">
        <el-input type="textarea" style="width:300px" :autosize="row" placeholder="请输入举报原因（必填）" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="图片上传:" :label-width="formLabelWidth">
        <p class="prompt">最多5张,支持JPG、JPEG、PNG.大小不超过5MB</p>
        <el-upload
          action="#"
          :limit="5"
          list-type="picture-card"
          :auto-upload="false">
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt="" >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
               <i class="el-icon-download"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
            <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
</el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$parent.tipDialogVisible = false" type="primary" plain>关闭</el-button>
      <el-button type="primary" @click="$parent.tipDialogVisible = false">查看申请</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    props: ['tipDialogVisible','imgBg', 'title', 'okText', 'closeText'],
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        formLabelWidth: '100px',
        row:{ minRows: 4, maxRows:1}
      };
    },
    methods: {
      handleRemove(file) {
        console.log(file);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      }
    }
  };
</script>
<style>
.dialog {
  box-shadow:0px 6px 14px 1px rgba(134,133,133,0.3);
  border-radius:5px;
}
.dialog-centent {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
.dialog-centent .dialog-title {
  font-size: 18px;
  color:#333;
  font-weight: bold;
  padding-top: 25px;
}
.dialog .el-dialog__body {
  padding: 25px
}
.tipDialog .el-dialog__body {
  padding: 25px 25px 6px;
}
.dialog-footer {
  padding: 0 20px 20px;
}
.dialog-footer .el-button {
  width: 100px;
  padding: 8px 20px;
  margin: 0 15px;
}
.prompt {
  color: #999;
  font-size:14px;
}
.dialog .el-upload--picture-card {
  width: 90px;
  height: 90px;
  line-height:88px;
}
.dialog .el-form-item {
  margin-bottom: 15px;
}
input,button,select,textarea{outline:none};
textarea{resize:none};
</style>
