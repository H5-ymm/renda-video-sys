<template>
  <div class="tables-box">
    <div class="table-list team-form">
      <el-form :inline="true" :model="formParams" ref="formParams" class="demo-form-inline" label-width="100px">
        <el-form-item label="账户名称">
          <el-input
            class="query-inputs width200"
            v-model="formParams.teamName"
            placeholder="请输入账号名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            class="query-inputs width200"
            v-model="formParams.mobile"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searCh" class="select-btn">查询</el-button>
          <el-button type="primary" @click="reSet(formParams)">重置</el-button>
        </el-form-item>
        <div class="slot_row"></div>
      </el-form>
        <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange">
        <el-table-column
          align="center"
          type="selection"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="账户名称"
          width="160"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="desired_position"
          label="反馈内容"
          min-width="180"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号码"
          width="160"
          align="center"
          >
        </el-table-column>    
        <el-table-column
          prop="money"
          label="反馈时间"
          width="160"
          sortable="custom"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">
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
  import { feedbackList, gainFeedbackInfo, doFeedbackInfo } from '../api/report'
  export default {
    data () {
      return {
        tableData: [],
        reportlist:{
          user: 'alfie',
          phone: 15765692066,
          date: 1576569206,
          reason: "违规",
          deal_per: "ren",
          deal_result: 'wqefgergberiogh7r8bgvr',
        },
        formParams: {
          uid: localStorage.getItem('sys_uid'),
          limit: 10,
          page: 1,
        },
        total: 0,
        id: '',
        multipleSelection: []
      }
    },
    created () {
      this.getList(this.formParams)
    },
    methods: {
      sortChange(column) {
        if (column.order == 'ascending') {
          this.formParams.timeDesc = 'asc'
        } else {
          this.formParams.timeDesc = 'desc'
        }
        this.getList(this.formParams)
      },
      searCh () {
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
      getList (formParams) {
        feedbackList(formParams).then(res => {
          if (res.data.data) {
            this.tableData = res.data.data || [];
            this.total = res.data.count
          }
          else {
            this.commentInfo = null
          }
        })
        .catch(error => {
          this.$message.error(error.status.remind)
        })
      },
      handleDel (val) {
        this.$confirm('确定要删除吗?', '', {
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
      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      reSet (formParams) {
        this.formParams.teamName = '';
        this.formParams.mobile = ''
      }
    }
  }
</script>
<style lang="scss">
  @import '../assets/css/table-list';
</style>
  