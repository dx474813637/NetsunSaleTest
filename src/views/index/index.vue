<!--  -->
<template>
	<el-affix @change="headerAffixChange">
		<header-user :customStyle="headerAffixStatus? {
			backgroundImage: 'radial-gradient(transparent 1px, #fff 1px)',
			boxShadow: '0 5px 5px rgba(90,90,90,.08)'
		} :  {
			backgroundImage: 'radial-gradient(transparent 1px, #F1F6FD 1px)',
			boxShadow: 'none'
		}"></header-user>
	</el-affix>
	
	<el-drawer v-model="menusShow" :with-header="false" append-to-body value="ltr" size="80vw">
		<menus-index class="menus-h5"></menus-index>
	</el-drawer>
	<div class="user-wrap " :class="{fx_mode: routerName == 'fx_helper'}">
		<div class="home-w u-flex u-flex-items-start u-p-t-15 box-border">
			<div class="item item-menus u-m-r-15" >  
				<el-affix class="menus-index-affix" :offset="76">
					<div class="u-p-5 u-radius-8 bg-white menus-w box-border">
						<el-scrollbar height="100%" >
							<menus-index></menus-index>
						</el-scrollbar> 
					</div>
					
				</el-affix>
				
			</div>
			
			
			<div class="item item-main u-radius-8 u-flex-column u-flex-items-start">
				<el-page-header class="u-p-10 u-p-t-20 box-border" style="width: 100%;"  title="后退"  @back="onBack"> 
					<template #icon >
						<el-icon class="text-base">
							<i-ep-ArrowLeft></i-ep-ArrowLeft>
						</el-icon>
					</template>
					<template #content>
						<el-text class="u-font-16 text-black" tag="b"> {{ useSettings.title }} </el-text>
						<el-text class="u-font-14 u-m-l-20" type="info"> {{ subTitle }} </el-text>
					</template>
					<template #extra>
						<el-button 
							type="primary" 
							plain 
							v-if="btnActive" 
							@click="router.push({name: btnActive.to.name})"
							>{{ btnActive.title }}</el-button>
					</template>
					<!-- <div class="mt-4 text-sm font-bold">
						Your additional content can be added with default slot, You may put as
						many content as you want here.
					</div> -->
				</el-page-header>
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
	<!-- <footer-help></footer-help> -->
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
		name: 'sub_acc',
		title: '新增子账户',
		to: {
			name: 'sub_acc_add'
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
		console.log(newValue.name) 
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
