<script setup lang="ts">
import { watch, computed, onMounted, onBeforeMount } from 'vue'
import router from '@/router/guard'
import {cateStore} from '@/stores/cate'
import {userStore} from '@/stores/user'  
const cate = cateStore() 
const {menuListAll, menuList, menus,  router_mode} = toRefs(cate) 
// import {
//   baseStore
// } from '@/stores/main.js';
// const base = baseStore()
watch(
	() => router.currentRoute.value,
	(n) => {  
		document.body.scrollTop = 0
		document.documentElement.scrollTop = 0
	},
	{
		deep: true
	}
) 
onMounted(() => {
	document.body.style.setProperty("--el-color-danger", "#FF3B53");
})
const isOperate = computed(() => router.currentRoute.value.matched.some(ele => ele.name == 'operate'))

</script>

<template> 
	<div :class="{
		'operate': isOperate
	}">
		<router-view :key="router.currentRoute.value.fullPath"></router-view>
	</div>
	
</template>
<style lang="scss" scoped> 
@import '@/styles/iconfont.css';
body,
 html {
 	margin: 0;
 	padding: 0;
 } 
 .operate {
	background: linear-gradient(to bottom, #fff, #f7f7f7);
 }
</style>

<!-- <style lang="scss">
@import '@/styles/mediaScreen.scss';
</style> -->
