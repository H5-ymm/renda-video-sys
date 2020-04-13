import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueParticles from 'vue-particles'  

import router from './router'
import store from './store/index'
import moment from 'moment'
import './assets/css/init.css'
import './assets/css/element-variables.scss';
// 引入axios
// import axios from './axios'
// Vue.prototype.$http = axios
Vue.prototype.$moment = moment
// use
Vue.use(VueParticles) 
Vue.config.productionTip = false

//富文本编辑器
// var E = window.wangEditor
// var editor2 = new E('#div3')
// editor2.create()

// 注册element-ui
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
