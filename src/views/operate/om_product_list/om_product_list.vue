<!--  -->
<template>
	<div class="box u-p-15 u-radius-15 bg-white ">
		<el-alert :title="title" type="warning" show-icon v-if="isParams" class="u-m-b-15 u-radius-15"
			@close="closeEvent" :close-text="isH5 ? '移除筛选' : '取消筛选，查看所有商品列表'" />
		<div class="u-p-15 box u-radius-15 bg-white ">
			<table-product-om :customParams="customParams" @detailEvent="detailEvent"
				@detailPriceEvent="detailPriceEvent"></table-product-om>
			<product-mobile-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-mobile-popup>
			<product-sku-popup :show="dialogTableVisible2" :id="detail_id" @setShow="setShow2"></product-sku-popup>
		</div>
	</div>
</template>

<script setup lang='ts'>
import router from "@/router/guard"
import { reactive, ref, inject, onMounted, toRefs, watch, computed } from 'vue'
const $api: any = inject('$api')
import { cateStore } from '@/stores/cate'
import { userStore } from '@/stores/user'
const user = userStore()
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
const { role } = toRefs(user)
const cate = cateStore()
// $api.product() 
const detail_id = ref('');
const login = ref('');
const dialogTableVisible = ref(false);
const dialogTableVisible2 = ref(false);
const title = computed(() => {
	if (login.value) {
		return `当前商家LOGIN：${login.value}`
	}
	return ''
})

const customParams = computed(() => {
	return {
		login: login.value
	}
})
const isParams = computed(() => Object.keys(router.currentRoute.value.query).length > 0 ? true : false)
watch(
	() => router.currentRoute.value.query,
	(n) => {
		login.value = n.login
	},
	{
		deep: true,
		immediate: true
	}
)
function closeEvent() {
	router.replace({ name: 'om_product_list' })
}
function detailEvent(data) {
	detail_id.value = data;
	dialogTableVisible.value = true
}
function detailPriceEvent(data) {
	detail_id.value = data;
	dialogTableVisible2.value = true
}


function setShow(v) {
	dialogTableVisible.value = v
}
function setShow2(v) {
	dialogTableVisible2.value = v
}
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;
}
</style>