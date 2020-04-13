<template>
  <div class="tables-box">
    <div class="table-list">
      <el-form :inline="true" :model="formParams" class="demo-form-inline">
        <el-form-item label="搜索类型：">
          <el-select v-model="formParams.type" placeholder="请选择" class="width120">
            <el-option label="姓名" value="1"></el-option>
            <el-option label="联系电话" value="2"></el-option>
            <el-option label="直属上级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formParams.keyword" placeholder="请输入你要搜索的关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" class="select-btn">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="add-member" @click="visible=true">添加管理员</el-button>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%">
        <el-table-column label="编号" prop="id" align="center" width="150"></el-table-column>
        <el-table-column label="账号" prop="name" align="center" width="150"></el-table-column>
        <el-table-column label="权限" prop="description" align="center" width="150"></el-table-column>
        <el-table-column label="真实姓名" prop="username" align="center" width="150"></el-table-column>
        <el-table-column label="状态" align="center" width="100">
           <template slot-scope="props">
            <span>{{ props.row.prohibit ? '启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
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
    <!-- <managerForm :dialogTableVisible="visible" @submitForm="submitForm" :formMember="formMember"></managerForm> -->
  </div>
</template>

<script>
// import managerForm from './managerSetting/managerForm'
import { getCompanyList } from '../api/company'
export default {
  // components: {
  //   managerForm
  // },
  data () {
    return {
      visible: false,
      tableData: [],
      userType: 1,
      formParams: {
        limit: 10,
        page: 1
      },
      total: 0,
      formMember: {}
    }
  },
  created () {
    // 初始化查询标签数据
    // this.reverseUser()
    this.getList(this.formParams)
  },
  methods: {
    handleSizeChange (val) {
      this.formParams.limit = val
      this.getList(this.formParams)
    },
    handleCurrentChange (val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
    getList (params) {
      getCompanyList(params).then(res => {
        const { data } = res
        this.tableData = data.data
        console.log(this.tableData)
        this.total = data.count
      }).catch(error => {
        if (error.status) {
          this.$message.error(error.status.remind)
        }
      })
    },
    handleEdit (val) {
      this.formMember = val
      this.visible = true
    },
    handleDel (val) {
      this.$confirm('你确定要删除吗?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let uid = val.id
          deleteUser({uid}).then(res =>{
            this.getList(this.formParams)
          })
        })
    },
    submitForm (val) {
      this.visible = false
      this.handle(val)
    },
    handle(params) {
      if (params.uid) {
        updateUser(params).then(res => {
        this.getList(this.formParams)
       }).catch(error => {
        this.$message.error(error.status.remind)
      })
      }
      else {
        addUser(params).then(res => {
          this.getList(this.formParams)
        }).catch(error => {
        this.$message.error(error.status.remind)
      })
      }
    }
  }
}
</script>

<style lang="scss">
  .tables-box{
    width: 100%;
    overflow: hidden;
    .table-list {
      background: #fff;
      border-radius:5px;
      height: calc(100% - 100px);
      padding: 15px;
      .team-pagination {
        margin-top: 20px;
      }
      .tip {
        margin: 30px 0;
      }
    }
  }
</style>
