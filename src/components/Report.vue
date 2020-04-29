<style lang="scss">
.el-collapse {
  border: none;
  .el-collapse-item__header{
    &:hover {
      background: none;
      border: none;
    }
  }
  .el-collapse-item__header.is-active {
    background: none;
    border: none;
  }
  .el-collapse-item__wrap {
    background: none;
  }
  .el-collapse-item__content {
    text-align: left;
  }
}
</style>

<template>
  <div class="tables-box">
    <div class="table-list team-form">
      <el-form :inline="true" :model="formParams" ref="formParams" class="demo-form-inline">
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
          <el-button type="primary" @click="reSet()">重置</el-button>
        </el-form-item>
        <div class="table-query">
        <el-button type="primary" @click="handleDel(id)">删除</el-button>
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection()">清空</el-button>
      </div>
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
          label="反馈内容"
          min-width="180"
          align="center"
          >
          <template slot-scope="scope">
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">
                  {{getText(scope.row.content)}}
                </template>
                <div>{{scope.row.content}}</div>
              </el-collapse-item>
            </el-collapse>
          </template>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="手机号码"
          width="160"
          align="center"
          >
        </el-table-column>    
        <el-table-column
          label="反馈时间"
          width="160"
          sortable="custom"
          align="center"
          >
          <template slot-scope="scope">
            <span>{{$moment.unix(scope.row.addtime).format('YYYY-MM-DD HH:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button @click="handleDel(scope.row.id)" type="text" size="small">删除</el-button>
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
  import { feedbackList, doFeedbackInfo } from '@/api/report'
  export default {
    data () {
      return {
        tableData: [],
        formParams: {
          uid: localStorage.getItem('sys_uid'),
          limit: 10,
          page: 1,
        },
        total: 0,
        id: '',
        multipleSelection: [],
        isShowTitle: true
      }
    },
    created () {
      this.getList(this.formParams)
    },
    methods: {
      getText(text) {
        return text.length > 10 ? text.substring(0, 10): text
      },
      sortChange(column) {
        if (column.order == 'ascending') {
          this.formParams.sortTime = 'asc'
        } else {
          this.formParams.sortTime = 'desc'
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
      handleDel (idlist) {
        if (!idlist) {
          return this.$message.warning('请选择删除的反馈意见')
        }
        this.$confirm('确定要删除吗?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          doFeedbackInfo({ idlist }).then(res => {
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
        this.id = val.map(item => item.id).join(',')
      },
      reSet () {
        this.formParams={
          uid: localStorage.getItem('sys_uid'),
          limit: 10,
          page: 1
        }
        this.getList(this.formParams)
      }
    }
  }
</script>
<style lang="scss">
  @import '../assets/css/table-list';
</style>
  