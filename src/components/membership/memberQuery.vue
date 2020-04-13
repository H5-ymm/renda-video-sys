<template>
  <div class="memberForm receiptForm">
    <!-- 添加标签 -->
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item label="搜索类型：">
        <div class="x-flex-start">
          <el-select v-model="value" placeholder="请选择" class="width120">
            <el-option label="企业名称" value="com_name"></el-option>
            <el-option label="职位名称" value="job_name"></el-option>
          </el-select>
          <el-input
            v-model="keyword"
            class="keyword"
            @change="changeInput"
            placeholder="请输入你要搜索的关键字"
          ></el-input>
          <div>
            <el-button type="primary" @click="onSubmit" class="select-btn">搜索</el-button>
            <el-button type="primary" @click="show=!show" class="collapse-btn">{{show?'收起':'展开'}}</el-button>
          </div>
        </div>
      </el-form-item>
      <el-collapse-transition>
        <div v-show="show">
          <el-form-item label="发布时间:">
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
              v-for="(item,index) in moneyTypeList"
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
          </el-form-item>
        </div>
      </el-collapse-transition>
    </el-form>
  </div>
</template>
<script>
import { moneyTypeList, rewardTypeList } from '@/base/base'
export default {
  data () {
    return {
      form: {
        ctime: 0,
        status: 0,
        com_name: '',
        job_name: '',
        offermoney_type: 0,
        reward_type: 0,
        job_status: 0
      },
      show: true,
      timeList: [
        { label: '全部', value: 0 },
        { label: '今天', value: 1 },
        { label: '最近三天', value: 2 },
        { label: '最近七天', value: 3 },
        { label: '最近半月', value: 4 },
        { label: '最近一个月', value: 5 }
      ],
      moneyTypeList,
      rewardTypeList,
      advertisesType: [
        { label: '全部', value: 0 },
        { label: '招聘中', value: 1 },
        { label: '已下架', value: 2 }
      ],
      statusList: [
        { label: '全部', value: 0 },
        { label: '待审核', value: 1 },
        { label: '已通过', value: 2 },
        { label: '未通过', value: 3 },
        { label: '已下架', value: 4 }
      ],
      value: 'com_name',
      keyword: ''
    }
  },
  watch: {
    keyword(v){
      if(v){
        this.form['ctime'] = 0
        this.form['offermoney_type'] = 0
        this.form['reward_type'] = 0
        this.form['status'] = 0
        this.form['job_status'] = 0
      }
    }
  },
  methods: {
    changeInput (e) {
      this.form[this.value] = e
    },
    onSubmit () {
      let params = {}
      for (let key in this.form) {
        if (this.form[key]) {
          params[key] = this.form[key]
        }
      }
      this.$emit('onSubmit', params)
    },
    selectQuery (key, item) {
      console.log(key,'key')
        console.log(item,'item')      // this.form[key] = item.value
      if(key == 'ctime'){
        this.form['offermoney_type'] = 0
        this.form['status'] = 0
        this.form['job_status'] = 0
        this.form['reward_type'] = 0
      }else if(key == 'offermoney_type'){
        this.form['status'] = 0
        this.form['ctime'] = 0
        this.form['job_status'] = 0
        this.form['reward_type'] = 0
      }else if(key == 'status'){
        this.form['job_status'] = 0
        this.form['offermoney_type'] = 0
        this.form['login_data'] = 0
        this.form['reward_type'] = 0
      }else if(key == 'reward_type'){
        this.form['status'] = 0
        this.form['offermoney_type'] = 0
        this.form['job_status'] = 0
        this.form['ctime'] = 0
      }else{
        this.form['ctime'] = 0
        this.form['offermoney_type'] = 0
        this.form['reward_type'] = 0
        this.form['status'] = 0
      }
      this.keyword='';
      this.form[this.value] ='';
      this.form[key] = item.value
      // this.getList(this.form)
      this.$emit('selectQuery', this.form)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/css/table-list';
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
