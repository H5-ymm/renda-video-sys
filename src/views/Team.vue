<template>
  <div class="team-main-view">
    <el-container>
      <el-aside width="210px" class="team-aside">
        <home-aside></home-aside>
      </el-aside>
      <el-container>
        <el-header height="75px">
          <div style="height:37px;" class="x-flex-between team-header">
            <i class="el-icon-refresh-right"></i>
            <div class="x-flex-center">
              <el-dropdown @command="handleCommand">
                <span>{{userinfo}}</span>
                <i class="el-icon-caret-bottom"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command>重置密码</el-dropdown-item>
                  <el-dropdown-item command="/login">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <breadcrumb :breadcrumbs="breadcrumb"></breadcrumb>
        </el-header>
        <el-main class="team-main">
          <router-view class="team-box"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import homeAside from '@/components/Aside' //侧边栏
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import { reset_password } from '@/api/company'
export default {
  name: 'team',
  data() {
    return {
      userinfo: '',
      breadcrumb: [],
    }
  },
  components: {
    homeAside,
    Breadcrumb
  },
  methods: {
    outLogin() {
      this.$router.push('load')
      localStorage.removeItem('sys_uid')
      localStorage.removeItem('sys_userInfo')
      localStorage.removeItem('sys_token')
    },
    handleCommand(val) {
      if (!val) {
        this.$alert('密码将设置为123456<br>确定重置吗?', '密码重置', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reset_password({ uid: this.uid }).then(res => {
            this.$message.success('重置成功')
          }).catch(error => {
            this.$message.error('重置失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        this.$message.success("退出登录成功");
        this.$router.push('load')
        localStorage.removeItem('sys_uid')
        localStorage.removeItem('sys_userInfo')
        localStorage.removeItem('sys_token')
      }
    }
  },
  created() {
    this.breadcrumb = JSON.parse(sessionStorage.getItem('menus'))
    this.userinfo = JSON.parse(localStorage.getItem('sys_userInfo')).name
    console.log(this.userinfo, 'userinfo')
    console.log(typeof JSON.parse(localStorage.getItem('sys_userInfo')), 'typeof localStorage.getItem.userinfo')
    console.log(JSON.parse(localStorage.getItem('sys_userInfo')).name, 'localStorage.getItem.userinfo')
  }
}
</script>

<style scoped lang="scss">
.team-main-view {
  width: 100vw;
  height: 100vh;
  /* overflow-y: hidden; */
  /* overflow: auto; */
  overflow: hidden;
  position: relative;
  .unRead {
    margin: 0 10px;
  }
  .el-header {
    padding: 0;
  }
  .team-header {
    padding: 0 20px;
  }
}
.team .team-header {
  padding: 0 38px;
}
.team-aside {
  /* height: 100vh; */
  overflow: hidden;
}
.team-main {
  height: 100vh;
  /* overflow: hidden; */
  background: #f0f2f5;
  padding: 30px;
  box-sizing: border-box;
}
</style>
