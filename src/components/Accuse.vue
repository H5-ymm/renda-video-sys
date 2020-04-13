<!-- 举报 -->
<template>
  <div class="tables-box">
    <div class="table-list team-forum">
      <el-form :inline="true" :model="formParams" ref="formParams" class="demo-form-inline" label-width="100px" :label-position="labelPosition">
        <el-form-item label="举报账号：">
          <el-input
            class="query-inputs width350"
            v-model="formParams.name"
            @change="changeInput"
            placeholder="请输入举报账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="举报理由">
          <el-select v-model="formParams.reason" placeholder="请选择举报理由">
            <el-option label="虚假职位" value="1"></el-option>
            <el-option label="地址虚假" value="2"></el-option>
            <el-option label="薪资虚假" value="3"></el-option>
            <el-option label="涉黄" value="4"></el-option>
            <el-option label="诈骗/收费" value="5"></el-option>
            <el-option label="欠薪" value="6"></el-option>
            <el-option label="非招聘帖" value="7"></el-option>
            <el-option label="其他" value="8"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="formParams.status">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="0">待审核</el-radio-button>
            <el-radio-button label="1">已处理</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <div></div>
        <el-form-item label="选择日期：">
          <el-date-picker
            v-model="DatePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dataChanged"
            >
          </el-date-picker>
        </el-form-item>
        <div></div>
      <el-button type="primary" @click="searCh" class="select-btn">查询</el-button>
      <el-button type="primary" @click="reSet(formParams)">重置</el-button>
      <div class="slot_row"></div>
    </el-form>
        <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="举报账号"
          width="170"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="job_name"
          label="举报职位"
          width="160"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="reason"
          label="举报理由"
          width="160"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="image"
          label="上传图片"
          width="180"
          align="center"
          >
          <template slot-scope="scope">
            <img class="slt" :src="scope.row.image" alt="" />
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="举报说明"
          width="180"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="添加时间"
          width="180"
          align="center"
          >
        <template slot-scope="times">
          <span>{{$moment.unix(times.row.addtime).format('YYYY-MM-DD HH:mm')}}</span>
        </template>
        </el-table-column>
        <!-- <el-table-column
          prop="city"
          label="处理人"
          width="100"
          align="center"
          >
        </el-table-column> -->
        <el-table-column
          label="状态"
          min-width="120"
          align="center"
          >
          <template slot-scope="scope">
            <span :class="deal ? 'green' : 'grey'">{{deal ? '已处理' : '未处理'}}</span>
          </template> 
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button @click="dialogVisible = true" type="text" size="small">查看</el-button>
            <el-button @click="handleStatus(scope.row,scope.$index)" type="text" size="small" :disabled="disabled && activeIndex==scope.$index">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="举报详情"
        :visible.sync="dialogVisible"
        width="40%"
        >
        <ul>
          <li class="marginb"><span>举报账号：&ensp;&ensp;</span><span>{{reportlist.user}}</span></li>
          <li class="marginb"><span>手机号码：&ensp;&ensp;</span><span>{{reportlist.phone}}</span></li>
          <li class="marginb"><span>举报原因：&ensp;&ensp;</span><span>{{reportlist.reason}}</span></li>
          <li class="marginb"><span>举报日期：&ensp;&ensp;</span><span>{{$moment.unix(reportlist.date).format('YYYY-MM-DD HH:mm')}}</span></li>
          <li class="marginb"><span>&ensp;&ensp;处理人：&ensp;&ensp;</span><span>{{reportlist.deal_per}}</span></li>
          <li class="marginb">
            <span>处理结果：&ensp;&ensp;</span>
            <!-- <span>{{reportlist.deal_result}}</span> -->
            <el-input class="deal-result" type="textarea" v-model="reportlist.deal_result"></el-input>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="处理结果"
        :visible.sync="dialogVisibleDeal"
        width="40%"
        >
          <el-input type="textarea" v-model="reportlist.deal_result"></el-input>
        </el-form>
         <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleDeal = false">取 消</el-button>
          <el-button type="primary" @click="dealSure">确 定</el-button>
        </span>
      </el-dialog>
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
    <!-- <followUpRecord :dialogTableVisible="dialogTableVisible" :trackList="trackLists" @handleClose="handleClose" @submitRecord="submitRecord"></followUpRecord> -->
  </div>
</template>
<script>
  import { reportList, gainReportInfo, feedbackReportInfo } from '../api/accuse'
  import { getConstant } from '../api/dictionary'

  // import cvLook  from './cvLook'
  // import followUpRecord from './followUpRecord'
  export default {
    // components: {
    //   cvLook,
    //   followUpRecord
    // },
    data () {
      return {
        dialogVisible: false,
        dialogVisibleDeal: false,
        deal: false,
        tableData: [
        //   {
        //   id: 0,
        //   date: '2016-05-02',
        //   name: '王小虎',
        //   address: '上海市普陀区金沙江路 1518 弄',
        // }, {
        //   id: 1,
        //   date: '2016-05-04',
        //   name: 'da虎',
        //   address: '上海市普陀区金沙江路 1518 弄',
        // }, {
        //   id: 2,
        //   date: '2016-05-01',
        //   name: '王3虎',
        //   address: '上海市普陀区金沙江路 1518 弄',
        // }
      ],
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
          name: '',
          reason: '',
          status: '',
          static: '',
          beginTime: '',
          endTime: '',
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
      let paramss = 'reason_type'
      this.getTypes(paramss)
      // console.log(asdf,'asdf')
      // console.log(teamAdministrationResume,'teamAdministrationResume')
    },
    methods: {
      getTypes (filed) {
        getConstant({ filed }).then(res => {
          console.log(res.data.adv_type,'res')
          // const adv_type = res.data.adv_type
          // this.adList.type = adv_type
          // console.log(this.addParams.type,'this.addParams.type')
          // typeObj[type.row.type]
          let typeObj = res.data.adv_type
          this.adType = res.data.adv_type
          var arr = []
          for (let i in typeObj) {
              let o = {
                label:  typeObj[i],
                value: Number(i)
              };
              arr.push(o)
          }
         
          // for(let i in typeObj) {
          //   if(i==)
          //   console.log(typeObj[i]);
          // }
          this.adTypeList = arr
          console.log(this.adTypeList);
        })
      },
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
        console.log(q,2222222222)
        this.trackLists = q
      },
      changeInput (e) {
        this.formParams[this.type] = e
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
        reportList(formParams).then(res => {
            console.log(res,'res-before')
            const { data } = res
            console.log(data,'data')
            this.tableData = data.data
            // this.tableData = res.data.data || [];
            // for(let i = 0; i < res.data.data.length; i++){
            //   this.tableData = res.data.data[i]
            // }
            this.total = res.data.count
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
      }
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
  .slt{
    width: 90px;
    height: 26px;
    border-radius: 6px;
  }
  .slt:hover{
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
  .deal-result{
    width: 200px;
  }

</style>
  