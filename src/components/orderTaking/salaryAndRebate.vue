<template>
  <div class="salary-rebate">
    <el-form-item label="员工薪资" required>
      <div class="x-flex-start">
        <el-select v-model="orderTakingForm.money_type" class="width160" placeholder="请选择">
          <el-option
            :label="item.label"
            :value="item.value"
            v-show="index"
            v-for="(item,index) in moneyTypeList"
            :key="item.label"
          ></el-option>
        </el-select>
        <el-select
          v-model="orderTakingForm.money"
          v-if="orderTakingForm.money_type==1"
          class="width160"
          placeholder="请选择"
        >
          <el-option :label="item" :value="key" v-for="(item,key) in moneyList" :key="key"></el-option>
        </el-select>
        <el-input
          placeholder="请输入薪资"
          v-if="orderTakingForm.money_type&&orderTakingForm.money_type!=1"
          class="width160 text-input"
          v-model="orderTakingForm.money"
        >
          <template slot="append">
            <span class="moneyType" v-if="orderTakingForm.money_type==2">元/人/日</span>
            <span class="moneyType" v-if="orderTakingForm.money_type==3">元/人/时</span>
          </template>
        </el-input>
      </div>
    </el-form-item>
    <el-form-item label="返利模式" class="reward_type" required>
      <div class="x-flex-start width700">
        <el-select
          v-model="orderTakingForm.reward_type"
          value-key="label"
          class="width160"
          placeholder="请选择"
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in rewardTypeList"
            :key="item.value"
          ></el-option>
        </el-select>
        <div v-if="orderTakingForm.reward_type">
          <el-input
            placeholder="请输入金额"
            v-if="orderTakingForm.reward_type==1"
            class="width160 text-input"
            v-model="orderTakingForm.reward_money"
          >
            <template slot="append">
              <span class="moneyType">元/人/月</span>
            </template>
          </el-input>
          <div v-else-if="orderTakingForm.reward_type==4">
            <el-input placeholder="请输入" class="width160 text-input" v-model="orderTakingForm.money">
              <template slot="prepend">
                <span class="moneyType">返利总金额</span>
              </template>
            </el-input>
            <el-input placeholder="请输入" class="width160 text-input" v-model="orderTakingForm.money">
              <template slot="prepend">
                <span class="moneyType">需入职满</span>
              </template>
              <template slot="append">
                <span class="moneyType">天</span>
              </template>
            </el-input>
          </div>
          <el-select
            v-model="orderTakingForm.reward_money_type"
            v-else
            class="width160"
            value-key="label"
            placeholder="请选择"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in payTypeList"
              :key="item.label"
            ></el-option>
          </el-select>
        </div>
      </div>
      <span class="error el-icon-warning">入职天数为0时，代表入职当天返利</span>
    </el-form-item>
    <el-form-item class="reward_type">
      <div
        class="x-flex-start width500"
        v-if="orderTakingForm.reward_type==1&&orderTakingForm.reward_money_type==3"
      >
        <el-input placeholder="请输入" class="width160 text-input" v-model="orderTakingForm.money">
          <template slot="prepend">
            <span class="moneyType">次月</span>
          </template>
          <template slot="append">
            <span class="moneyType">号结算</span>
          </template>
        </el-input>
        <el-select
          v-model="orderTakingForm.reward_money_type"
          @blur="blurInput"
          @change="changePayType"
          class="width160"
          placeholder="结算类型"
        >
          <el-option label="长期返利" :value="1"></el-option>
          <div class="width160" ref="reward" :value="2">
            <el-input
              placeholder="请输入"
              class="text-input"
              v-model="orderTakingForm.settlement_time"
              @change="changeInput"
            >
              <template slot="prepend">
                <span class="moneyType">持续返利</span>
              </template>
              <template slot="append">
                <span class="moneyType">月</span>
              </template>
            </el-input>
          </div>
        </el-select>
      </div>
      <div
        class="x-flex-start width700"
        v-if="orderTakingForm.reward_type!=1&&orderTakingForm.reward_type!=4"
      >
        <el-input
          placeholder="请输入"
          class="width160 text-input"
          v-model="orderTakingForm.money"
          v-if="orderTakingForm.reward_money_type"
        >
          <template slot="append">
            <span class="moneyType">元/人/{{rewardType}}</span>
          </template>
        </el-input>
        <el-select
          v-model="orderTakingForm.reward_pay_type"
          class="width160"
          placeholder="结算类型"
          v-if="orderTakingForm.reward_money_type"
        >
          <el-option :label="`次${rewardType}结算`" :value="1"></el-option>
          <el-option :label="`本${rewardType}结算`" :value="2"></el-option>
        </el-select>
        <el-select
          v-model="orderTakingForm.reward_money_type_value"
          v-if="orderTakingForm.reward_pay_type&&orderTakingForm.reward_money_type==2"
          class="width160"
          placeholder="请选择"
        >
          <el-option
            :label="`${payType}${item.label}`"
            :value="item.value"
            v-for="item in weekList"
            :key="item.label"
          ></el-option>
        </el-select>
      </div>
    </el-form-item>
    <el-form-item
      class="reward_type"
      v-if="(orderTakingForm.reward_type==2||orderTakingForm.reward_type==3)&&orderTakingForm.reward_money_type"
    >
      <div class="x-flex-start-justify width500">
        <el-input
          placeholder="请输入"
          @focus="focusInput"
          class="width160 text-input"
          v-model="orderTakingForm.money"
        >
          <template slot="prepend">
            <span class="moneyType">持续</span>
          </template>
          <template slot="append">
            <span class="moneyType">{{rewardType}}</span>
          </template>
        </el-input>
        <el-input
          placeholder="请输入"
          class="width160 text-input"
          @focus="focusInput"
          v-model="orderTakingForm.money"
        >
          <template slot="prepend">
            <span class="moneyType">需入职满</span>
          </template>
          <template slot="append">
            <span class="moneyType">{{rewardType}}</span>
          </template>
        </el-input>
      </div>
      <div class="error reward-error" v-if="rewardTipShow">
        <div class="x-flex-start-justify">
          <i class="el-icon-warning"></i>
          <ul>
            <li>1.此项为选填项</li>
            <li>2.持续天数为空时，默认为1{{rewardType}}</li>
            <li>3.入职时间为空是，默认工作1{{rewardType}}返利1{{rewardType}}</li>
          </ul>
        </div>
      </div>
    </el-form-item>
  </div>
</template>
<script>
import { moneyTypeList, rewardTypeList, payTypeList, weekList } from '../../base/base'
export default {
  props: ['moneyList', 'form'],
  data () {
    return {
      orderTakingForm: {},
      comTypeList: [],
      moneyTypeList,
      rewardTypeList,
      payTypeList,
      weekList,
      reward_money_type: '',
      rewardTipShow: false,
      reward_type: 0
    }
  },
  computed: {
    payType () {
      return this.orderTakingForm.reward_pay_type == 1 ? '次' : '本'
    },
    rewardType () {
      console.log(this.orderTakingForm.reward_money_type)
      return this.orderTakingForm.reward_money_type == 1 ? '日' : this.orderTakingForm.reward_money_type == 2 ? '周' : '月'
    }
  },
  watch: {
    form (val) {
      if (val) {
        this.orderTakingForm = val
      }
    }
  },
  methods: {
    getTypeFlag () {

    },
    focusInput () {
      this.rewardTipShow = true
    },
    changePayType (val) {
      console.log(val)
    },
    blurInput ($event) {
      return false
    },
    changeInput (val) {
      if (val) {
        this.orderTakingForm.reward_money_type = `持续返利` + val + `月`
        this.blurInput()
      }
    }
  }
}
</script>
<style lang="scss">
  .salary-rebate {
    padding-bottom: 20px;
    .width500 {
      width: 500px;
    }
    .width700 {
      width: 700px;
    }
    .width110 {
      width: 110px;
      margin: 0 20px;
    }
    .reward_type {
      margin-bottom: 10px;
    }
    .error {
      top: -16px;
      &.reward-error {
        width: 300px;
        left: 360px;
        top: -10px;
        ul {
          margin-left:5px;
          font-size:12px;
          line-height: 20px;
        }
      }
    }
  }
  .width160 {
    width: 160px!important;
    margin-right: 30px;
    &.el-select  {
      >.el-input{
        width: 160px!important;
      }
    }
    .moneyType {
      color: #333;
    }
    .el-input-group__append,.el-input-group__prepend {   
      border:none;
      border-radius: 0;
      background: none;
      padding: 0;
      background-color:none;
    }
  }
  .text-input {
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid #eee;
    height: 38px;
    .el-input__inner {
      padding: 0 ;
      height: 37px!important;
      line-height: 37px!important;
      text-align: center;
      border: none!important;
    }
  }
  .el-scrollbar__wrap {
    // width: 180px;
    .text-input {
      overflow: hidden;
      border: none;
      padding: 0 0 0 20px;
    }
  }
</style>