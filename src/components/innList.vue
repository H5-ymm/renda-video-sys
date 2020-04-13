<template>
  <div class="innlist">
    <div class="tables-box">
      <div class="table-list">
        <el-form :model="formParams" class="demo-form-inline">
          <el-form-item label="搜索类型:">
            <div class="x-flex-start search-query">
              <el-select v-model="type" class="width100">
                <el-option label="团队名称" value="1"></el-option>
                <el-option label="企业名称" value="2"></el-option>
                <el-option label="岗位名称" value="3"></el-option>
              </el-select>
              <el-input class="query-input" v-model="keyword" @change="changeInput" placeholder="请输入关键词"></el-input>
              <el-button type="primary" @click="searCh" class="select-btn">搜索</el-button>
              <el-button type="primary" @click="show=!show" class="collapse-btn">{{show?'收起':'展开'}}</el-button>
            </div>
          </el-form-item>
          <el-collapse-transition>
            <div v-show="show">

              <el-form-item label="发布时间：">
                <el-link :underline="false" :class="{'active': formParams.fb_time == item.value}" @click="selectQuery('fb_time',item)" v-for="(item,index) in timeList" :key="index">{{item.label}}</el-link>
              </el-form-item>

              <el-form-item label="上架状态：">
                <el-link :underline="false" :class="{'active': formParams.jobStatus == item.value}" @click="selectQuery('jobStatus',item)" v-for="(item,index) in jobStatusList" :key="index">{{item.label}}</el-link>
              </el-form-item>

              <el-form-item label="岗位类型：">
                <el-link :underline="false" :class="{'active': formParams.jobType == item.value}" @click="selectQuery('jobType',item)" v-for="(item,index) in jobType" :key="index">{{item.label}}</el-link>
              </el-form-item>

              <el-form-item label="返利模式：">
                <el-link :underline="false" :class="{'active': formParams.reward_type == item.value}" @click="selectQuery('reward_type',item)" v-for="(item,index) in rewardType" :key="index">{{item.label}}</el-link>
              </el-form-item>

              <el-form-item label="薪资类型：">
                <el-link :underline="false" :class="{'active': formParams.money_type == item.value}" @click="selectQuery('money_type',item)" v-for="(item,index) in moneyType" :key="index">{{item.label}}</el-link>
              </el-form-item>

              <!-- <el-form-item label="发布时间:">
                <el-link
                  :underline="false"
                  :class="{'active': form.ctime==item.value}"
                  @click="selectQuery('ctime',item)"
                  v-for="(item,index) in timeList"
                  :key="index"
                >{{item.label}}</el-link>
              </el-form-item>
              <el-form-item label="薪资方式:">
                <el-link
                  :underline="false"
                  :class="{'active': form.offermoney_type==item.value}"
                  @click="selectQuery('offermoney_type',item)"
                  v-for="(item,index) in jobStatusList"
                  :key="index"
                >{{item.label}}</el-link>
              </el-form-item>
              <el-form-item label="返利方式:">
                <el-link
                  :underline="false"
                  :class="{'active': form.reward_type==item.value}"
                  @click="selectQuery('reward_type',item)"
                  v-for="(item,index) in rewardTypeList"
                  :key="index"
                >{{item.label}}</el-link>
              </el-form-item>
              <el-form-item label="招聘状态:">
                <el-link
                  :underline="false"
                  :class="{'active': form.job_status==item.value}"
                  @click="selectQuery('job_status',item)"
                  v-for="(item,index) in advertisesType"
                  :key="index"
                >{{item.label}}</el-link>
              </el-form-item>
              <el-form-item label="状态筛选:">
                <el-link
                  :underline="false"
                  :class="{'active': form.status==item.value}"
                  @click="selectQuery('status',item)"
                  v-for="(item,index) in statusList"
                  :key="index"
                >{{item.label}}</el-link>
              </el-form-item> -->
              <!-- </div>
          </el-collapse-transition>

          <!-- <el-form-item>
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title" >
                  <div style="color: #409EFF;width: 100%;" @click="show=!show">
                    高级筛选<i :class="show ? 'header-icon el-icon-arrow-down' : 'header-icon el-icon-arrow-right'"></i> 
                  </div>
                </template>
                <div>
                  <el-form-item label="发布时间：">
                    <el-radio-group v-model="formParams.fb_time" @change="((label)=>{selectQuery(label, 'fb_time')})">
                      <el-radio-button
                        v-for="(item,index) in timeList"
                        :label="item.value"
                        :key="index"
                      >
                      {{item.label}}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div style="margin-top: 20px">
                  <el-form-item label="上架状态：">
                    <el-radio-group v-model="formParams.jobStatus">
                      <el-radio-button
                        v-for="(item,index) in jobStatusList"
                       :label="item.value"
                       :key="index"
                       @click="selectQuery('jobStatus',item)"
                       >{{item.label}}
                       </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div style="margin-top: 20px">
                  <el-form-item label="岗位类型：">
                    <el-radio-group v-model="formParams.jobType">
                      <el-radio-button 
                      v-for="(item, index) in jobType" 
                      :label="item.value"
                      :key="index"
                      @click="selectQuery('jobType',item)"
                      >{{item.label}}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div style="margin-top: 20px">
                  <el-form-item label="返利模式：">
                    <el-radio-group v-model="formParams.reward_type">
                      <el-radio-button 
                      v-for="(item, index) in rewardType"
                      :key="index"
                      :label="item.value"
                      @click="selectQuery('reward_type',item)"
                      >{{item.label}}</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div style="margin-top: 20px">
                  <el-form-item label="薪资类型：">
                    <el-radio-group v-model="formParams.money_type">
                      <el-radio-button 
                      v-for="(item,index) in moneyType"
                      :key="index"
                      :label="item.value"
                      @click="selectQuery('money_type',item)"
                      >
                      {{item.label}}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form-item> -->
            </div>
          </el-collapse-transition>
        </el-form>
        <el-table :data="tableData" ref="tableData" style="width: 100%">
          <el-table-column label="团队名称" prop="team_name" align="center" width="80"></el-table-column>
          <el-table-column label="团队负责人" prop="user_name" align="center" width="200"></el-table-column>
          <el-table-column label="企业名称" prop="company_name" align="center" width="150"></el-table-column>
          <el-table-column label="岗位名称" prop="job_name" align="center" width="150"></el-table-column>
          <el-table-column label="薪资类型" align="center" width="150">
            <template slot-scope="slot">
              <span>{{getMoneyType(slot.row.offermoney_type)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="返利类型" align="center" width="150">
            <template slot-scope="scope">
              <span>{{getRewardType(scope.row.reward_type)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="招聘人数" prop="number" align="center" min-width="200"></el-table-column>
          <el-table-column label="上架状态" prop="state" align="center" min-width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small">
                <i :class="scope.row.is_up==null ? 'el-icon-minus' : scope.row.is_up=='1' ? 'el-icon-circle-check' : 'el-icon-close' "></i>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="创建日期" prop="ctime" align="center" min-width="200">
            <template slot-scope="times">
              <span>{{$moment.unix(times.row.ctime).format('YYYY-MM-DD HH:mm')}}</span>
              <!-- <span>{{getTime(times.row.ctime)}}</span> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button @click="handleDetail(scope.row)" type="text" size="small">查看详情</el-button>
              <el-button @click="handleDel(scope.row)" type="text" v-if="uid==scope.row.uid" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="team-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formParams.page" :page-sizes="[10, 30, 50, 100]" :page-size="formParams.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { internalList } from '../api/innList'
// import { rewardList, moneyTypeList } from '../base/base.js'
export default {
  data () {
    return {
      show: true,
      visible: false,
      tableData: [],
      userType: 1,
      keyword: '',
      type: '1',
      // jobStatus: [
      //   { label: '全部', value: '' },
      //   { label: '今天', value: '1' },
      //   { label: '下架', value: '0' },
      // ],
      // timeList: [
      //   { label: '全部', value: '' },
      //   { label: '今天', value: '1' },
      //   { label: '最近三天', value: '2' },
      //   { label: '最近七天', value: '3' },
      //   { label: '最近半月', value: '4' },
      //   { label: '最近一个月', value: '5' }
      // ],
      timeList: [
        { label: '全部', value: 0 },
        { label: '今天', value: 1 },
        { label: '最近三天', value: 2 },
        { label: '最近七天', value: 3 },
        { label: '最近半月', value: 4 },
        { label: '最近一个月', value: 5 }
      ],
      jobStatusList: [
        { label: '全部', value: 0 },
        { label: '下架', value: 1 },
        { label: '上架', value: 2 },
      ],
      jobType: [
        { label: '全部', value: 0 },
        { label: '精选岗位', value: 1 },
        { label: '高新返利', value: 2 },
        { label: '企业急招', value: 3 },
        { label: '普通', value: 4 },
      ],
      rewardType: [
        { label: '全部', value: 0 },
        { label: '月返', value: 1 },
        { label: '日返', value: 2 },
        { label: '时返', value: 3 },
        { label: '一次性返', value: 4 },
      ],
      moneyType: [
        { label: '全部', value: 0 },
        { label: '月薪', value: 1 },
        { label: '日薪', value: 2 },
        { label: '时薪', value: 3 },
      ],
      formParams: {
        uid: localStorage.getItem('sys_uid'),
        type: '',
        keyword: '',
        // beginTime: '',
        // endTime: '',
        jobStatus: 0,
        jobType: 0,
        fb_time: 0,
        reward_type: 0,
        money_type: 0,
        page: 1,
        limit: 10
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
        { label: '工作日志', value: 4 }
      ]
    }
  },
  watch: {
    keyword (v) {
      if (v) {
        this.formParams['fb_time'] = 0
        this.formParams['jobType'] = 0
        this.formParams['reward_type'] = 0
        this.formParams['money_type'] = 0
        this.formParams['jobStatus'] = 0
      }
    }
  },
  created () {
    console.log(this.formParams, 'this.formParams')
    this.getList(this.formParams);
    // console.log(asdf,'asdf')
    console.log(internalList, 'internalList')
  },
  methods: {
    // selectQuery (val,par) {
    //   this.formParams[par] = val
    //   this.getList(this.formParams)
    // },
    selectQuery (key, item) {
      // this.formParams[key] = item.value
      console.log(key, 'key')
      console.log(item, 'item')
      if (key == 'fb_time') {

        this.formParams['jobType'] = 0
        this.formParams['money_type'] = 0
        this.formParams['jobStatus'] = 0
        this.formParams['reward_type'] = 0

      } else if (key == 'jobType') {

        this.formParams['money_type'] = 0
        this.formParams['fb_time'] = 0
        this.formParams['jobStatus'] = 0
        this.formParams['reward_type'] = 0

      } else if (key == 'money_type') {

        this.formParams['jobStatus'] = 0
        this.formParams['jobType'] = 0
        this.formParams['login_data'] = 0
        this.formParams['reward_type'] = 0

      } else if (key == 'reward_type') {

        this.formParams['money_type'] = 0
        this.formParams['jobType'] = 0
        this.formParams['jobStatus'] = 0
        this.formParams['fb_time'] = 0

      } else {

        this.formParams['fb_time'] = 0
        this.formParams['jobType'] = 0
        this.formParams['reward_type'] = 0
        this.formParams['money_type'] = 0

      }

      this.keyword = '';
      this.formParams[this.type] = '';
      this.formParams[key] = item.value
      this.getList(this.formParams)
      // this.$emit('selectQuery', this.formParams)
    },
    // changeInput (e) {
    //   this.formParams[this.value] = e
    // },
    handleDetail (v) {
      let arr = JSON.parse(sessionStorage.getItem('menus'))
      arr.push('发单详情')
      sessionStorage.setItem('menus', JSON.stringify(arr))
      this.$router.push({ path: 'innDetail', query: { id: v.id } })
      // this.$router.push({ path: 'innDetail', query: { id: v.id, job_name: v.job_name, team_name: v.team_name, user_name: v.user_name } })
    },
    getJobType (val) {
      let obj = this.jobType.find(item => {
        return val == item.value
      })
      if (obj) {
        return obj.label
      }
    },
    getRewardType (val) {
      let obj = this.rewardType.find(item => {
        return val == item.value
      })
      if (obj) {
        return obj.label
      }
    },
    getMoneyType (val) {
      let obj = this.moneyType.find(item => {
        return val == item.value
      })
      if (obj) {
        return obj.label
      }
    },
    changeInput (e) {
      this.formParams[this.type] = e
    },
    searCh () {
      this.formParams.type = this.type;
      this.formParams.keyword = this.keyword;
      // console.log(this.formParams.type,'type');
      // console.log(this.formParams.keyword,'keyworde');
      // console.log(this.tableData,'tableData1')
      this.getList(this.formParams)
      // console.log(this.tableData,'tableData2')
      // internalList(this.formParams).then(res => {
      //   if (res.data.data) {
      //     this.tableData = res.data.data || [];
      //     this.total = res.data.count
      //   }
      //   else {
      //     this.commentInfo = null
      //   }
      // })
      // .catch(error => {
      //   this.$message.error(error.status.remind)
      // })
    },
    handleSizeChange (val) {
      console.log(val, 'val')
      this.formParams.limit = val
      this.getList(this.formParams)
    },
    handleCurrentChange (val) {
      this.formParams.page = val
      this.getList(this.formParams)
    },
    getList (formParams) {
      internalList(formParams).then(res => {
        this.tableData = res.data.data || [];
        this.total = res.data.count
      })
        .catch(error => {
          this.$message.error(error.status.remind)
        })
    },
  }
}
</script>
<style  lang="scss" scoped>
  .el-form-item{
    margin-top: 15px;
  }
  /deep/.el-form-item__content{
    margin: 15px 0t;
  }
  .el-link {
    margin-left: 10px;
    padding: 0 20px;
    &.active {   
      color: #FFF;
      border-radius:4px;
      background-color: #409EFF;
      border-color: #409EFF;
    }
  }
  .active {   
      color: #FFF;
      border-radius:4px;
      background-color: #409EFF;
      border-color: #409EFF;
    }
  .el-icon-circle-check{
    font-size: x-large;
  }
  .team-main{
    height: 100%;
    overflow: auto;
    /* overflow: hidden; */
    background: #F0F2F5;
    padding: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .tables-box{
    height: 100%;
    overflow: auto;
  }
  .tables-box .table-list{
    height: 95%;
    overflow: auto;
  }
  /* .collapse-btn{
    display: inline-block;
  } */
</style>
<style scoped lang="scss">
  @import '../assets/css/table-list';
   .memberForm {
     &.receiptForm {
       .el-form-item{
         display: block;
       }
      }
      .width120 {
        width: 120px;
      }
      .keyword {
        margin: 0 10px;
      }
     .el-input {
        border-radius:3px;
        width: 200px;
     }
     .select-btn {
      border-radius:3px;
     }
   }
  </style>