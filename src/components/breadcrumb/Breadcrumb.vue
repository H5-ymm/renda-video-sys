<template>
  <div class="breadcrumb">
    <el-row>
      <el-col :span="24" class="breadcrumb-bre">
        <div class="bg-purple-dark">
          <el-breadcrumb class="breadcrumb-bre-li">
            <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :key="index">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  // props: ['breadcrumbs'],
  data () {
    return {
      breadcrumbs: ['论坛列表']
    }
  },
  watch: {
    $route (to, from) {
      this.breadcrumbs = JSON.parse(sessionStorage.getItem('menus'))
      // console.log(to.path);
    }
  }
  // created() {
  //   this.breadcrumbs = JSON.parse(sessionStorage.getItem('menus'))
  // }
}
</script>
<style lang="scss">
.breadcrumb{
  overflow: hidden;
  background: #fff;
  width: 100%;
  height: 36px;
  padding: 0 20px;
  border:1px solid #eee;
  .breadcrumb-bre{
    height: 36px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .breadcrumb-bre-li{
    line-height: 36px;
  }
}
</style>
