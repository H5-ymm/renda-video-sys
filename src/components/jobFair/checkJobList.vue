<template>
  <div class="tables-box">
    <div class="table-list team-forum">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="企业名称:">
          <el-input
            class="width200"
            v-model="formParams.name"
            placeholder="请输入账户名称"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
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
        <el-button type="primary" class="select-btn">审核</el-button>
        <el-button>删除</el-button>
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection">清空</el-button>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="招聘会名称" prop="team_name" align="center" width="160"></el-table-column>
        <el-table-column label="参会企业" align="center" min-width="160">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
         <el-table-column label="发布职位" align="center" width="160">      
        </el-table-column>
        <el-table-column label="状态" align="center" width="160">
           <template slot-scope="scope">
            <p :class="scope.row.status === 0 ? 'grayyuan': scope.row.status === 1 ? 'greenyuan': 'redyuan'"></p>
            待举办
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleCheck(scope.row)" type="text" size="small">审核</el-button>
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <confirmDialog :dialogVisible="dialogVisible" @submit="submit" :objRow="objRow" @handleClose="dialogVisible=false;uid=''"></confirmDialog>
  </div>
</template>
<script>
import confirmDialog from '../common/confirmDialog'
import { getDiscussList, getDiscussInfo } from '@/api/comment'
export default {
  components: {
    confirmDialog
  },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      formParams: {
        limit: 10,
        page: 1,
        name: '',
        status: ''
      },
      total: 0,
      uid: localStorage.getItem('sys_uid'),
      id: '',
      multipleSelection:[],
      statusList: [
        {label: '待举办', value: 0},
        {label: '进行中', value: 1},
        {label: '已结束', value: 2}
      ],
      objRow: {}
    }
  },
  created () {
    // 初始化查询标签数据
    this.getList(this.formParams)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toggleSelection() {
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection();
    },
    submit() {

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
        this.total = res.data.total
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
    handleDetail (val) {
      this.$router.push({ path: 'detailCard', query: { id: val.id } })
    },
    handleCheck(val) {
      this.dialogVisible = true
      this.objRow = {
        status:1
      }
    },
    handleDel (val) {
      this.$confirm('删除后信息无法恢复，请谨慎操作', '确定要删除招聘会职位吗', {
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
