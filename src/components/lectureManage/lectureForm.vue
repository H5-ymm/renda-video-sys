<template>
  <div class="teamMessage">
    <div class="manager-form-row">
      <el-form
        :model="lectureForm"
        :rules="rules"
        ref="lectureForm"
        label-width="150px"
        label-position="right"
        class="teamMessage-form">
        <section class="section-box">
          <el-form-item label="宣讲会名称" prop="title">
            <el-input v-model="lectureForm.title" class="width408" placeholder="请输入宣讲会名称"></el-input>
          </el-form-item>
          <el-form-item label="企业名称" prop="com_id">
            <el-select v-model="lectureForm.com_id" class="width408">
              <el-option :label="item.com_name" :value="item.id" v-for="(item, index) in companyList" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" required>
             <el-date-picker
              class="width408"
              type="datetime"
              value-format="timestamp"
              format="yyyy-MM-DD HH:mm"
              @change="changeDate"
              :picker-options="pickerOptions"
              v-model="starttime"
              placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="联系人" prop="link_man">
            <el-input v-model="lectureForm.link_man" class="width408" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="link_tel">
            <el-input v-model="lectureForm.link_tel" class="width408" placeholder="请输入联系人电话"></el-input>
          </el-form-item>
          <el-form-item label="宣讲会图片/视频" required>
            <el-upload
              class="uploader-card avatar-uploader"
              action="customize"
              :show-file-list="false"
              :http-request="uploadFile"
            >
             <video name="media" id="video" ref="video1" class="avatar" preload="auto" v-if="enclosure&&lectureForm.type==1" >
                <source :src="enclosure">您的浏览器暂不支持视频播放
              </video>
              <img v-if="enclosure&&lectureForm.type==2" :src="enclosure" class="avatar" />
              <i v-else class="el-icon-circle-plus avatar-uploader-icon"></i>
              <p>上传图片/视频</p>
              </el-upload>
          </el-form-item>
          <el-form-item label="招聘简章" required>
            <div id="wangeditor" class="width408"></div>
          </el-form-item>
          <el-form-item class="teamMessage-btn">
            <el-button type="primary" @click="submitForm('lectureForm')">{{id?'保存':'发布'}}</el-button>
          </el-form-item>
        </section>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addLecture, getLectureInfo, lectureEdit, companyList , moreupload} from '@/api/lecture'
import E from 'wangeditor'
import { upload } from '@/axios'
import { getImgUrl } from '@/util/util'
export default {
  data () {
    return {
      lectureForm: {
        title: '',
        com_id: '',
        starttime: '',
        invitation_letter:'',
        link_man: '',
        link_tel: '',
        enclosure: '',
        type: ''
      },
      enclosure: '',
       pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        },
      rules: {
        title: [
          { required: true, message: '请输入宣讲会名称', trigger: 'blur' }
        ],
        com_id: [
          { required: true, message: '请选择企业名称', trigger: 'change' }
        ],
        link_man: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        link_tel: [
          { required: true, message: '请输入联系人电话', trigger: 'blur' }
        ]
        
      },
      id: '',
      timeList: [],
      editor:{},
      companyList: [],
      starttime: ''
    };
  },
  created () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getInfo(this.id)
    }
    this.getCompanyList()
  },
  mounted() {
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
        'justify',  // 对齐方式
        'image',  // 插入图片
        'undo',  // 撤销
    ]
    this.editor.customConfig.zIndex = 100
    this.editor.customConfig.onchange = (html) => {
        // html 即编辑器中的内容
        console.log('onblur', html)
        this.lectureForm.invitation_letter = html
    }
    this.editor.customConfig.customUploadImg = (files, insert) => {
      this.insert(files[0])
    }
    this.editor.customConfig.uploadImgShowBase64 = true
    this.editor.create()
  },
  methods: {
    uploadFile (params) {
      const _file = params.file;
      if (_file.type.indexOf('image')!=-1) {
        this.lectureForm.type = 2
      } else {
        this.lectureForm.type = 1
      }
      console.log(_file)
      moreupload(_file).then(res => {
        this.enclosure = getImgUrl(res.data.url)
        this.lectureForm.enclosure = this.enclosure
      })
    },
    getCompanyList() {
      companyList({uid: localStorage.getItem('sys_uid')}).then(res => {
        this.companyList = res.data
      })
    },
    insert (imgUrl) {
      upload(imgUrl).then(res => {
        // let src = getImg(imgUrl)
         let src = getImgUrl(res.data.url)
        let img = "<img class='imgBg' src=" + src + " />"
        this.editor.cmd.do('insertHTML', img)
      })
    },
    // 获取招聘会详情
    getInfo(id) {
      getLectureInfo({ id }).then(res => {
        if (res.data) {
          let data = res.data
          for(let key in this.lectureForm) {
            this.lectureForm[key] = data[key]
          }
          this.lectureForm.id =  this.id
          this.editor.txt.html(data.invitation_letter)
          let starttime = this.$moment.unix(data.starttime).format('YYYY-MM-DD HH:mm')
          console.log(starttime)
          this.starttime = this.$moment(starttime).valueOf()
        }
      })
    },
    // 日期
    changeDate(val) {
      let starttime = val + ''
      this.lectureForm.starttime = starttime.substring(0, 10)
    },
    // 发布招聘会
    add() {
      addLecture(this.lectureForm).then(res => {
        if (res.data) {
          this.$router.push('/lectureManage')
        } else {
          this.$message.error('发布失败')
        }
      }).catch(error =>{
        if (error && error.status) {
          this.$message.error(error.status.remind)
        }        
      })
    },
    // 编辑招聘会
    edit() {
      lectureEdit(this.lectureForm).then(res => {
        if (res.data) {
          this.$router.push('/lectureManage')
        }  else {
          this.$message.error('保存失败')
        }
      }).catch(error =>{
        if (error && error.status) {
          this.$message.error(error.status.remind)
        }        
      })
    },
    // 提交
    submitForm (lectureForm) {
      this.$refs[lectureForm].validate((valid) => {
        if (valid) {
          if (!this.lectureForm.starttime) {
            return this.$message.warning('请选择开始时间')
          }
          if (!this.lectureForm.invitation_letter) {
            return this.$message.warning('请输入招聘简章')
          }
          if(this.id) {
            this.edit()
          } else {
            this.add()
          }
        } else {
          return false;
        }
      });
    },
    resetForm (lectureForm) {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
 @import '../../assets/css/form';
 .el-date-editor {
   .el-input__inner {
     &:focus {
       padding: 2px 30px;
     }
   }
 }
 .wangeditor {
   width: 408px;
 }
</style>
