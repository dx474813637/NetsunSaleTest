<script setup lang="ts">
import { watch, computed } from 'vue'
import router from '@/router/guard'
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
	background-color: #f7f7f7;
 }
</style>
