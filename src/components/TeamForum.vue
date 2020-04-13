<template>
  <div class="tables-box">
    <div class="table-list team-forum">
      <el-form :model="formParams" class="demo-form-inline">
        <el-form-item label="搜索类型:">
          <div class="x-flex-start search-query">
            <el-select v-model="value" class="width100">
              <!-- v-model="type" -->
              <el-option label="团队名称" value="team_name"></el-option>
              <el-option label="发布人" value="username"></el-option>
            </el-select>
            <el-input
              class="query-input"
              v-model="keyword"
              @change="changeInput"
              placeholder="请输入关键词"
            ></el-input>
            <el-button type="primary" @click="queryList" class="select-btn">搜索</el-button>
          </div>
        </el-form-item>
        <el-form-item label="筛选分类:">
          <el-link
            :underline="false"
            :class="{'active': formParams.type==item.value}"
            @click="selectSort(item)"
            v-for="(item,index) in commentSort"
            :key="index"
          >{{item.label}}</el-link>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" ref="multipleTable" style="width: 100%">
        <el-table-column label="团队名称" prop="team_name" align="center" width="80"></el-table-column>
        <el-table-column label="发布人" prop="user_name" align="center" width="200"></el-table-column>
        <el-table-column label="标题" prop="title" align="center" width="150"></el-table-column>
        <el-table-column label="分类" align="center" width="150">
          <template slot-scope="scope">
            <span>{{getSortType(scope.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布内容" align="center" min-width="200">
          <template slot-scope="scope">
            <div class="text-line content-unescaped" v-html="unescaped(scope.row.content)"> </div>
            <!-- <div v-html="scope.row.content"></div> -->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleDetail(scope.row)" type="text" size="small">详情</el-button>
            <el-button
              @click="handleDel(scope.row)"
              type="text"
              v-if="uid==scope.row.uid"
              size="small"
            >删除</el-button>
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
import { getDiscussList, getDiscussInfo } from '../api/comment'
export default {
  data () {
    return {
      show: false,
      visible: false,
      tableData: [],
      userType: 1,
      keyword: '',
      value: 'team_name',
      formParams: {
        limit: 10,
        page: 1,
        type: 0
      },
      total: 0,
      formMember: {},
      uid: localStorage.getItem('sys_uid'),
      commentInfo: {},
      id: '',
      commentSort: [
        { label: '全部', value: 0 },
        { label: '通知', value: 1 },
        { label: '晨会', value: 2 },
        { label: '经验分享', value: 3 },
        { label: '工作日志', value: 4 },
        { label: '文章', value: 5 }
      ]
    }
  },
  created () {
    // 初始化查询标签数据
    this.getList(this.formParams)
  },
  methods: {
    unescaped (v) {
      return unescape(v)
    },

    changeInput (e) {
      console.log(e,'eee')
      this.formParams[this.value] = e
      console.log(this.formParams,'this.formParams')
    },
    queryList () {
      console.log(2)
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
    selectSort (val) {
      console.log(val,'val')
      this.formParams.type = val.value;
      this.getList(this.formParams)
    },
    refurbish () {
      this.getList(this.formParams)
    },
    getList (formParams) {
      getDiscussList(formParams).then(res => {
        // if (res.data.data) {
          this.tableData = res.data.data || []
        // }
        // else {
        //   this.commentInfo = null
        // }
      }).catch(error => {
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
      // let arr = JSON.parse(sessionStorage.getItem('menus'))
      // console.log(arr,'arrrr')
      // arr.push('论坛详情')
      // sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push({ path: 'detailCard', query: { id: val.id } })
    },
    handleDel (val) {
      this.$confirm('你确定要删除吗?', '', {
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
    }
  }
}
</script>

<style lang="scss">
 @import '../assets/css/table-list';
 #app{
   height: 100%;
 }
 .el-container{
   height: 100%;
 }
 .el-container,.is-vertical{
   height: 100%;
 }
 .table-list{
   height: 100%;
  overflow: auto;
 }
 .content-unescaped {
   width: 140px;
   height: 40px;
   line-height: 40px;
   span {
      white-space:nowrap;
      overflow: hidden;
      width: 140px;
      display: inline-block;
      text-overflow: ellipsis;
   }
 }
 .active{background-color: #409EFF;color: #fff;}
</style>
