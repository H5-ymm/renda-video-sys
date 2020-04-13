<template>
  <div class="tables-box">
    <div class="table-list team-forum">
      <el-form :inline="true" :model="formParams" ref="formParams" class="demo-form-inline" label-width="100px" :label-position="labelPosition">
        <el-form-item label="账户名称：">
          <el-input
            class="query-inputs width200"
            v-model="formParams.teamName"
            @change="changeInput"
            placeholder="请输入账号名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input
            class="query-inputs width200"
            v-model="formParams.name"
            @change="changeInput"
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
            <el-button @click="handleStatus(scope.row,scope.$index)" type="text" size="small" :disabled="disabled && activeIndex==scope.$index">处理</el-button>
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
  </div>
</template>
<script>
  import { feedbackList, gainFeedbackInfo, doFeedbackInfo } from '../api/report'
  export default {
    data () {
      return {
        dialogVisible: false,
        dialogVisibleDeal: false,
        deal: false,
        tableData: [{
          id: 0,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',

        }, {
          id: 1,
          date: '2016-05-04',
          name: 'da虎',
          address: '上海市普陀区金沙江路 1518 弄',

        }, {
          id: 2,
          date: '2016-05-01',
          name: '王3虎',
          address: '上海市普陀区金沙江路 1518 弄',

        }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        reason: '',
        reportlist:{
          user: 'alfie',
          phone: 15765692066,
          date: 1576569206,
          reason: "违规",
          deal_per: "ren",
          deal_result: 'wqefgergberiogh7r8bgvr',
        },
        radio1: '',
        show: false,
        resumeId: '',
        formLabelWidth: '120px',
        names: '',
        phones: '',
        namess: '',
        datess: '',
        labelPosition: 'right',
        show: false,
        visible: false,
        userType: 1,
        keyword: '',
        team_name: '',
        name: '',
        mobile: '',
        type: '',
        id: '',
        formParams: {
          uid: localStorage.getItem('sys_uid'),
          limit: 10,
          page: 1,
        },
        value1:'',
        DatePicker:[],
        total: 0,
        formMember: {},
        commentInfo: {},
        id: '',
        exportC: {
          uid: localStorage.getItem('sys_uid'),
        },
        
        trackLists: [],
        multipleSelection: [],
        activeIndex:-1,
        disabled:false
      }
    },
    created () {
      this.getList(this.formParams);
    },
    methods: {
      dealSure () {
        this.disabled = true;
        this.dialogVisibleDeal = false;
      },
      handleStatus(row,index){
        console.log(index)
        this.dialogVisibleDeal = true
        this.activeIndex = index
      },
      submitRecord (w) {
        console.log(w,'用户input')
        this.dialogTableVisible = false
      },
      openWindow (q) {
        this.dialogTableVisible = true
        this.trackLists = q
      },
      changeInput (e) {
        this.formParams[this.type] = e
      },
      sortChange(column) {
        if (column.order == 'ascending') {
          this.formParams.timeDesc = 'asc'
        } else {
          this.formParams.timeDesc = 'desc'
        }
        this.getList(this.formParams)
      },
      searCh () {
        // let d = new Date().valueOf()
        // console.log(d,222)
        // console.log(this.DatePicker[0].valueOf(),3333)
        this.getList(this.formParams)
      },
      handleSizeChange (val) {
        console.log(val,'val')
        this.formParams.limit = val
        this.getList(this.formParams)
      },
      handleCurrentChange (val) {
        this.formParams.page = val
        this.getList(this.formParams)
      },
      selectSort (val) {
        this.formParams.type = val.value
      },
      refurbish () {
        this.getList(this.formParams)
      },
      handleClick () {
        console.log(1)
        // this.$router.push({path:'./cvLook'})
      },
      //关闭弹窗
      handleClose () {
        this.dialogTableVisible = false
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
      getSortType (val) {
        let obj = this.commentSort.find(item => {
          return val == item.value
        })
        if (obj) {
          return obj.label
        }
      },
      handleDetail (val) {
        let arr = JSON.parse(sessionStorage.getItem('menus'))
        arr.push('论坛详情')
        sessionStorage.setItem('menus', JSON.stringify(arr))
        this.$router.push({ path: 'detailCard', query: { id: val.id } })
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
      dataChanged () {
        if(this.DatePicker.length > 0){
          this.formParams.beginTime = this.DatePicker[0].valueOf();
          this.formParams.endTime = this.DatePicker[1].valueOf();
        }
      },
      reSet (formParams) {
        this.DatePicker = [];
        this.formParams.teamName = '';
        this.formParams.phone = '';
        this.formParams.name = '';
      },
      // getSortType (val) {
      //   // let obj = this.trackLists.find(item => {
      //   //   return val == item.
      //   // })
      //   // if (obj) {
      //     // return val.remark
      //   }
      // },
    },
  }
</script>
<!-- 
<style lang="scss">
</style> -->
<style lang="scss">
  @import '../assets/css/table-list';
  .slot_row{width: 100%;height: 20px;}
  .tables-box .query-inputs {
    margin: 0;
    width: 350px;
  }
  .green{color: green;}
  .grey{color: grey;}
  .marginb{
    margin-bottom: 30px;
    
    }

</style>
  