<template>
  <el-dialog width="500px" :visible="dialogTableVisible" class="member-dialog" :show-close="false">
    <div class="member-row" v-if="formMember">
      <img src="../../assets/img/member/cancel.png" alt class="cancel-icon" @click="handleClose" />
      <section class="member-col1">
        <div class="head-box">
          <img src="../../assets/img/img1.png" class="head" alt />
        </div>
        <p>{{formMember.user_name}}</p>
      </section>
      <section class="member-col2">
        <div class="x-flex-center">
          <p>姓名</p>
          <el-input v-model="formMember.user_name"></el-input>
        </div>
        <div class="x-flex-center">
          <p>联系电话</p>
          <el-input v-model="formMember.username"></el-input>
        </div>
        <div class="x-flex-center">
          <p>身份证号码</p>
          <el-input v-model="formMember.id_card"></el-input>
        </div>
        <div class="x-flex-center">
          <p>户籍所在地</p>
          <el-input v-model="formMember.provinceid"></el-input>
        </div>
        <div class="x-flex-center">
          <p>学历</p>
          <el-input v-model="formMember.education"></el-input>
        </div>
        <!-- <div class="x-flex-center">
          <p>当前职称</p>
          <el-input v-model="formMember.grade_name"></el-input>
        </div>
        <div class="x-flex-center">
          <p>部门</p>
          <el-input v-model="formMember.depart_name"></el-input>
        </div> -->
        <!-- <div class="x-flex-center">
          <p>入职人数</p>
          <el-input v-model="formMember.entry_num"></el-input>
        </div> -->
        <div class="x-flex-center">
          <p>拥有简历</p>
          <!-- <p>{{formMember.export_num}}</p> -->
          <el-input v-model="formMember.export_num"></el-input>
        </div>
        <div class="x-flex-center">
          <p>最后登录时间</p>
          <!-- <p>{{formMember.login_date}}</p> -->
          <el-input v-model="$moment.unix(formMember.login_date).format('YYYY-MM-DD HH:mm')"></el-input>
        </div>
        <!-- <div class="x-flex-center">
          <p>当前状态</p>
          <el-input>{{formMember.status == 1 ? '正常': '锁定'}}</el-input>
        </div> -->
      </section>
      <section class="member-col3">
        <el-form :model="formMember" class="demo-form-inline" label-width="90px">
          <el-form-item label="部门">
            <el-select v-model="formMember.depart_name" @change="selectDep">
              <el-option
                :label="item.depart_name"
                :value="item.id"
                v-for="(item,index) in depList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="部门">
            <el-select v-model="depId" @change="selectDep">
              <el-option
                :label="item.depart_name"
                :value="item.id"
                v-for="(item,index) in depList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="当前职称">
            <el-select v-model="formMember.grade_name">
              <el-option
                :label="item.grade_name"
                :value="item.id"
                v-for="(item,index) in jobList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="当前职称">
            <el-select v-model="formMember.grade_id">
              <el-option
                :label="item.grade_name"
                :value="item.id"
                v-for="(item,index) in jobList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="当前状态">
            <el-radio-group v-model="formMember.is_lock">
              <el-radio :label="0" border>正常</el-radio>
              <el-radio :label="1" border>锁定</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式" v-if="formMember.status==2">
            <el-input type="textarea" v-model="formMember.remark" placeholder="请输入锁定说明（必填）"></el-input>
          </el-form-item>
          <el-form-item label="认证信息">
            <div class="x-flex-start-justify member-status">
              <img src="../../assets/img/member/phone.png" v-if="formMember.mobile" alt />
              <img src="../../assets/img/member/phone1.png" v-else alt />
              <img src="../../assets/img/member/IDCard.png" alt v-if="formMember.idcard_status" />
              <img src="../../assets/img/member/IDCard1.png" alt v-else />
              <img src="../../assets/img/member/zfb.png" alt v-if="formMember.alipay_status" />
              <img src="../../assets/img/member/zfb1.png" alt v-else />
              <img src="../../assets/img/member/wx.png" alt v-if="formMember.wx_status" />
              <img src="../../assets/img/member/wx1.png" alt v-else />
              <img src="../../assets/img/member/card.png" alt v-if="formMember.bank_status" />
              <img src="../../assets/img/member/card1.png" alt v-else />
              <img src="../../assets/img/member/email.png" alt v-if="formMember.email_status" />
              <img src="../../assets/img/member/email1.png" alt v-else />
            </div>
          </el-form-item>
        </el-form>
      </section>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="submitMember">确定</el-button>
      <!-- <el-button type="primary" @click="handleClose">关闭</el-button> -->
    </div>
  </el-dialog>
</template>
<script>
// 部门经理只能编辑状态
// 成员只能查看
// 总经理可以编辑部门 职称 状态
import { departmentRoleList, getUserDetail } from '../../api/team'
import { getConstant } from '../../api/dictionary'
export default {
  props: ['dialogTableVisible', 'uid', 'objRow', 'memberIf'],
  data () {
    return {
      formMember: {},
      jobList: [],
      depList: [],
      depId: ''
    }
  },
  created () {
    // this.getJobList()
    console.log(this.uid)
  },
  watch: {
    uid (val) {
      if (val) {
        console.log(val)
        this.getInfo(val)
      }
    }
  },
  methods: {
    getInfo (id) {
      let params = {
        uid: id
      }
      getUserDetail(params).then(res => {
        console.log(res,'info res')
        this.formMember = res.data
        console.log(this.formMember,'this.formMember-333')
        // this.depId = this.getJob(this.depList, this.formMember.grade_id)
        this.jobList = this.getArr(this.depList, this.depId)
        console.log(this.jobList)
        console.log(this.formMember,'this.formMember')
      })
    },
    getJobList () {
      let uid = localStorage.getItem('sys_uid')
      departmentRoleList({ uid }).then(res => {
        console.log(res)
        this.depList = res.data
      })
    },
    getArr (arr, id) {
      let newArr = []
      arr.forEach(item => {
        if (item.id == id) {
          newArr = item.child
        }
      })
      return newArr
    },
    getJob (arr, id) {
      let depId
      arr.forEach(item => {
        if (item.child) {
          item.child.forEach(val => {
            if (val.id == id) {
              depId = val.depart_id
            }
          })
        }
      })
      return depId
    },
    selectDep (val) {
      this.jobList = this.getArr(this.depList, val)
    },
    handleClose () {
      this.$parent.dialogInfoVisible = false
    },
    submitMember () {
      let params = {
        uid: this.formMember.uid,
        id: this.formMember.id,
        grade_id: this.formMember.grade_id,
        status: this.formMember.status,
        provinceid: this.formMember.provinceid,
        cityid: this.formMember.cityid,
        three_cityid: this.formMember.three_cityid,
        remark: this.formMember.remark
      }
      this.$emit('submitMember', params)
      this.$parent.dialogInfoVisible = false
    }
  }
}
</script>
 <style lang="scss">

</style>
<style lang="scss" scoped>
  /deep/.el-input__inner{
    height: 25px;
    margin-left: 5px;
  }
.member-dialog {
  box-shadow:0px 1px 43px 0px rgba(51,51,51,0.3);
  border-radius:5px;
  .el-dialog__body,.el-dialog__header {
    padding: 0;
  }
 .member-row {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    color: #333333;
    padding: 0 0 10px;
    position: relative;
    .cancel-icon {
      position: absolute;
      top: 5px;
      right: 0;
    }
    .member-col1 {
      background:#EBF4FB;
      padding: 21px 0 20px;
      .head-box {
        padding: 10px 0 20px;
      }
      .head {  
        width: 88px;
        height: 88px;
        border-radius: 50%;
      }
    }
    .member-col2 {
      line-height: 30px;
      margin: 10px auto;
      width: 65%;
      p {
        &:nth-of-type(1) {
          width: 100px;
          text-align: right;
          color: #6A6A6A;
        }
        &:nth-of-type(2) {
          flex: 1;
          text-align: left;
          margin-left: 30px;
        }
      }
      
    }
    .member-col3 {
      width: 100%;
      border-top: 1px solid #eee;
      padding-top: 10px;
      .demo-form-inline {
        width: 90%;
        margin: 10px auto;
        .el-form-item {
          margin-bottom: 10px;
        }
        .el-input__inner{
          width:300px!important;
          height:38px;
          border-radius: 0;
        }
        .el-textarea {
          width:300px!important;
          border-radius: 0;
          height: 80px;
        }
        .el-form-item__content {
          margin-left: 20px!important;
        }
        .el-select,.el-radio-group,.el-textarea{
          margin-left: -30px;
        }
        .el-radio.is-bordered {
          height: 38px;
          width: 145px;
          border-radius: 0;
          line-height: 38px;
          padding:0;
          margin-right: 0;
          &+.el-radio.is-bordered {
            margin-left: 10px;
          }
        }
        .el-radio__input {
          float: right;
          margin-top: 12px;
          margin-right: 10px;
        }
        .member-status {
          margin-top: 12px;
          padding-left:14px;
          img {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
 .el-input__inner{
   height: 15px !important;
 }
 .member-dialog .member-row .member-col2 p[data-v-26173c3e]:nth-of-type(1) {
    width: 116px;
    text-align: right;
    color: #6A6A6A;
}
</style>