<template>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :maxHeight="maxHeight" 
        > 
        <el-table-column label="ID" :width="80" >
            <template #default="{ row }">
                <div class="u-flex">
                    <span>{{ row.id }}</span> 
                </div> 
            </template>
        </el-table-column>
        <el-table-column prop="rec_bank_account_name" label="提现银行信息" width="300" >
            <template #default="{ row }">
                <div class="u-font-12">
                    <div class="u-flex u-flex-items-start u-m-b-5">
                        <el-text class="text-nowrap" type="info">账户名称：</el-text>
                        <el-text >{{ row.rec_bank_account_name }}</el-text>
                    </div> 
                    <div class="u-flex u-flex-items-start u-m-b-5">
                        <el-text class="text-nowrap" type="info">账户卡号：</el-text>
                        <el-text >{{ row.rec_bank_account }}</el-text>
                    </div> 
                    <div class="u-flex u-flex-items-start u-m-b-5">
                        <el-text class="text-nowrap" type="info">银行支行：</el-text>
                        <el-text >{{ row.rec_bank_name }}</el-text>
                    </div> 
                    <div class="u-flex u-flex-items-start u-m-b-5">
                        <el-text class="text-nowrap" type="info">银行行号：</el-text>
                        <el-text >{{ row.rec_bank_no }}</el-text>
                    </div> 
                </div>
                
            </template>
        </el-table-column> 
        <el-table-column prop="amount" label="提现金额" align="center"  >
            <template #default="{row}">
                <el-statistic :precision="2" :value="row.amount" value-style="font-size: 14px; color: #f00" />
            </template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center" >
            <template #default="{ row }">
                <div class="u-m-b-8" v-if="row.hasOwnProperty('status')"> 
                    <div>{{ row.status }}</div> 
                </div>
                <div>
                    <el-button 
                        type="primary" 
                        plain 
                        size="small" 
                        @click="getOrderStatusData(row)"
                        :loading="row.loading"
                    >点击查询</el-button>
                </div> 
            </template>
        </el-table-column> 
        <el-table-column prop="memo" label="备注" /> 
        <el-table-column prop="ctime" label="时间" />  
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
import { reactive,ref,computed, inject, onMounted } from 'vue'
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
    }
});
const emit = defineEmits(["setCurrentRow"]);
const currentRow = ref()
const $api = inject('$api')
const dataList = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20)
const paramsObj = computed(() => {
    return {
        p: curP.value
    }
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => {
    refreshData()
})
async function refreshData() {
    
    loading.value = true; 
    await getData()
    loading.value = false;
}
const getData = async () => { 
    const res = await $api.statement_list({params: paramsObj.value, loading: false}) 
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