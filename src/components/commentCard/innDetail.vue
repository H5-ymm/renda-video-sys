<template>
  <!-- class="inn-Detail" -->
  <div>
    <!-- class="table-list" -->
    <div class="whiteBGC">
      <h3 class="border-bottom ">团队信息</h3>
      <el-row :gutter="20">
        <el-col :span="24">&ensp;&ensp;团队名称：{{inList.team_name}}</el-col>
        <el-col :span="24">&ensp;&ensp;团队负责人：{{inList.user_name}}</el-col>
      </el-row>
      <h3 class="border-bottom ">岗位信息</h3>
      <el-row>
        <el-col :span="24">&ensp;&ensp;岗位名称：{{inList.job_name}}</el-col>
        <el-col :span="24">&ensp;&ensp;用工企业名称：{{inList.company_name}}</el-col>
        <el-col :span="24">&ensp;&ensp;招聘人数：{{inList.number}}</el-col>
        <el-col :span="24">&ensp;&ensp;招工截止日期：{{$moment.unix(inList.utime).format('YYYY-MM-DD HH :mm')}}</el-col>
      </el-row>
      <h3 class="border-bottom ">薪资说明</h3>
      <el-row>
        <el-col :span="24">&ensp;&ensp;薪资类型：{{inList.offermoney_type==1?'月薪':inList.offermoney_type==2?'日薪':'时薪'}}</el-col>
        <el-col :span="24" v-if="inList.offermoney_type==1">&ensp;&ensp;薪资金额：{{inList.money_min }} - {{inList.money_max}}</el-col>
        <el-col :span="24" v-else>&ensp;&ensp;薪资金额：{{inList.money}}</el-col>
        <el-col :span="24" v-if="inList.welfare_statement">&ensp;&ensp;福利说明：{{inList.welfare_statement}}</el-col>
      </el-row>
      <h3 class="border-bottom ">岗位说明：</h3>
      <el-row>
        <el-col :span="24" v-if="inList.address">&ensp;&ensp;上班地址：{{inList.address}}</el-col>
        <el-col :span="24" v-if="inList.working_hours">&ensp;&ensp;上班时长：{{inList.working_hours}}</el-col>
        <el-col :span="24" v-if="inList.entry_requirements">&ensp;&ensp;入职条件：{{inList.entry_requirements}}</el-col>
        <el-col :span="24" v-if="inList.introduction">&ensp;&ensp;工作内容：{{inList.introduction}}</el-col>
      </el-row>
      <h3 class="border-bottom ">其他说明</h3>
      <el-row>
        <el-col :span="24">&ensp;&ensp;性别要求：{{inList.sex==1?'男':inList.sex==2?'女':'男女不限'}}</el-col>
        <el-col :span="24" v-if="inList.working_hours">&ensp;&ensp;年龄要求：{{inList.age_min}} ~ {{inList.age_max}}</el-col>
        <el-col :span="24" v-if="inList.entry_requirements">&ensp;&ensp;缴纳五险：{{!inList.five_risks?'否':inList.five_risks==1?'是':'试用期后'}}</el-col>
        <el-col :span="24" v-if="inList.entry_requirements">&ensp;&ensp;缴纳公积金：{{!inList.five_risks?'否':inList.five_risks==1?'是':'试用期后'}}</el-col>
        <el-col :span="24">&ensp;&ensp;企业介绍：{{inList.com_introduction}}</el-col>
      </el-row>
      <h3 class="border-bottom ">返利规则</h3>
      <el-row :gutter="20">
        <el-col :span="24">&ensp;&ensp;招聘类型：{{inList.type==1?'返利招聘':'普通招聘'}}</el-col>
        <el-col :span="24" v-if="inList.type==2">&ensp;&ensp;返利模式：
          <span v-if="inList.reward_type==1">
            <span>{{inList.reward_money}}元/人/{{rewardType()}}</span>
            -
            <span>次月{{inList.settlement_time}}号结算</span>
            -
            <span v-if="inList.reward_money_type==1">长期返利</span>
            <span v-if="inList.reward_money_type==2&&inList.duration_time">持续返利{{inList.duration_time}}个月</span>
            <span v-if="inList.reward_money_type==2&&!inList.duration_time">一{{inList.reward_money_type==1?'天':inList.reward_money_type==2?'周': '个月'}}</span>
          </span>
          <span v-if="inList.reward_type!=1&&inList.reward_type!=4">
            <span>{{inList.reward_money}}元/人/{{rewardType()}}</span>
            -
            <span v-if="inList.reward_money_type!=1">{{inList.settlement_type==1?'本':'次'}}{{rewaryMoneType()}}{{inList.settlement_time?inList.settlement_time:'第一天'}}结算</span>
            <span v-else>{{inList.settlement_type==1?'当日':'次日'}}结算</span>
            -
            <span v-if="inList.duration_time">{{inList.duration_time}}{{rewaryMoneType()}}</span>
            <span v-else>一{{rewaryMoneType()}}</span>
            <span v-if="inList.reward_needtime">需入职满 {{inList.reward_needtime}}{{rewaryMoneType()}}</span>
            <span v-else>需入职满 一天</span>
          </span>
          <span v-if="inList.reward_type==4">
            <span>{{inList.reward_money}}元/人/一次性</span>
            -
            <span v-if="inList.reward_money_type==2&&!inList.duration_time">需入职满 {{inList.reward_needtime}}</span>
          </span>
        </el-col>
      </el-row>
      <h3 class="border-bottom ">运营信息</h3>
      <el-row :gutter="20">
        <el-col :span="24">&ensp;&ensp;岗位类型：{{getJobType(inList.job_type)}}</el-col>
        <el-col :span="24" v-if="inList.source">&ensp;&ensp;岗位来源：{{inList.source}}</el-col>
        <el-col :span="24" v-if="inList.link_man">&ensp;&ensp;合作商务姓名：{{inList.link_man}}</el-col>
        <el-col :span="24" v-if="inList.link_tel">&ensp;&ensp;合作商务电话：{{inList.link_tel}}</el-col>
        <el-col :span="24" v-if="inList.meeting_time">&ensp;&ensp;面试时间：{{$moment.unix(inList.meeting_time).format('YYYY-MM-DD HH :mm')}}</el-col>
        <el-col :span="24" v-if="inList.address">&ensp;&ensp;面试地址：{{inList.address}}</el-col>
        <el-col :span="24" v-if="inList.work_man">&ensp;&ensp;发单负责人：{{inList.work_man}}</el-col>
        <el-col :span="24" v-if="inList.work_tel">&ensp;&ensp;负责人电话：{{inList.work_tel}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          &ensp;&ensp;创建日期：{{$moment.unix(inList.ctime).format('YYYY-MM-DD HH:mm')}}
          <!-- 创建日期: {{getTime(inList.ctime)}} -->
        </el-col>
      </el-row>
      <div style="margin: 30px 0;"></div>
      <el-button plain @click="closeMe">关闭</el-button>
    </div>
  </div>
</template>
<script>
import { commentSort } from '../../base/base'
import { seeTeamJobInfo } from '../../api/comment'
export default {
  data () {
    return {
      uid: localStorage.getItem('sys_uid'),
      username: localStorage.getItem('username'),
      inList: {},//发单列表
      id: '',
      jobType: [
        { label: '普通岗位', value: 0 },
        { label: '精选岗位', value: 1 },
        { label: '高新返利', value: 2 },
        { label: '企业急招', value: 3 }
      ]
    }
  },
  created () {
    this.id = this.$route.query.id
    console.log(this.$route.query)
    this.getDetail()
  },
  methods: {
    rewardType () {
      let text = ''
      if (this.inList.reward_type == 1) {
        text = '月'
      }
      if (this.inList.reward_type == 2) {
        text = '日'
      }
      if (this.inList.reward_type == 3) {
        text = '时'
      }
      return text
    },
    rewaryMoneType () {
      let text
      if (this.inList.reward_money_type == 1) {
        text = '天'
      }
      if (this.inList.reward_money_type == 2) {
        text = '周'
      }
      if (this.inList.reward_money_type == 3) {
        text = '个月'
      }
      return text
    },
    //获取详情
    getJobType (val) {
      let obj = this.jobType.find(item => {
        console.log(item.value)
        return val == item.value
      })
      return obj ? obj.label : ''
    },
    getDetail () {
      let params = {
        uid: this.uid,
        id: this.id
      }
      seeTeamJobInfo(params).then(res => {
        this.inList = res.data
      })
    },
    closeMe () {
      this.$router.go(-1)
    },
  }
}
</script>
<style scoped lang="scss">
 .whiteBGC {
   .el-col {
    margin: 10px 0;
  }
 }
  h3{
    padding: 15px 0;
    font-family:'Alibaba-PuHuiTi-Bold';
    font-weight: bold !important;
    font-size: large;
  }
  .border-bottom {
    border-bottom: 1px solid #eee;
  }
  .row-bg {
    padding: 50px 0;
    background-color: #f9fafc;
  }
  .whiteBGC{
    background: #fff;
    border-radius:5px;
    padding: 15px;
  }
</style>