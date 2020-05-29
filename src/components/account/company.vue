<template>
  <div class="tables-box">
    <div class="table-list company-list">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="企业名称">
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
        <el-button type="primary" class="select-btn"  icon="el-icon-plus" @click="addCompany">添加企业</el-button>
        <el-button @click="handleUser">删除</el-button>
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection">清空</el-button>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" @sort-change="sortChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="企业名称" prop="com_name" align="center" width="160"></el-table-column>
        <el-table-column label="注册手机账户" prop="username" align="center" width="160"></el-table-column>
        <el-table-column label="所属区域"  align="center" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.areaName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="link_man" align="center" width="100"></el-table-column>
        <el-table-column label="联系人电话" prop="link_tel" align="center" width="160"></el-table-column>
        <el-table-column label="注册时间" align="center" sortable="custom" width="160">
          <template slot-scope="scope">
            <span>{{$moment.unix(scope.row.reg_date).format('YYYY-MM-DD HH:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleDel(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="team-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :current-page="formParams.page" :page-sizes="[10, 30, 50, 100]" :page-size="formParams.limit" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import { getJobUserList } from '@/api/companyAccount'
import { delConsumer } from '@/api/consumer'
export default {
  data () {
    return {
      idList: '',
      multipleSelection: [],
      tableData: [],
      formParams: {
        limit: 10,
        page: 1,
        type: 1
      },
      total: 0,
      statusList: [
        { label: '全部', value: 0 },
        { label: '待审核', value: 1 },
        { label: '已通过', value: 2 },
        { label: '未通过', value: 3 },
      ],
    }
  },
  created () {
    this.getList(this.formParams)
  },
  methods: {
    addCompany(){
      let arr = ['企业账户','添加企业账户']
      sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push({path: '/companyForm', query: { view: 1 }})
    },
    reset() {
      this.formParams = {
        limit: 10,
        page: 1,
        name: '',
        status: '',
        type: 1
      }
      this.getList(this.formParams)
    },
    toggleSelection() {
      this.multipleSelection = []
      this.idList = ''
      this.$refs.multipleTable.clearSelection();
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.idList = val.map(item => item.idList).join(',')
    },
    handleSizeChange (val) {
      this.formParams.limit = val
      this.getList(this.formParams)
    },
    handleCurrentChange (val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
     sortChange(column) {
      if (column.order == 'ascending') {
        this.formParams.sortTime = 'asc'
      } else {
        this.formParams.sortTime = 'desc'
      }
      this.getList(this.formParams)
    },
    selectQuery (key, item) {
      // if (key == 'login_data') {
      //   this.formParams['reg_date'] = 0
      //   this.formParams['status'] = 0
      // } else if (key == 'reg_date') {
      //   this.formParams['status'] = 0
      //   this.formParams['login_data'] = 0
      // } else {
      //   this.formParams['reg_date'] = 0
      //   this.formParams['login_data'] = 0
      // }
      // this.keyword = '';
      // this.formParams[this.value] = '';
      // this.formParams[key] = item.value
      this.getList(this.formParams)
    },
    handleUser () {
      if (!this.idList) {
        return this.$message.warning('请选择账户')
      }
      else {
        this.handleDel(this.idList)
      }
    },
    getList (params) {
      getJobUserList(params).then(res => {
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
      let arr = ['企业账户', '查看企业']
      sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push({ path: '/companyForm', query: { id: val.com_id, view: 1 } })
    },
    handleDel (idList) {
      this.$confirm('你确定要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         delConsumer({ idList }).then(res => {
           if(res.data) {
            this.$message.success('删除成功')
            this.getList(this.formParams)
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(error =>{
        if (error && error.status) {
          this.$message.error(error.status.remind)
        }        
      })
    },
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/table-list';
</style>