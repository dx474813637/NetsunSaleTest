<!--  -->
<template>
	<el-affix @change="headerAffixChange" :z-index="2500">
		<header-user></header-user>
	</el-affix> 
	<div class="user-wrap u-m-b-30" :class="{fx_mode: routerName == 'fx_helper'}">
		<div class="home-w u-flex u-flex-items-start u-p-t-15 box-border">  
			<div class="item item-main u-radius-8 u-flex-column u-flex-items-start u-p-20">
				 
				<router-view class="u-flex-1" style="width: 100%;" :key="routerPath"></router-view>
			</div>
		</div>
	</div>
	<div class="menus-btn-h5">
		<el-button 
			type="primary" 
			class="u-font-25" 
			size="large" 
			icon="Operation" 
			circle 
			@click="menusShow = !menusShow"
		/>
	</div> 
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs  } from "vue"; 
import router from "@/router/guard"  
import {useSettingsStore} from '@/stores/settings'
import {cateStore} from '@/stores/cate'
import {userStore} from '@/stores/user' 
const useSettings = useSettingsStore()
const cate = cateStore() 
const {menuListAll, menuList} = toRefs(cate)  
const user = userStore() 
const {cpy_info} = toRefs(user)
const { webview, isH5 } = toRefs(useSettings)
const menuActive = ref('product_list')
const menusShow = ref(false)

const headerAffixStatus = ref(false)

const routerPath = computed(() => { 
	return router.currentRoute.value.fullPath
})
const routerName = computed(() => { 
	return router.currentRoute.value.name
})
const addBtnList = [
	// {
	// 	name: 'address_list',
	// 	title: '新增地址',
	// 	to: {
	// 		name: 'address_add'
	// 	}
	// },
	{
		name: 'product_list',
		title: '新增商品',
		to: {
			name: 'product_add'
		}
	},
	{
		name: 'express_list',
		title: '新增物流配置',
		to: {
			name: 'express_add'
		}
	},
	{
		name: 'sub_acc',
		title: '新增子账户',
		to: {
			name: 'sub_acc_add'
		}
	},
	{
		name: 'statement_list',
		title: '新增提现',
		to: {
			name: 'out_pay_apply'
		}
	},
]
onMounted(async () => {
	// cate.getWarehouseData() 
})
 
const btnActive = computed(() => { 
	return addBtnList.filter(ele => ele.name == menuActive.value)[0]
}) 
const subTitle = computed(() => {
	return menuListAll.value.filter(ele => {
		return ele.children && ele.children.some(item => {
			return item.index == menuActive.value
		})
	})[0]?.label
})
// const subTitle = computed(() => menuListAll.filter(ele => ele?.children.some(item => item.index == menuActive.value))[0].label)

watch(
	() => router.currentRoute.value,
	(newValue:any) => {
		// console.log(newValue.name) 
		menuActive.value = newValue.name
	},
	{immediate: true, deep: true}
)  
const onBack = () => {
	router.go(-1) 
}

function headerAffixChange(e) {
	// console.log(e)
	headerAffixStatus.value = e
} 
</script> 
<style lang="scss" scoped> 
@import '@/styles/iconfont.css';
@import '@/styles/mediaScreen.scss';
.el-menu {
	border-right: 0;

	// transition: width 0.15s;
	// -webkit-transition: width 0.15s;
	// -moz-transition: width 0.15s;
	// -webkit-transition: width 0.15s;
	// -o-transition: width 0.15s; 
	::v-deep {
		.el-sub-menu__title {
			height: 40px;
			padding-left: 15px!important;
			.menu-title {
				font-weight: normal;
			} 
			.iconfont {
				padding-right: 5px;
			}
		}
		.el-sub-menu {
			box-sizing: border-box;
			width: 100%;
			margin-bottom: 15px;
			.el-menu {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				box-sizing: border-box;
				.el-menu-item {
					flex: 0 0 50%;
					width: 50%;
					padding: 0 15px;
					display: flex; 
					align-items: center;
					color: #555;
					font-size: 12px;
					height: 35px;
					.el-text {
						font-size: 12px;
					}
					&:hover {
						background-color: transparent;
						color: var(--el-color-primary);
					}
					&.is-active {
						color: var(--el-color-primary);
					}
				}
			}
		}
	}
}
.user-wrap {
	width: 100%;
	::v-deep {
		.el-menu-item {
			color: #888;
			&.is-active {
				color: $uni-color-primary;
			}
		}
		.el-sub-menu__title,
		.logout {
			font-weight: bold;
			color: #333;
		}
	}
	&.fx_mode {
		.home-w {
			min-width: 1440px;
			max-width: 100vw;
			padding-top: 0!important;
		}
		.item-menus.item {
			display: none;
		}
		.item-main.item {
			width: 100%;
			flex: 1;
			margin: 0!important;
			.el-page-header {
				display: none;
			}
		}
	}
} 
.item-menus {
	// background-color: #fff;	
	width: $user-menus-w;
	// position: fixed;
	// top: 96px;
	// z-index: 100;
	// height: calc(100vh - 96px); 
	
}
.menus-w {
	height: calc(100vh - ($header-h) - 20px);
	box-sizing: border-box;
	width: 100%;
}
.item-main {
	background-color: #fff;
	flex: 0 0 calc(100% - $user-menus-w);
	width: calc(100% - $user-menus-w);
	min-height: calc(100vh - 20px - ($header-h));
	// padding-left: 10px;
	// padding-right: 10px;
	@extend %box-sizing;
}
.el-page-header {
	::v-deep {
		.el-page-header__title {
			color: #999;
		}
	}
}
.menus-btn-h5 {
	display: none;
	position: fixed;
	right: 20px;
	bottom: 80px; 
	z-index: 80; 
	border-radius: 50%;
	overflow: hidden;
	.el-button {
		width: 50px;
		height: 50px;
	}
	@media (max-width: 768px) {
		display: block;
	}
}
</style>
