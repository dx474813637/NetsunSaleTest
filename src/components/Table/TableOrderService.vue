<template>
    <el-table 
        v-loading="loading" 
        :data="list" 
        style="width: 100%"  
        :maxHeight="maxHeight"  
        > 
        <el-table-column prop="id" label="ID" width="70" align="center" fixed="left" />
        <el-table-column prop="cate" label="类型" width="70" align="center"  fixed="left" />
        <el-table-column prop="info" label="原因" width="240"  >
            <template #default="{row}">
                <div v-html="row.info"></div> 
            </template> 
        </el-table-column>
        <el-table-column label="附图" width="90" align="center"  >
            <template #default="{row}">
                <template v-if="row.img">
                    <el-image 
                        style="width: 50px; height: 50px"
                        :src="row.img.split('|')[0]"
                        :zoom-rate="1.2"
                        :preview-src-list="row.img.split('|')" 
                        lazy
                        fit="contain" 
                        :preview-teleported="true"
                    ></el-image> 
                </template> 
                <template v-else>
                    无
                </template> 
                
            </template> 
        </el-table-column> 
        <el-table-column label="订单" width="70" align="center"  >
            <template #default="{row}">
                <el-link type="primary" size="small"  @click="emit('detailEvent', row.oid)">查看</el-link>
            </template> 
        </el-table-column>
        <el-table-column label="快递单号" width="100"  >
            <template #default="{row}">
                <el-text size="small">{{ row.express }}</el-text>
            </template> 
        </el-table-column>
        <!-- <el-table-column label="卖方" width="100"  >
            <template #default="{row}">
                <el-text size="small">{{ row.express1 }}</el-text>
            </template> 
        </el-table-column>  -->
        <el-table-column prop="zt_title" label="状态" align="center" width="120"  />  
        <el-table-column label="创建时间" width="150" align="center" >
            <template #default="{row}">
                <el-text size="small">{{ row.ctime }}</el-text>
            </template> 
        </el-table-column>
        <el-table-column label="更新时间" width="150" align="center" >
            <template #default="{row}">
                <el-text size="small">{{ row.uptime }}</el-text>
            </template> 
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right"> 
            <template #default="{row}">
                <div class="u-flex u-flex-center"> 
                    <div  v-if="row.zt == 0">
                        <el-popconfirm 
                            title="同意确认" 
                            @confirm="checkRefundBtn({sh: 1, order_id: row.oid})"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            >
                            <template #reference>
                                <el-button plain type="primary" size="small">同意售后</el-button>	
                                <!-- <el-button plain type="primary" size="small">发货</el-button>	 -->
                            </template>
                        </el-popconfirm>
                        <el-popconfirm 
                            title="拒绝确认" 
                            @confirm="checkRefundBtn({sh: 0, order_id: row.oid})"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            >
                            <template #reference>
                                <el-button plain type="danger" size="small" >拒绝售后</el-button>	
                                <!-- <el-button plain type="primary" size="small">发货</el-button>	 -->
                            </template>
                        </el-popconfirm>
                    </div>
                    <div v-if="row.button1 == 1" class="u-m-l-10">
                        <el-popconfirm 
                            title="操作确认" 
                            @confirm="confirmSendBtn(row.id)"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            >
                            <template #reference>
                                <el-button plain type="warning" size="small">{{ row.button1_title }}</el-button>	 
                            </template>
                        </el-popconfirm>
                    </div>
                    <div  v-if="row.button2 == 1" class="u-m-l-10">
                        <el-popconfirm 
                            title="操作确认" 
                            @confirm="overServiceBtn(row.id)"
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            >
                            <template #reference>
                                <el-button plain type="danger" size="small">{{ row.button2_title }}</el-button>	 
                            </template>
                        </el-popconfirm> 
                    </div>
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
			<el-form-item label="售后ID" >
				<el-input v-model="curRowId" readonly ></el-input>
			</el-form-item>
			<!-- <el-form-item label="快递公司" prop="delivery_id">
				<el-select v-model="expressForm.delivery_id" placeholder="快递公司" style="width: 100%;" >
                    <el-option
                        v-for="item in deliveryList"
                        :key="item.id"
                        :label="item.delivery_name"
                        :value="item.delivery_id"
                    />
                </el-select>
			</el-form-item> -->
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
// const deliveryList = ref([]) 
const expressForm = ref({
    express: '',
    // delivery_id: ''
})

const rules = {
	express: [{
		required: true,
		message: '请输入快递单号',
		trigger: ['blur', 'change']
	}],
	// delivery_id: [{
	// 	required: true,
	// 	message: '请选择快递公司',
	// 	trigger: ['blur', 'change']
	// }], 
}
const emit = defineEmits(["detailEvent"]);
onMounted(async () => {
	// getDeliveryListData()
    loading.value = true; 
    await getData()
    loading.value = false;

})
// const getDeliveryListData = async () => { 
//     const res = await $api.delivery_list({loading: false}) 
//     if(res.code == 1) {
//         deliveryList.value = res.list 
//     }
// }
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
    const res = await $api.service_list({params: paramsObj.value, loading: false}) 
    if(res.code == 1) {
        list.value = res.list
        total.value = +res.total 
    }
}
async function overServiceBtn (id) {
    const res = await $api.change_service_status({params: { id }})
	if(res.code == 1) {
		ElMessage.success(res.msg)
        await getData()
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
	        const res = await $api.change_service_status({params: { id: curRowId.value, ...expressForm.value }}) 
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
    // expressForm.value.delivery_id = ''
    expressForm.value.express = ''
    expressRef.value.resetFields()
}

function lookDetailClick() {

} 
</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>