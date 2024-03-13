<template> 
    <el-row :gutter="20" class="u-m-b-10">
        <el-col :span="16" :xs="24">
            <el-input 
                v-model="terms"   
                clearable 
            />
        </el-col>
        <el-col :span="8" :xs="24">
            <el-button type="primary" @click="refreshData">搜索</el-button>
        </el-col>
    </el-row>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :maxHeight="maxHeight"
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
        > 
        <el-table-column label="ID" :width="120" >
            <template #default="{ row }">
                <div class="u-flex">
                    <span>{{ row.id }}</span> 
                    <span class="u-m-l-10" v-if="isRadioGroup && currentRow && currentRow.id == row.id ">
                        <el-Icon color="#ff0000">
                            <i-ep-CircleCheck></i-ep-CircleCheck>
                        </el-Icon>
                    </span>
                </div>
                
            </template>
        </el-table-column>
        <el-table-column prop="bank_name" label="银行名称" /> 
        <el-table-column prop="bank_no" label="银行行号" />   
        <el-table-column label="操作" width="90" align="center" v-if="isEditBtn"> 
            <template #default="{row}">
                <div class="u-flex u-flex-center">
                    <!-- <el-button 
                    link 
                    type="primary" 
                    size="small" 
                    @click="router.push({name: 'sku_edit', params: {id: row.id}})"
                    >编辑</el-button>   -->

                    <el-popconfirm 
                        title="移除确认" 
                        @confirm="deleteSku(row.id)"
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        >
                        <template #reference>
                            <el-button  
                                link 
                                type="danger" 
                                size="small"  
                                >删除</el-button> 
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
    isSearchBar: {
        type: Boolean,
        default: false
    },
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
    terms: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(["setCurrentRow"]);
const currentRow = ref()
const $api = inject('$api')
const dataList = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(15)
const paramsObj = computed(() => {
    return {
        p: curP.value,
        terms: terms.value
    }
})
const terms = ref('')
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => {
    refreshData()
})
async function refreshData() {
    dataList.value = []
    loading.value = true; 
    await getData()
    loading.value = false;
}
const getData = async () => { 
    if(!paramsObj.value.terms) return
    const res = await $api.sinopay({action: 'GET_BANK_NAME', ...paramsObj.value},{ loading: false}) 
    dataList.value = res.list.list_bank_no.pw_rec_list
    total.value = +res.list.list_bank_no.pw_rec_total
}
 
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = async (val: number) => {
  console.log(`current page: ${val}`)
  await refreshData()
} 

const handleCurrentTableChange = (val: User | undefined) => { 
    if(!props.isRadioGroup) return 
    currentRow.value = val
    emit('setCurrentRow', {value: deepClone(currentRow.value)})
}
const deleteSku = async (id) => {
    const res = await $api.del_sku({params: {id}});
    if(res.code == 1){
        ElMessage.success(res.msg)
        refreshData()
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