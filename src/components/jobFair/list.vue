<template>
  <div class="tables-box">
    <div class="table-list team-form">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="招聘会名称">
          <el-input
            class="width200"
            v-model="formParams.name"
            placeholder="请输入账户名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formParams.status" class="width200">
            <el-option label="待举办" value="0"></el-option>
            <el-option label="进行中" value="1"></el-option>
            <el-option label="已结束" value="2"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="queryList" class="select-btn">查询</el-button>
           <el-button type="primary" @click="reset" class="select-btn">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-query">
        <el-button type="primary" class="select-btn" icon="el-icon-plus" @click="addJobFair">发布</el-button>
        <el-button>删除</el-button>
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection()">清空</el-button>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" 
        @selection-change="handleSelectionChange"
        @sort-change="sortChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="招聘会名称" prop="team_name" align="center" width="160"></el-table-column>
        <el-table-column label="开始时间" sortable="custom" align="center" width="160">    
        </el-table-column>
       <el-table-column label="结束时间" sortable="custom" align="center" width="160">
            
      </el-table-column>
      <el-table-column label="参会企业" align="center" min-width="160">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="160">
           <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button @click="viewCompany(scope.row)" type="text" size="small">查看企业</el-button>
            <el-button @click="handleDetail(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="team-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formParams.page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="formParams.limit"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getDiscussList, getDiscussInfo } from '@/api/comment'
export default {
  data () {
    return {
      show: false,
      visible: false,
      tableData: [],
      userType: 1,
      keyword: '',
      value: 'team_name',
      formParams: {
        limit: 10,
        page: 1,
        name: '',
        status: ''
      },
      total: 0,
      formMember: {},
      uid: localStorage.getItem('sys_uid'),
      commentInfo: {},
      id: '',
      multipleSelection:[],
      statusList: [
        {label: '待举办', value: 0},
        {label: '进行中', value: 1},
        {label: '已结束', value: 2}
      ]

    }
  },
  created () {
    // 初始化查询标签数据
    this.getList(this.formParams)
  },
  methods: {
    addJobFair() {
      let arr = ['招聘会列表','发布招聘会']
      sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push('/jobFairForm')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toggleSelection() {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection();
    },
    sortChange(column) {
      if (column.order == 'ascending') {
        this.formParams.timeDesc = 'asc'
      } else {
        this.formParams.timeDesc = 'desc'
      }
      this.getList(this.formParams)
    },
    queryList () {
      this.getList(this.formParams)
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
    handleSizeChange (val) {
      this.formParams.limit = val
      this.getList(this.formParams)
    },
    handleCurrentChange (val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
    refurbish () {
      this.getList(this.formParams)
    },
    getList (formParams) {
      getDiscussList(formParams).then(res => {
        this.tableData = res.data.data || []
        this.total = res.data.count
        console.log(this.total)
      }).catch(error => {
        this.$message.error(error.status.remind)
      })
    },
    getStatus (val) {
      let obj = this.statusList.find(item => {
        return val == item.value
      })
      if (obj) {
        return obj.label
      }
    },
    viewCompany(val) {
      let arr = ['招聘会列表','参会企业']
      sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push({ path: '/companyAccount', query: { id: val.id } })
    },
    handleDetail (val) {
      this.$router.push({ path: '/jobFairForm', query: { id: val.id } })
    },
    handleDel (val) {
      this.$confirm('请确定已与企业沟通删除后信息无法恢复！', '确定要删除招聘会吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let uid = val.id
        deleteUser({ uid }).then(res => {
          this.getList(this.formParams)
        })
      }).catch(() => {
        console.log(2)
      })
    }
  }
}
</script>

<style lang="scss">
 @import '../../assets/css/table-list';
</style>
