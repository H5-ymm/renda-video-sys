<template>
  <div class="tables-box">
    <div class="table-list company-list">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="宣讲会名称">
          <el-input
            class="width200"
            v-model="formParams.name"
            placeholder="请输入宣讲会名称"></el-input>
        </el-form-item>
         <el-form-item label="企业名称">
          <el-input
            class="width200"
            v-model="formParams.comName"
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
           <el-button type="primary" @click="selectQuery" class="select-btn">查询</el-button>
           <el-button type="primary" @click="reset" class="select-btn">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-query">
        <el-button type="primary" class="select-btn"  icon="el-icon-plus" @click="addLecture">添加宣讲会</el-button>
        <el-button @click="handleCompany(1, idList)">审核</el-button>
        <!-- <el-button @click="handleCompany(0, idList)">删除</el-button> -->
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection">清空</el-button>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="宣讲会名称" prop="title" align="center" width="160"></el-table-column>
        <el-table-column label="企业名称" prop="com_name" align="center" width="160"></el-table-column>
        <el-table-column label="开始时间" align="center" width="160">
           <template slot-scope="scope">
            <span>{{$moment.unix(scope.row.starttime).format('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="link_man" align="center" width="100"></el-table-column>
        <el-table-column label="联系人电话" prop="link_tel" align="center" width="160"></el-table-column>
        <el-table-column label="状态" align="center" width="160">
          <template slot-scope="props">
             <span class="status" :class="props.row.status === 0 ? 'grayyuan': props.row.status === 1 ? 'greenyuan': 'redyuan'">{{props.row.status === 0 ?'待审核':props.row.status === 1?'已通过': '已拒绝'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template slot-scope="scope">
            <el-button @click="handleCheck(scope.row)" type="text" size="small">审核</el-button>
            <el-button @click="handleView(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleView(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDel(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="team-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :current-page="formParams.page" :page-sizes="[10, 30, 50, 100]" :page-size="formParams.limit" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
    </div>
    <confirmDialog :dialogVisible="dialogVisible" @submit="submit" :objRow="objRow" @handleClose="dialogVisible=false;idList=''"></confirmDialog>
  </div>
</template>

<script>
import confirmDialog from '../common/confirmDialog'
import { getLectureList, addLecture, lectureDel, lectureCheck } from '@/api/lecture'
export default {
  components: {
    confirmDialog
  },
  data () {
    return {
      multipleSelection: [],
      dialogVisible: false,
      tableData: [],
      formParams: {
        limit: 10,
        page: 1
      },
      total: 0,
      statusList: [
        { label: '全部', value: 0 },
        { label: '待审核', value: 1 },
        { label: '已通过', value: 2 },
        { label: '未通过', value: 3 },
      ],
      objRow: {
        status: 0
      },
      id: '',
      idList: ''
    }
  },
  created () {
    this.getList(this.formParams)
  },
  methods: {
    addLecture(){
      let arr = ['宣讲会管理','添加宣讲会']
      sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push({path: '/lectureForm'})
    },
    reset() {
      this.formParams = {
        limit: 10,
        page: 1,
        name: '',
        status: '',
        comName: ''
      }
      this.getList(this.formParams)
    },
    toggleSelection() {
      this.multipleSelection = []
      this.idList =''
      this.$refs.multipleTable.clearSelection();
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.idList = val.map(item => item.id).join(',')
    },
    // 分页
    handleSizeChange (val) {
      this.formParams.limit = val
      this.getList(this.formParams)
    },
    handleCurrentChange (val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
    selectQuery () {
      this.getList(this.formParams)
    },
    handleCompany (type, val) {
      if (!val) {
        return this.$message.warning('请选择宣讲会')
      }
      else {
        if (!type) {
          this.handleDel(this.idList)
        }
        else {
          this.dialogVisible = true
        }
      }
    },
    // 审核
    handleCheck(val){
      this.objRow.status = val.status
      this.dialogVisible = true
      this.idList = val.id
    },
    submit (val) {
      if (val.status == 2) {
        if (!val.reason) {
          return this.$message.warning('请输入不通过原因')
        }
      }
      let params = {
        idList: this.idList,
        status: val.status,
        refuse: val.reason
      }
      this.submitCheck(params)
    },
    getList (params) {
      getLectureList(params).then(res => {
        const { data } = res
        this.tableData = data.data
        this.total = data.count
      }).catch(error => {
        if (error.status) {
          this.$message.error(error.status.remind)
        }
      })
    },
    handleView (val) {
      this.$router.push({ path: '/lectureForm', query: { id: val.id } })
    },
    submitCheck (val) {
      lectureCheck(val).then(res => {
        this.objRow = {}
        this.dialogVisible = false
        this.getList(this.formParams)
      }).catch((error) => {
        this.$message.error(error.status.remind)
      })
    },
    handleDel (idList) {
      this.$confirm('你确定要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        lectureDel({ id: idList }).then(res => {
          if(res.data) {
            this.$message.success('删除成功')
            this.getList(this.formParams)
          } else {
            this.$message.error('删除失败')
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