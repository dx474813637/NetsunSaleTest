<template>
    <el-table 
        v-loading="loading" 
        :data="list" 
        style="width: 100%"   
        :maxHeight="maxHeight"  
        > 
        <!-- <el-table-column prop="id" label="ID" width="70" align="center"  /> -->
        <el-table-column label="商品信息" :width="isH5? '300' :'auto'"  >
            <template #default="{row}">  
                <div class="u-m-b-10 u-flex text-nowrap">
                    <div>
                        <el-text type="info">订单编号</el-text>
                        <el-text class="u-m-l-5 text-black" tag="b" >{{ row.id }}</el-text> 
                    </div>
                    <div class="u-m-l-20">
                        <el-text type="info">创建时间</el-text>
                        <el-text class="u-m-l-5 " type="info" >{{ row.ctime }}</el-text> 
                    </div>
                </div>
                <div class="u-flex u-flex-items-start u-m-t-5 u-m-b-5 " v-for="item in row.pid" :key="item.id">
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
        <el-table-column prop="total_fee" label="总价" width="150" align="center"   >
            <template #default="{row}">
                <el-statistic :precision="2" :value="row.total_fee" value-style="font-size: 14px; color: #f00" />
            </template>
        </el-table-column>
        <!-- <el-table-column label="订单信息" width="250"  >
            <template #default="{row}">
                <div v-if="row.express" class="u-m-b-5">
                    <el-text type="success" >物流单号:{{ row.express }}</el-text>  
                </div> 
                <div>
                    <el-text type="info" >{{ row.company }}</el-text>  
                </div> 
                <div v-if="row.info" class="u-m-t-5">
                    <el-text type="error" >备注：{{ row.info }}</el-text>  
                </div> 
            </template>
        </el-table-column> -->
        
        <el-table-column label="订单状态" width="120" >
            <template #default="{row}">
                <el-text type="danger" v-if="row.status == '6'">{{ $filters.order_status(row.status) }}</el-text>
                <el-text type="success" v-else-if="row.status == '3' || row.status == '4'" >{{ $filters.order_status(row.status) }}</el-text>
                <el-text type="warning" v-else >{{ $filters.order_status(row.status) }}</el-text>
            </template> 
        </el-table-column>  
        <!-- <el-table-column prop="ctime" label="创建时间" width="200" /> -->
        <el-table-column label="操作" width="120" align="center" > 
            <template #default="{row}">     
                <div class="u-p-5" >
                    <el-button plain type="primary" size="small" @click="router.push({name: 'order', params: {id: row.id}})">查看详情</el-button>	
                </div>
                <div class="u-p-5" v-if="row.status == '0'">
                    <el-popconfirm 
						title="支付订单确认" 
						@confirm="payOrderBtn({order_id: row.id})"
						confirm-button-text="确认"
						cancel-button-text="取消"
						>
						<template #reference>
							<el-button plain type="primary" size="small" :loading="pay_loading">支付订单</el-button>	 
						</template>
					</el-popconfirm>
                </div>
                <div class="u-p-5" v-if="row.status == '0'">
                    <el-popconfirm 
						title="取消订单确认" 
						@confirm="cancelOrderBtn({order_id: row.id})"
						confirm-button-text="确认"
						cancel-button-text="取消"
						>
						<template #reference>
							<el-button plain type="danger" size="small" >取消订单</el-button>	 
						</template>
					</el-popconfirm>
                </div>
                <div class="u-p-5" v-if="row.status == '1'">
                    <el-popconfirm 
						title="退款申请确认" 
						@confirm="refundBtn({order_id: row.id})"
						confirm-button-text="确认"
						cancel-button-text="取消"
						>
						<template #reference>
							<el-button plain type="danger" size="small" >退款申请</el-button>	 
						</template>
					</el-popconfirm>
                </div>
               
            </template>
            
        </el-table-column>
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
            small
            background
            layout="prev, pager, next, slot"
            :total="total" 
        >
            <span class="u-p-l-10">共 {{ total }} 条数据</span>
        </el-pagination>
    </div>   
    <el-dialog v-model="dialogVisible" width="300px" :close-on-click-modal="false" :close-on-press-escape="false" title="微信支付二维码">
        <img w-full style="width: 100%" :src="payCodeImg" alt="Preview Image" />
    </el-dialog>
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted, watch } from 'vue'
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
const dialogVisible2 = ref(false)
const payCodeImg = ref('')
const pay_loading = ref(false)
const $api = inject('$api')
const list = ref([])
const express_list = ref([])
const loading = ref(false)
const ziti = ref('')
const express = ref('')
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20) 
const curRowId = ref('')
const expressRef = ref()
const eExpressRef = ref()
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
const eExpressForm = ref({
    wuliu: '', 
    weight: ''
})
const weightRequired = computed(() => {
    let wuliu = eExpressForm.value.wuliu;
    let jitu_id = express_list.value.filter(ele => ele.name == '极兔速递')[0]?.id || ''
    // console.log(wuliu, jitu_id)
    eExpressRef.value?.clearValidate('weight')
    if(jitu_id == wuliu) return true
    return false
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
    // getMyExpressData()
    loading.value = true; 
    await getData()
    loading.value = false;

})
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
    const res = await $api.order_list({params: paramsObj.value, loading: false}) 
    if(res.code == 1) {
        list.value = res.list
        total.value = +res.total 
        ziti.value = res.ziti || ''
        express.value = res.express || ''
    }
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
const cancelOrderBtn = async (params) => { 
    await changeStatus(params)
	await getData()
}
const payOrderBtn = async ({order_id}) => {
    pay_loading.value = true
    try {
        const res = await $api.weixin_pay({params: {id: order_id},loading: false}) 
        if(res.code == 1) {
            payCodeImg.value = `https://www.sunmaxx.cn/Index/qrcode?url=${res.pay?.code_url }`;
            dialogVisible.value = true
        } 
    } catch (error) {
        
    } 
    pay_loading.value = false;
} 
async function refundBtn({order_id}) {
    const res = await $api.order_refund({params: {
		order_id, 
	}})
	if(res.code == 1) {
		ElMessage.success(res.msg)
        await getData()
	}
} 
</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>