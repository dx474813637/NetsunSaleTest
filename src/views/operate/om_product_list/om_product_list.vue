<!--  -->
<template>
	<!-- <div class="u-p-15 box u-radius-15 bg-white u-flex u-flex-items-center u-flex-between ">
		<div class="item"></div>
		<div class="item">

		</div>
	</div> -->
	<div class="u-p-15 box u-radius-15 bg-white ">
		<table-product-om @detailEvent="detailEvent" @detailPriceEvent="detailPriceEvent"></table-product-om>
		<product-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-popup>
		<product-sku-popup :show="dialogTableVisible2" :id="detail_id" @setShow="setShow2"></product-sku-popup>
	</div>
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted, toRefs } from 'vue'
const $api: any = inject('$api')
import { cateStore } from '@/stores/cate'
import { userStore } from '@/stores/user'
const user = userStore()
const { role } = toRefs(user)
const cate = cateStore()
// $api.product() 
const detail_id = ref('');
const dialogTableVisible = ref(false);
const dialogTableVisible2 = ref(false);
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