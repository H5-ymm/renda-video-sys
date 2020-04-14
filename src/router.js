import Vue from 'vue'
import Router from 'vue-router'
const Load  = resolve => (require(['./views/Load.vue'], resolve))
const viewMain  = resolve => (require(['./views/viewMain.vue'], resolve))
const jobFairList  = resolve => (require(['./components/jobFair/list.vue'], resolve))
const jobFairForm  = resolve => (require(['./components/jobFair/jobFairForm.vue'], resolve))
const checkJobList  = resolve => (require(['./components/jobFair/checkJobList.vue'], resolve))
const applicant  = resolve => (require(['./components/account/applicant.vue'], resolve))
const companyAccount  = resolve => (require(['./components/account/company.vue'], resolve))
const addUser  = resolve => (require(['./components/account/addUser.vue'], resolve))
const companyForm  = resolve => (require(['./components/jobFair/companyForm.vue'], resolve))
const Report  = resolve => (require(['./components/Report.vue'], resolve))
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
          path: '/jobFairForm',
          name: 'jobFairForm',
          component: jobFairForm,
          title: '发布视频会',
          meta: {
            requiresAuth: 2
          }
        },
        { // 基本设置
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
          path: '/addUser',  //添加用户
          component: addUser,
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
