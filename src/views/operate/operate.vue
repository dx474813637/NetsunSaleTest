<!--  -->
<template>
	<!-- <el-affix @change="headerAffixChange">
		<header-user :customStyle="headerAffixStatus? {
			background: '#fff',
			boxShadow: '0 5px 5px rgba(90,90,90,.08)'
		} :  {
			background: 'transparent',
			boxShadow: 'none'
		}"></header-user>
	</el-affix> -->
	
	<el-drawer custom-class="menus-drawer" v-model="menusShow" :with-header="false" value="ltr" size="80vw">
		<div style="height: calc(100% - 40px);">
			<menus-index class="menus-h5" mode="operate"></menus-index>
		</div>
		<div class="u-flex u-flex-items-center u-flex-between u-p-15 box-border return-w"
			@click="router.push({name: 'product_list'})" 
			style="height: 40px;cursor: pointer;">
			<div class="item u-flex u-flex-items-center">
				<el-icon ><Operation /></el-icon>
				<el-text class="u-m-l-10 ">商家中心</el-text>
			</div>
			<div class="item">
				<el-icon size="14"><ArrowRight /></el-icon>
			</div>
		</div>
	</el-drawer>
	<div class="user-wrap " >
		<div class="home-w u-flex u-flex-items-start u-p-t-15 box-border">
			<div class="item item-menus u-m-r-20" v-if="true">  
				<el-affix :offset="15">
					<div class="u-p-5 menus-w box-border base-shadow">
						<div style="height: calc(100% - 40px);">
							<el-scrollbar height="100%" > 
								<menus-index mode="operate"></menus-index>
							</el-scrollbar> 
						</div>
						
						<div class="u-flex u-flex-items-center u-flex-between text-white u-p-15 box-border return-w"
							@click="router.push({name: 'product_list'})" 
							style="height: 40px;cursor: pointer;">
							<div class="item u-flex u-flex-items-center">
								<el-icon color="#fff"><Operation /></el-icon>
								<el-text class="u-m-l-10 text-white">商家中心</el-text>
							</div>
							<div class="item">
								<el-icon size="14"><ArrowRight /></el-icon>
							</div>
						</div>
					</div>
					
				</el-affix>
				
			</div>
			
			
			<div class="item item-main u-flex-column u-flex-items-start">
				<el-affix :offset="15" style="width: 100%;">
					<el-page-header class="u-p-15 u-radius-15 box-border base-shadow u-m-b-15 page-header" style="width: 100%;"  title="后退"  @back="onBack"> 
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
								color="#626aef"
								dark
								:icon="btnActive.icon"
								v-if="btnActive && !isH5" 
								class="text-bold u-font-13 u-radius-10"
								@click="router.push({name: btnActive.to.name})"
								> 
								{{ btnActive.title }} 
							</el-button>
						</template>
						<!-- <div class="mt-4 text-sm font-bold">
							Your additional content can be added with default slot, You may put as
							many content as you want here.
						</div> -->
					</el-page-header>
				</el-affix>
				
				<router-view class="u-flex-1 base-shadow" style="width: 100%;" :key="routerPath"></router-view>
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
const { webview, isH5 } = toRefs(useSettings)
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
		name: 'workers_list',
		title: '绑定员工',
		icon: 'CirclePlus',
		to: {
			name: 'workers_add'
		}
	},
]
const openeds = computed(() => menuListAll.value.map(ele => ele.index))
onMounted(async () => {
	// cate.getWarehouseData()
	// cate.getMenusData()
	// await user.getCpyData(true)
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
		// console.log(newValue.name) 
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
@import '@/styles/iconfont.css';
@import '@/styles/operate.scss';
@import '@/styles/mediaScreen.scss';
.return-w {
	border-top: 1px solid #4b549d;
	transition: all .3s;
	&:hover {
		background-color: rgba(0,0,0,.1);
	}
}
.page-header {
	background-image: radial-gradient(transparent 1px, #fff 1px);
	background-size: 5px 5px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
	position: relative;
	z-index: 50;
}
// $user-menus-w: 0px;

.user-wrap {
	width: 100%;
	::v-deep {
		.el-menu-item {
			color: #E7EEF8;
			&.is-active {
				color: #fff;
			}
		}
		.el-sub-menu__title,
		.logout {
			font-weight: bold;
			color: #333;
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
	// height: calc(100vh - ($header-h) - 20px);
	height: calc(100vh - 30px);
	box-sizing: border-box;
	width: 100%;
	border-radius: 1rem;
	background-color: #2b326e; 
}
.item-main {
	// background-color: #fff;
	flex: 0 0 calc(100% - $user-menus-w);
	width: calc(100% - $user-menus-w);
	// min-height: calc(100vh - 20px - ($header-h));
	min-height: calc(100vh - 30px);
	margin-bottom: 15px;
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
	.menus-drawer {
		background-color: #2b326e!important;  
			.el-drawer__body {
				background-color: #2b326e!important; 
			} 
	}  
	

</style>
