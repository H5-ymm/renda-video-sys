<template>
  <div class="view-box-list">
    <div
      class="view-box-card"
      :class="{'view-box-card-active': index==activeIndex}"
      v-for="(item,index) in list"
      :key="index"
    >
      <section class="view-card-row x-flex-start" @click="selectComment(index,item)">
        <span class="top" v-if="!item.is_top">
          <span>置顶</span>
        </span>
        <div class="view-card-col1">
          <img src="../../assets/img/img1.png" alt />
        </div>
        <div class="view-card-col2">
          <p>{{item.title}}</p>
          <p>
            发布者：
            <span class="nick-name">{{item.user_name}}</span>
          </p>
          <p class="time">更新时间：{{item.addtime}}</p>
        </div>
        <div class="view-card-col3">
          <el-button round size="mini">{{item.type | sortType(item.type)}}</el-button>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import { commentSort } from '../../base/base'
export default {
  filters: {
    sortType (val) {
      let obj = commentSort.find(item => {
        return val == item.value
      })
      return obj.label
    }
  },
  name: 'card',
  props: ['list'],
  data () {
    return {
      activeIndex: 0,
      commentSort
    }
  },
  methods: {
    selectComment (index, item) {
      this.activeIndex = index
      this.$emit('selectComment', item.id)
    }
  }
}
</script>
<style>
  .view-box-list {
    background: #fff;
    width: 540px;
    height: 774px;
    margin-top: 10px;
  }
  .view-box-list .view-box-card {
    padding: 0 24px;
  }
  .view-box-list .view-box-card-active {
    background: #DCEEFE;
  }
  .view-card-row {
    width: 100%;
    height: 130px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    position: relative;
    /* overflow: hidden; */
  }
  .top {
    position: absolute;
    top:-2px;
    left: -58px;
    border-bottom: 30px solid red; 
    border-left: 30px solid transparent;            
    border-right: 30px solid transparent;            
    width: 30px;
    transform: rotate(-45deg) scale(0.6);
    color:#fff;
    font-size: 14px;
  }
  .top span {
    position: absolute;
    top: 6px;
  }
  .view-card-col1 {
    width: 20%;
  }
  .view-card-col1 img {
    width: 88px;
    height: 88px;
    border-radius: 100%;
  }
  .view-card-col2 {
    width: 60%;
    line-height: 32px;
    font-size:14px;
  }
  .view-card-col3 {
    flex: 1;
    text-align: right;
  }
  .view-card-col2 .time {
    font-size:12px;
    color: #999999;
  }
  .view-card-col2 .nick-name{
    color: #1890FF;
  }
  .view-card-col1 {
    width: 20%;
  }
</style>