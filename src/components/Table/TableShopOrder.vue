<template>
    <el-table 
        v-loading="loading" 
        :data="list" 
        style="width: 100%"   
        :maxHeight="maxHeight"  
        stripe  
        > 
        <!-- <el-table-column prop="id" label="ID" width="70" align="center"  /> -->
        <el-table-column label="商品信息"  :width="isH5? '320' :'auto'"  >
            <template #default="{row}">  
                <div class="u-m-b-10 u-flex  text-nowrap">
                    <div>
                        <el-text type="info">订单编号</el-text>
                        <el-text class="u-m-l-5 text-black" tag="b" >{{ row.id }}</el-text> 
                    </div>
                    <div class="u-m-l-20">
                        <el-text type="info">商家</el-text>
                        <el-link class="u-m-l-5 " tag="ins" type="primary" 
                            @click="router.replace({name: 'shop_order_list', query: {login: row.sell_login}})">{{ row.sell_login }}</el-link> 
                    </div>
                    <div class="u-m-l-20">
                        <el-text type="info">创建时间</el-text>
                        <el-text class="u-m-l-5 " type="info" >{{ row.ctime }}</el-text> 
                    </div>
                </div>
                <div class="u-flex u-flex-items-start u-m-t-5 u-m-b-5" v-for="item in row.pid" :key="item.id">
                    <div class="u-m-r-10" style="flex: 0 0 45px">
                        <el-image class="u-radius-5" lazy style="width: 45px; height: 45px" :src="item.img" fit="fill" />
                    </div> 
                    <div class="u-flex-1">
                        <el-link class="text-black" :underline="false" @click="emit('detailEvent', item.pid)" >
                            {{ item.name }}*{{ item.num }}；
                        </el-link> 
                        <div class="u-flex u-flex-wrap u-flex-items-start">
                            <el-tag class="u-m-r-5 u-m-t-5" type="primary" size="small">{{ item.goods_no }}</el-tag>
                            <el-tag class="u-m-r-5 u-m-t-5" type="info" size="small">{{ item.recommend_remark }}</el-tag>
                            <el-tag class="u-m-r-5 u-m-t-5" type="info" size="small">{{ item.delivery_delay_day }}天发货</el-tag>
                            <el-tag class="u-m-r-5 u-m-t-5" type="info" size="small">{{ item.warehouse }}</el-tag>
                        </div>
                    </div>
                </div>
                
            </template>
        </el-table-column>
        <el-table-column prop="total_fee" label="总价/元" width="150" align="center"   >
            <template #default="{row}">
                <el-statistic 
                    :precision="2" 
                    :value="row.total_fee" 
                    value-style="font-size: 14px; color: #f00; font-weight: bold"
                />
                <div class="u-m-t-5" v-if="row.refund_fee">
                    <el-tag size="small" type="warning" plain>退款：{{ row.refund_fee }} 元</el-tag>
                </div>
            </template>
        </el-table-column> 
        <el-table-column label="订单状态" width="120" >
            <template #default="{row}">
                <el-text tag="b" type="danger" v-if="row.status == '6'">{{ $filters.order_status(row.status) }}</el-text>
                <el-text tag="b" type="success" v-else-if="row.status == '3' || row.status == '4'" >{{ $filters.order_status(row.status) }}</el-text>
                <el-text tag="b" type="warning" v-else >{{ $filters.order_status(row.status) }}</el-text>
            </template> 
        </el-table-column>  
        <el-table-column prop="login" label="买家UID" width="100" /> 
 
        <template #empty>
            <div class="u-flex u-flex-center u-p-t-20 u-p-b-20">
                <el-empty description="无数据" />
            </div>
        </template>
    </el-table>
    <div class="list-page-box u-p-t-20 u-p-b-20">
        <el-pagination
            v-model:current-page="curP"
            v-model:page-size="pageSize" 
            background
            layout="prev, pager, next, slot"
            :total="total" 
        >
            <el-text class="u-p-l-10 u-font-12 " type="info">共 {{ total }} 条数据</el-text>
        </el-pagination>
    </div>  
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted, watch, toRefs } from 'vue'
import router from "@/router/guard"  
import { genFileId,ElNotification, ElMessage } from 'element-plus'
import { useSettingsStore } from '@/stores/settings' 
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
const props = defineProps({
    isRadioGroup: {
        type: Boolean,
        default: false
    },
    isEditBtn: {
        type: Boolean,
        default: false
    },
    maxHeight: {
        type: [String, Number],
        default: 'auto'
    },
    customParams: {
        type: Object,
        default: () => ({})
    },
}); 
const dialogVisible = ref(false)
const $api = inject('$api')
const list = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20) 
const curRowId = ref('')
const expressRef = ref()
const paramsObj = computed(() => {
    return {
        p: curP.value,
        ...props.customParams
    }
}) 
const deliveryList = ref([]) 
const expressForm = ref({
    express: '',
    delivery_id: ''
})

const rules = {
	express: [{
		required: true,
		message: '请输入快递单号',
		trigger: ['blur', 'change']
	}],
	delivery_id: [{
		required: true,
		message: '请选择快递公司',
		trigger: ['blur', 'change']
	}], 
}
const emit = defineEmits(["detailEvent"]);
onMounted(async () => {
	// getDeliveryListData()
    loading.value = true; 
    await getData()
    loading.value = false;

})
const getDeliveryListData = async () => { 
    const res = await $api.delivery_list({loading: false}) 
    if(res.code == 1) {
        deliveryList.value = res.list 
    }
}
watch(
    () => [curP.value, props.customParams],
    async (val) => {
        loading.value = true; 
        await getData()
        loading.value = false;
    },
    {deep: true}
)
const getData = async () => { 
    const res = await $api.shop_order_list({params: paramsObj.value, loading: false}) 
    if(res.code == 1) {
        list.value = res.list
        total.value = +res.total 
    }
}
async function confirmSendBtn (id) {
	dialogVisible.value = true 
    curRowId.value = id
    // emit('sendExpress', id)
}
async function submitForm (formName) {
    formName.validate(async (valid) => {
		if (valid) { 
	        const res = await changeStatus({...expressForm.value})
			if(res.code != 1) return; 
			dialogVisible.value = false
			await getData()
		} else {
			console.log('error submit!!');
			return false;
		}
	});
     
	
}
async function changeStatus (params) {
	const res = await $api.change_order_status({params: {
		order_id: curRowId.value,
        ...params 
	}})
	if(res.code == 1) {
		ElMessage.success(res.msg)
	}
    return res
}
async function checkRefundBtn(params) {
    await changeStatus(params)
	await getData()
}
function close() {
    expressForm.value.delivery_id = ''
    expressForm.value.express = ''
    expressRef.value.resetFields()
}
</script>
<style lang='scss' scoped>
@import '@/styles/operate.scss';
// 
.el-tree {
    background-color: transparent;
}
</style>