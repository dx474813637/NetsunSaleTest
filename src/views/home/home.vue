<!--  -->
<template>
	<el-affix @change="headerAffixChange">
		<header-user></header-user>
	</el-affix> 
	<div class="user-wrap " >
		<div class="home-w u-p-t-15 box-border">   
			<div class="u-m-b-20" v-for="item in cate_list_index" :key="item.id">
				<product-list-mode 
					:cate="item.id"
					:title="item.name"
				></product-list-mode>
			</div>
				 
		</div> 
	</div>
	
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted, toRefs, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const $api: any = inject('$api')
import { cateStore } from '@/stores/cate' 
const cate = cateStore() 
const {cate_list_index} = toRefs(cate)
const list = ref([])
const headerAffixStatus = ref(false)
onMounted(async () => {
	
})  
function headerAffixChange(e) {
	// console.log(e)
	headerAffixStatus.value = e
} 
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;
}

.list {
	@include flex(x, start, start);
	flex-wrap: wrap;

	.list-item {
		flex: 0 0 15%;
		width: 15%;
		margin-right: 2%;

		&:nth-of-type(6n) {
			margin-right: 0;
		}
	}
}
</style>