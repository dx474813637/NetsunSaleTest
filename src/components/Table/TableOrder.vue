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
        <el-table-column label="订单信息" width="250"  >
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
        </el-table-column>
        
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
                <div class="u-p-5" v-if="row.status == '1'">
                    <el-popconfirm 
						title="发货确认" 
						@confirm="confirmSendBtn(row.id)"
						confirm-button-text="确认"
						cancel-button-text="取消"
						>
						<template #reference>
							<el-button plain type="primary" size="small">发货</el-button>	 
						</template>
					</el-popconfirm>
                </div>
                <div class="u-p-5" v-if="row.status == '1'">
                    <el-popconfirm 
                        v-if="ziti == '1'"
						title="自提确认" 
						@confirm="selfPickupBtn(row.id)"
						confirm-button-text="确认"
						cancel-button-text="取消"
						>
						<template #reference>
							<el-button plain type="primary" size="small">自提</el-button>	 
						</template>
					</el-popconfirm>
                </div> 
                <div class="u-p-5" v-if="row.status == '5'">
                    <el-popconfirm 
						title="同意退款确认" 
						@confirm="checkRefundBtn({sh: 1, order_id: row.id})"
						confirm-button-text="确认"
						cancel-button-text="取消"
						>
						<template #reference>
							<el-button plain type="primary" size="small">同意退款</el-button>	
							<!-- <el-button plain type="primary" size="small">发货</el-button>	 -->
						</template>
					</el-popconfirm>
                </div>
                <div class="u-p-5" v-if="row.status == '5'">
                    <el-popconfirm 
						title="拒绝退款确认" 
						@confirm="checkRefundBtn({sh: 0, order_id: row.id})"
						confirm-button-text="确认"
						cancel-button-text="取消"
						>
						<template #reference>
							<el-button plain type="danger" size="small" >拒绝退款</el-button>	
							<!-- <el-button plain type="primary" size="small">发货</el-button>	 -->
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
    <el-dialog
        v-model="dialogVisible"
        title="输发货表单"
        width="30%" 
        @close="close"
    >
        <!-- <div class="u-flex u-flex-items-center">
            <el-input v-model="express" placeholder="输入发货的快递单号" />
        </div> -->
        <el-form :model="expressForm" :rules="rules" ref="expressRef" label-width="100px">
			<el-form-item label="当前订单号" >
				<el-input v-model="curRowId" readonly ></el-input>
			</el-form-item>
			<el-form-item label="快递公司" prop="delivery_id">
				<el-select v-model="expressForm.delivery_id" placeholder="快递公司" style="width: 100%;" >
                    <el-option
                        v-for="item in deliveryList"
                        :key="item.id"
                        :label="item.delivery_name"
                        :value="item.delivery_id"
                    />
                </el-select>
			</el-form-item>
			<el-form-item label="快递单号" prop="express">
				<el-input v-model="expressForm.express" placeholder="输入发货的快递单号"></el-input>
			</el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm(expressRef)">提交表单</el-button>
        </span>
        </template>
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
const $api = inject('$api')
const list = ref([])
const loading = ref(false)
const ziti = ref('')
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
	getDeliveryListData()
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
    const res = await $api.order_list({params: paramsObj.value, loading: false}) 
    if(res.code == 1) {
        list.value = res.list
        total.value = +res.total 
        ziti.value = res.ziti || ''
    }
}
async function confirmSendBtn (id) {
	dialogVisible.value = true 
    curRowId.value = id
    // emit('sendExpress', id)
}
async function selfPickupBtn(id) {
    const res = await $api.change_order_status4({params: {
		order_id: id, 
	}})
	if(res.code == 1) {
		ElMessage.success(res.msg)
        await getData()
	}
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
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>