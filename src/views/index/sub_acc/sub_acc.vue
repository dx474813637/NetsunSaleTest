<!--  -->
<template>
  <div class="u-p-5 box-border">

    <div class="u-p-5">
      <el-alert title="仅用于商家相关商品需要供应商查看订单信息并发货时使用（商品选择相应的子账号）。" :closable="false" type="success" />
    </div>
    <div class="u-p-5 box">
      <table-sub-acc isEditBtn></table-sub-acc>
    </div>
  </div>

</template>

<script setup lang='ts'>
import { reactive, ref, inject } from 'vue'
const $api: any = inject('$api')
</script>
<style lang='scss' scoped>
.box {
  @extend %box-sizing;
}
</style>