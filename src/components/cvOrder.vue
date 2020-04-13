<template>
  <div class="tables-box">
    <div class="table-list">
      <el-form
        :inline="true"
        :model="formParams"
        ref="formParams"
        class="demo-form-inline"
        label-width="100px"
        :label-position="labelPosition"
      >
        <el-form-item label="团队名称：">
          <el-input
            class="query-inputs width350"
            v-model="formParams.teamName"
            placeholder="请输入团队名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input class="query-inputs width350" v-model="formParams.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <div></div>
        <el-form-item label="姓名：">
          <el-input class="query-inputs width350" v-model="formParams.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="选择日期：">
          <el-date-picker
            v-model="DatePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dataChanged"
          ></el-date-picker>
        </el-form-item>
        <div></div>
        <el-button type="primary" @click="searCh" class="select-btn">查询</el-button>
        <el-button type="primary" @click="reSet(formParams)">重置</el-button>
        <el-button type="primary" @click="exPort" class="select-btn">导出简历</el-button>
        <div class="slot_row"></div>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" width="130" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="200" align="center"></el-table-column>
        <el-table-column prop="desired_position" label="意向岗位" width="180" align="center"></el-table-column>
        <el-table-column prop="money" label="意向工资" width="130" align="center"></el-table-column>
        <el-table-column prop="city" label="意向城市" width="120" align="center"></el-table-column>
        <el-table-column label="跟进人" width="160" align="center">
          <template slot-scope="props">
            <span
              @click="openWindow(props.row)"
            >{{props.row.trackList?props.row.trackList.username:''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="跟进记录" width="260" align="center">
          <template slot-scope="props">
            <el-button type="text">
              <span
                @click="openWindow(props.row)"
              >{{props.row.trackList?props.row.trackList.title:''}}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="times">
            <span>{{$moment.unix(times.row.addtime).format('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="team_name" label="团队名称" width="160" align="center"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
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
    <followUpRecord
      :dialogTableVisible="dialogTableVisible"
      :id="resumeId"
      @handleClose="handleClose"
      @submitRecord="submitRecord"
    ></followUpRecord>
  </div>
</template>
<script>
import { teamAdministrationResume, exportUserResume } from '../api/cvorder'
import cvLook from './cvLook'
import followUpRecord from './followUpRecord'
export default {
  components: {
    cvLook,
    followUpRecord
  },
  data() {
    return {
      gridData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      reason: '',
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
        // teamName: '',
        // name: '',
        // beginTime: '',
        // endTime: '',
        // phone: '',
        limit: 10,
        page: 1,
      },
      value1: '',
      DatePicker: [],
      total: 0,
      formMember: {},
      commentInfo: {},
      id: '',
      exportC: {
        uid: localStorage.getItem('sys_uid'),
      },
      tableData: [

      ],
      trackLists: [],
      multipleSelection: [],
    }
  },
  created() {
    this.getList(this.formParams);
  },
  methods: {
    submitRecord(w) {
      this.dialogTableVisible = false
    },
    openWindow(v) {
      this.dialogTableVisible = true
      this.resumeId = v.trackList.resume_id
    },
    searCh() {
      this.getList(this.formParams)
    },
    handleSizeChange(val) {
      this.formParams.limit = val
      this.getList(this.formParams)
    },
    handleCurrentChange(val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
    handleClick() {
      this.$router.push({ path: './cvLook' })
    },
    //关闭弹窗
    handleClose() {
      this.dialogTableVisible = false
    },
    getList(formParams) {
      teamAdministrationResume(formParams).then(res => {
        // if (res.data.data) {
        this.tableData = res.data.data || [];
        this.total = res.data.count
      })
        .catch(error => {
          this.$message.error(error.status.remind)
        })
    },
    exPort() {
      exportUserResume(this.formParams.uid)
    },
    postFormData(url, params) {
      window.location.href = `${url}?uid=${params}`
    },
    getSortType(val) {
      let obj = this.commentSort.find(item => {
        return val == item.value
      })
      if (obj) {
        return obj.label
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dataChanged() {
      if (this.DatePicker.length > 0) {
        this.formParams.beginTime = this.DatePicker[0] ? this.DatePicker[0].valueOf() : '';
        this.formParams.endTime = this.DatePicker[1] ? this.DatePicker[1].valueOf() : '';
      }
    },
    reSet(formParams) {
      this.DatePicker = [];
      this.formParams.teamName = '';
      this.formParams.phone = '';
      this.formParams.name = '';
      this.getList(this.formParams)
    }
  },
}
</script>
<!-- 
<style lang="scss">
</style> -->
<style lang="scss">
@import "../assets/css/table-list";
.slot_row {
  width: 100%;
  height: 20px;
}
.tables-box .query-inputs {
  margin: 0;
  width: 350px;
}
/* .table-list {
  background: #fff;
  border-radius:5px;
  // height: calc(100% - 100px);
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
} */

.tables-box {
  width: 100%;
  margin-bottom: 60px;
  &.user-list {
    height: calc(100% - 60px);
    overflow: auto;
    overflow-x: hidden;
  }
  height: 100%;
  overflow: auto;
}
</style>
  