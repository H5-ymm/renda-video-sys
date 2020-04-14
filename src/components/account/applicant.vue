<template>
  <div class="tables-box">
    <div class="table-list company-list">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="姓名">
          <el-input
            class="width200"
            v-model="formParams.name"
            placeholder="请输入账户名称"></el-input>
        </el-form-item>
         <el-form-item label="注册手机">
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
        <el-button type="primary" class="select-btn" @click="addUser">添加账户</el-button>
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
      <el-pagination class="team-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :current-page="formParams.page" :page-sizes="[10, 30, 50, 100]" :page-size="formParams.limit" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getCompanyList, companyLog, resetPassword, companyLock, companyCheck, companyDel,
 getCompanyInfo } from '@/api/company'
export default {
  data () {
    return {
      uid: '',
      multipleSelection: [],
      dialogTableVisible: false,
      tableData: [],
      formParams: {
        limit: 10,
        page: 1,
        mobile:'',
        name:' '
      },
      total: 0
    }
  },
  created () {
    this.getList(this.formParams)
  },
  methods: {
     addUser(){
      let arr = ['求职账户','添加账户']
      sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push('/addUser')
    },
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
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.uid = val.map(item => item.uid).join(',')
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
          this.objRow.status = Number(val.status) + 1
        }
      }
    },
    submit (val) {
      this.checkData = {}
      this.lockData = {}
      this.dialogTableVisible = false
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
      this.$router.push({ path: '/addUser', query: { uid: val.uid } })
    },
    submitCheck (val) {
      companyCheck(val).then(res => {
        this.dialogType = ''
        this.objRow = {}
        this.getList(this.formParams)
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    handleDel (uids) {
      this.delData.uids = this.uid
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
    }
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/table-list';
</style>