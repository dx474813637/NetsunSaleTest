<template>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
        :max-height="maxHeight"
        > 
        <el-table-column  fixed="left" label="ID" :width="isRadioGroup ?70:60" >
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
        <el-table-column align="center" prop="name" label="物流名称" /> 
        <el-table-column align="center" prop="exptype" label="类型" /> 
        <el-table-column align="center" prop="paytype" label="支付类型" >
            <template #default="{ row }">
                <div class="u-flex u-flex-center" v-if="row.paytype">
                    {{ express.expressPayType2Str(row.paytype) }}
                </div> 
            </template>
        </el-table-column>
 
        <el-table-column label="操作"  :fixed="isH5? false :'right'" width="140" align="center" v-if="isEditBtn"> 
            <template #default="{row}">
                
                <div class="u-flex-column u-flex-center" >
                    <div class="u-p-5">
                        <el-button 
                            link 
                            type="primary" 
                            size="small" 
                            @click="router.push({name: 'express_edit', params: {id: row.id}})"
                            >编辑</el-button> 
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
    <!-- <div class="list-page-box u-p-t-20 u-p-b-20">
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
    </div>  --> 
</template>

<script setup lang='ts'> 
import { reactive,ref,computed, inject, onMounted, toRefs,watch } from 'vue'
import type { UploadFile  } from 'element-plus'
import { genFileId,ElNotification, ElMessage } from 'element-plus'
import router from "@/router/guard" 
import { cateStore } from '@/stores/cate' 
import { useSettingsStore } from '@/stores/settings' 
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
import { userStore } from '@/stores/user' 
const user = userStore()
const { cpy_info, subAccount } = toRefs(user)
import { useExpressStore } from '@/stores/express' 
const express = useExpressStore()
const { express_pay_list, express_list, express_list_loading } = toRefs(express) 
// import useProductSku from '@/hook/useProductSku'
// const {
//     sku2treeData
// } = useProductSku()
const cate = cateStore()
const { freight_list } = toRefs(cate)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const emit = defineEmits(["detailEvent"]);
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
const currentRow = ref()
const $api:any = inject('$api')
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
    if(express_pay_list.value.length == 0) {
        await express.getExpressData()  
    }
    await refreshData() 
    // user.getSubAccData()
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
async function refreshData() {
    
    loading.value = true; 
    await getData()
    loading.value = false;
} 
const getData = async () => { 
    const res = await $api.my_express({params: paramsObj.value, loading: false}) 
    dataList.value = res.list.map(ele => ({
        ...ele, 
        // switchLoading: false, 
        // sku: sku2treeData(ele.sku), 
        // filesList: ele.ewm ? [{url: ele.ewm} ]: [] 
    }))
    total.value = +res.total
}
 
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
} 

const handleCurrentTableChange = (val: User | undefined) => { 
    if(!props.isRadioGroup) return 
    currentRow.value = val
}
 
async function accChangeEvent(value, row) {
    console.log(value, row)
    if(row.ewm_loading) return
    row.ewm_loading = true;
    try {
        
        const res = await $api.save_product_ewm({
            params: {
                id: row.id,
                ewm: value
            }
        })
        if(res.code == 1) {
            row.ewm = value
            ElNotification({
                title: '系统消息',
                message: `商品ID【${row.id}】${res.msg}`,
                type: 'success',
                position: 'bottom-right',
            })
        }
    } catch (error) {
    }
    row.ewm_loading = false;
}

const deleteProd = async (id) => {
    const res = await $api.del_product({params: {id}});
    if(res.code == 1){
        ElMessage.success(res.msg)
        refreshData()
    }
}
</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
// 
.el-table {
    ::v-deep {
        .el-table__body {
            border-spacing:0px 5px;
            .el-table__row {   
                td {
                    padding-top: 5px;
                    padding-bottom: 5px;
                }
            }
        }
    }
}
.el-tree {
    background-color: transparent;
}
.table-box {
    ::v-deep {
        .el-upload--picture-card { 
            --el-upload-picture-card-size: 55px;
        }
        .el-upload-list--picture-card .el-upload-list__item {
            --el-upload-list-picture-card-size: 55px;
        }
        .el-upload-list--picture-card .el-upload-list__item-actions span+span {
            margin-left: 8px
        }
            
        .limit {
            .el-upload--picture-card {
                display: none;
            }
            .el-upload-list--picture-card {
                display: flex;
            }
            .el-upload-list--picture-card .el-upload-list__item {
                margin: 0
            }
        }
    }
} 
</style>