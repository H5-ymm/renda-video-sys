<template>
  <div class="tables-box">
    <div class="table-list">
      <el-button type="primary" class="add-member" @click="visible=true">添加部门</el-button>
      <tableList :tableData="tableData" @handleTurnover="handleEdit" @handleDel="handleDel"></tableList>
      <el-pagination
        class="team-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formMember.page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="formMember.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <turnoverModal
      :dialogTableVisible="dialogTableVisible"
      :departId="departId"
      @handleClose="handle"
    ></turnoverModal>
    <addDepModal :dialogTableVisible="visible" @submitForm="submitForm"></addDepModal>
    <successModal :dialogTableVisible="visible1" @handleTurnover="handleEdit"></successModal>
    <outDep :dialogTableVisible="delVisible" @submitForm="handleUser"></outDep>
  </div>
</template>

<script>
import tableList from './department/tableList'
import addDepModal from './department/addDepModal'
import successModal from './department/successModal'
import outDep from './department/outDep'
import turnoverModal from './department/turnoverModal'
import { getDepartmentList, addTeamDepartment, delDepartment } from '../api/department'
export default {
  components: {
    tableList,
    addDepModal,
    successModal,
    outDep,
    turnoverModal
  },
  data () {
    return {
      breadcrumb: ['设置', '管理控制', '全部管理员'],
      dialogTableVisible: false,
      visible: false,
      visible1: false,
      delVisible: false,
      turnoverVisible: false,
      tableData: [],
      currentPage: 1,
      userType: 1,
      formMember: {
        uid: localStorage.getItem('sys_uid'),
        limit: 10,
        page: 1
      },
      total: 0,
      departId: '',
      uid: localStorage.getItem('sys_uid')
    }
  },
  created () {
    // 初始化查询标签数据
    // this.reverseUser()
    this.getList(this.formMember)
  },
  methods: {
    handleSizeChange (val) {
      this.formMember.limit = val
      this.getList(this.formMember)
    },
    handleCurrentChange (val) {
      this.formMember.page = val
      this.getList(this.formMember)
    },
    getList (params) {
      getDepartmentList(params).then(res => {
        const { data } = res
        this.tableData = data.data
        this.delVisible = this.tableData.some(item => {
          return !item.user_name
        })
        this.total = data.count
      }).catch(error => {
        if (error.status) {
          this.$message.error(error.status.remind)
        }
      })
    },
    handleEdit (val) {
      this.departId = val || this.tableData[0].id
      this.dialogTableVisible = true
    },
    handleDel (val) {
      let params = {
        departId: val,
        uid: this.uid
      }
      delDepartment(params).then(res => {
        if (res.status.code == 200) {
          // this.delVisible = true
          this.getList(this.formMember)
          this.$message.error('删除成功')
        }
      }).catch(error => {
        this.$message.error(res.status.remind)
      })
    },
    handle (index) {
      this.dialogTableVisible = false
      if (index) {
        this.getList(this.formMember)
      }
    },
    handleUser () {
      // this.dialogTableVisible = true
      this.delVisible = false
    },
    addMember () {
      this.visible = true
    },
    onSubmit (value) {
      let params = Object.assign(this.formMember, value)
      this.getList(params)
    },
    submitForm (val) {
      this.visible = false
      addTeamDepartment(val).then(res => {
        this.visible1 = true
        this.getList(this.formMember)
      }).catch(error => {
        this.$message.error(error.status.remind)
      })
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
      border-radius:10px;
      // height: calc(100% - 100px);
      padding: 15px;
      .add-member {
        margin-bottom: 15px;
      }
      .team-pagination {
        margin-top: 20px;
      }
    }
  }
</style>
