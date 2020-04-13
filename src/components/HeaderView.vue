<template>
  <div class="orderTaking-header">
    <div class="x-flex-between">
      <span class="header-left">人事达</span>
      <ul class="nav">
        <li
          v-for="(item, index) in menus"
          class="nav-item"
          :key="index"
          @click="switchNav(item, index)"
          :class="{'active': activeIndex==index}"
        >
          {{item.title}}
          <span class="line" v-if="activeIndex==index"></span>
        </li>
      </ul>
    </div>
    <div class="bg-purple-light x-flex-between">
      <span class="home-purple-left">
        <i class="el-icon-user-solid"></i>
        <a class="welcome">登录</a>
        <a class="divider">|</a>
        <a class="welcome">注册</a>
      </span>
      <a class="el-icon-phone-outline">021-51991869</a>
    </div>
  </div>
</template>
<script>
export default {
  name:'',
  data() {
    return {
       activeIndex: 1,
       menus: [
        {
          title: '首页',
          url: 'home'
        },
        {
          title: '接单',
          url: 'orderTaking'
        },
        {
          title: '拼团',
          url: ''
        },
        {
          title: '资讯',
          url: ''
        }
      ]
    }
  },
  methods:{
    switchNav (item, index) {
      this.activeIndex = index
      this.$router.push(item.url)
    }
  }
}
</script>
