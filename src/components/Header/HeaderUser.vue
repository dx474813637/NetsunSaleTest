<template>
	<header class="header" id="header" :style="customStyle"> 
		<div class="header-main">
			<div class="home-w">
				<div class="main-logo">
					<a href="https://www.sunmaxx.cn/mall" title=""
						><img
							src="/logo.png"
							class="logo"
							alt=""
					/></a>
				</div>
				<div class="main-nav">
					<div class="nav-item">
						<el-link href="https://www.sunmaxx.cn">SunMaxx</el-link>
						<el-divider direction="vertical" />
						<el-link @click="router.push({name: 'order_list'})">{{ userid? '用户中心' : '登录'}}</el-link>
						<template v-if="userid? true : false">
							<el-divider direction="vertical" />
							<el-link type="danger" @click="logoutBtn" >登出</el-link>
						</template>
						
					</div>
					<!-- <div class="nav-item">
						<el-button  
							color="#626aef"
							dark
							icon="Shop" 
							class="u-font-13 u-radius-10"
							@click="router.push({name: 'product_list'})"
							>
							商品
						</el-button> 
					</div>    -->
				</div>
			</div>
		</div>
	</header>
	<div class="nav">
		<div class="home-w u-flex">
			<div class="nav-item" @click="router.push({name: 'home'})">
				<p>首页</p>
			</div>
			<div class="nav-item" @click="router.push({name: 'product_list'})">
				<p>全部列表</p>
			</div>
			<div class="nav-item" 
				v-for="item in cate_list_index" 
				:key="item.id"
				@click="router.push({path: '/index/product_list', query: {cate: item.id}})"
				>
				<p>{{ item.name }}</p>
			</div> 
			<div class="nav-item" @click="router.push({name: 'note_list'})">
				<p>发现</p>
			</div>
			<div class="nav-item" @click="router.push({name: 'order_list'})">
				<p>订单中心</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs  } from "vue";
import router from "@/router/guard" 
const $api: any = inject('$api')
import { userStore } from '@/stores/user'
const user = userStore()
const { userid } = toRefs(user)
import { cateStore } from '@/stores/cate'
const cate = cateStore()
const { cate_list, cate_list_index } = toRefs(cate)
const routerName = computed(() => { 
	return router.currentRoute.value.name
})
onMounted(() => {
	cate.getCateData()
})
const props = defineProps({
	customStyle: {
		type: Object,
		deafult: () => {
			return {}
		}
	}
})

function logoutBtn() {
	user.logout()
	router.go(0)
}
</script>
<style lang="scss" scoped>
.nav {
	background-color: #D9374E;
	color: #fff;
	.nav-item {
		height: 40px;
		padding: 0 20px;
		line-height: 40px; 
		cursor: pointer;
		&:hover {
			background-color: rgba(0,0,0,.1);
		}
	}
}
header {
	// transition: all .3s;
}
::v-deep .input-with-select {
	background-color: transparent;
	.el-input__wrapper {
		box-shadow: none;
	}
}
.input-with-select {
	height: 40px;
}

.search-in-select {
	width: 115px;
}

header {
	color: $uni-text-color-grey;
	background: #fff;
	border-bottom: 1px solid #f8f8f8;
	
	// background-image: radial-gradient(transparent 1px, #fff 1px);
	// background-size: 4px 4px;
    // backdrop-filter: saturate(50%) blur(4px);
    // -webkit-backdrop-filter: saturate(50%) blur(4px);
	position: relative;
	z-index: 50;
	&.header {
		.header-top {
			// background-color: #fafafa;
			font-size: 12px;
			border-bottom: 1px solid #e7e7e7;

			.home-w {
				@include flex(x, between);
				height: 50px;

				.top-left {
					@include flex(x);

					.login {
						cursor: pointer;
						color: $uni-color-primary;
					}

					.reg {
						border-left: 1px solid #ddd;
						cursor: pointer;
					}
				}

				.top-right {
					& > a,
					> span {
						padding: 0 5px;
					}
				}
			}
		}

		.header-main {
			.home-w {
				@include flex(x, between);
				height: $header-h;
			}

			.main-logo {
				flex: 0 0 300px;

				.logo {
					height: 40px;
				}
			}
			.main-nav {
				@include flex(x);
				.nav-item {
					padding: 0 8px;
					margin-left: 15px;
					font-size: 14px;
					cursor: pointer;
				}
			}
 
		} 
	}
}
</style>
