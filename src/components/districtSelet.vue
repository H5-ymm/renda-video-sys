<template>
  <el-cascader v-model="districtList" :placeholder="placeholder" :options="options" clearable :props="props" ref="cascader" class="cascader" @change="changeData" @expand-change="handleItemChange"></el-cascader>
</template>
<script>
import { getProvincesList } from '@/api/dictionary'
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
        value: 'id',
        label: 'area_name',
        children: 'children'
      },
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
      this.districtList = this.address
    }
  },
  watch: {
    address: {
      handler (val, oldVal) {
        if (val.length) {
          this.getRegion(val)
          setTimeout(() => {
            this.districtList = this.address
          }, 1000)
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
        item.children = []
        return item
      })
    },
    getRegion (value) {
      getProvincesList({parentId: ''}).then(res => {
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
      getProvincesList({ parentId: code }).then(res => {
        let arr = []
        if (!this.disabled) {
          arr = this.getProlist(res.data)
          this.getAreaList(value)
        }
        else {
          arr = res.data
        }
        this.options.forEach(item => {
          if (item.id == code) {
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
      getProvincesList({ parentId: code }).then(res => {
        let arr = res.data
        this.options.forEach(item => {
          if (item.id == value[0]) {
            this.list.push(item.area_name)
            if (item.children.length) {
              item.children.forEach(val => {
                if (val.id == code) {
                  this.list.push(val.area_name)
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
          if (val[2] && item.id == val[2]) {
            this.list.push(item.area_name)
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

