<template>
  <div class="tables-box">
    <div class="table-list company-list">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="企业名称">
          <el-input
            class="width200"
            v-model="formParams.companyName"
            placeholder="请输入账户名称"></el-input>
        </el-form-item>
         <el-form-item label="注册手机" v-if="!id">
          <el-input
            class="width200"
            v-model="formParams.mobile"
            placeholder="请输入注册手机号码"></el-input>
        </el-form-item>
         <el-form-item label="状态">
          <el-select v-model="formParams.status" class="width200">
            <el-option label="待审核" value="0"></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="已拒绝" value="2"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="selectQuery" class="select-btn">查询</el-button>
           <el-button type="primary" @click="reset" class="select-btn">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-query">
        <el-button type="primary" class="select-btn"  icon="el-icon-plus" @click="addCompany">添加企业</el-button>
        <el-button @click="handleCompany(1, idlist)" type="primary">审核</el-button>
        <el-button @click="handleCompany(0, idlist)">删除</el-button>
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection">清空</el-button>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="参会企业" prop="com_name" align="center" width="160"></el-table-column>
        <el-table-column label="所属区域" align="center" width="160">
           <template slot-scope="scope">
            <span>{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.areaName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="link_man" align="center" width="100"></el-table-column>
        <el-table-column label="联系人电话" prop="link_tel" align="center" width="160"></el-table-column>
        <el-table-column label="状态" align="center" width="160">
          <template slot-scope="props">
             <span class="status" :class="props.row.status === 0 ? 'grayyuan': props.row.status === 1 ? 'greenyuan': 'redyuan'">{{props.row.status === 0 ?'待审核':props.row.status === 1?'已通过': '已拒绝'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <el-button @click="handleView(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleCheck(scope.row)" type="text" size="small">审核</el-button>
            <el-button @click="handleDel(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="team-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :current-page="formParams.page" :page-sizes="[10, 30, 50, 100]" :page-size="formParams.limit" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
    </div>
    <confirmDialog :dialogVisible="dialogVisible" @submit="submit" :objRow="objRow" @handleClose="dialogVisible=false;idlist=''"></confirmDialog>
  </div>
</template>

<script>
import confirmDialog from '../common/confirmDialog'
import { getCompanyList, companyCheck, companyDel, getCompanyInfo } from '@/api/company'
export default {
  components: {
    confirmDialog
  },
  data () {
    return {
      multipleSelection: [],
      delData: {},
      dialogVisible: false,
      tableData: [],
      formParams: {
        limit: 10,
        page: 1
      },
      total: 0,
      statusList: [
        { label: '全部', value: 0 },
        { label: '待审核', value: 1 },
        { label: '已通过', value: 2 },
        { label: '未通过', value: 3 },
      ],
      objRow: {
        status: 0
      },
      id: '',
      idlist: ''
    }
  },
  created () {
    // 初始化查询标签数据
    if (this.$route.query && this.$route.query.id) {
      this.formParams.id = this.$route.query.id
      this.id = this.$route.query.id
    }
    this.getList(this.formParams)
  },
  methods: {
    addCompany(){
      let arr = ['企业账户','添加企业账户']
      sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push({path: '/companyForm', query: { jfId: this.id }})
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
    toggleSelection() {
      this.multipleSelection = []
      this.idlist =''
      this.$refs.multipleTable.clearSelection();
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.idlist = val.map(item => item.id).join(',')
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
    handleCompany (type, val) {
      if (!val) {
        return this.$message.warning('请选择企业')
      }
      else {
        if (!type) {
          this.handleDel(this.idlist)
        }
        else {
          this.dialogVisible = true
        }
      }
    },
    handleCheck(val){
      this.objRow.status = val.status
      console.log(this.objRow.status)
      this.dialogVisible = true
      this.idlist = val.id
    },
    submit (val) {
      if (val.status == 2) {
        if (!val.reason) {
          return this.$message.warning('请输入不通过原因')
        }
      }
      let params = {
        idlist: this.idlist,
        status: val.status,
        refuse: val.reason
      }
      this.submitCheck(params)
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
    handleView (val) {
      this.$router.push({ path: '/companyForm', query: { comId: val.com_id, id: val.id } })
    },
    submitCheck (val) {
      companyCheck(val).then(res => {
        this.objRow = {}
        this.dialogVisible = false
        this.getList(this.formParams)
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    handleDel (idlist) {
      this.$confirm('你确定要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        companyDel({ idlist }).then(res => {
          if(res.data) {
            this.$message.success('删除成功')
            this.getList(this.formParams)
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => {
        console.log(2)
      })
      this.delData = {}
    },
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/table-list';
</style>