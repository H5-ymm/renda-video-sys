<template>
  <div class="teamMessage">
    <div class="manager-form-row">
      <el-form
        :model="companyForm"
        :rules="rules"
        ref="companyForm"
        label-width="70px"
        label-position="left"
        class="teamMessage-form"
      >
        <section class="section-box">
          <el-form-item label="姓名" prop="com_name">
            <el-input v-model="companyForm.com_name" class="width408"  placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="现住地址" prop="com_name">
            <el-input v-model="companyForm.com_name" class="width408"  placeholder="请输入现住地址"></el-input>
          </el-form-item>
    
          <el-form-item label="邮箱" prop="com_name">
            <el-input v-model="companyForm.com_name" class="width408"  placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="com_name">
            <el-select v-model="companyForm.status" class="width408" placeholder="请选择性别">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="com_name">
            <el-input v-model="companyForm.com_name" class="width408"  placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item class="teamMessage-btn">
            <el-button type="primary" @click="submitForm('jobForm')">保存</el-button>
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
import { uploadFile } from '@/api/upload'
export default {
  components: {
    districtSelet
  },
  data () {
    return {
      companyForm: {
        type: 1,
        email: ''
      },
      license_img: '',
      landlineStart: '',
      landlineEnd: '',
      rules: {
        
      },
      comScaleList: [],
      comTypeList: [],
      jobList: {},
      dialogFormVisible: false,
      form: {},
      money_array: {},
      edu_type: []
    };
  },
  created () {
    let params = 'com_type,com_scale,job_array,money_array,edu_type'
    this.getList(params)
    if (this.$route.query.id) {
       this.companyForm.id = this.$route.query.id
       this.getInfo(this.companyForm.id)
    }
  },
  methods: {
    getList (filed) {
      getConstant({ filed }).then(res => {
        const { com_scale, com_type, job_array,money_array, edu_type } = res.data
        this.comScaleList = com_scale
        this.comTypeList = com_type
        this.jobList = job_array
        this.money_array = money_array
        this.edu_type = edu_type
      })
    },
    getInfo (id) {
      getTeamInfo({ id }).then(res => {
        if (res.data) {
          this.personalForm = res.data || {}
          this.address.push(this.personalForm.provinceid, this.personalForm.cityid, this.personalForm.three_cityid)
        }
      })
    },
    getImg (file) {
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
    uploadLicense (params) {
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
    change (val) {
      this.companyForm.provinceid = val[0]
      this.companyForm.cityid = val[1]
      this.companyForm.three_cityid = val[2]
    },
    submitForm (companyForm) {
      this.companyForm.landline = this.landlineStart + '-' + this.landlineEnd
      this.$refs[companyForm].validate((valid) => {
        if (valid) {
          edit_team(this.companyForm).then(res => {
            if (res.status.code == 200) {
              this.$router.push('userlist')
            }
          })
        } else {
          return false;
        }
      });
    },
    resetForm (companyForm) {
      this.$refs[companyForm].resetFields()
    }
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/form';
</style>
