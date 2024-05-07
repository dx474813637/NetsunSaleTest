<!--  -->
<template>
	<div class="list-main-box u-p-t-10 u-p-b-10" v-loading="loading">
		<div class="list">
			<template v-if="!product_list || product_list.length == 0">
				<div class="u-flex u-flex-center u-p-t-30" style="width: 100%; background-color: #fff;">
					<el-empty description="列表为空" />
				</div>
			</template>
			<div class="list-item u-m-b-10" v-for="item in product_list" :key="item.id">
				<product-card :origin="item"></product-card>
			</div>
		</div>

	</div>
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const $api: any = inject('$api')
import { cateStore } from '@/stores/cate'
const cate = cateStore()
// $api.product() 
const detail_id = ref('');
const dialogTableVisible = ref(false);
function detailEvent(data) {
	detail_id.value = data;
	dialogTableVisible.value = true
}

const product_list = ref([])
const loading = ref(false)
onMounted(async () => {
	await getProductData()
})

async function getProductData() {
	const res = await $api.product({ loading: false })
	if (res.code == 1) {
		product_list.value = res.list
	}
}
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;
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