<!--  -->
<template>
	<div class="list-main-box bg-white box-border " v-loading="loading">
		<div class="list-title u-m-b-20 u-flex u-flex-between" v-if="title">
			<div class="u-font-18 text-bold">{{ title }}</div> 
		</div>
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
	<div class="list-page-box u-p-t-40 u-p-b-40">
		<el-pagination
			v-model:current-page="curP" 
			hide-on-single-page
			background
			layout="prev, pager, next, slot"
			:total="product_total" 
		>
			<span class="u-p-l-10">共 {{ product_total }} 个商品</span>
		</el-pagination>
	</div>
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted, computed, watch, toRefs } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const $api: any = inject('$api')
import router from '@/router';
import { cateStore } from '@/stores/cate'
const cate = cateStore()
const {cate_list_all} = toRefs(cate) 
// $api.product()  
const title = computed(() => {
	if(cate_list_all.length == 0 || cate_active.value === '') return '商品列表'
	return cate_list_all.value.filter(ele => ele.id == cate_active.value)[0]?.name
})
const product_list = ref([])
const product_total = ref(0)
const loading = ref(false) 
const cate_active = ref('') 
const curP = ref(1)
const params = computed(() => { 
    return {
        p: curP.value, 
        cate: cate_active.value,
        // num: pageSize.value
    }
})
watch(
    () => router.currentRoute.value,
    async (n) => { 
        console.log(n)
        initParams() 
    },
    {  
        immediate: true,
        deep: true
    }
)
watch(
    () => params.value,
    async (n) => { 
        loading.value = true
        try {
            await getProductData()
        } catch (error) {
            
        }
        loading.value = false
        
    },
    {  
        immediate: true,
        deep: true
    }
)
onMounted(async () => {
	await getProductData()
})

function initParams() { 
    cate_active.value = router.currentRoute.value.query.cate 
   
}
async function getProductData() {
	const res = await $api.product({ params: params.value, loading: false })
	if (res.code == 1) {
		product_list.value = res.list
        product_total.value = +res.total
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