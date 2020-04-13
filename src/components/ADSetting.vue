<template>
  <div class="tables-box">
    <div class="table-list team-forum">
      <div style="margin: 30px 0;"></div>
      <!-- 顶部 -->
      <el-form :inline="true">
        <el-form-item label="广告名称：">
          <el-input placeholder="广告名称：" v-model="params.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="seaCh">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addAd">添加广告</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 30px 0;"></div>
      <!-- 表格 data绑定为数组-->
      <el-table :data="adList" ref="adList" style="width: 100%"></el-table-column>
        <el-table-column label="广告编号" prop="id" align="center" width="80"></el-table-column>
        <el-table-column label="广告名称" prop="name" align="center" width="200"></el-table-column>
        <el-table-column label="广告类型"align="center" width="200">
          <template slot-scope="typ">
            <span>{{getAdType(typ.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="缩略图" align="center" width="200">
          <template slot-scope="scope">
            <img class="slt" :src="scope.row.image" alt="" />
          </template>
        </el-table-column>
        <el-table-column label="点击量" prop="number" align="center" width="100"></el-table-column>
        <el-table-column label="备注" align="center" prop="remark" width="200"></el-table-column>
        <el-table-column label="创建日期" align="center" width="300">
          <template slot-scope="times" label="addtime">
            <span>{{$moment.unix(times.row.addtime).format('YYYY-MM-DD HH:mm')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150" >
          <template slot-scope="scope">
            <!-- <el-button @click="dialogVisible = true" type="text" size="small">修改</el-button>  -->
            <el-button @click="getDetail(scope.row)" type="text" size="small">修改</el-button> 
            <el-button
              @click="handleDel(scope.row)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="team-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="params.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
<!-- 弹框 -->
      <el-dialog
        :title="adId?'修改广告':'添加广告'"
        :visible.sync="dialogVisible"
        width="30%"
        >
        <div>
          <el-form :model="addParams" ref="addParams" label-width="100px">
            <el-form-item label="广告名称：">
              <el-input
                class="query-inputs width350"
                v-model="addParams.name"
                placeholder="请输入广告名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="广告类型：">
              <el-select v-model="addParams.type" value-key="label" placeholder="请选择广告类型">
                <el-option 
                :label="item.label" 
                :value="item.value"
                v-for="(item, index) in adTypeList" 
                :key="item.label"
                >
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传图片：">
              <el-upload
              class="avatar-uploader"
              action="customize"
              ref="upload"
              :show-file-list="false"
              :http-request="upload"
            >
            <div class="borderdashed">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-circle-plus avatar-uploader-icon"></i>
              <p>上传</p>
            </div>
            </el-upload>
            </el-form-item>
            <el-form-item label="是否启用：">
              <el-radio-group v-model="addParams.is_enable">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="2">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
              type="textarea"
                class="query-inputs width350"
                v-model="addParams.remark"
                placeholder="请输入备注"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="IamSure">确 定</el-button>
        </span>
      </el-dialog>
      
    </div>
  </div>
</template>
<script>
  import { advertiseList, advertisementInfo,addAdvertisementInfo, editAdvertiseInfo, delAdvertiseInfo } from '../api/adlist'
  import { uploadFile } from '../api/upload'
  import { getImgUrl, getImg } from '../util/util'
  import { getConstant } from '../api/dictionary'

  export default {
    data() {
      return {
        // 分页
        total: 0,
        getTypeArr:[],
        adId: '', // 广告id
        // editOrDelData: {
        //   uid: localStorage.getItem('sys_uid'),
        //   id:'',
        //   name: ''
        // },
        //获取列表传参
        params: {
          uid: localStorage.getItem('sys_uid'),
          // name: '1',
          limit: 10,
          page: 1
        },
        //修改编辑传参
        addParams: {
          uid: localStorage.getItem('sys_uid'),
          id: '',
          name: '',
          type: '',
          image: '',//广告图片路径
          is_enable: 1,//是否启用（1：启用，2：关闭）
          remark:'',//备注
          addtime: 1577361373
        },
        dialogVisible: false,
        uid: localStorage.getItem('sys_uid'),
        dialogImageUrl: '',
        imageUrl: '',
        adList: [],
        adType: {},
        adTypeList:[],
        // 删除
        delparams: {
          uid: '',
          id:''
        }
      }
    },
    created() {
      let paramss = 'adv_type'
      this.getTypes(paramss)
      this.getList(this.params)
    },
    methods: {
      getTypes (filed) {
        getConstant({ filed }).then(res => {
          console.log(res.data.adv_type,'res')
          // const adv_type = res.data.adv_type
          // this.adList.type = adv_type
          // console.log(this.addParams.type,'this.addParams.type')
          // typeObj[type.row.type]
          let typeObj = res.data.adv_type
          this.adType = res.data.adv_type
          var arr = []
          for (let i in typeObj) {
              let o = {
                label:  typeObj[i],
                value: Number(i)
              };
              arr.push(o)
          }
         
          // for(let i in typeObj) {
          //   if(i==)
          //   console.log(typeObj[i]);
          // }
          this.adTypeList = arr
          console.log(this.adTypeList);
        })
      },
      getAdType (val) {
        for(let key in this.adType) {
          if (val== key) {
            return this.adType[key]
          }
        }
      },
      seaCh(){
        this.getList (this.params)
      },
      // 分页
      handleSizeChange (val) {
        this.params.limit = val
        this.getList(this.params)
        console.log(this.params.limit,'this.params.limit')
      },
      handleCurrentChange (val) {
        this.params.page = val
        this.getList(this.params)
      },
      handleDel (v) {
          this.delparams.uid = v.uid
          this.delparams.id = v.id
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAdvertiseInfo(this.delparams).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList(this.params)
          }).catch(err => {
            this.$message({
              message: err.status.remind,
              type: 'warning'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      addAd () {
        this.dialogVisible = true
      },
      // 列表
      getList (params) {
        advertiseList(params).then(response => {
          console.log(response);
          this.adList = response.data.data
          this.total = response.data.count
          for(let i=0; i<response.data.data.length; i++){
            this.adList[i].image=getImgUrl(response.data.data[i].image)
          }
        }).catch(function (error) {
            console.log(error);
          });
      },
      // 获取详情(修改)
      getDetail (val) {
        this.dialogVisible = true;
        this.adId = val.id
        this.addParams.id = val.id
        this.addParams = val
        console.log(val)
        this.imageUrl = val.image
      },
      IamSure () {
        // 编辑广告
        if (this.adId) {
          //  编辑接口
          editAdvertiseInfo(this.addParams).then( res => {
            this.getList(this.params)
            console.log(this.addParams,'this.addParams')
          })
          // this.getList(this.params)
        }
        else {
          // 新增广告
          addAdvertisementInfo(this.addParams).then(res=>{
            this.getList(this.params)
          })
          // this.getList(this.params)
        }
        this.dialogVisible = false;
      },
     
      upload (params) {
        console.log(params,'params')
        const _file = params.file;
        uploadFile(_file).then(res => {
          this.imageUrl = this.getImg(_file)
          this.addParams.image = res.data.url
        })
        // this.getList(this.params)

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
    },
  }
</script>
<style lang="scss" scoped>
  img{margin: 0 !important;}
  .slt{
    width: 90px;
    height: 26px;
    border-radius: 6px;
  }
  .slt:hover{
    width: 180px;
    height: 52px;
    border-radius: 12px;
  }
  .avatar-uploader .el-upload {
    background: #eee;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    color: #999999;
    font-size: 14px;
    width:91px;
    height:91px;
    >p {
      margin-top: -10px;
    }
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
    color: #999999;
    font-size: 42px;
    margin-top: 10px;
  }
  .avatar {
    width:91px;
    height:91px;
    display: block;
  }
  .borderdashed{
    width: 91px;
    height: 91px;
    border: dashed #999 1px;
    border-radius: 3px;
    background-color: #eee;
  }
</style>