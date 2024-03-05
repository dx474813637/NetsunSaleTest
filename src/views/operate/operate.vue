<!--  -->
<template>
	<el-affix @change="headerAffixChange">
		<header-user :customStyle="headerAffixStatus? {
			background: '#fff',
			boxShadow: '0 5px 5px rgba(90,90,90,.08)'
		} :  {
			background: 'transparent',
			boxShadow: 'none'
		}"></header-user>
	</el-affix>
	
	<div class="user-wrap " >
		<div class="home-w u-flex u-flex-items-start u-p-t-15 box-border">
			<div class="item item-menus" v-if="false">  
				<el-affix :offset="76">
					<div class="u-p-5 u-radius-8 bg-white menus-w box-border">
						<el-scrollbar height="100%" >
							<el-menu
								:default-active="menuActive"
								class="el-menu-vertical-demo"
								router 
								@open="handleOpen"
								@close="handleClose"
								>
								<template  v-for="item in menuListAll" >
									<el-sub-menu  
										v-if="item.children && item.children.length > 0" 
										:index="item.index" 
										:key="item.index"
										>
										<template #title>
											<!-- <el-icon>
												<component :is="item.icon"></component>
											</el-icon> -->
											<i class="iconfont" :class="item.icon" ></i> 
											<span class="menu-title" >{{item.label}}</span>
										</template>
										<el-menu-item 
											v-for="ele in item.children" 
											:index="ele.index" 
											:key="ele.index"
											:route="ele.route" 
											>
											
											<!-- <i class="custom-icon" :class="ele.icon" v-if="ele.icon" ></i>
											<span slot="title">{{ele.label}}</span> -->
											<template #title>
												<template v-if="ele.hasOwnProperty('url')">
													<view class="u-flex u-flex-between" @click="gotoOtherPage(ele)">
														<view class="item-left"> 
															<span>{{ele.label}}</span>
														</view> 
													</view>
													<!-- <view class="u-flex u-flex-between u-flex-1" > 
														<el-text tag="a" style="display: block; width: 100%;" :href="ele.url" >{{ele.label}}</el-text>
													</view>  -->
												</template>
												<view class="u-flex u-flex-between" v-else>
													<view class="item-left"> 
														<span>{{ele.label}}</span> 
													
														<el-icon size="15" v-show="ele.hasOwnProperty('tag')">
															<WarningFilled v-if="ele.tag == 'error'" style="color: #f30404" />
															<SuccessFilled v-if="ele.tag == 'success'" style="color: #38cb30" />
														</el-icon>  
													</view>
													<!-- <view class="item-right">
														<template v-if="ele.active == 'cart'">
															<text class="num" v-if="cartNumTotal > 0">{{cartNumTotal}}</text>
														</template>
														
													</view> -->
												</view>
											</template>
											
										</el-menu-item>
									</el-sub-menu>
									<el-menu-item v-else @click="funcClick(item)" class="logout">
										<!-- <el-icon>
											<component :is="item.icon"></component>
										</el-icon> -->
										<span >{{item.label}}</span>
									</el-menu-item>
								</template> 
							</el-menu>
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
	
	<!-- <footer-help></footer-help> -->
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs  } from "vue"; 
import router from "@/router/guard" 
import {
    WarningFilled, SuccessFilled
} from '@element-plus/icons-vue'
import {useSettingsStore} from '@/stores/settings'
import {cateStore} from '@/stores/cate'
import {userStore} from '@/stores/user'
import {useFinanceStore} from '@/stores/finance'
const useSettings = useSettingsStore()
const cate = cateStore()
const finance = useFinanceStore()
const {menuListAll, menuList} = toRefs(cate)
const { account_info, organizations_info } = toRefs(finance)
const { webview } = toRefs(useSettings)
const user = userStore() 
const {cpy_info} = toRefs(user)
const menuActive = ref('product_list')

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
]
onMounted(async () => {
	cate.getWarehouseData()
	cate.getMenusData()
	await user.getCpyData(true)
	// user.getRoleData()
})
 
const btnActive = computed(() => { 
	return addBtnList.filter(ele => ele.name == menuActive.value)[0]
})
const handleOpen = (key: string, keyPath: string[]) => {
	// console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
	// console.log(key, keyPath);
};
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
watch(
	() => cpy_info.value,
	(newValue:any) => { 
		menuList.value.some(ele => {
			if(ele.index == 1) {
				ele.children.forEach(item => {
					if(item.index == 'shop_info' ) {
						item.tag = newValue.rz == 1? 'success': 'error'
						item.msg = newValue.rz == 1? '已认证': '未认证'
					}
				})
				return true
			}
			return false
		})
	},
	{immediate: true, deep: true}
)

const funcClick = (item) => {
	if(item.index == 'logout') {
		user.logout()
		useSettings.goLogin() 
	}
	else if(item.index == 'fx') {
		const target = router.resolve({
			name: 'fx_helper'
		})
		window.open(target.href, '_blank')
	}
}

const onBack = () => {
	router.go(-1) 
}

function headerAffixChange(e) {
	// console.log(e)
	headerAffixStatus.value = e
}
function gotoOtherPage(ele) {
	if(ele.hasOwnProperty('linkWay')) {
		location.href = ele.url
		return
	}
	localStorage.setItem('webview', JSON.stringify(ele))
	webview.value = ele
	router.push({ 
		name: 'web_view', 
	})
}

</script> 
<style lang="scss" scoped> 
$user-menus-w: 0px;
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
</style>
