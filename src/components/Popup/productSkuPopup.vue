<template>
    <el-dialog customClass="cusTomClass" v-model="dialogTableVisible" width="70%" title="商品价格详情" @open="open" :close-on-press-escape="false" >
        <table-sku-price 
            maxHeight="50vh" 
			:dataList="spec_prices_data"
        ></table-sku-price> 
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, inject, toRefs, computed, watch } from 'vue';   
import { cateStore } from '@/stores/cate'; 
const cate = cateStore();
import useProductSku from '@/hook/useProductSku.ts'
import {isObjectEqual} from '@/utils/index'
let { freight_list } = toRefs(cate);  
const $api = inject('$api')
const props = defineProps({
	id: {
		type: String,
        detail: ''
	},
    show: {
        type: Boolean,
        detail: false
    }
});     
const {
    sku2treeData 
} = useProductSku()
const emit = defineEmits(["setShow"]);
const dialogTableVisible = computed({
    set(v) {
		console.log(v)
        emit('setShow', v)
    },
    get() {
        return props.show
    }
})
const product_base_data = ref({})
const picArr = computed(() => product_base_data.value.pic?.split('|') || []) 
const spec_prices_data = ref([])
const product_shop_data = ref({})
const product_sku = reactive<any>({
	data: {},
	form: {}
})     
const detailActive = ref('description')
const activeIndex = ref(0)
watch(
	() => product_base_data.value.sku,
	(val) => { 
		if(val) {
			product_sku.data = sku2treeData(val)
			product_sku.data.forEach(ele => {
				product_sku.form[ele.label] = ''
			}) 
		}
		
	}
)
 
const skuCheck = computed(() => !Object.values(product_sku.form).some(ele => !ele))
const product_num_max = ref(0)
const active_sku_preview_img = ref('')
const freight_name = computed(() => freight_list.value.filter(ele => ele.value == product_base_data.value?.freight_id)[0]?.label)
const descriptionArr = computed(() => product_base_data.value.description?.split('|'))
 
const skuPrice = computed(() => {
	let price = 0;
	let i = findIndexby()
	if(i != -1) {
		price =  +spec_prices_data.value[i].price
	}else {
		price =  +product_base_data.value.price || 0
	}
	return price
})
onMounted(async () => { 
	
}) 
const getData = async () => {
	const res = await $api.product_detail({ params: { id: props.id } })
	if(res.code == 1) {
		product_base_data.value = res.list
		spec_prices_data.value = res.spec_prices.map(ele => { 
			let skuArr = Object.keys(ele.specs)
			skuArr = skuArr.map(item => {
				return {
					label: item,
					value: ele.specs[item]
				}
			})
			return {
				...ele,
				skuArr 
			}
		})
		product_shop_data.value = res.company
	}
} 
const skuClick = (key:any, value:any) => {
	if(product_sku.form[key] == value) {
		value = ''
		active_sku_preview_img.value = ''
	}  
	product_sku.form[key] = value
	// checkSkuDisabled()
	if(Object.values(product_sku.form).filter(ele => !ele).length == 0) {
		setMaxCount()
	} 
	
	// console.log(product_sku.form)
	
}
function findIndexby () {
	return spec_prices_data.value.map(ele => ele.specs).findIndex(ele => isObjectEqual(ele, product_sku.form) );
}
function previewHoverEvent(index) {
	activeIndex.value = +index
}

async function open() {
	initData()
    await getData() 
}
function initData() {
	product_sku.form = {}
	activeIndex.value = 0
	active_sku_preview_img.value = ''
	product_num_max.value = 0
	product_base_data.value = {}
	spec_prices_data.value = []
}

function setMaxCount() {
	// console.log(product_sku.form)
	let i = spec_prices_data.value.map(ele => ele.specs).findIndex(ele => {
		// console.log(ele, product_sku.form)
		return isObjectEqual(ele, product_sku.form)
	})
	// console.log(i)
	if(i != -1) {
		let count = spec_prices_data.value[i].stock;
		// if(count == 0) {
		// 	product_num.value = 0
		// }
		product_num_max.value = count
		active_sku_preview_img.value = spec_prices_data.value[i].img
	}
} 
</script>
<!-- <style lang="scss">
	.cusTomClass {
		border-radius: 20px!important;
	}
</style> -->
<style lang='scss' scoped>
.main {
	.el-image {
		display: block;
	}
}

.shop-card {
	position: relative;
	overflow: hidden;
	border-radius: 5px;
	background-color: var(--el-color-primary-light-9);
	// min-height: 100%;
	@extend %box-sizing;
	&:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 120px;
		background-color: var(--el-color-primary);
	}
	.shop-box {
		position: relative;
		z-index: 20;
		border-radius: 5px;
		background-color: #fff;
		box-shadow: 0 0 10px rgba(0,0,0,.1); 
		.shop-row {
			line-height: 18px;
			margin-bottom: 14px;
			padding-bottom: 10px;
			border-bottom: 1px dashed var(--el-border-color);
			.el-text {

			}
			&.shop-header {
				border-bottom: 0;
			}
		}
		.shop-header {
			.shop-logo {
				flex: 0 0 40px;
				width: 40px;
				height: 40px;
				.el-avatar {
					width: 100%;
					height: 100%;
				}
			}
			.shop-name { 
			}
		}
	}
}
.preview-img-tabs {
	.el-tabs {
		--el-tabs-header-height: auto;
		::v-deep {
			.el-tabs__nav-wrap {
				margin-bottom: 0;
			}
			.el-tabs__item {
				padding: 5px!important;
			}
			.el-tabs__content {
				display: none;
			}
			.el-tabs__header {
				border-bottom: 0;
			}
		}
	}
	.preview-img {
		width: 50px;
		height: 50px;
	}
}
 
.product-title {
	line-height: 25px;
}
.product-price {
	height: 40px;
	background-color: var(--el-color-primary-light-9);
}
.product-data {
	border-top: 1px dashed var(--el-border-color);
	border-bottom: 1px dashed var(--el-border-color);
} 
.info-row {
	.info-row-item {
		&.info-row-item-label {
			font-size: 12px;
			flex: 0 0 3em;
			width: 3em;  
			color: #999;
			line-height: 30px; 
			&.sku-label {
				width: auto;
    			flex: 0 1 auto;
				min-width: 3em;
			}
		}
		&.info-row-item-content {
			line-height: 30px;
			.content-item {
				&.radio {
						::v-deep {
							.el-check-tag {
								font-weight: normal;
							}
							// .el-button:focus {
							// 	color: var(--el-button-text-color);
							// 	border-color: var(--el-button-border-color);
							// 	// background-color: var(--el-button-bg-color); 
							// }
							// .el-button:not(.is-disabled):hover {
							// 	color: var(--el-button-text-color);
							// 	border-color: var(--el-button-border-color);
							// 	background-color: var(--el-fill-color); 
							// }
							// .el-button.is-plain:hover,
							// .el-button.is-plain:focus { 
							// 	background-color: var(--el-button-bg-color); 
							// }
					}
				}
				
				&.active {

				}
			}
		}
	}
}
.attribute-box {
	background-color: #f8f8f8;
	.item {
		flex: 0 0 33%;
		@extend %box-sizing;
		.el-text {
			align-self: auto;
		}
	}
}
</style>