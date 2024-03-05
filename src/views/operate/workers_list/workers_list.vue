<!--  -->
<template>
    <div class="u-p-10 box">
        <table-workers
            isEditBtn 
            @detailEvent="detailEvent"
        ></table-workers>
      <!-- <table-product
        isEditBtn 
        @detailEvent="detailEvent"
      ></table-product>
          <product-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-popup> -->
    </div>
  </template>
  
  <script setup lang='ts'>
  import { reactive,ref, inject} from 'vue'  
  const $api: any = inject('$api')
  // $api.product() 
  const detail_id = ref('');
  const dialogTableVisible = ref(false);
  function detailEvent(data) {
      detail_id.value = data ;
      dialogTableVisible.value = true
  }
  function setShow(v) {
      dialogTableVisible.value = v
  }
  </script>
  <style lang='scss' scoped>
  .box {
    @extend %box-sizing;
  }
  </style>