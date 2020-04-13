<template>
  <div class="tables-box user-list">
    <memberCard :userType="userType"></memberCard>
    <div class="table-list">
      <memberQuery @onSubmit="onSubmit" @selectQuery="selectQuery"></memberQuery>
      <memberTable
        :total="total"
        :tableData="tableData"
        @handleEdit="handleEdit"
        @handleCheck="handleCheck"
        @handleDel="handleDel"
        @handleSelectionChange="handleSelectionChange"
      ></memberTable>
      <el-pagination
        class="team-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="newForm.page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="newForm.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <memberInfo
      :dialogTableVisible="dialogTableVisible"
      @submitMember="submitMember"
      :userId="userId"
    ></memberInfo>
    <confirmDialog
      v-if="visible"
      :dialogTableVisible="true"
      @submit="submit"
      :infoObj="infoObj"
      dialogType="check"
      @handleClose="visible=false;ids='';dialogType=''"
    ></confirmDialog>
  </div>
</template>
<script>
import Breadcrumb from './breadcrumb/Breadcrumb'
import memberCard from './membership/memberCard'
import memberQuery from './membership/memberQuery'
import memberTable from './membership/memberTable'
import memberInfo from './membership/memberInfo'
import confirmDialog from './common/confirmDialog'
import { getFdJobList, delFdjob, checkFdjob, updateInvoice } from '@/api/orderTarking'
import memberInfoVue from './membership/memberInfo.vue';
export default {
  components: {
    memberCard,
    memberQuery,
    memberTable,
    memberInfo,
    confirmDialog
  },
  data () {
    return {
      dialogTableVisible: false,
      visible: false,
      tableData: [],
      currentPage: 1,
      userType: 1,
      newForm: {
        uid: localStorage.getItem('sys_uid'),
        limit: 10,
        page: 1
      },
      total: 0,
      len: 0,
      userId: '',
      ids: ''

    }
  },
  created () {
    // 初始化查询标签数据
    // this.reverseUser()
    this.getList(this.newForm)
  },
  // watch: {
  //   keyword(v){
  //     if(v){
  //       this.newForm['ctime'] = 0
  //       this.newForm['offermoney_type'] = 0
  //       this.newForm['reward_type'] = 0
  //       this.newForm['status'] = 0
  //       this.newForm['job_status'] = 0
  //     }
  //   }
  // },
  
  methods: {
    // 筛选
    selectQuery(v){
      this.newForm = v
      let newForm = Object.assign(this.newForm, v)
      console.log(newForm,'newForm')
      this.getList(newForm)
    },
    handleSizeChange (val) {
      this.newForm.limit = val
      this.getList(this.newForm)
    },
    handleCurrentChange (val) {
      this.newForm.page = val
      this.getList(this.newForm)
    },
    getList (params) {
      getFdJobList(params).then(res => {
        const { data } = res
        this.tableData = data.data
        this.total = data.count
        console.log(data.data,'data.data')
        if(data.data.length){
          for(let i =0;i<data.data.length;i++){
            this.ids = data.data[i].id
          }
        }
        // data.data.find(item => {
        //   this.ids = item.id
        // })
      })
    },
    handleEdit (val) {
      this.dialogTableVisible = true
      this.userId = val
      console.log(this.userId)
    },
    handleDel (ids) {
      delFdjob({ ids }).then(res => {
        this.$message.success('删除成功')
        this.getList(this.newForm)
      }).catch(error => {
        this.$message.error(error.status.remind)
      })
    },
    handleSelectionChange (val) {
      this.len = val
    },
    submitMember (val) {

    },
    // 审核
    submit (val) {
      let params = Object.assign(val,{ ids:this.ids })
      checkFdjob(params).then(res => {
        this.visible = false
        this.getList(this.newForm)
      }).catch(error => {
        this.$message.error(error.status.remind)
      })
    },
    handleCheck (val) {
      this.visible = true;
      this.ids = val
    },
    onSubmit (value) {
      let params = Object.assign(this.newForm, value)
      this.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.table-list {
  background: #fff;
  border-radius:5px;
  overflow: visible;
  /* height: calc(100% - 100px); */
  padding: 15px;
  .team-pagination {
    margin-top: 20px;
  }
  .member-table {
    .action-btn {
      color: #333333;
      margin-bottom: 15px;
      .el-button {
        border-radius: 0;
        height: 38px;
      }
      .select-text {
        font-size: 14px;
        margin: 0 5px;
        color: #6A6A6A;
      }
    }
  }
}
.tables-box{
  width: 100%;
  overflow: hidden;
  margin-bottom: 60px;
  &.user-list {
    height: calc(100% - 60px);
    overflow: auto;
    /* overflow-x: hidden; */
  }
}
.team-info-row {
  margin: 20px 0;
}
.box-card p {
  font-size:16px;
}
.box-card p:nth-of-type(2) {
  font-size:34px;
  margin-top: 10px;
}
</style>
