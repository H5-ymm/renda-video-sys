<template>
  <div>
    <el-form :model="formParams" class="demo-form-inline">
      <el-form-item label="搜索类型:">
        <div class="x-flex-start search-query">
          <el-select v-model="type" placeholder="请选择" class="width100">
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
          @click="handleTeam('check')"
          v-if="tableType=='all'"
          class="select-btn"
        >审核</el-button>
        <el-button @click="handleTeam('')" class="select-btn">删除</el-button>
        <el-button @click="handleTeam('lock')" class="select-btn">锁定</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      ref="multipleTable"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="60"></el-table-column>
      <el-table-column label="用户编号" prop="id" align="center" width="80"></el-table-column>
      <el-table-column label="团队名称" prop="team_name" align="center" width="200"></el-table-column>
      <el-table-column label="登录/注册" prop="login_date" align="center" width="150">
        <template slot-scope="props">
          <span>{{$moment(props.row.login_date).format('YYYY-MM-DD HH:mm')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="mobile" align="center" width="150"></el-table-column>
      <el-table-column label="团队性质" align="center" v-if="tableType=='all'" width="150">
        <template slot-scope="props">
          <span>{{props.row.type==1?'企业':'个人'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="职称"
        prop="member_count"
        v-if="tableType=='personal'"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        label="拥有简历"
        prop="member_count"
        v-if="tableType=='personal'"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column
        label="团队人员"
        prop="member_count"
        v-if="tableType=='all'"
        align="center"
        width="150"
      ></el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="props">
          <span>{{ props.row.status === 1 ? '待审核': props.row.status === 2 ? '已通过': '未通过'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="table-button-box">
            <el-button
              @click="handleTeam('check',scope.row)"
              type="text"
              size="small"
              v-if="tableType=='all'"
            >审核</el-button>
            <el-button @click="handleEdit(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleLog(scope.row)" type="text" size="small">日志</el-button>
            <div>
              <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="handleTeam('lock',scope.row)" type="text" size="small">锁定</el-button>
              <el-button @click="handlePassword(scope.row)" type="text" size="small">密码</el-button>
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
      :dialogTableVisible="dialogTableVisible"
      @submit="submit"
      :dialogType="dialogType"
      @handleClose="dialogTableVisible=false;ids='';dialogType=''"
    ></confirmDialog>
    <memberInfo :dialogTableVisible="dialogInfoVisible" :uid="uid"></memberInfo>
  </div>
</template>
<script>
import Log from '../company/companyLog'
import confirmDialog from '../common/confirmDialog'
import memberInfo from '../membership/memberInfo'

import { getTeamList, checkTeamSave, delTeam, delUser, getTeamUserList } from '../../api/team'
export default {
  components: {
    Log,
    confirmDialog,
    memberInfo
  },
  props: ['tableType'],
  data () {
    return {
      show: true,
      visible: false,
      dialogTableVisible: false,
      dialogInfoVisible: false,
      tableData: [],
      userType: 1,
      keyword: '',
      type: '',
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
    statusList () {
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
  created () {
    // 初始化查询标签数据
    if (this.tableType == 'all') {
      this.getList(this.formParams)
    }
    else {
      this.getUserList(this.formParams)
    }
  },
  methods: {
    getList (params) {
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
    getUserList (params) {
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
    changeInput (e) {
      this.formParams[this.type] = e
    },
    handleSelectionChange (val) {
      this.ids = val.map(item => item.id).join(',')
    },
    handleSizeChange (val) {
      this.formParams.limit = val
      this.getList(this.formParams)
    },
    handleCurrentChange (val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
    selectQuery (key, item) {
      if (key == 'status' && item.value == 4) {
        this.formParams.dismissed = 1
      }
      else {
        this.formParams[key] = item.value
      }
    },
    handleEdit (val) {
      console.log(this.tableType)
      if (this.tableType == 'personal') {
        this.uid = val.uid
        this.dialogInfoVisible = true
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
    handleTeam (type, val) {
      if (!this.ids && !val) {
        return this.$message.warning('请选择团队')
      }
      else {
        if (!type) {
          this.handleDel(this.ids)
        }
        else {
          this.ids = val.id
          this.dialogType = type
          this.dialogTableVisible = true
        }
      }
    },
    submit (val) {
      this.dialogTableVisible = false
      let params = Object.assign(val, { ids: this.ids })
      if (this.dialogType == 'check') {
        this.submitCheck(params)
      } else {
        this.submitLock(params)
      }
    },
    submitCheck (val) {
      checkTeamSave(val).then(res => {
        this.getList(this.formParams)
        this.visibleCheck = false
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    submitLock (val) {
      let params = Object.assign(val, { uid: this.uid })
      companyLock(val).then(res => {
        this.getList(this.formParams)
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    handleDel (ids) {
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
    deleteTeam (ids) {
      delTeam({ ids }).then(res => {
        this.getList(this.formParams)
      }).catch(() => {
        console.log(2)
      })
    },
    deleteUser (ids) {
      delUser({ ids }).then(res => {
        this.getList(this.formParams)
      }).catch(() => {
        console.log(2)
      })
    },
    handlePassword (val) {
      this.$alert('密码将设置为123456<br>确定重置吗?', '密码重置', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let uid = val.id
        resetPassword({ uid }).then(res => {
          this.getList(this.formParams)
        })
      }).catch(() => {
        console.log(2)
      })
    },
    handleLog (row) {
      this.uid = row.uid
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/css/table-list';
</style>

