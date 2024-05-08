<!--  -->
<template>
	<div class="u-p-10 box"> 
		<table-order :customParams="customParams" @detailEvent="detailEvent"></table-order>

		<product-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-popup> 
	</div>
</template>
  
<script setup lang='ts'>
import { computed, ref, inject, onMounted } from 'vue'
const $api: any = inject('$api')
const tabs_list = ref([
	{ label: '全部状态', value: '' },
	{ label: '待付款', value: '0' },
	{ label: '付款成功', value: '1' },
	{ label: '待收货', value: '2' },
	{ label: '已完成', value: '3' },
	{ label: '评分完成', value: '4' },
	{ label: '申请退款', value: '5' },
	// { label: '拒绝退款', value: '6' },
	{ label: '订单关闭', value: '7' }
])
const tabs_list2 = ref([
	{ label: '我是卖家', value: '' },
	{ label: '我是买家', value: '1' },
])
const value = ref('');
const role = ref('');
const customParams = computed(() => {
	return {
		type: value.value,
		role: role.value
	}
})
onMounted(() => {
	$api.order_detail({params: {order_id: 1}})
})
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
	::v-deep {
		.el-tabs {
			// --el-tabs-header-height: 50px!important;
		}
		
		.el-tabs__item {
			// color: #707173; 
		}
		.el-tabs__item.is-active {
			color: var(--el-color-primary);
		}
		.el-tabs__nav-wrap::after {
			height: 1px;
		}
	}
}

</style>