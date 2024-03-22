<!--  -->
<template>
	<div>
		<el-row :gutter="20" class="u-p-10">
			<el-col :span="12" :xs="24">
				<div class="u-radius-8 card u-flex-column u-flex-items-center u-flex-center u-p-10 box-border">
					<div class="card-header">
						<el-text tag="b" class="u-font-16 text-white">待结算金额</el-text>
					</div>
					<div class="u-flex-1 u-flex u-flex-center">
						<el-statistic :precision="2" :value="initData.order_statement_num1" value-style="font-size: 30px; color: #fff" />
					</div>
				</div>
			</el-col>
			<el-col :span="12" :xs="24">
				<div class="u-radius-8 card u-flex-column u-flex-items-center u-flex-center u-p-10 box-border">
					<div class="card-header u-flex u-flex-between u-flex-items-center">
						<el-text tag="b" class="u-font-16 text-white">可提现金额</el-text>
						<el-button type="danger" plain size="small" v-if="initData.order_statement_num2 > 0" @click="tixianBtn">提现</el-button>
					</div>
					<div class="u-flex-1 u-flex u-flex-center">
						<el-statistic :precision="2" :value="initData.order_statement_num2" value-style="font-size: 30px; color: #fff" />
					</div>
				</div>
			</el-col>
		</el-row>
		<div class="u-p-10 box">
			<el-tabs v-model="api" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane v-for="item in tabs_list" :key="item.value" :label="item.label"
					:name="item.value"></el-tab-pane>
			</el-tabs>
			<el-alert v-show="detail_id && api == 'order_statement_list3'" class="u-m-b-10" :title="`明细ID：${detail_id}`"
				type="warning" @click="close" />
			<table-statement-list :customParams="customParams" :api="api"
				@detailEvent="detailEvent"></table-statement-list>

			<product-popup :show="dialogTableVisible" :id="detail_id" @setShow="setShow"></product-popup>
		</div>
	</div>

</template>

<script setup lang='ts'>
import { computed, ref, inject, nextTick, onMounted } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
const $api: any = inject('$api')
const tabs_list = ref([
	{ label: '待结算列表', value: 'order_statement_list1' },
	{ label: '已结算列表', value: 'order_statement_list2' },
	{ label: '已提现列表', value: 'order_statement_list3' },
	{ label: '提现记录', value: 'order_statement_cash' },
])
const api = ref('order_statement_list1')
const value = ref('');
const role = ref('');
const initData = ref({
	order_statement_num1: 0,
	order_statement_num2: 0,
	config: {}
})
const customParams = computed(() => {
	return {
		sid: detail_id.value
		// type: value.value,
		// role: role.value
	}
}) 
const detail_id = ref('');
const dialogTableVisible = ref(false);
function detailEvent(data) {
	detail_id.value = data.id;
	api.value = 'order_statement_list3'
}
onMounted(async () => {
	await getInitData()
})
async function getInitData() {
	await getMoney('order_statement_num1')
	await getMoney('order_statement_num2')
}
async function getMoney(name) {
    const res = await $api[name]({loading: false}) 
    initData.value[name] = res.statement  
	if(name == 'order_statement_num2') {
		initData.value.config = res
	}
}
function setShow(v) {
	dialogTableVisible.value = v
}
async function tixianBtn() {
    const res = await $api.order_statement_draw({params: {...initData.value.config}, loading: true}) 
    if(res.code == 1) {
		ElMessage.success(res.msg)
		await getInitData()
	}

}
function handleClick() {
	detail_id.value = '';
}
function close() {
	detail_id.value = '';
	api.value = ''
	nextTick(() => {
		api.value = 'order_statement_list3'
	})

}
</script>
<style lang='scss' scoped>
.box {
	@extend %box-sizing;

	::v-deep {
		.el-tabs {
			// --el-tabs-header-height: 50px!important;
		}

		.el-tabs__item {
			// color: #707173; 
		}

		.el-tabs__item.is-active {
			color: var(--el-color-primary);
		}

		.el-tabs__nav-wrap::after {
			height: 1px;
		}
	}
}

.card {
	width: 100%;
	background-color: #f5005a;
	color: #fff;
	height: 160px;
}

.card-header {
	width: 100%;
}
</style>