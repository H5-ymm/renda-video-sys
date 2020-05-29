import Vue from 'vue'
import Router from 'vue-router'
const Load  = resolve => (require(['./views/Load.vue'], resolve))
const viewMain  = resolve => (require(['./views/viewMain.vue'], resolve))
const jobFairList  = resolve => (require(['./components/jobFair/list.vue'], resolve))
const jobFairForm  = resolve => (require(['./components/jobFair/jobFairForm.vue'], resolve))
const JFcompany  = resolve => (require(['./components/jobFair/JFcompany.vue'], resolve))
const checkJobList  = resolve => (require(['./components/jobFair/checkJobList.vue'], resolve))
const jobDetail  = resolve => (require(['./components/jobFair/jobDetail.vue'], resolve))
const applicant  = resolve => (require(['./components/account/applicant.vue'], resolve))
const viewUser  = resolve => (require(['./components/account/viewUser.vue'], resolve))
const companyAccount  = resolve => (require(['./components/account/company.vue'], resolve))
const ADSetting  = resolve => (require(['./components/ADSetting.vue'], resolve))
const companyForm  = resolve => (require(['./components/jobFair/companyForm.vue'], resolve))
const Report  = resolve => (require(['./components/Report.vue'], resolve))
const lectureManage  = resolve => (require(['./components/lectureManage/list.vue'], resolve))
const lectureForm  = resolve => (require(['./components/lectureManage/lectureForm.vue'], resolve))

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
      path: '/viewMain',
      name: 'viewMain',
      component: viewMain,
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
          path: '/checkJobList',
          name: 'checkJobList',
          component: checkJobList,

          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/jobDetail',
          name: 'jobDetail',
          component: jobDetail,

          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/jobFairForm',
          name: 'jobFairForm',
          component: jobFairForm,
          title: '发布招聘会',
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/lectureManage',
          name: 'lectureManage',
          component: lectureManage,
          title: '宣讲会管理',
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/lectureForm',
          name: 'lectureForm',
          component: lectureForm,
          title: '宣讲会管理',
          meta: {
            requiresAuth: 2
          }
        },  
        {
          path: '/JFcompany',
          name: 'JFcompany',
          component: JFcompany,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/companyForm',
          name: 'companyForm',
          component: companyForm,
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
          path: '/viewUser',  // 求职者账户
          component: viewUser,
          meta: {
            requiresAuth: 2
          },
          children: [
          ]
        },    
        {
          path: '/ADSetting',  //添加用户
          component: ADSetting,
          meta: {
            requiresAuth: 2
          }
        },
        {
          path: '/Report', //反馈
          component: Report,
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
