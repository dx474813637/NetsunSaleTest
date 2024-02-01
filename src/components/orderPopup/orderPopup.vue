<template>
    <el-dialog v-model="dialogTableVisible" width="1000px" title="商品详情" @open="open" :close-on-press-escape="false" >
        <div class="home-w">
			<div class="cart-box u-flex-y u-flex-items-start u-p-20">
				<div class="shop-item u-flex-1 " >
					<el-card class="box-card" shadow="hover">
						<template #header>
							<div class="card-header u-flex u-flex-between">
								<div class="item u-flex">
									订单【{{id}}】详情
								</div>
							</div>
						</template>
						<div class="products-item">
							<el-table :data="list.pid" style="width: 100%">
								<el-table-column label="预览图" width="100" align="center">
									<template #default="{ row }">
										<el-image style="width: 60px; height: 60px; border-radius: 5px;" :src="row.img"
											fit="cover" lazy />
									</template>
								</el-table-column>
								<el-table-column label="商品信息">
									<template #default="{ row }">
										<div> 
											<el-text tag="b" size="large">{{ row.name }}</el-text> 
										</div>
										<div>
											<el-text type="info" size="small" v-for="item in row.specs_arr">
												{{ item.label }}：{{item.value }}；
											</el-text>
										</div>
									</template>
								</el-table-column>
								<el-table-column label="单价" prop="price" align="center" width="120"></el-table-column>
								<el-table-column label="数量" width="120" align="center">
									<template #default="{ row }">
										<span class="u-p-r-10">×</span><span>{{ row.num }}</span>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</el-card>
				</div>
			</div>
			<div class="content-addr-wrap" v-if="addressData.id" v-loading="address_loading">
				<div class="letter-box u-radius-10">
					<div class="letter-border u-radius-10">
						<div class="u-flex u-p-b-10">
							<div class="item-left u-m-r-20 u-flex "> 
								<div class="name u-m-r-10">{{ addressData.name }}</div>
								<div class="mobile">{{ addressData.tel }}</div>
							</div>  
						</div>
						<div class="u-flex address u-line-2">
							{{ addressData.area_name }}
							{{ addressData.address }}
						</div>
					</div>
				</div>
			</div>

			<div class="u-p-20 box">
				<el-row :gutter="10" v-if="list.login">
					<el-col :span="5">
						<div class="grid-content label">买家账号</div>
					</el-col>
					<el-col :span="19">
						<div class="grid-content content">{{ list.login }}</div>
					</el-col>
				</el-row>
				 
				<el-row :gutter="10">
					<el-col :span="5">
						<div class="grid-content label">订单创建时间</div>
					</el-col>
					<el-col :span="19">
						<div class="grid-content content">{{ list.ctime }}</div>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="5">
						<div class="grid-content label">订单状态</div>
					</el-col>
					<el-col :span="19">
						<div class="grid-content content">
							<el-text type="danger" v-if="list.status == '6'">{{ $filters.order_status(list.status) }}</el-text>
							<el-text type="success" v-else-if="list.status == '3' || list.status == '4'" >{{ $filters.order_status(list.status) }}</el-text>
							<el-text type="warning" v-else >{{ $filters.order_status(list.status) }}</el-text>
						</div>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="5">
						<div class="grid-content label">总金额</div>
					</el-col>
					<el-col :span="19">
						<div class="grid-content content u-flex">
							<el-statistic :precision="2" :value="list.total_fee" value-style="font-size: 14px" />
							<el-text type="info" class="u-m-l-10">元</el-text>
						</div>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="5">
						<div class="grid-content label">订单评分</div>
					</el-col>
					<el-col :span="19">
						<div class="grid-content content">
							<span class="u-m-r-10">{{ list.score }} 分</span>
							<el-rate :value="list.score" disabled />
						</div>
					</el-col>
				</el-row> 
			</div>
        </div>
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
const list = ref({})
const sell_info = ref({})
const buy_info = ref({})
const addressData = ref({})
const address_loading = ref(false)
const showRate = ref(false)
const score = ref(1)
// const {
//     sku2treeData 
// } = useProductSku()
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
onMounted(async () => { 
	
}) 
const getData = async () => {
	const res = await $api.order_detail({ params: { order_id: props.id } })
	if (res.code == 1) {
		list.value = res.list
		addressData.value = res.list.address
		// sell_info.value = res.sell_info
		// buy_info.value = res.buy_info
	} 
} 
// async function getAddressData() { 
// 	const res = await $api.address_detail({ params: { address_id: list.value.address_id }, loading: false })
// 	if (res.code == 1) {
// 		addressData.value = res.list 
// 	}
// } 
async function open() {
	initData()
    await getData() 
	// try {
	// 	address_loading.value = true
	// 	await getAddressData()
	// } catch (error) {
		
	// }
	// address_loading.value = false
}
function initData() {
	list.value = {}
	// sell_info.value = {}
	// buy_info.value = {} 
}
 
</script>
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
.box {
	@extend %box-sizing;
}

.el-row {
	// margin-bottom: 6px;
	padding: 6px;
	border-radius: 5px;
	transition: all .3s;

	&:hover {
		background-color: #f8f8f8;

		.grid-content.content {
			box-shadow: 0 0 10px rgba(0, 0, 0, .1);
		}
	}
}

.grid-content {
	height: 35px;
	line-height: 35px;
	border-radius: 4px;
	font-size: 15px;

	&.label {
		color: #666;
		// text-align: right;

	}

	&.content {
		@extend %box-sizing;
		background-color: #f9fafc;
		padding: 0px 20px;
		transition: all .3s;
		;
	}
}

.letter-border {
	padding: 30px;
	background: #fdfdfd;
	@extend %box-sizing;
}

.letter-box {
	@extend %box-sizing;
	padding: 4px;
	box-sizing: border-box;
	background: linear-gradient(45deg,
			#f22121 12.5%,
			#ebe4f8 12.5%,
			#ebe4f8 25%,
			#2c6dd6 25%,
			#2c6dd6 37.5%,
			#ebe4f8 37.5%,
			#ebe4f8 50%,
			#f22121 50%,
			#f22121 62.5%,
			#ebe4f8 62.5%,
			#ebe4f8 75%,
			#2c6dd6 75%,
			#2c6dd6 87.5%,
			#ebe4f8 87.5%,
			#ebe4f8 100%);
	background-size: 70px 70px;
}
.content-addr-wrap {
	padding: 10px 20px 10px;
	width: 100%;
	@extend %box-sizing;
	.name {}

	.address {
		color: #888;
		font-size: 14px;
	}

	.mobile {}
}

.cart-box {
	height: 100%;
	@extend %box-sizing;
	.cart-box-footer {
		@extend %box-sizing;
		height: 100px;
		width: 100%;
		background-color: #fff;
		.cart-box-footer-w {
			@extend %box-sizing;
			width: 100%; 
			background-color: #fff;
			height: 100px;
			// box-shadow: var(--el-box-shadow-lighter);
			.cart-box-footer-box {
				@extend %box-sizing;
				border-radius: 0 0 10px 10px;
			border: 1px solid var(--el-border-color);
				width: 100%;
				height: 100%;
			}
		}
	}
}
.cart-box-main {
	width: 100%;
	min-height: 60vh;
}

.shop-item {
	width: 100%; 
	@extend %box-sizing;
	::v-deep {
		.el-loading-spinner {
			--el-loading-spinner-size: 20px;
			color: $uni-color-primary;
		}
		.el-table thead {
			// display: none;
		}
		.el-card__header {
			background-color: #f8f8f8;
			padding-top: 10px;
			padding-bottom: 10px;
		}
	}
	.el-card {
		--el-card-border-radius: 20px;
		
	}
}
.cart-box-footer {
	@extend %box-sizing;
	height: 100px;
	width: 100%;
	background-color: #fff;
	.cart-box-footer-w {
		@extend %box-sizing;
		width: 100%; 
		background-color: #fff;
		height: 100px;
		// box-shadow: var(--el-box-shadow-lighter);
		.cart-box-footer-box {
			@extend %box-sizing;
			// border-radius: 0 0 10px 10px;
			border-top: 1px solid var(--el-border-color);
			width: 100%;
			height: 100%;
		}
	}
}
</style>