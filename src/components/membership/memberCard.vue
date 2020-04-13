<template>
  <div class="member-card">
    <el-button type="text">发单</el-button>
    <el-row :gutter="20" class="team-info-row">
      <el-col :span="6" v-for="(item,key) in userLabel" :key="key">
        <el-card class="box-card" :class="'name'+key">
          <p>{{item}}</p>
          <p>{{list[key-1]}}</p>
          <!-- <img src="../../assets/img/cardBg1.png" alt class="cardBg" v-if="key=='name'" />
        <img src="../../assets/img/cardBg2.png" alt class="cardBg" v-if="key=='number'" />
        <img src="../../assets/img/cardBg3.png" alt class="cardBg" v-if="key=='total'&&!userType" />
        <img
          src="../../assets/img/cardBg4.png"
          alt
          class="cardBg"
          v-if="key=='jobStatus'&&!userType"
        />
        <img src="../../assets/img/cardBg5.png" alt class="cardBg" v-if="key=='total'&&userType" />
        <img
          src="../../assets/img/cardBg6.png"
          alt
          class="cardBg"
          v-if="key=='jobStatus'&&userType"
          />-->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCount } from '../../api/orderTarking'
export default {
  props: ['userType', 'userInfo'],
  data () {
    return {
      userLabel1: {
        1: '',
        2: '',
        3: '',
        4: ''
      },
      list: []
    }
  },
  computed: {
    userLabel () {
      let obj = {}
      obj = {
        1: '发单总数',
        2: '今日发单',
        3: '待审核',
        4: '招聘中'
      }
      return obj
    }
  },
  created () {
    this.getNumber()
  },
  methods: {
    getNumber () {
      let type
      for (let i = 1; i < 5; i++) {
        if (i == 4) {
          type = 'all'
        }
        else {
          type = i
        }
        getCount({ type }).then(res => {
          this.list.push(res.data)
        })
        console.log(this.list)
      }
    }
  }
}
</script>
<style lang="scss">
  .member-card {
    margin: 0 16px;
  }
  .cardBg {
    position: absolute;
    bottom: 0;
    right: 0;
    max-width: 126px;
  }
  .box-card {
    box-shadow:2px 5px 17px 0px rgba(51,51,51,0.2);
    border-radius:5px;
    height: 126px;
    padding-left: 20px;
    padding-top: 10px;
    position: relative;
    &.el-card{
      color: #fff;
    }
    &.name1 {
      background:linear-gradient(150deg,#7F80FE,#729EFE);
    }
    &.name2 {
      background:linear-gradient(117deg,rgba(255,110,115,1),rgba(255,116,145,1));
    }
    &.name3 {
      background:linear-gradient(117deg,rgba(255,146,100,1),rgba(255,176,100,1));
    }
    &.name4 {
      background:linear-gradient(117deg,rgba(166,91,251,1),rgba(189,94,255,1));
    }
  }
</style>