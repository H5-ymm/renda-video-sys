<template>
  <div class="teamMessage">
    <div class="manager-form-row">
      <el-form
        :model="companyForm"
        :rules="rules"
        :inline="true"
        ref="companyForm"
        label-width="70px"
        label-position="left"
        class="teamMessage-form"
      >
        <section class="section-box">
          <div class="section-title"> 基本信息</div>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="姓名" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入姓名"></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="现住地址" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入现住地址"></el-input>
              </el-form-item>
             </el-col>
              <el-col :span="8">
              <el-form-item label="邮箱" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入邮箱"></el-input>
              </el-form-item>
             </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="性别" prop="com_name">
                <el-select v-model="companyForm.status" placeholder="请选择性别">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                </el-select>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入联系电话"></el-input>
              </el-form-item>
             </el-col>
             <el-col :span="8"></el-col>
          </el-row>
        </section>
         <section class="section-box">
          <div class="section-title"> 求职信息</div>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="工作性质" prop="com_name">
                 <el-select v-model="companyForm.status" placeholder="请选择工作性质">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                </el-select>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="工作地点" prop="com_name" >
                <districtSelet></districtSelet>
              </el-form-item>
             </el-col>
              <el-col :span="8">
              <el-form-item label="期望薪资" prop="com_name">
                 <el-select v-model="companyForm.money" placeholder="请选择期望薪资">
                  <el-option :label="item" :value="index" v-for="(item, index) in money_array" :key="index"></el-option>
                </el-select>
              </el-form-item>
             </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="期望行业" prop="com_name">
                <el-select v-model="companyForm.status" placeholder="请选择期望行业">
                 <el-option :label="item" :value="index" v-for="(item, index) in jobList" :key="index"></el-option>
                </el-select>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="期望职位" prop="com_name">
                <el-select v-model="companyForm.status" placeholder="请选择期望职位">
                  <el-option :label="item" :value="index" v-for="(item, index) in jobList" :key="index"></el-option>
                </el-select>
              </el-form-item>
             </el-col>
            <el-col :span="8"></el-col>
          </el-row>
        </section>
         <section class="section-box">
          <div class="section-title"> 教育背景</div>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="学历" prop="edu">
                 <el-select v-model="companyForm.edu" placeholder="请选择学历">
                 <el-option :label="item" :value="index" v-for="(item, index) in edu_type" :key="index"></el-option>
                </el-select>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="毕业时间" prop="com_name">
                <el-date-picker
                  type="date"
                  placeholder="选择毕业时间">
                </el-date-picker>
              </el-form-item>
             </el-col>
            <el-col :span="8"></el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="学校名称" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入学校名称"></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="院系" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入院系"></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="专业" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入专业"></el-input>
              </el-form-item>
             </el-col>
          </el-row>
        </section>
         <section class="section-box">
          <div class="section-title"> 工作/实习经历</div>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="工作时间" prop="com_name">
               <el-date-picker
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="工作类型" prop="com_name">
                 <el-select v-model="companyForm.status" placeholder="请选择工作类型">
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                </el-select>
              </el-form-item>
             </el-col>
              <el-col :span="8">
              <el-form-item label="工作职责" prop="com_name">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入工作职责" />
              </el-form-item>
             </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="8">
              <el-form-item label="公司名称" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入公司名称"></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8">
              <el-form-item label="职位名称" prop="com_name">
                <el-input v-model="companyForm.com_name"  placeholder="请输入职位名称"></el-input>
              </el-form-item>
             </el-col>
            <el-col :span="8"></el-col>
          </el-row>
          <div class="btn">
            <el-button type="primary"  size="medium" class="add-btn" @click="dialogFormVisible=true">添加工作/实习经历</el-button>
          </div>
        </section>
      </el-form>
    </div>
    <el-dialog title="添加工作/实习经历" :visible.sync="dialogFormVisible" >
      <el-form :model="form" class="form-dialog">
        <el-form-item label="工作时间" prop="com_name">
          <el-date-picker
            type="daterange"
            class="width300"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="工作类型" prop="com_name">
              <el-select v-model="companyForm.status" placeholder="请选择工作类型" class="width300">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司名称" prop="com_name">
            <el-input v-model="companyForm.com_name" class="width300" placeholder="请输入公司名称"></el-input>
          </el-form-item>
          <el-form-item label="职位名称" prop="com_name">
            <el-input v-model="companyForm.com_name" class="width300"  placeholder="请输入职位名称"></el-input>
          </el-form-item>
          <el-form-item label="工作职责" prop="com_name" >
            <el-input
              type="textarea"
              :rows="2"
              class="width300"
              placeholder="请输入工作职责" />
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getConstant } from '@/api/dictionary'
import districtSelet from '../districtSelet'
import userCard from '../userCard'
import { edit_team, getTeamInfo } from '@/api/team'
import { uploadFile } from '@/api/upload'
export default {
  components: {
    districtSelet,
    userCard
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
.teamMessage {
  padding-bottom: 80px;
  // height: 100%;
  .teamMessage-form {
    border-radius: 5px;
    background: #fff;
    padding: 20px;
    width: 100%;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .section-box {
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    width: 100%;
    .row-bg , .el-form-item ,.el-select, .el-date-editor{
      width: 100%;
    }
    .el-form-item {
      margin-right: 60px;
      // margin-bottom: 15px;
      .el-form-item__content {
        width: 78%;
        min-width: 200px;
      }
    }
    .section-title {
      padding-bottom: 20px;
      font-size: 16px;
      color: #333;
      &::before {
        content: '*';
        color:red;
      }
    }
    .el-date-editor {
      .el-input__inner {
        &:focus {
          padding-left: 30px;
        }
      }
    }
    .btn {
      text-align: center;
      .add-btn {
        margin-bottom:  20px;
        padding: 10px 100px;
      }
    }
    
  }
  .manager-form-row {
    width: 100%;
    margin: 0 auto;
  }
  .form-dialog {
    width: 80%;
    margin:  0 auto;
    .width300 {
      width: 300px;
    }
  }
}
</style>
