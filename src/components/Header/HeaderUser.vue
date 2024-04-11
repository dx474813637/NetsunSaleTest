<template>
	<header class="header" id="header" :style="customStyle"> 
		<div class="header-main">
			<div class="home-w">
				<div class="main-logo">
					<a href="https://www.sunmaxx.cn/" title=""
						><img
							src="/logo.png"
							class="logo"
							alt=""
					/></a>
				</div>
				<div class="main-nav">
					<template v-if="role ==2 || role == 3">
						<div class="nav-item">
							<el-button  
								color="#626aef"
								dark
								icon="Switch" 
								class="text-bold u-font-13 u-radius-10"
								@click="router.push({name: 'workers_list'})"
								>
								<template v-if="role == 2">运营商管理中心</template> 
								<template v-if="role == 3">VIP商家管理中心</template> 
								
							</el-button> 
						</div>
					</template>
					<!-- <template v-if="routerName == 'fx_helper'">
						<div class="nav-item">
							<router-link :to="{name: 'user_index'}">返回用户中心</router-link> 
						</div>
					</template>
					<template v-else >
						<div class="nav-item">
							<el-link  type="primary" href="/" >返回首页</el-link> 
						</div>
						<div class="nav-item">
							<el-link  type="primary" href="#/help" target="_blank">帮助中心</el-link> 
						</div> 
					</template> -->

					
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, toRefs  } from "vue";
import router from "@/router/guard" 
import { userStore } from '@/stores/user'
const user = userStore()
const { role } = toRefs(user)
const routerName = computed(() => { 
	return router.currentRoute.value.name
})
const props = defineProps({
	customStyle: {
		type: Object,
		deafult: () => {
			return {}
		}
	}
})


</script>
<style lang="scss" scoped>
header {
	transition: all .3s;
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
	// background: #fff;
	border-bottom: 1px solid #f8f8f8;
	
	background-image: radial-gradient(transparent 1px, #fff 1px);
	background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
	position: relative;
	z-index: 50;
	&.header {
		.header-top {
			background-color: #fafafa;
			font-size: 12px;
			border-bottom: 1px solid #e7e7e7;

			.home-w {
				@include flex(x, between);
				height: 40px;

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
