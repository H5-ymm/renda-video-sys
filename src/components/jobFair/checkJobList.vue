<template>
  <div class="tables-box">
    <div class="table-list team-form">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="企业名称" v-if="!com_id">
          <el-input
            class="width200"
            v-model="formParams.companyName"
            placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formParams.status" class="width200">
            <el-option label="待审核" value="0"></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="已拒绝" value="2"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="queryList" class="select-btn">查询</el-button>
           <el-button type="primary" @click="reset" class="select-btn">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-query">
        <el-button type="primary" class="select-btn" @click="handleCheck(obj)">审核</el-button>
        <el-button @click="handleDel(idlist)">删除</el-button>
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection">清空</el-button>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="职位展示位置" align="center" width="160">
          <template slot-scope="props">
             <span>{{props.row.exhibition == 1?'招聘会':props.row.exhibition == 2?'宣讲会': '招聘会/宣讲会'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="参会企业" v-if="!com_id" align="center" prop="com_name" min-width="160">
        </el-table-column>
         <el-table-column label="发布职位" align="center" prop="job_name" width="160">      
        </el-table-column>
        <el-table-column label="状态" align="center" width="160">
          <template slot-scope="props">
             <span class="status" :class="props.row.status === 0 ? 'grayyuan': props.row.status === 1 ? 'greenyuan': 'redyuan'">{{props.row.status === 0 ?'待审核':props.row.status === 1?'已通过': '已拒绝'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  min-width="160">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleCheck(scope.row)" type="text" size="small">审核</el-button>
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
    <confirmDialog :dialogVisible="dialogVisible" @submit="submit" :objRow="objRow" @handleClose="dialogVisible=false;uid=''"></confirmDialog>
  </div>
</template>
<script>
import confirmDialog from '../common/confirmDialog'
import { getJobList, trialFairJob , delFairJob} from '@/api/job'
export default {
  components: {
    confirmDialog
  },
  data () {
    return {
      dialogVisible: false,
      tableData: [],
      formParams: {
        limit: 10,
        page: 1,
        status: ''
      },
      total: 0,
      uid: localStorage.getItem('sys_uid'),
      id: '',
      multipleSelection:[],
      statusList: [
        {label: '待举办', value: 0},
        {label: '进行中', value: 1},
        {label: '已结束', value: 2}
      ],
      objRow: {
        status: 0
      },
      idlist: '',
      obj: {
        id: '',
        status: 0
      },
      com_id: ''
    }
  },
  created () {
    // 初始化查询标签数据
    if (this.$route.query.id) {
      this.com_id = this.$route.query.id
      this.formParams.comId = this.com_id
    }
    this.getList(this.formParams)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.idlist = val.map(item => item.id).join(',')
      this.obj.id = this.idlist
    },
    toggleSelection() {
      this.multipleSelection = []
      this.idlist =''
      this.$refs.multipleTable.clearSelection();
      this.obj.id = ''
    },
    submit (val) {
      if (val.status == 2) {
        if (!val.reason) {
          return this.$message.warning('请输入不通过原因')
        }
      }
      let params = {
        idList: this.idlist,
        status: val.status,
        content: val.reason || ''
      }
      this.submitCheck(params)
    },
    submitCheck (val) {
      trialFairJob(val).then(res => {
        this.objRow = {
          status: 0
        }
        this.dialogVisible = false
        this.getList(this.formParams)
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    queryList () {
      this.getList(this.formParams)
    },
    reset() {
      this.formParams = {
        limit: 10,
        page: 1,
        name: '',
        status: ''
      }
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
    refurbish () {
      this.getList(this.formParams)
    },
    getList (formParams) {
      getJobList(formParams).then(res => {
        this.tableData = res.data.data || []
        this.total = res.data.count
      }).catch(error => {
        this.$message.error(error.status.remind)
      })
    },
    getStatus (val) {
      let obj = this.statusList.find(item => {
        return val == item.value
      })
      if (obj) {
        return obj.label
      }
    },
    handleDetail (val) {
      this.$router.push({ path: '/jobDetail', query: { id: val.id } })
    },
    handleCheck(val) {
      if (!val.id) {
        return this.$message.warning('请选择职位')
      }
      this.idlist = val.id
      this.objRow = {
        status: val.status
      }
      this.dialogVisible = true
    },
    handleDel(id) {
      if (!id) {
        return this.$message.warning('请选择职位')
      }
      this.$confirm('删除后信息无法恢复，请谨慎操作', '确定要删除招聘会职位吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delFairJob({ idList: id }).then(res => {
         if(res.data) {
           this.getList(this.formParams)
          } else {
           this.$message.warning('删除失败')
         }
        })
      }).catch(() => {
        console.log(2)
      })
    }
  }
}
</script>

<style lang="scss">
 @import '../../assets/css/table-list';
</style>
