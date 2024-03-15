<template>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :maxHeight="maxHeight" 
        > 
        <template v-if="api != 'order_statement_cash'">
            <el-table-column prop="oid" label="订单ID" />  
            <el-table-column prop="statement_total_fee" label="订单结算金额"  > 
                <template #default="{ row }">
                    <el-statistic :precision="2" :value="row.statement_total_fee" value-style="font-size: 14px; color: #f00" />
                </template>
            </el-table-column> 
            <el-table-column prop="statement_refund_fee" label="退款结算金额"  > 
                <template #default="{ row }">
                    <el-statistic :precision="2" :value="row.statement_refund_fee" value-style="font-size: 14px; color: #f00" />
                </template>
            </el-table-column> 
            <el-table-column prop="statement" label="实际结算金额"  > 
                <template #default="{ row }">
                    <el-statistic :precision="2" :value="row.statement" value-style="font-size: 14px; color: #f00" />
                </template>
            </el-table-column> 
        </template>
        <template v-else>
            <el-table-column prop="id" label="ID" />  
            <el-table-column prop="sale_money" label="销售金额"  > 
                <template #default="{ row }">
                    <el-statistic :precision="2" :value="row.sale_money" value-style="font-size: 14px; color: #f00" />
                </template>
            </el-table-column> 
            <el-table-column prop="money" label="提现金额"  > 
                <template #default="{ row }">
                    <el-statistic :precision="2" :value="row.money" value-style="font-size: 14px; color: #f00" />
                </template>
            </el-table-column> 
            <el-table-column prop="ctime" label="时间"  > 
                <template #default="{ row }">
                    <el-text type="info">{{row.ctime}}</el-text>
                </template>
            </el-table-column> 
            <el-table-column label="" width="140" align="center" >
                <template #default="{ row }"> 
                    <div>
                        <el-button 
                            type="primary" 
                            plain 
                            size="small" 
                            @click="detailBtn(row)"
                            :loading="row.loading"
                        >明细</el-button>
                    </div> 
                </template>
            </el-table-column>
        </template>
        <!-- 
          -->
        <!-- <el-table-column prop="ctime" label="时间" />   -->
        <template #empty>
            <div class="u-flex u-flex-center u-p-t-20 u-p-b-20">
                <el-empty description="无数据" />
            </div>
        </template>
    </el-table>
    <div class="list-page-box u-p-t-20 u-p-b-20">
        <el-pagination
            v-model:current-page="curP"
            :page-size="pageSize"
            small
            background
            layout="prev, pager, next, slot"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        >
            <span class="u-p-l-10">共 {{ total }} 条数据</span>
        </el-pagination>
    </div> 
</template>

<script setup lang='ts'>
import { reactive,ref,computed, inject, onMounted, watch } from 'vue'
import router from "@/router/guard" 
import { ElMessage } from "element-plus";
import { deepClone } from '@/utils';
import useProductSku from '@/hook/useProductSku'
const {
    sku2treeData
} = useProductSku()
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
    api: {
        type: String,
        default: 'auto'
    },
    customParams: {
        type: Object,
        default: () => ({})
    },
});
const emit = defineEmits(["detailEvent"]);
const currentRow = ref()
const $api = inject('$api')
const dataList = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20)
const paramsObj = computed(() => {
    return {
        p: curP.value,
        ...props.customParams
    }
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => {
    refreshData()
})
watch(
    () => [curP.value, props.api],
    async (val) => {
        refreshData()
    },
    {deep: true}
)
function detailBtn(item) {
    emit('detailEvent', item)
}
async function refreshData() {
    
    loading.value = true; 
    await getData()
    loading.value = false;
}
const getData = async () => { 
    if(!props.api) return
    const res = await $api[props.api]({params: paramsObj.value, loading: false}) 
    dataList.value = res.list 
    total.value = +res.total
}
 
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = async (val: number) => {
  console.log(`current page: ${val}`)
  await refreshData()
} 
 
async function getOrderStatusData(data) {
    let i = dataList.value.findIndex(ele => ele.id == data.id);
    if(i == -1) return
    if(dataList.value[i].loading) return;
    dataList.value[i].loading = true
    try {
        const res = await $api.sinopay({action: 'OUT_QUERY',  order_id: data.id }); 
        if(res.code == 1) {
            dataList.value[i].status = res.list.title

        }
    } catch (error) {
        
    }
    dataList.value[i].loading = false
   
} 

</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-tree {
    background-color: transparent;
}
</style>