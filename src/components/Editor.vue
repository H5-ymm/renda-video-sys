<template>
  <el-dialog
  :title="adId?'修改资讯':'添加资讯'"
  :visible.sync="dialogVisible"
  :before-close="handleClose"
  width="60%"
  @opened="opened"
  @closed="closed"
  >
  <!-- -->
    <div>
      <el-form :model="newparams" ref="newparams" :rules="rules" label-width="100px">
        <el-form-item label="资讯标题：">
          <el-input
            class="query-inputs width350"
            v-model="newparams.title"
            placeholder="请输入资讯标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="作者：">
          <el-input
            class="query-inputs width350"
            v-model="newparams.author"
            placeholder="请输入作者"
          ></el-input>
        </el-form-item>
        <el-form-item label="资讯来源：">
          <el-input
            class="query-inputs width350"
            v-model="newparams.source"
            placeholder="请输入资讯来源"
          ></el-input>
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
        <el-form-item label="资讯简介：">
          <el-input
          type="textarea"
            class="query-inputs width350"
            v-model="newparams.synopsis"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
        <div id="wangeditor">
        </div>
        <el-button v-on:click="getContent">查看内容</el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="IamSure">{{ adId ? "修 改" : "确 定" }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
    import E from 'wangeditor'
    import { advertiseList, advertisementInfo, addAdvertisementInfo, editAdvertiseInfo} from '../api/adlist'

    export default {
      props: ['dialogVisible', 'adId', 'newparams', 'imageUrl', 'getDetail'],
      name: 'editor',
      data () {
        return {
          // id:1,
          editorContent: '',
          // dialogVisibleChild: this.dialogVisible,
          rules: {
            name: [
              { required: true, message: '请输入活动名称', trigger: 'blur' },
              { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            image: [
              { required: true, message: '请插入图片', trigger: 'change' }
            ],
            
            desc: [
              { required: true, message: '请填写活动形式', trigger: 'blur' }
            ]
          },
          editor:{}
        }
      },
      watch: {
        dialogVisible (v) {
          // `this` 指向 vm 实例
          console.log(v,'dialogvisible')
          // return this.dialogVisible
        }
      },
      methods: {
        getContent: function () {
            alert(this.editorContent)
        },
        upload (params) {
          console.log(params,'params')
          // const _file = params.file;
          // uploadFile(_file).then(res => {
          //   this.imageUrl = this.getImg(_file)
          //   this.newparams.image = res.data.url
          // })
          this.$emit('upload',params)
        },
       
        // IamSure(){
        //   this.$emit('IamSure')
        // }
        IamSure () {
          // 编辑资讯
          // if (this.adId) {
          //   //  编辑接口
          //   editAdvertiseInfo(this.editOrDelData).then( res => {

          //   })
          //   this.getList(this.params)
          // }
          // else {
          //   // 新增资讯
          //   this.$emit('IamSure')
          // }
          this.$emit('IamSure')
        },
        handleClose () {
          // this.$parent.dialogVisible = false
          this.$emit('handleClose')
        },
        // 获取详情(修改)
      
        opened(){
          console.log(E,'E')
          if (Object.keys(this.editor).length !== 0) {
            
          }else{
            this.editor = new E('#wangeditor')
            // this.editor.customConfig.onchange = (html) => {
            //   this.editorContent = html
            // }
            // 自定义菜单配置
            this.editor.customConfig.menus = [
                'head',
                'fontSize',
                'bold',
                'italic',
                'underline',
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'justify',  // 对齐方式
                'image',  // 插入图片
                'undo',  // 撤销
            ]
            this.editor.customConfig.onblur = (html) => {
                // html 即编辑器中的内容
                console.log('onblur', html)
                // this.newparams.content = html
                this.$emit('onblur',html)
            }
            this.editor.customConfig.linkImgCheck = function (src) {
                console.log(src) // 图片的链接

                return true // 返回 true 表示校验成功
                // return '验证失败' // 返回字符串，即校验失败的提示信息
            }
            this.editor.create()
            // this.editor.txt.html('<p>用 JS 设置的内容</p>')
            // this.getDetail()
          }
        },
        closed(){
          // this.editor.destroy()
        }
      },
      updated () {
        console.log(this.dialogVisibleChild,'dialogVisibleChild')
        
      },
    }
</script>

<style scoped>
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
