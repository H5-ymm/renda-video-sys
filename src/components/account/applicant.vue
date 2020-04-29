<template>
  <div class="tables-box">
    <div class="table-list company-list">
      <el-form :model="formParams" class="demo-form-inline" :inline="true">
        <el-form-item label="姓名">
          <el-input
            class="width200"
            v-model="formParams.name"
            placeholder="请输入账户名称"></el-input>
        </el-form-item>
         <el-form-item label="注册手机">
          <el-input
            class="width200"
            v-model="formParams.mobile"
            placeholder="请输入注册手机号码"></el-input>
        </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="selectQuery" class="select-btn">查询</el-button>
           <el-button type="primary" @click="reset" class="select-btn">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-query">
        <el-button type="primary" class="select-btn" @click="addUser">添加账户</el-button>
        <el-button @click="handleUser">删除</el-button>
        <span class="select-text">
          已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="toggleSelection">清空</el-button>
      </div>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%" @sort-change="sortChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="姓名" prop="nickname" align="center" width="160"></el-table-column>
        <el-table-column label="注册手机账户" prop="username" align="center" width="160"></el-table-column>
        <el-table-column label="所属区域" prop="mobile" align="center" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.provinceName}}{{scope.row.cityName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="username" align="center" width="160"></el-table-column>
        <el-table-column label="联系人电话" prop="tel" align="center" width="160"></el-table-column>
        <el-table-column label="注册时间" align="center" width="160" sortable="custom">
          <template slot-scope="scope">
            <span>{{$moment.unix(scope.row.reg_date).format('YYYY-MM-DD HH:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleDel(scope.row.id)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="team-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" 
      :current-page="formParams.page" :page-sizes="[10, 30, 50, 100]" :page-size="formParams.limit" layout="total, sizes, prev, pager, next" :total="total"></el-pagination>
    </div>
      <el-dialog title="添加账户" :visible.sync="dialogFormVisible" >
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userForm"
          label-width="80px"
          label-position="right"
          class="teamMessage-form"
        >
          <section class="section-box">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="userForm.name" class="width300" :readonly="userId!=''"  placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="userForm.tel" :readonly="userId!=''" class="width300"  placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="现住地址" required>
              <div class="width300">
                <districtSelet @change="change" :address="address" v-if="!userId" :disabled="true"></districtSelet>
                <p class="el-input__inner" v-else>{{userForm.provinceName}}{{userForm.cityName}}</p>
              </div>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select v-model="userForm.sex" :disabled="userId!=''"  class="width300" placeholder="请选择性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userForm.email"  :readonly="userId!=''" class="width300"  placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </section>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('userForm')" v-if="!userId">保存</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { wantedJobUserList, addConsumer, delConsumer, seeConsumerInfo } from '@/api/consumer'
import districtSelet from '../districtSelet'
export default {
  components: {
    districtSelet
  },
  data () {
    return {
      idList: '',
      multipleSelection: [],
      dialogFormVisible: false,
      tableData: [],
      formParams: {
        limit: 10,
        page: 1,
        mobile:'',
        name:'',
        type: 2
      },
      total: 0,
      userForm: {
        name: '',
        sex: '',
        tel: '',
        provinceid: '',
        cityid: '',
        email: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
      },
      address: [],
      userId: ''
    }
  },
  created () {
    this.getList(this.formParams)
  },
  methods: {
     addUser(){
      this.dialogFormVisible = true
    },
    reset() {
      this.formParams = {
        limit: 10,
        page: 1,
        name: '',
        status: '',
        type: 2
      }
      this.getList(this.formParams)
    },
     change (val) {
      this.userForm.provinceid = val[0]
      this.userForm.cityid = val[1]
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    toggleSelection() {
      this.multipleSelection = []
      this.idList = ''
      this.$refs.multipleTable.clearSelection();
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val;
      this.idList = val.map(item => item.id).join(',')
    },
    sortChange(column) {
      if (column.order == 'ascending') {
        this.formParams.sortTime = 'asc'
      } else {
        this.formParams.sortTime = 'desc'
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
    selectQuery (key, item) {
      // if (key == 'login_data') {
      //   this.formParams['reg_date'] = 0
      //   this.formParams['status'] = 0
      // } else if (key == 'reg_date') {
      //   this.formParams['status'] = 0
      //   this.formParams['login_data'] = 0
      // } else {
      //   this.formParams['reg_date'] = 0
      //   this.formParams['login_data'] = 0
      // }
      // this.keyword = '';
      // this.formParams[this.value] = '';
      // this.formParams[key] = item.value
      this.getList(this.formParams)
    },
    handleUser () {
      if (!this.idList) {
        return this.$message.warning('请选择账户')
      }
      else {
        this.handleDel(this.idList)
      }
    },
    getList (params) {
      wantedJobUserList(params).then(res => {
        const { data } = res
        this.tableData = data.data
        this.total = data.count
      }).catch(error => {
        if (error.status) {
          this.$message.error(error.status.remind)
        }
      })
    },
    handleEdit (val) {
      this.userId = val.info_id
      this.dialogFormVisible = true
      this.getDetail(val.info_id)
    },
    getDetail(id) {
      seeConsumerInfo({id}).then(res => {
        let data = res.data
        for(let key in this.userForm) {
          this.userForm[key] = data[key]
        }
        this.userForm.name = data.nickname
        this.userForm.provinceName = data.provinceName
        this.userForm.cityName = data.cityName
      })
    },
    submitForm (userForm) {
      this.$refs[userForm].validate((valid) => {
        if (valid) {
          addConsumer(this.userForm).then(res => {
            if (res.data) {
              this.dialogFormVisible = false
              this.$message.success('添加成功')
              this.getList(this.formParams)
            } else {
              this.$message.error('添加失败')
            }
          }).catch(error =>{
            if (error && error.status) {
              this.$message.error(error.status.remind)
            }        
          })
        } else {
          return false;
        }
      });
    },
    handleDel (idList) {
      this.$confirm('你确定要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delConsumer({ idList }).then(res => {
           if(res.data) {
            this.$message.success('删除成功')
            this.getList(this.formParams)
          } else {
            this.$message.error('删除失败')
          }
        }).catch(error =>{
          if (error && error.status) {
            this.$message.error(error.status.remind)
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