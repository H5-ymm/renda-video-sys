<template>
  <el-cascader v-model="districtList" :placeholder="placeholder" :options="options" clearable :props="props" ref="cascader" class="cascader" @change="changeData" @expand-change="handleItemChange"></el-cascader>
</template>
<script>
import { getProvincesList, getCitysList, getAreasList } from '../api/company'
import { cityList } from '../base/base'
export default {
  props: {
    disabled: false,
    placeholder: { type: String, default: '请选择地区' },
    canAll: { type: Array, default: _ => [true, true, true] },
    address: { type: Array, default: _ => [] }
  },
  data () {
    return {
      options: [],
      districtList: [],
      props: {
        value: 'code',
        label: 'name',
        children: 'children'
      },
      cityList,
      list: [],
      arr: [],
      list1: []
    }
  },
  created () {
    if (!this.address.length) {
      this.districtList = []
      this.getRegion([])
    }
    else {
      this.getRegion(this.address)
      this.districtList = this.address.map(item => { return item + '' })
    }
  },
  watch: {
    address: {
      handler (val, oldVal) {
        console.log(val)
        if (val.length) {
          this.getRegion(val)
          setTimeout(() => {
            this.districtList = this.address.map(item => { return item + '' })
          }, 1000)
          // this.getRegion(val)
          // this.districtList = this.address.map(item => { return item + '' })
        }
        else {
          this.getRegion([])
          this.districtList = []
        }
      },
      deep: true  // 可以深度检测到 person 对象的属性值的变化
    }
  },
  methods: {
    handleItemChange (val) {
      this.getCityList(val)
    },
    getProlist (list) {
      return list.map(item => {
        let obj =
          {
            code: item.provinceid,
            name: item.province,
            children: []
          }
        return obj
      })
    },
    getProlist1 (list) {
      return list.map(item => {
        let obj =
          {
            code: item.code,
            name: item.name,
            children: []
          }
        return obj
      })
    },
    getList (list) {
      return list.map(item => {
        let obj =
          {
            code: item.code,
            name: item.name
          }
        return obj
      })
    },
    getRegion (value) {
      getProvincesList().then(res => {
        let arr = this.getProlist(res.data)
        this.options = arr
        this.getCityList(value)
      })
    },
    getCityList (value) {
      let code = ''
      if (!value.length) {
        code = '110000'
      }
      else {
        code = value[0]
      }
      getCitysList({ code }).then(res => {
        let arr = []
        if (!this.disabled) {
          arr = this.getProlist1(res.data)
          this.getAreaList(value)
        }
        else {
          arr = this.getList(res.data)
        }
        this.options.forEach(item => {
          if (item.code == code) {
            item.children = arr
            return false
          }
        })
      })
    },
    getAreaList (value) {
      let code = ''
      if (!value[1]) {
        code = '110100'
      }
      else {
        code = value[1]
      }
      getAreasList({ code }).then(res => {
        let arr = res.data
        this.options.forEach(item => {
          if (item.code == value[0]) {
            this.list.push(item.name)
            if (item.children.length) {
              item.children.forEach(val => {
                if (val.code == code) {
                  this.list.push(val.name)
                  val.children = arr
                  this.arr = arr
                }
              })
            }
          }
        })
      })
    },
    changeData (val) {
      if (this.arr.length) {
        this.arr.forEach(item => {
          if (val[2] && item.code == val[2]) {
            this.list.push(item.name)
          }
        })
      }
      let arr = [...new Set(this.list)]
      this.$emit('input', val)
      this.$emit('change', val)
      this.$emit('changeAddress', arr)
    }
  }
}
</script>

<style scoped>
.cascader {
  display: block;
  width: 100%!important;
}
</style>

