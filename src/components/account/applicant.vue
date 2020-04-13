<template>
  <div class="tables-box">
    <div class="table-list company-list">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="姓名:">
          <el-input
            class="width200"
            v-model="formParams.name"
            placeholder="请输入账户名称"></el-input>
        </el-form-item>
         <el-form-item label="注册手机:">
          <el-input
            class="width200"
            v-model="formParams.mobile"
            placeholder="请输入注册手机号码"></el-input>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="selectQuery" class="select-btn">查询</el-button>
           <el-button type="primary" @click="reset" class="select-btn">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-query">
        <el-button type="primary" class="select-btn">添加账户</el-button>
        <el-button>删除</el-button>
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection">清空</el-button>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="姓名" prop="com_name" align="center" width="160"></el-table-column>
        <el-table-column label="注册手机账户" prop="mobile" align="center" width="160"></el-table-column>
        <el-table-column label="所属区域" prop="mobile" align="center" width="160"></el-table-column>
        <el-table-column label="联系人" prop="link_name" align="center" width="100"></el-table-column>
        <el-table-column label="联系人" prop="link_phone" align="center" width="160"></el-table-column>
        <el-table-column label="注册时间" align="center" width="160">
          <template slot-scope="props">
           
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleDel(scope.row.uid)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="team-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formParams.page" :page-sizes="[10, 30, 50, 100]" :page-size="formParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <Log :dialogTableVisible="visible" @handleClose="visible=false" :uid="uid"></Log>
    <confirmDialog :dialogTableVisible="dialogTableVisible" @submit="submit" :objRow="objRow" :dialogType="dialogType" @handleClose="dialogTableVisible=false;uid='';dialogType=''"></confirmDialog>
    <!-- :status="status" -->
  </div>
</template>

<script>
import Log from '../company/companyLog'
import confirmDialog from '../common/confirmDialog'

import { getCompanyList, companyLog, resetPassword, companyLock, companyCheck, companyDel,
 getCompanyInfo } from '@/api/company'
export default {
  components: {
    Log,
    confirmDialog
  },
  data () {
    return {
      uid: '',
      multipleSelection: [],
      delData: {},
      checkData: {},
      show: true,
      visible: false,
      dialogTableVisible: false,
      tableData: [],
      userType: 1,
      keyword: '',
      type: '',
      value: 'com_name',
      formParams: {
        limit: 10,
        page: 1,
        mobile:'',
        name:' '
      },
      total: 0,
      lockData: {},
      formMember: {},
      timeList: [
        { label: '全部', value: 0 },
        { label: '今天', value: 1 },
        { label: '最近三天', value: 2 },
        { label: '最近七天', value: 3 },
        { label: '最近半月', value: 4 },
        { label: '最近一个月', value: 5 }
      ],
      statusList: [
        { label: '全部', value: 0 },
        { label: '待审核', value: 1 },
        { label: '已通过', value: 2 },
        { label: '未通过', value: 3 },
      ],
      logList: [],
      teamType: [
        { label: '个人', value: 2 },
        { label: '团队', value: 1 }
      ],
      dialogType: '',
      objRow: {}
    }
  },
  created () {
    // 初始化查询标签数据
    console.log(this.formParams, 'this.formParams')
    this.getList(this.formParams)
  },
  watch: {
    keyword (v) {
      console.log(v, 1234)
      if (v) {
        this.formParams['reg_date'] = 0
        this.formParams['status'] = 0
        this.formParams['login_data'] = 0
      }
    }
  },
  methods: {
    reset() {
      this.formParams = {
        limit: 10,
        page: 1,
        name: '',
        status: ''
      }
      this.getList(this.formParams)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toggleSelection() {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection();
    },
    changeInput (e) {
      console.log(this.value, 'this.value')
      console.log(e, 'e')
      if (this.value == 'com_name') {
        this.formParams['telphone'] = ''
        this.formParams['id'] = ''
      } else if (this.value == 'telphone') {
        this.formParams['id'] = ''
        this.formParams['com_name'] = ''
      } else {
        this.formParams['com_name'] = ''
        this.formParams['telphone'] = ''
      }
      this.formParams[this.value] = e
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.uid = val.map(item => item.uid).join(',')
      console.log(this.uid, 'this.uid')
    },

    handleSizeChange (val) {
      this.formParams.limit = val
      this.getList(this.formParams)
    },
    handleCurrentChange (val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
    selectQuery (key, item) {
      if (key == 'login_data') {
        this.formParams['reg_date'] = 0
        this.formParams['status'] = 0
      } else if (key == 'reg_date') {
        this.formParams['status'] = 0
        this.formParams['login_data'] = 0
      } else {
        this.formParams['reg_date'] = 0
        this.formParams['login_data'] = 0
      }
      this.keyword = '';
      this.formParams[this.value] = '';
      this.formParams[key] = item.value
      this.getList(this.formParams)
    },
    handleTeam (type, val) {
      console.log(val, 'val')
      if (!this.uid && !val) {
        return this.$message.warning('请选择团队')
      }
      else {
        if (!type) {
          this.handleDel(this.uid)
        }
        else {
          this.uid = val.uid || val
          this.dialogType = type
          this.dialogTableVisible = true
          if (this.dialogType == 'check') {
            // this.objRow = val
            this.objRow.status = Number(val.status) + 1
            console.log(this.objRow.status)
          } else {
            this.objRow = val
          }

        }
      }
    },
    submit (val) {
      this.checkData = {}
      this.lockData = {}
      console.log(val, 'val')
      // this.lockStatusNum = val.status
      // console.log(this.checkData,'this.checkData')
      this.dialogTableVisible = false
      if (this.dialogType == 'check') {
        if (val.status == 3) {
          if (!val.reason) {
            return this.$message.warning('请输入不通过原因')
          }
        }
        let params = Object.assign(val, { uid: this.uid })
        this.checkData = {
          uids: this.uid,
          status: val.status - 1,
          reason: val.reason
        }
        this.submitCheck(this.checkData)
      } else {
        this.lockData = {
          uids: this.uid,
          status: val.status,
          reason: val.reason
        }
        this.submitLock(this.lockData)
      }
    },
    getList (params) {
      getCompanyList(params).then(res => {
        const { data } = res
        this.tableData = data.data
        this.total = data.count
      }).catch(error => {
        if (error.status) {
          this.$message.error(error.status.remind)
        }
      })
    },
    handleEdit (val) {
      this.$router.push({ path: 'companyInfo', query: { uid: val.uid } })
    },
    submitCheck (val) {
      companyCheck(val).then(res => {
        this.dialogType = ''
        this.objRow = {}
        this.getList(this.formParams)
        // this.uid = ''
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    submitLock (val) {
      companyLock(val).then(res => {
        this.dialogType = ''
        this.objRow = {}
        this.getList(this.formParams)
        this.uid = ''
        // this.lockStatus = res.data.status
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    handleLock (val) {
      this.visibleLock = true
      this.uid = val.uid
    },
    handleDel (uids) {
      this.delData.uids = this.uid
      console.log(77777)
      this.$confirm('你确定要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        companyDel({ uids }).then(res => {
          this.getList(this.formParams)
        })
      }).catch(() => {
        console.log(2)
      })
      this.delData = {}
    },
    handlePassword (val) {
      this.$alert('密码将设置为123456<br>确定重置吗?', '密码重置', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let uid = val.uid
        resetPassword({ uid }).then(res => {
          this.$message.success('重置成功')
          this.getList(this.formParams)
        })
      }).catch(() => {
        console.log(2)
      })
    },
    handleLog (row) {
      this.uid = row.uid
      this.visible = true
    }
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/table-list';
 #app{
   height: 100%;
 }
 .el-container{
   height: 100%;
 }
 .el-container,.is-vertical{
   height: 100%;
 }
 .table-query {
   margin-bottom: 20px;
   .select-text {
    margin-left: 20px;
   }
 }
 .table-list{
  height: 100%;
   overflow: auto;
 }
</style>