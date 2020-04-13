<template>
  <div class="tables-box">
    <div class="table-list team-forum">
      <div style="margin: 30px 0;"></div>
      <!-- 顶部 -->
      <el-form :inline="true">
        <el-form-item label="资讯标题：">
          <el-input placeholder="资讯标题："></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addAd">添加资讯</el-button>
        </el-form-item>
      </el-form>

      <div style="margin: 30px 0;"></div>
      <!-- 表格 -->
      <el-table :data="adList" ref="adList" style="width: 100%" >
        <el-table-column label="资讯编号" prop="id" align="center" width="80"></el-table-column>
        <el-table-column label="资讯标题" prop="name" align="center" width="200"></el-table-column>
        <el-table-column label="缩略图" align="center" width="200">
          <template slot-scope="scope">
            <img class="slt" :src="scope.row.image" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="点击量" prop="number" align="center" width="100"></el-table-column>
        <el-table-column label="发布人" align="center" prop="people" width="200"></el-table-column>
        <el-table-column label="创建日期" prop="ctime" align="center" width="300">
          <template slot-scope="times" label="time">
            <span>{{$moment.unix(times.row.time).format('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150" >
          <template slot-scope="scope">
            <el-button @click="getDetail(scope.row)" type="text" size="small">修改</el-button> 
            <el-button
              @click="handleDel(scope.row)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <Editor ref="editorr" :dialogVisible="dialogVisible" :adId="adId" :newparams="newparams" :imageUrl="imageUrl" :getDetail="getDetail" @IamSure="IamSure" @upload="upload" @onblur="onblur" @handleClose="handleClose"></Editor>
    </div>
  </div>
</template>
<script>
  import { inquiryList, addInquiryInfo, editInquiryInfo, gainInquiryInfo, delInquiryInfo } from '../api/news'
  import { uploadFile } from '../api/upload'
  import Editor from './Editor'
  import { getImgUrl, getImg } from '../util/util'

  export default {
    data() {
      return {
        adId: '', // 资讯id
        // 编辑和删除传参
        // id: 1,
        newparams: {
            uid:  localStorage.getItem('sys_uid'),
            title: 'hhh',
            author: '咨询作者',
            source: '来源',
            synopsis: 'qqq',
            image:'https://www.baidu.com/img/2019dong_33c09d45f5e85ae961a3852d8769f124.gif',
            content: 'sssss'
          },
        // editOrDelData: {
        //   uid: localStorage.getItem('sys_uid'),
        //   id:''
        // },
        params: {
          uid: localStorage.getItem('sys_uid'),
          // title: '1',
          // limit: 10,
          // page: 1
        },
        // newparams: {
        //   uid: localStorage.getItem('sys_uid'),
        //   title: '',
        //   type: '',
        //   image: '',//资讯图片路径
        //   is_enable: 1,//是否启用（1：启用，2：关闭）
        //   remark:'',//备注
        // },
        dialogVisible: false,
        uid: localStorage.getItem('sys_uid'),
        dialogImageUrl: '',
        imageUrl: '',
        adList: [
          {
            uid:  localStorage.getItem('sys_uid'),
            title: 'hhh',
            author: '咨询作者',
            source: '来源',
            synopsis: 'qqq',
            image:'https://www.baidu.com/img/2019dong_33c09d45f5e85ae961a3852d8769f124.gif',
            content: 'sssss'
          },
        ],
      } 
    },
    components: {Editor},
    created() {
      this.getList(this.params)
      console.log(this.dialogVisible,'dialogVisible')
    },
    methods: {
       // 列表
       getList (params) {
        inquiryList(params).then(response => {
          console.log(response);
          this.adList = response.data.data
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      // 获取详情(修改编辑)
      getDetail (val) {
        this.dialogVisible = true;
        console.log(val,'val of getdetail')
        this.adId = val.id
        // this.editOrDelData.id = val.id
        this.newparams = val
        let editparams = {
          uid: localStorage.getItem('sys_uid'),
          id:this.adId
        }
        editInquiryInfo(editparams).then(function (response) {
          console.log(response);
          this.newparams  = response.data
        })
        .catch(function (error) {
          console.log(error);
        });
      },
      upload (params) {
        const _file = params.file;
        uploadFile(_file).then(res => {
          this.imageUrl = this.getImg(_file)
          this.newparams.image = res.data.url
        })
      },
      getImg (file) {
        let url = null;
        if (window.createObjectURL != undefined) {
          url = window.createObjectURL(_file)
        } else if (window.URL != undefined) {
          url = window.URL.createObjectURL(file)
        } else if (window.webkitURL != undefined) {
          url = window.webkitURL.createObjectURL(file)
        }
        return url;
      },
      onblur(html){
        this.newparams.content = html
      },
      handleDel (v) {
        delInquiryInfo(v).then(res => {

        })
        this.getList(this.params)
      },
      addAd () {
        this.adId = ''
        this.dialogVisible = true
        console.log('aaaaa')
        //   // 编辑资讯
        if (this.adId) {
          //  编辑接口
          this.newparams.id = this.adId
          console.log(this.newparams,'this.newparams')
          editInquiryInfo(this.newparams).then( res => {
            
          })
          this.getList(this.params)
        }
        else {
          // 新增资讯
          addInquiryInfo(this.newparams).then(res=>{
            this.adList = res.data.data
            this.getList(this.params)
          })
          // this.getList(this.params)
        }
      },
      IamSure () {
          this.dialogVisible = false;
      },
      handleClose(){
        this.dialogVisible = false
      },
     
      
    },
  }
</script>
<style lang="scss" scoped>
  .slt{
    width: 90px;
    height: 26px;
    border-radius: 6px;
  }
  
</style>