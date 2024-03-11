<!--  -->
<template> 
    <div class="box u-p-15 u-radius-15 bg-white " >
        <el-alert 
          :title="`当前发展人UID：${uidInfo}`" 
          type="warning" 
          show-icon 
          v-if="isUid"
          class="u-m-b-15 u-radius-15" 
          @close="closeEvent"
          :close-text="isH5? '移除筛选':'取消筛选发展人，查看所有员工发展商家列表'"
          />
        <table-shop
            isEditBtn 
            @detailEvent="detailEvent"
        ></table-shop>
    </div>
  </template>
  
  <script setup lang='ts'>
  import router from "@/router/guard" 
  import { reactive,ref, inject, computed, toRefs} from 'vue'  
  const $api: any = inject('$api')
import { useSettingsStore } from '@/stores/settings' 
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
  // $api.product() 
  const detail_id = ref('');
  const dialogTableVisible = ref(false);
 
  const isUid = computed(() => router.currentRoute.value.query.uid? true : false)
  const uidInfo = computed(() => router.currentRoute.value.query.uid)

  function detailEvent(data) {
      detail_id.value = data ;
      dialogTableVisible.value = true
  }
  function setShow(v) {
      dialogTableVisible.value = v
  }
  function closeEvent() {
    router.replace({name: 'workers2s_list'})
  }
  </script>
  <style lang='scss' scoped>
  .box {
    @extend %box-sizing;
  }
  </style>