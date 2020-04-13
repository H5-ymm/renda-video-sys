<template>
  <div class="panel-row">
    <p class="panel-title">{{title}}</p>
    <slot name="content"></slot>
  </div>
</template>
<script>
export default {
  props: ['title']
}
</script>
<style>
  .panel-row {
    width: 100%;
    height: 100%;
    padding: 20px 0;
  }
  .panel-row .panel-title {
    font-size:18px;
    font-weight:bold;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-left:28px;
  }
</style>