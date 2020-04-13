<template>
  <div class="member-table">
    <div class="action-btn x-flex-between" style="padding: 15px 0 25px 0;">
      <div>
        <el-button type="primary" @click="handleCheck(ids)">审核</el-button>
        <el-button @click="handleDel(ids)">删除</el-button>
        <span class="select-text">已选择
          <el-button type="text">{{multipleSelection.length}}&nbsp;</el-button>项
        </span>
        <el-button type="text" @click="multipleSelection=[]">清空</el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        border=""
        :data="tableData"
        ref="multipleTable"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="编号" prop="id" align="center" width="60"></el-table-column>
        <el-table-column label="职位/企业名称" align="center" width="150">
          <template slot-scope="props">
            <span>{{props.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求人数" prop="required_number" align="center" width="150"></el-table-column>
        <el-table-column label="工作地址" align="center" width="150">
          <template slot-scope="props">
            <span>{{props.row.province}}{{props.row.city}}</span>
          </template>
        </el-table-column>
        <el-table-column label="薪资方式" prop="grade_name" align="center" width="100">
          <template slot-scope="props">
            <span>{{props.row.money_type==1?"月薪":props.row.money_type==2?'日薪':'时薪'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="返利方式" prop="grade_name" align="center" width="120">
          <template slot-scope="props">
            <span>{{props.row.reward_type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="ctime" align="center" width="170"></el-table-column>
        <el-table-column label="招聘状态" align="center" width="180">
          <!-- prop="entry_num" -->
          <template slot-scope="props">
            <!-- {{props.row.job_status}} -->
            <div class="job_status">{{props.row.job_status==1?"招聘中":'已下架'}}</div>
            <el-switch
              :value="getChangeStatus(props.row.job_status)"
              @change="swichChange(props.row.job_status,props.$index)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" width="150">
          <template slot-scope="props">
            <span
              class="status"
              :class="{'active-status1':props.row.status==1,'active-status':props.row.status==2,'active-status2':props.row.status==3}"
            >{{props.row.status | statusType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button
              @click="handleCheck(scope.row.id)"
              v-if="scope.row.status==1"
              type="text"
              size="small"
            >审核</el-button>
            <el-button
              @click="handleCheck(scope.row.id)"
              v-if="scope.row.status==2 || scope.row.status==3"
              type="text"
              size="small"
            >已审核</el-button>
            <!-- <el-button @click="handleCheck(scope.row.id)" v-if="scope.row.status==1" type="text" size="small">审核</el-button> -->

            <el-button @click="handleEdit(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { rewardList, statusList } from '@/base/base'
export default {
  filters: {
    rewardType(val) {
      let obj = rewardList.find(item => {
        return val == item.value
      })
      console.log(obj)
      return obj ? obj.label : '--'
    },
    statusType(val) {
      let obj = statusList.find(item => {
        return val == item.value
      })
      console.log(obj)
      return obj ? obj.label : '--'
    }
  },
  props: {
    tableData: {
      type: []
    }
  },
  props: ['tableData'],
  data() {
    return {
      memberInfo: {},
      rewardList,
      teamId: '',
      multipleSelection: [],
      statusList,
      ids: ''
    }
  },
  methods: {
    swichChange(val, index) {
      console.log(index)
      let inde = val == 1 ? 0 : 1
      this.tableData[index].job_status = this.getChangeStatus(inde)
    },
    getChangeStatus(status) {
      console.log(status == 1 ? true : false)
      return status == 1 ? true : false
    },
    handleEdit(row) {
      this.$router.push({ path: 'orderTarkingCard', query: { id: row.id } })
    },
    handleCheck(val) {
      if (!val) {
        return this.$message.warning('选择数据')
      }
      this.$emit('handleCheck', val)
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      let arr = val.map(item => {
        return item.id
      })
      this.ids = arr.join(',')
    },
    handleDel(row) {
      if (!row) {
        return this.$message.warning('选择数据')
      }
      this.$confirm('你确定要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('handleDel', row.id)
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>
<style lang="scss">
.table {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  height: 76%;
}
.job_status {
  color: #333;
}
.status {
  position: relative;
  margin-left: 10px;
  &.active-status {
    &::before {
      background: #71d875;
    }
  }
  &.active-status1 {
    &::before {
      background: #999;
    }
  }
  &.active-status2 {
    &::before {
      background: #ff0000;
    }
  }
  &::before {
    position: absolute;
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    top: 7px;
    left: -20px;
    background: #ff0000;
  }
}
</style>