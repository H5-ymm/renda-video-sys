<template>
  <div class="teamMessage">
    <div class="manager-form-row">
      <el-form
        :model="companyForm"
        :rules="rules"
        ref="companyForm"
        label-width="100px"
        class="teamMessage-form"
      >
        <section class="section-box">
          <el-form-item label="企业名称" prop="com_name">
            <el-input v-model="companyForm.com_name" :readonly="readonly" class="width408" placeholder="请输入企业名称"></el-input>
          </el-form-item>
          <el-form-item label="营业执照" v-if="companyForm.license_url">
            <el-upload
              class="uploader-card avatar-uploader"
              action="customize"
              :disabled="readonly"
              :show-file-list="false"
              :http-request="uploadLicense"
            >
              <img v-if="license_img" :src="license_img" class="avatar" />
              <i v-else class="el-icon-circle-plus avatar-uploader-icon"></i>
              <p>上传营业执照</p>
            </el-upload>
          </el-form-item>
          <el-form-item label="所属地区" required>
            <div class="width408" v-if="!readonly">
              <districtSelet @change="change" :address="address"></districtSelet>
            </div>
            <div class="width408" v-else>
              <p class="el-input__inner">{{companyForm.provinceName}}{{companyForm.cityName}}{{companyForm.areaName}}</p >
            </div>
            <el-input
              v-if="companyForm.address"
              v-model="companyForm.address"
              class="width408 team-address"
              :readonly="readonly"
              placeholder="请填写详细地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属行业" prop="trades">
            <el-select v-model="companyForm.trades" :disabled="readonly" class="width408" placeholder="请选择企业从事行业">
              <el-option :label="item" :value="index+1" v-for="(item,index) in jobList" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业性质" prop="nature">
            <el-select v-model="companyForm.nature" :disabled="readonly" class="width408" placeholder="请选择企业性质">
              <el-option
                :label="item"
                :value="index"
                v-for="(item,index) in comTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业规模" prop="scale">
            <el-select v-model="companyForm.scale" :disabled="readonly" class="width408" placeholder="请选择企业规模">
              <el-option
                :label="item"
                :value="index+1"
                v-for="(item,index) in comScaleList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="企业简介" prop="content">
            <el-input
              type="textarea"
              class="width408"
              :autosize="{minRows: 5}"
              :readonly="readonly"
              v-model="companyForm.content"
              placeholder="请输入企业简介"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="link_man">
            <el-input v-model="companyForm.link_man" :readonly="readonly" class="width408" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="link_tel">
            <el-input v-model="companyForm.link_tel" :readonly="readonly" class="width408" placeholder="联系人电话"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" v-if="companyForm.email">
            <el-input v-model="companyForm.email" :readonly="readonly" class="width408" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item class="teamMessage-btn" v-if="(companyForm.jfId&&!view )|| (view&&!comId)">
            <el-button type="primary" @click="submitForm('companyForm')">保存</el-button>
            <el-button @click="resetForm('companyForm')">取消</el-button>
          </el-form-item>
          <el-form-item class="teamMessage-btn" v-if="comId&&!view">
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
import { addFairCompanyUser, getCompanyInfo, companyCheck } from '@/api/company'
import { seeCompanyInfo, addCompanyInfo } from '@/api/companyAccount'
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
      rules: {
        com_name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        trades: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        nature: [
          { required: true, message: '请选择企业性质', trigger: 'change' }
        ],
        scale: [
          { required: true, message: '请选择企业规模', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入企业介绍', trigger: 'blur' }
        ],
        link_man: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        link_tel: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ]
      },
      comScaleList: [],
      comTypeList: [],
      jobList: [],
      comId: '',
      id: '',
      readonly: false,
      dialogVisible: false,
      address: [],
      objRow: {},
      view: 0
    };
  },
  created () {
    let params = 'com_type,com_scale,job_array'
    this.getList(params)
    if (this.$route.query.jfId) {
      this.companyForm.jfId = this.$route.query.jfId
    } 
    if (this.$route.query.comId && this.$route.query.id ) {
      this.comId = this.$route.query.comId
      this.id = this.$route.query.id
      this.readonly = true
      this.getInfo(this.comId)
    }
    if (this.$route.query.view) {
      if (this.$route.query.id) {
        this.comId = this.$route.query.id
        this.getDetail(this.comId)
        this.readonly = true
      }
      this.view = this.$route.query.view
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
    getDetail(id) {
      seeCompanyInfo({ id }).then(res => {
        if (res.data) {
          let info = res.data
          for (let key in info) {
            if (info[key] || info[key]!='null') {
              this.companyForm[key] = info[key]
            } else {
              this.companyForm[key] = ''
            }
          }
          this.license_img = this.companyForm.license_url=='null' ? '': this.companyForm.license_url
          this.address.push(this.companyForm.province, this.companyForm.city, this.companyForm.area)
        }
      })
    },
    getInfo (comId) {
      getCompanyInfo({ comId }).then(res => {
         if (res.data) {
          let info = res.data
          for (let key in info) {
            if (info[key]&&info[key]!='null') {
              this.companyForm[key] = info[key]
            } else {
              this.companyForm[key] = ''
            }
          }
          this.license_img = this.companyForm.license_url=='null' ? '': this.companyForm.license_url
          this.address.push(this.companyForm.province, this.companyForm.city, this.companyForm.area)
        }
      })
    },
    // getImg (file) {
    //   let url = null;
    //   if (window.createObjectURL != undefined) {
    //     url = window.createObjectURL(_file)
    //   } else if (window.URL != undefined) {
    //     url = window.URL.createObjectURL(file)
    //   } else if (window.webkitURL != undefined) {
    //     url = window.webkitURL.createObjectURL(file)
    //   }
    //   return url;
    // },
    uploadLicense (params) {
      const _file = params.file;
      const isLt2M = _file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("请上传2M以下的.xlsx文件");
        return false;
      }
      uploadFile(_file).then(res => {
        this.license_img = getImgUrl(res.data.url)
        this.companyForm.license_url = this.license_img
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
      companyCheck(params).then(res => {
        this.dialogTableVisible = false
        this.objRow = {}
        this.companyForm.status = val.status
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    addCompany(params){
      addCompanyInfo(params).then(res => {
        if (res.data) {
          let arr = ['企业账户']
          sessionStorage.setItem('menus', JSON.stringify(arr))
          this.$router.push({ path: '/companyAccount'})
        } else {
          this.$message.error('添加失败')
        }
      }).catch(error =>{
        if (error && error.status) {
          this.$message.error(error.status.remind)
        }        
      })
    },
    submitForm (companyForm) {
      this.$refs[companyForm].validate((valid) => {
        if (valid) {
          if (this.view) {
            this.addCompany(this.companyForm)
          } else {
            addFairCompanyUser(this.companyForm).then(res => {
              if (res.data) {
                let arr = ['招聘会列表', '参会企业']
                sessionStorage.setItem('menus', JSON.stringify(arr))
                this.$router.push({ path: '/JFcompany', query: { id: this.companyForm.jfId} })
              } else {
                this.$message.error('添加失败')
              }
            }).catch(error =>{
              if (error && error.status) {
                this.$message.error(error.status.remind)
              }        
           })
          }
        } else {
          return false;
        }
      });
    },
    resetForm (companyForm) {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/form';
</style>
