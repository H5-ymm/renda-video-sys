<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style scoped>

#app{
 width: 100%;
  
} 
</style>

<script>
export default {
  data(){
    return {
      token:''
    }
  },
  created:function(){

  }
}
</script>
