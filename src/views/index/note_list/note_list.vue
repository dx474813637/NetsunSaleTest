<!--  -->
<template>
	<div class="list-main-box u-p-t-10 u-p-b-10" v-loading="loading">
		<div class="list">
			<template v-if="!product_list || product_list.length == 0">
				<div class="u-flex u-flex-center u-p-t-30" style="width: 100%; background-color: #fff;">
					<el-empty description="列表为空" />
				</div>
			</template>
			<div class="list-item u-m-b-10" v-for="(item, index) in product_list" :key="index">
				<div class="u-flex u-flex-items-start">
					<!-- <dx-video :src="item.pic"></dx-video> -->
					<video :src="item.pic" controls ></video>
					<div class="u-m-l-40 u-flex-1">
						<div>
							<el-text class="text-bold text-black u-font-20">{{item.title}}</el-text>
						</div>
						<div>
							<el-text type="info">{{item.shijian}}</el-text>
							<el-text type="info" class="u-m-l-10">{{item.user}}</el-text>
						</div>
						<div>
							<el-text class="u-font-16">{{item.body}}</el-text>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script setup lang='ts'>
import { reactive, ref, inject, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
const $api: any = inject('$api')
import { cateStore } from '@/stores/cate'
const cate = cateStore()
// $api.product() 
const detail_id = ref('');
const dialogTableVisible = ref(false);
function detailEvent(data) {
	detail_id.value = data;
	dialogTableVisible.value = true
}

const product_list = ref([])
const loading = ref(false)
onMounted(async () => {
	await getNoteData()
})

async function getNoteData() {
	const res = await $api.longs({ loading: false })
	if (res.code == 1) {
		product_list.value = res.list
	}
}
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;
}

.list { 
	
}
video {
	width: 300px;
	height: 300px;
	flex: 0 0 300px;
}
</style>