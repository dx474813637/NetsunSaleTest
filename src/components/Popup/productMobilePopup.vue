<template>
    <el-dialog customClass="cusTomClass" v-model="dialogTableVisible" width="600px" title="商品详情" @open="open" :close-on-press-escape="false" >
        <div class="home-w">
			<div class="img-w">
				<!-- <product-focusing :imgs="picArr" :index="activeIndex"></product-focusing> -->
				<el-carousel trigger="click" height="560px">
					<el-carousel-item v-for="(item, index) in picArr" :key="index">
						<el-image style="height: 100%;" :src="item"  fit="contain"></el-image>
					</el-carousel-item>
				</el-carousel>
			</div>
            <el-row> 
                <el-col :span="24" :xs="24">
                    <div class="main-center">
						<div class="u-flex u-flex-items-center u-flex-between u-m-b-10">
							<div class="item">
								<el-text type="danger">到手价 ￥</el-text>
								<el-text type="danger" tag="b" class="u-font-24 ">{{ product_base_data.price1 }}</el-text>
								<el-text type="danger">起</el-text>
								<el-text tag="del" type="danger" class="u-m-l-15" >￥{{ product_base_data.price }}</el-text>
							</div>
							<div class="item">
								<el-text type="info">已售 {{ product_base_data.sales_volume }}</el-text>
							</div>
						</div> 
                        <div class="product-title u-m-b-10">
                            <el-text class="u-font-24 u-line-2" style="line-height: 30px;">{{ product_base_data.name }}</el-text>
                        </div>
                        <div class="product-sub u-m-b-10">
                            <el-text type="info">{{ product_base_data.recommend_remark }}</el-text>
                        </div>
                        <div class="product-fahuo u-m-b-5">
                            <div class="u-flex u-flex-items-start info-row">
                                <div class="info-row-item info-row-item-label">商家：</div>
                                <div
                                    class="info-row-item info-row-item-content u-flex u-flex-items-start u-flex-wrap u-m-l-5">
                                    <el-text>{{ product_shop_data.company }}</el-text>
                                </div>
                            </div>
                        </div>
                        <div class="product-fahuo u-m-b-5">
                            <div class="u-flex u-flex-items-start info-row">
                                <div class="info-row-item info-row-item-label">发货：</div>
                                <div
                                    class="info-row-item info-row-item-content u-flex u-flex-items-start u-flex-wrap u-m-l-5">
                                    <el-text>预计 {{ product_base_data.delivery_delay_day }} 天内发货</el-text>
                                </div>
                            </div>
                        </div>
                        <div class="product-fahuo u-m-b-5">
                            <div class="u-flex u-flex-items-start info-row">
                                <div class="info-row-item info-row-item-label">分类：</div>
                                <div
                                    class="info-row-item info-row-item-content u-flex u-flex-items-start u-flex-wrap u-m-l-5">
                                    <el-text>{{cate_active_name}}</el-text>
                                </div>
                            </div>
                        </div>
                        <div class="product-service u-m-b-5">
                            <div class="u-flex u-flex-items-start info-row">
                                <div class="info-row-item info-row-item-label">服务：</div>
                                <div
                                    class="info-row-item info-row-item-content u-flex u-flex-items-start u-flex-wrap u-m-l-5">
                                    <el-text>{{ freight_name }}</el-text>
                                </div>
                            </div>
                        </div>
                         
                        <div class="u-flex u-flex-items-start info-row u-m-b-10" v-for="(item, index) in product_sku.data"
                            :key="index">
                            <div class="info-row-item info-row-item-label sku-label">
                                {{ item.label }}：
                            </div>
                            <div class="info-row-item info-row-item-content u-flex u-flex-items-start u-flex-wrap u-m-l-5">
                                <div class="content-item u-m-r-10 u-m-b-10 radio" v-for="(ele, i) in item.children"
                                    :key="i">
                                    <el-check-tag :checked="product_sku.form[item.label] == ele.label" 
										@change="skuClick(item.label, ele.label)">{{ ele.label }}</el-check-tag>
                                </div>
                            </div>
                        </div>    
						<div class="u-flex u-flex-items-start info-row u-m-b-10" v-show="active_sku_preview_img">
							<div class="info-row-item info-row-item-label sku-label">预览：</div>
							<div class="info-row-item info-row-item-content u-flex u-flex-items-start u-flex-wrap u-m-l-5">
								<div class="content-item u-m-r-10 u-m-b-10 u-border" >
									<el-image
										style="width: 80px; height: 80px; border: 2px solid #ECF5FF;"
										:src="active_sku_preview_img"
										:zoom-rate="1.2"
										:preview-src-list="[active_sku_preview_img]" 
										fit="cover"
										/>
								</div>
							</div>
						</div>
                    </div>
					<div class="u-flex u-flex-items-start info-row u-m-b-10" v-if="skuCheck">
						<div class="info-row-item info-row-item-label sku-label">库存：</div>
						<div class="info-row-item info-row-item-content u-flex u-flex-items-start u-flex-wrap u-m-l-5">
							<div class="content-item u-m-r-10 u-m-b-10" >
								{{ product_num_max }}
							</div>
						</div>
					</div>
					<div class="u-flex u-flex-items-start info-row u-m-b-10 " v-if="product_base_data.attribute && product_base_data.attribute.length > 0">
						<div class="u-flex u-flex-wrap u-flex-items-start attribute-box u-p-10" style="width: 100%;">
							<div class="item u-flex u-flex-items-start u-m-b-10"
								v-for="(item, index) in product_base_data.attribute"
								:key="index"
								>
								<el-text type="info" size="small" >{{ item.name }}：</el-text>
								<el-text type="" size="small" class="u-flex-1 u-p-r-10" >{{ item.value }}</el-text>
							</div>
						</div> 
					</div>
                </el-col>
            </el-row>
			<el-row>
				<el-col :span="24"> 
					<el-image v-for="(item, index) in descriptionArr" :key="index"
						:src="item"
						lazy
						style="width: 100%;display: block;"
					></el-image>  
				</el-col>
			</el-row>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, inject, toRefs, computed, watch } from 'vue';   
import { cateStore } from '@/stores/cate'; 
const cate = cateStore();
import useProductSku from '@/hook/useProductSku.ts'
import {isObjectEqual} from '@/utils/index'
let { freight_list, cate_list } = toRefs(cate);  
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
 
const cate_active_name = computed(() => {
	if(!product_base_data.value.id || cate_list.value.length == 0) return '' 
	return cate_list.value.map(ele => ele.children).flat().filter(ele => ele.id == product_base_data.value.cate)[0]?.name
})
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
	if(cate_list.value.length == 0) {
		cate.getCateData()
	}
}) 
const getData = async () => {
	const res = await $api.product_detail({ params: { id: props.id } })
	if(res.code == 1) {
		product_base_data.value = res.list
		spec_prices_data.value = res.spec_prices
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
		flex: 0 0 50%;
		@extend %box-sizing;
		.el-text {
			align-self: auto;
		}
	}
}
</style>