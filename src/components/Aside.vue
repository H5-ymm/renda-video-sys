<template>
  <div class="hello">
    <!-- 侧边导航栏，需要给 具体 导航的 父级 加 class "acts" 则可以修改高亮状态 -->
    <!-- 关于 三级路由  不匹配侧边栏的问题，需要 对 返回的路由对象 进行重新改写,见 computed=> routerli -->
    <el-row class="tac">
      <el-col :span="24">
        <div class="names">人事达</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#000"
          active-text-color="#1890FF"
          text-color="#fff"
          @open="handleOpen"
          @close="handleClose"
          @select="selectMenus"
          router
          :default-active="routerli"
        >
          <el-submenu :index="item.title" class="acts" v-for="(item,index) in menus" :key="index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item
              :index="val.url"
              :class="{'is-active':title==val.title}"
              v-for="(val,ind) in item.submenu"
              :key="ind"
              :route="val.url"
            >{{val.title}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Aside',
  props: {

  },
  data() {
    return {
      menus: [
        {
          title: '视频招聘会',
          icon: 'el-icon-menu',
          submenu: [
            {
              title: '招聘会列表',
              url: '/jobFairList'
            },
             {
              title: '宣讲会管理',
              url: '/lectureManage'
            },
            {
              title: '审核招聘职位',
              url: '/checkJobList'
            }
          ]
        },  
        {
          title: '账户管理',
          icon: 'el-icon-s-custom',
          submenu: [
            {
              title: '求职账户',
              url: '/applicant'
            },
            {
              title: '企业账户',
              url: '/companyAccount'
            }
          ]
        },
        {
          title: '意见反馈',
          icon: 'el-icon-info',
          submenu: [
            {
              title: '反馈列表',
              url: '/Report'
            }
          ]
        },
        {
          title: '网站设置',
          icon: 'el-icon-setting',
          submenu: [
            {
              title: '广告设置',
              url: '/ADSetting'
            }
          ]
        }
      ],
      title: '',
      userType: 1,
      uid: localStorage.getItem('sys_uid')
    }
  },
  created() {

  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    },
    escUser() {
      window.localStorage.clear()
      window.sessionStorage.clear()
      this.$router.push('/load')
    },
    selectMenus(key, keyPath) {
      this.title = key
      let arr = this.getMenusTitle(key, this.menus)
      sessionStorage.setItem('menus', JSON.stringify(arr))
    },
    getMenusTitle(url, arr) {
      let title = ''
      let list = []
      arr.forEach(item => {
        item.submenu.forEach(val => {
          if (val.url == url) {
            title = val.title
            list.push(title)
          }
        })
      })
      return list
    }
  },
  computed: {
    routerli() {
      // 对应路由
      let pathStr = this.$route.path.split('/')
      let path = ''
      console.log(pathStr)
      if (pathStr[1] == 'personalForm') {
        path = '/teamList'
      } else if (pathStr[1] == 'companyInfo') {
        path = '/company'
      } else if (pathStr[1] == 'orderTarkingCard') {
        path = '/Userlist'
      } else if (pathStr[1] == 'innDetail') {
        path = '/innList'
      } else if (pathStr[1]=== 'jobDetail'){
        path = '/checkJobList'
      } else if (pathStr[1]=== 'viewUser'){
        path = '/applicant'
      } else if (pathStr[1]=== 'companyForm'){
        path = '/companyAccount'
      } else {
        path = this.$route.fullPath
      }
      console.log(path)
      return path

    },
    names() {
      return this.$store.state.user.users
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hello {
  height: 100%;
  background: #000;
}
.el-menu-vertical-demo {
  border: 0px solid #ffffff;
  height: 100%;
}
.el-submenu .el-menu-item {
  min-width: 170px;
}
.el-menu-item.is-active {
  background: #1890ff !important;
  border: none !important;
  box-sizing: border-box !important;
  color: #fff !important;
}
.el-menu-item {
  background-color: rgba(0, 0, 0, 0.1) !important;
  padding-left: 50px !important;
}
.el-menu-item.is-active {
  background: #1890ff !important;
  border-right: 4px solid #06adfb;
  box-sizing: border-box;
  color: #fff;
  padding-left: 50px !important;
}
.names {
  width: 100%;
  height: 60px;
  text-align: center;
  color: #fff;
  background: #20222a;
  height: 46px;
  line-height: 46px;
}
.tac {
  height: 100%;
  overflow: auto;
}
.el-container {
  height: 100%;
}
</style>
