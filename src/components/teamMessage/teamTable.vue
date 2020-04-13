<template>
  <div>
    <el-form :model="formParams" class="demo-form-inline">
      <el-form-item label="搜索类型:">
        <div class="x-flex-start search-query">
          <el-select v-model="value" placeholder="请选择" class="width100">
            <el-option label="团队名称" value="team_name"></el-option>
            <el-option label="手机号" value="mobile"></el-option>
            <el-option label="用户编码" value="id"></el-option>
          </el-select>
          <el-input
            class="query-input"
            v-model="keyword"
            @change="changeInput"
            placeholder="请输入关键词"
          ></el-input>
          <el-button type="primary" @click="getList(formParams)" class="select-btn">查询</el-button>
          <el-button type="primary" @click="show=!show" class="collapse-btn">{{show?'收起':'展开'}}</el-button>
        </div>
      </el-form-item>
      <el-collapse-transition>
        <div v-show="show">
          <el-form-item label="状态筛选:">
            <el-link
              :underline="false"
              :class="{'active': formParams.status==item.value}"
              @click="selectQuery('status',item)"
              v-for="(item,index) in statusList"
              :key="index"
            >{{item.label}}</el-link>
          </el-form-item>
          <el-form-item label="登录时间:">
            <el-link
              :underline="false"
              :class="{'active': formParams.regtime==item.value}"
              @click="selectQuery('regtime',item)"
              v-for="(item,index) in timeList"
              :key="index"
            >{{item.label}}</el-link>
          </el-form-item>
          <el-form-item label="注册时间:">
            <el-link
              :underline="false"
              :class="{'active': formParams.ctime==item.value}"
              @click="selectQuery('ctime',item)"
              v-for="(item,index) in timeList"
              :key="index"
            >{{item.label}}</el-link>
          </el-form-item>
        </div>
      </el-collapse-transition>
      <el-form-item label="团队性质:" v-if="tableType=='all'">
        <el-link
          :underline="false"
          :class="{'active': formParams.type==item.value}"
          @click="selectQuery('type',item)"
          v-for="(item,index) in teamType"
          :key="index"
        >{{item.label}}</el-link>
      </el-form-item>
      <el-form-item class="hanble-btn">
        <el-button
          type="primary"
          @click="handleTeam('check',ids)"
          v-if="tableType=='all'"
          class="select-btn"
        >审核</el-button>
        <el-button @click="handleTeam('')" class="select-btn">删除</el-button>
        <el-button @click="handleTeam('lock',ids)" class="select-btn">锁定</el-button>
      </el-form-item>
    </el-form>
    <!-- table数据 -->
    <el-table
      :data="tableData"
      ref="multipleTable"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="60"></el-table-column>
      <el-table-column label="用户编号" prop="uid" align="center" width="80"></el-table-column>
      <el-table-column
        v-if="tableType==='personal'"
        key="user_name"
        label="姓名"
        prop="user_name"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column label="团队名称" prop="team_name" align="center" width="150"></el-table-column>
      <el-table-column label="登录/注册" prop="login_date" align="center" width="150">
        <template slot-scope="prop">
          <p>{{ $moment.unix(prop.row.login_date).format('YYYY-MM-DD HH:mm') }}</p>
          <p>{{ $moment.unix(prop.row.reg_date).format('YYYY-MM-DD HH:mm') }}</p>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center" width="150"></el-table-column>
      <!-- <el-table-column v-if="tableType!='all'" label="职称" prop="grade_name" align="center" width="150"></el-table-column> -->

      <el-table-column
        v-if="tableType=='all'"
        key="team-types"
        label="团队性质"
        align="center"
        width="150"
      >
        <template slot-scope="props">
          <span>{{props.row.type==1?'企业':'个人'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableType=='personal'"
        key="grade_name"
        label="职称"
        prop="grade_name"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        v-if="tableType=='personal'"
        key="member_count"
        label="拥有简历"
        prop="member_count"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        v-if="tableType=='all'"
        key="member_count"
        label="团队人员"
        prop="member_count"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="props">
          <div v-if="tableType=='all'" key="statuses">
            <p
              :class="props.row.status === 1 ? 'grayyuan': props.row.status === 2 || props.row.is_lock === 1 ? 'greenyuan': 'redyuan'"
            ></p>
            {{ props.row.status == 1 && props.row.is_lock == 0 ? '待审核': props.row.status == 2 && props.row.is_lock == 0 || props.row.is_lock == 1 ? '已通过': props.row.status == 3 && props.row.is_lock == 0 ? '未通过': props.row.is_lock == 1 ? '已锁定':''}}
          </div>
          <div v-else>
            <p
              :class="props.row.status === 1 || props.row.is_lock === 0 ? 'grayyuan': props.row.status === 2 || props.row.is_lock === 1? 'greenyuan': 'redyuan'"
            ></p>
            {{ props.row.is_lock === 0 ? '正常': '已锁定'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="240px">
        <template slot-scope="scope">
          <div class="table-button-box">
            <div class="x-flex-center x-flex-wrap">
              <el-button
                @click="handleTeam('check',scope.row)"
                type="text"
                size="small"
                v-if="tableType === 'all' && scope.row.status === 1"
              >审&emsp;核</el-button>
              <el-button
                @click="handleTeam('check',scope.row)"
                type="text"
                size="small"
                v-else-if="tableType === 'all' "
              >已审核</el-button>
              <el-button @click="handleEdit(scope.row)" type="text" size="small">查&emsp;看</el-button>
              <el-button @click="handleLog(scope.row)" type="text" size="small">日&emsp;志</el-button>
            </div>
            <div class="x-flex-center x-flex-wrap">
              <el-button @click="handleDel(scope.row)" type="text" size="small">删&emsp;除</el-button>
              <el-button
                v-if="scope.row.is_lock==0"
                @click="handleTeam('lock',scope.row)"
                type="text"
                size="small"
              >锁&emsp;定</el-button>
              <el-button
                v-else-if="scope.row.is_lock==1"
                @click="handleTeam('lock',scope.row)"
                type="text"
                size="small"
              >解&emsp;锁</el-button>
              <el-button @click="handlePassword(scope.row)" type="text" size="small">密&emsp;码</el-button>
            </div>
          </div>
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
    <Log :dialogTableVisible="visible" @handleClose="visible=false" :uid="uid"></Log>
    <confirmDialog
      v-if="dialogTableVisible"
      :dialogTableVisible="true"
      @submit="submit"
      :objRow="objRow"
      :dialogType="dialogType"
      @handleClose="dialogTableVisible=false;ids='';dialogType=''"
    ></confirmDialog>
    <memberInfo :dialogTableVisible="dialogInfoVisible" :uid="uid" :memberIf="memberIf"></memberInfo>
  </div>
</template>
<script>
import Log from '../company/companyLog'
import confirmDialog from '../common/confirmDialog'
import memberInfo from '../membership/memberInfo'
import { resetPassword } from '../../api/company'

import { getTeamList, checkTeamSave, delTeam, delUser, getTeamUserList, lockTeamSave, lockUserSave } from '../../api/team'
import { stringify } from 'querystring';
export default {
  components: {
    Log,
    confirmDialog,
    memberInfo
  },
  props: {
    tableType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      lockData: {},
      objRow: {},
      memberIf: true,
      multipleSelection: [],
      lockUserData: {},
      delData: {
        ids: 1
      },
      show: true,
      visible: false,
      dialogTableVisible: false,
      dialogInfoVisible: false,
      infoObj: {},
      tableData: [],
      userType: 1,
      keyword: '',
      type: '',
      value: 'team_name',
      formParams: {
        limit: 10,
        page: 1,
        ctime: 0,
        regtime: 0,
        status: 0,
        type: 0
      },
      total: 0,
      timeList: [
        { label: '全部', value: 0 },
        { label: '今天', value: 1 },
        { label: '最近三天', value: 2 },
        { label: '最近七天', value: 3 },
        { label: '最近半月', value: 4 },
        { label: '最近一个月', value: 5 }
      ],
      teamType: [
        { label: '全部', value: 0 },
        { label: '个人', value: 2 },
        { label: '团队', value: 1 }
      ],
      ids: '',
      uid: '',
      dialogType: ''
    }
  },
  computed: {
    statusList() {
      let arr = []
      if (this.tableType == 'all') {
        arr = [
          { label: '全部', value: 0 },
          { label: '待审核', value: 1 },
          { label: '已通过', value: 2 },
          { label: '未通过', value: 3 },
          { label: '已解散', value: 4 },
        ]
      }
      else {
        arr = [
          { label: '全部', value: 0 },
          { label: '正常', value: 1 },
          { label: '已锁定', value: 2 },
          { label: '已删除', value: 3 }
        ]
      }
      return arr
    }
  },
  created() {
    // 初始化查询标签数据
    this.getAllList(this.tableType)
  },
  watch: {
    tableType(val) {
      this.getAllList(val)
    },
    keyword(v) {
      if (v) {
        this.formParams['status'] = 0
        this.formParams['regtime'] = 0
        this.formParams['login_data'] = 0
        this.formParams['ctime'] = 0
        if (this.tableType == 'all') {
          this.formParams['type'] = 0
        }
      }
    }
  },
  methods: {
    getAllList(val) {
      if (val == 'all') {
        this.getList(this.formParams)
      }
      else {
        this.getUserList(this.formParams)
      }
    },
    selectQuery(key, item) {
      console.log(this.tableType, 'this.tableType')
      if (key == 'status' && item.value == 4) {
        this.formParams.dismissed = 1
      }
      if (key == 'ctime') {
        this.formParams['regtime'] = 0
        this.formParams['status'] = 0
        if (this.tableType == 'all') {
          this.formParams['type'] = 0
        }
      } else if (key == 'regtime') {
        this.formParams['status'] = 0
        this.formParams['ctime'] = 0
        if (this.tableType == 'all') {
          this.formParams['type'] = 0
        }
      } else if (key == 'status') {
        this.formParams['regtime'] = 0
        this.formParams['login_data'] = 0
        if (this.tableType == 'all') {
          this.formParams['type'] = 0
        }
      } else {
        this.formParams['status'] = 0
        this.formParams['regtime'] = 0
        this.formParams['login_data'] = 0
        this.formParams['ctime'] = 0
      }
      this.keyword = '';
      this.formParams[this.value] = '';
      this.formParams[key] = item.value
      this.getAllList(this.tableType)
    },
    getList(params) {
      getTeamList(params).then(res => {
        const { data } = res
        this.tableData = data.data
        this.total = data.count
      }).catch(error => {
        if (error.status) {
          this.$message.error(error.status.remind)
        }
      })
    },
    getUserList(params) {
      getTeamUserList(params).then(res => {
        const { data } = res
        this.tableData = data.data
        this.total = data.count
      }).catch(error => {
        if (error.status) {
          this.$message.error(error.status.remind)
        }
      })
    },
    changeInput(e) {
      if (this.value == 'team_name') {
        this.formParams['mobile'] = ''
        this.formParams['id'] = ''
      } else if (this.value == 'mobile') {
        this.formParams['id'] = ''
        this.formParams['team_name'] = ''
      } else {
        this.formParams['team_name'] = ''
        this.formParams['mobile'] = ''
      }
      this.formParams[this.value] = e
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = val.map(item => item.id).join(',')
    },
    handleSizeChange(val) {
      this.formParams.limit = val
      this.getAllList(this.tableType)
    },
    handleCurrentChange(val) {
      this.formParams.page = val
      this.getAllList(this.tableType)
    },
    // selectQuery (key, item) {
    //   if (key == 'status' && item.value == 4) {
    //     this.formParams.dismissed = 1
    //   }
    //   else {
    //     this.formParams[key] = item.value
    //   }
    //   this.getList(this.formParams)

    // },
    // 查看
    handleEdit(val) {
      // console.log(this.tableType)
      if (this.tableType == 'personal') {
        this.uid = val.uid
        this.dialogInfoVisible = true
        this.infoObj = val
      }
      else {
        this.ids = val.id
        if (val.type == 1) {
          this.$router.push({ path: 'companyForm', query: { id: val.id } })
        }
        else {
          this.$router.push({ path: 'personalForm', query: { id: val.id } })
        }
      }
    },
    handleTeam(type, val) {
      console.log(val, 'val')
      if (!this.ids && !val) {
        return this.$message.warning('请选择团队')
      }
      else {
        if (!type) {
          this.handleDel(this.ids)
        }
        else {
          console.log(val)
          this.ids = val.uid || val   //id 
          this.dialogType = type
          this.dialogTableVisible = true
          this.objRow = val
        }
      }
    },
    submit(val) {
      if (val.status == 3) {
        if (!val.reason) {
          return this.$message.warning('请输入未通过原因')
        }
      }
      this.dialogTableVisible = false
      let params = Object.assign(val, { uids: this.ids })
      console.log(params)
      if (this.tableType == 'all') {
        if (this.dialogType == 'check') {
          this.submitCheck(params)
        } else {
          this.submitLock(params)
        }
      } else {
        this.lockUserData = {
          uids: val.ids.uid,
          is_lock: val.status
        }
        this.submitLock(this.lockUserData)
      }
      this.getAllList(this.tableType)
    },
    submitCheck(val) {
      checkTeamSave(val).then(res => {
        if (res.data) {
          this.$message.success('操作成功')
          this.$message.success('操作成功')
          this.getAllList(this.tableType)
        } else {
          this.$message.error('操作失败')
        }
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    submitLock(val) {
      if (this.tableType == 'all') {
        lockTeamSave(val).then(res => {
          if (res.data) {
            this.$message.success('操作成功')
            this.$message.success('操作成功')
            this.getAllList(this.tableType)
          } else {
            this.$message.error('操作失败')
          }
        }).catch((error) => {
          this.$message.error(error.status.remind)
        })
      }
      else {
        lockUserSave(val).then(res => {
          this.getAllList(this.tableType)
        }).catch((error) => {
          this.$message.error(error.status.remind)
        })
        // this.getUserList(this.formParams)
      }
      // this.getList(this.formParams)
      this.ids = ''
    },
    handleDel(ids) {
      // console.log(ids,'del.val')
      this.$confirm('你确定要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.tableType == 'all') {
          this.deleteTeam(ids)
        }
        else {
          this.deleteUser(ids)
        }
      }).catch(() => {
        console.log(2)
      })
    },
    deleteTeam(ids) {
      this.delData = {}
      this.delData.ids = ids.id
      // console.log(this.delData,'this.delData')
      delTeam(this.delData).then(res => {
        this.getList(this.formParams)
      }).catch(() => {
        console.log(2)
      })
      this.delData = {}
    },
    deleteUser(ids) {
      this.delData = {}
      this.delData.ids = ids.id
      delUser(this.delData).then(res => {
        this.getUserList(this.formParams)
      }).catch(() => {
        console.log(3)
      })
      this.delData = {}
    },
    handlePassword(val) {
      this.$confirm('此操作将重置密码为123456, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let uid = val.id
        resetPassword({ uid }).then(res => {
          console.log('12345')
          // this.$message.success('重置成功')
          this.getList(this.formParams)
          this.$message({
            type: 'success',
            message: '重置成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        });
      });
    },
    handleLog(row) {
      this.uid = row.uid
      this.visible = true
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/css/table-list";
.tables-box {
  .table-button-box {
    .el-button--small {
      padding: 3px 0 !important;
    }
  }
}
.grayyuan {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: grey;
}
.greenyuan {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: green;
}
.redyuan {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: red;
}
</style>

