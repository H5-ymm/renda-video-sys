<template>
  <div class="tables-box">
    <div class="table-list">
      <el-alert
        title="提示：根据权限名称不同，可操作功能不同"
        
        type="warning"  :closable="false" class="tip">
      </el-alert>
      <el-button type="primary" class="add-member" @click="visible=true">添加管理员</el-button>
      <div style="margin: 20px 0;"></div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%">
        <el-table-column label="编号" prop="id" align="center" width="150"></el-table-column>
        <el-table-column label="账号" prop="name" align="center" width="150"></el-table-column>
        <el-table-column label="权限" prop="description" align="center" width="150"></el-table-column>
        <el-table-column label="真实姓名" prop="username" align="center" width="150"></el-table-column>
        <el-table-column label="状态" align="center" width="100">
           <template slot-scope="props">
            <span>{{ props.row.prohibit ? '禁用':'启用'}}</span>
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
    <managerForm v-if="visible" :dialogTableVisible="true" @submitForm="submitForm" :formMember="formMember"></managerForm>
  </div>
</template>
<script>
import managerForm from './managerSetting/managerForm'
import { getUserList, deleteUser, updateUser, addUser } from '../api/manager'
export default {
  components: {
    managerForm
  },
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
      getUserList(params).then(res => {
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
      console.log(val,'valval')
      this.formMember = val
      console.log(this.formMember,'edit.this.formMember')
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
      console.log(params,'handle s par')
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
