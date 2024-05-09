<!--  -->
<template>
	<div class="list-main-box u-p-20 bg-white" v-loading="loading">
		<div class="list-title u-m-b-20 u-flex u-flex-between">
			<div class="u-font-18 text-bold">{{ title }}</div>
			<el-link @click="router.push({path: '/index/product_list', query: {cate: cate}})">更多 >></el-link>
		</div>
		<div class="list">
			<template v-if="!product_list || product_list.length == 0">
				<div class="u-flex u-flex-center u-p-t-30" style="width: 100%; background-color: #fff;">
					<el-empty description="列表为空" />
				</div>
			</template>
			<div class="list-item u-m-b-10" v-for="item in product_list.slice(0, 6)" :key="item.id">
				<product-card :origin="item"></product-card>
			</div>
		</div>

	</div>
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const $api: any = inject('$api')
import router from '@/router';
// import { cateStore } from '@/stores/cate' 
// const cate = cateStore() 
const props = defineProps({
	cate: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		default: ''
	},
})
const product_list = ref([])
const loading = ref(false)
onMounted(async () => { 
	// console.log(props.cate)
	loading.value = true
	await getProductData()
	loading.value = false
})
 
async function getProductData() { 
	const res = await $api.product({ params: { cate: props.cate}, loading: false }) 
	if (res.code == 1) {
		product_list.value = res.list
	}
}
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;
}
.list-main-box {
	width: 100%
}
.list {
	@include flex(x, start, start);
	flex-wrap: wrap;

	.list-item {
		flex: 0 0 15%;
		width: 15%;
		margin-right: 2%;

		&:nth-of-type(6n) {
			margin-right: 0;
		}
	}
}
</style>