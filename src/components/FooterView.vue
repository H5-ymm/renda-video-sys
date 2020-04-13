<template>
  <el-footer height="320px" class="footer">
    <section class="home-main-section home-main-section-footer">
      <el-row :gutter="20" class="footer-main" type="flex" justify="start">
        <el-col :span="4">
          <ul class="home-footer-box">
            <li class="home-footer-title">企业服务</li>
            <li>公司搜索</li>
            <li>职位搜索</li>
            <li>新闻咨讯</li>
          </ul>
        </el-col>
        <el-col :span="10">
          <ul class="home-footer-box">
            <li class="home-footer-title">联系方式</li>
            <li>仁达网络科技(上海)有限公司</li>
            <li>公司地址：上海市浦东新区金海路2588号1幢A区310室</li>
            <li>服务热线：021-51991869（9:00-18:00)</li>
            <li>违法和不良信息举报邮箱：</li>
          </ul>
        </el-col>
        <el-col :span="8" :offset="8">
          <ul class="home-footer-box home-footer-box1">
            <li class="home-footer-title">微信公众号</li>
            <li>
              <img src="../assets/img/qrcode.png" class="home-footer-img" />
            </li>
          </ul>
        </el-col>
      </el-row>
    </section>
  </el-footer>
</template>
<script>
export default {
  data() {
    return {
      informationList: [{
        imgUrl: require('../assets/img/img1.png'),
        title: '当代职场人：7成人入职不满3年就跳槽',
        content: '近日，前程无忧最新发布的“2019年第四季度求职者跳槽意愿度调查”结果显示：2019年第四季度有明确跳槽意愿的受访者占35.2%，和上个季度比没有太大变化。进入2019年的尾声，大部分职场人本着“拿完年'
      },
      {
        imgUrl: require('../assets/img/img2.png'),
        title: '大多数90后离职和薪资有关，面试能说吗？',
        content: '你是不是也听到过这样的言论，比如“90后太难管了，说两句就要离职”、“现在的90后离职率比80后高多了”……所以，这些宁愿折损“名声”也要离职的90后到底都经历了什么？'
      }]
    }
  }
}
</script>
