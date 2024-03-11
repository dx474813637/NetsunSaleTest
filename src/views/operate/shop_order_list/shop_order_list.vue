<!--  -->
<template> 
    <div class="box u-p-15 u-radius-15 bg-white " >
        <el-alert 
          :title="title" 
          type="warning" 
          show-icon 
          v-if="isParams"
          class="u-m-b-15 u-radius-15" 
          @close="closeEvent"
          :close-text="isH5? '移除筛选':'取消筛选，查看所有有效订单列表'"
          />
        <table-shop-order
            isEditBtn 
            :customParams="customParams"
            @detailEvent="detailEvent" 
        ></table-shop-order>
		  <!-- <product-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-popup> -->
    </div>
  </template>
  
  <script setup lang='ts'>
  import router from "@/router/guard" 
  import { reactive,ref, inject, computed, watch, toRefs} from 'vue'  
  const $api: any = inject('$api')
import { useSettingsStore } from '@/stores/settings' 
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
  // $api.product() 
  const detail_id = ref('');
  const dialogTableVisible = ref(false);
 
  const uid = ref('');
  const login = ref('');
  const customParams = computed(() => {
    return {
      uid: uid.value,
      login: login.value
    }
  })
  const title = computed(() => {
    if(login.value) {
      return `当前商家LOGIN：${login.value}`
    }
    if(uid.value) {
      return `当前发展人UID：${uid.value}`
    }
    return ''
  })
  const isParams = computed(() => Object.keys(router.currentRoute.value.query).length > 0 ? true : false)
  watch(
    () => router.currentRoute.value.query,
    (n) => {
      uid.value = n.uid
      login.value = n.login
    },
    {
      deep: true,
      immediate: true
    }
  )

  function detailEvent(data) {
      detail_id.value = data ;
      dialogTableVisible.value = true
  }
  function setShow(v) {
      dialogTableVisible.value = v
  }
  function closeEvent() {
    router.replace({name: 'shop_order_list'})
  }
  </script>
  <style lang='scss' scoped> 
  .box { 
    @extend %box-sizing;
  }
  </style>