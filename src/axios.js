import axios from 'axios';
import QS from 'qs';
const $axios = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 4000
});
// const baseURL1 = process.env.VUE_APP_URL + '/index.php'
// const baseURL = process.env.VUE_APP_URL + '/admin.php'
// const baseExportURL = process.env.VUE_APP_URL + '/uploads/test/'
const baseURL1 = 'http://tiantianxsg.com:39888/index.php'
const baseURL = 'http://tiantianxsg.com:39888/admin.php'
const baseExportURL = 'http://tiantianxsg.com:39888/uploads/test/'

//请求拦截
$axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 通过reudx的store拿到拿到全局状态树的token ，添加到请求报文，后台会根据该报文返回status
    // 此处应根据具体业务写token
    const token = localStorage.getItem('sys_token');
    if (localStorage.getItem('sys_token')) {
      config.headers['HTTP_TOKEN'] = token
      // config.headers['HTTP-USERID'] = 6
    }
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    // this.$message.error(error);
    return Promise.reject(error);
  }
);
// 添加响应拦截器
$axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response.data.status.code === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
    // return Promise.resolve(response); 
  },
  // 服务器状态码不是200的情况 
  error => {
    console.log(error.response)
    if (error.response && error.response.status) {
      switch (error.response.status) {
        // 401: 未登录    
        // 未登录则跳转登录页面，并携带当前页面的路径    
        // 在登录成功后返回当前页面，这一步需要在登录页操作。    
        case 401:
          break;
        // 403 token过期    
        // 登录过期对用户进行提示    
        // 清除本地token和清空vuex中token对象    
        // 跳转登录页面    
        case 403:
          this.$message.error(error.response.status.remind);
          // 清除token     
          localStorage.removeItem('token');
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面     
          break;
        // 404请求不存在    
        case 404:
          //   this.$message.error('网络请求不存在');   
          break;
        // 其他错误，直接抛出错误提示    
        default:
        //   this.$message.error(error.response.status.remind) 
      }
      return Promise.reject(error.response);
    }
  }
);
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post (url, data) {
  return new Promise((resolve, reject) => {
    $axios.post(`${baseURL}${url}`, QS.stringify(data || {}))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        console.log(err)
        reject(err.data)
      })
  });
}
export function $post (url, params) {
  return new Promise((resolve, reject) => {
    $axios.post(`${baseURL}${url}${'?' + QS.stringify(params)}`)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export function $get (url, params) {
  return new Promise((resolve, reject) => {
    $axios.get(`${baseURL}${url}${'?' + QS.stringify(params)}`)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export function exportData (url, params) {
  let param = QS.stringify(params)
  window.location.href = `${baseURL}${url}${'?'}${param}`
}
export function upload (params) {
  let file = new FormData()
  file.append('image', params)
  return new Promise((resolve, reject) => {
    $axios.post(`${baseURL1}/uploadimg/moreupload`, file)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export function getData (url, params) {
  return new Promise((resolve, reject) => {
    $axios.post(`${baseURL1}${url}${'?' + QS.stringify(params)}`)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

export default $axios;