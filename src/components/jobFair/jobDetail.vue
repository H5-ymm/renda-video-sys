<template>
  <div class="teamMessage">
    <div class="manager-form-row">
      <el-form
        :model="companyForm"
        ref="companyForm"
        label-width="100px"
        class="teamMessage-form"
      >
        <section class="section-box">
          <el-form-item label="企业名称">
            <el-input v-model="companyForm.com_name" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="职位名称">
            <el-input v-model="companyForm.job_name" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="工作地点">
            <el-input v-model="addressText" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="companyForm.address" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="招聘人数">
            <el-input v-model="companyForm.number" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="工作性质">
            <el-input v-model="companyForm.natureName" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="岗位类别">
            <el-input v-model="companyForm.type_name" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="学历要求">
           <el-input v-model="companyForm.eduName" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="职业要求">
            <el-input v-model="companyForm.job_requirements" readonly class="width408"></el-input>
          </el-form-item>
           <el-form-item label="薪资">
            <el-input v-model="companyForm.salaryName" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="社保">
            <el-input v-model="companyForm.social_securityName" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话">
            <el-input v-model="companyForm.link_tel" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" v-if="companyForm.email">
            <el-input v-model="companyForm.email" readonly class="width408"></el-input>
          </el-form-item>
          <el-form-item class="teamMessage-btn">
            <el-button type="primary" @click="submitCheck">{{!companyForm.status ? '审核' : '已审核'}}</el-button>
          </el-form-item>
        </section>
      </el-form>
    </div>
    <confirmDialog :dialogVisible="dialogVisible" @submit="submit" :objRow="objRow" @handleClose="dialogVisible=false;id=''"></confirmDialog>
  </div>
</template>
<script>
import { getConstant } from '@/api/dictionary'
import districtSelet from '../districtSelet'
import confirmDialog from '../common/confirmDialog'
import { fairJobInfo, trialFairJob } from '@/api/job'
import { uploadFile } from '@/api/upload'
import { getImgUrl } from '@/util/util'
export default {
  components: {
    districtSelet,
    confirmDialog
  },
  data () {
    return {
      companyForm: {
        com_name: '',
        email: '',
        content: '',
        province: '',
        city: '',
        area: '',
        address: '',
        trades: '',
        nature: '',
        scale: '',
        link_man: '',
        link_tel: '',
        jfId: ''
      },
      license_img: '',
      comScaleList: [],
      comTypeList: [],
      jobList: [],
      comId: '',
      id: '',
      dialogVisible: false,
      address: [],
      objRow: {}
    };
  },
  computed : {
    addressText(){
      return this.companyForm.provinceName +  this.companyForm.cityName +  this.companyForm.areaName
    }
  },
  created () {
    let params = 'com_type,com_scale,job_array'
    this.getList(params)
    if (this.$route.query.jfId) {
      this.companyForm.jfId = this.$route.query.jfId
    } 
    if (this.$route.query.id ) {
      this.id = this.$route.query.id
      this.getInfo(this.id)
    }
  },
  methods: {
    getArray(obj) {
      let arr = []
      for (let key in obj) {
          arr.push(obj[key])
      }
      return arr
    },
    getList (filed) {
      getConstant({ filed }).then(res => {
        const { com_scale, com_type, job_array } = res.data
        this.comScaleList = com_scale
        this.comTypeList = com_type
        this.jobList = this.getArray(job_array)
      })
    },
    getInfo (id) {
      fairJobInfo({ id }).then(res => {
        if (res.data) {
          this.companyForm = res.data || {}
          this.license_img = this.companyForm.license_url
          this.address.push(this.companyForm.province, this.companyForm.city, this.companyForm.area)
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
        this.companyForm.license_url = getImgUrl(res.data.url)
      })
    },
    change (val) {
      this.companyForm.province = val[0]
      this.companyForm.city = val[1]
      this.companyForm.area = val[2]
    },
    submitCheck () {
      if (this.companyForm.status) return
      this.objRow.status = this.companyForm.status
      this.dialogVisible = true
    },
    submit (val) {
      if (val.status == 2) {
        if (!val.reason) {
          return this.$message.warning('请输入不通过原因')
        }
      }
      let params = {
        idlist: this.id,
        status: val.status,
        refuse: val.reason
      }
      trialFairJob(params).then(res => {
        this.dialogTableVisible = false
        this.objRow = {}
        this.companyForm.status = val.status
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    submitForm (companyForm) {
      this.$refs[companyForm].validate((valid) => {
        if (valid) {
          addFairCompanyUser(this.companyForm).then(res => {
            if (res.data) {
              this.$router.push({ path: '/JFcompany', query: { id: this.ithis.companyForm.jfIdd } })
            } else {
              this.$message.error(res.data.remind)
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
