import Vue from 'vue'
import Router from 'vue-router'
import Load from './views/Load.vue'  //登录页
const jobFairList  = resolve => (require(['./components/jobFair/list.vue'], resolve))
const checkJobList  = resolve => (require(['./components/jobFair/checkJobList.vue'], resolve))
const applicant  = resolve => (require(['./components/account/applicant.vue'], resolve))
const companyAccount  = resolve => (require(['./components/account/company.vue'], resolve))
const Team  = resolve => (require(['./views/Team.vue'], resolve))
import Manager from './components/Manager.vue'
import companyForm from './components/teamMessage/companyForm'   // 企业
import personalForm from './components/teamMessage/personalForm'   // 团队
import baseSetting from './components/baseSetting.vue'
import Setting from './components/Setting.vue'  //其他设置
import OrderTarkingCard from './components/OrderTarkingCard.vue'
import Adduser from './components/Adduser.vue'  //添加用户
import DetailCard from './components/commentCard/DetailCard.vue'
import companyInfo from './components/company/companyInfo.vue'  //草稿箱 容器
import ADSetting from './components/ADSetting.vue' //广告设置
import News from './components/News.vue' //资讯设置
import Editor from './components/Editor.vue' //资讯编辑

import cvOrder from './components/cvOrder.vue' //简历管理
import cvLook from './components/cvLook.vue' //简历查看
import innList from './components/innList.vue' //内部发单列表
import innDetail from './components/commentCard/innDetail.vue' //内部发单详情

import Report from './components/Report.vue' //反馈

Vue.use(Router)

let routers = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: {
        name: 'Load'
    }
    },
    {
      path: '/team',
      name: 'Team',
      component: Team,
      redirect: '/jobFairList',
      children: [
        {
          path: '/jobFairList',
          name: 'jobFairList',
          component: jobFairList,

          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/detailCard',
          name: 'DetailCard',
          component: DetailCard,
          title: '论坛详情',
          meta: {
            requiresAuth: 2
          }
        },
        { //发单管理
          path: '/checkJobList',
          name: 'checkJobList',
          component: checkJobList,
          meta: {
            requiresAuth: 2
          }
        },
        { //发单管理
          path: '/orderTarkingCard',
          name: 'OrderTarkingCard',
          component: OrderTarkingCard,
          meta: {
            requiresAuth: 2
          }
        },
        { // 团队个人设置
          path: '/companyForm',
          name: 'companyForm',
          component: companyForm,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/companyInfo',
          name: 'companyInfo',
          component: companyInfo,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/personalForm',
          name: 'personalForm',
          component: personalForm,
          meta: {
            requiresAuth: 2
          }
        },
        { // 基本设置
          path: '/baseSetting',
          name: 'baseSetting',
          component: baseSetting,
          meta: {
            requiresAuth: 2
          }
        },
        { // 其他设置
          path: '/setting',
          component: Setting,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/companyAccount',  // 企业账户
          component: companyAccount,
          meta: {
            requiresAuth: 2
          },
          children: [
          ]
        },
        {
          path: '/applicant',  // 求职者账户
          component: applicant,
          meta: {
            requiresAuth: 2
          },
          children: [
          ]
        },
        {
          path: 'adduser',  //添加用户
          // name: Adduser,
          component: Adduser,
          meta: {
            requiresAuth: 1
          }
        },
        {
          path: '/manager',  //用户列表
          // name: Manager,
          component: Manager,
          meta: {
            requiresAuth: 1
          }
        },
        {
          path: '/cvOrder',  //简历管理
          // name: cvOrder,
          component: cvOrder,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/cvLook',  //简历查看
          // name: cvLook,
          component: cvLook,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/innList',  //内部发单列表
          // name: innList,
          component: innList,
          meta: {
            requiresAuth: 2
          },
        },
        {
          path: '/innDetail', //内部发单查看
          // name: innDetail,
          component: innDetail,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/ADSetting', //广告设置
          // name: ADSetting,
          component: ADSetting,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/Report', //反馈
          // name: Report,
          component: Report,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/Editor', //富文本编辑
          // name: Editor,
          component: Editor,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/News', //富文本编辑
          // name: News,
          component: News,
          meta: {
            requiresAuth: 2
          }
        }
        
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/Load',
      name: 'Load',
      component: Load
    }
  ]
})
// 全部钩子
// routers.beforeEach((to,from,next)=>{
//   let path=from.path
//       if (to.path === '/load'|| to.path === '/about') {
//             next();
//           } else {
//             let desc= store.state.user.desc;
//             if(!desc) {
//               next('/load')
//             }else{
//                 if(desc<=to.meta.requiresAuth){
//                   next()
//                 }else{
//                   next(path)
//                 }
//             }

//           }

// })
// 公出路由
export default routers
