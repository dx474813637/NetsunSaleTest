<template>
    <el-table 
        v-loading="loading" 
        :data="skuList" 
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
        <el-table-column :fixed="isH5? false :'left'"  label="商品名" width="300" >
            <template #default="{row}">   
                <div class="u-flex u-flex-items-start u-m-t-5 u-m-b-5" >
                    <div class="u-m-r-10" style="flex: 0 0 45px">
                        <el-image class="u-radius-5" lazy style="width: 45px; height: 45px" :src="row.pic.split('|')[0]" fit="fill" />
                    </div> 
                    <div class="u-flex-1">
                        <el-link class="text-black" :underline="false" @click="emit('detailEvent', row.id)">
                            {{ row.name }} 
                        </el-link> 
                        <div class="u-flex u-flex-wrap u-flex-items-start">
                            <el-tag class="u-m-r-5 u-m-t-5" type="primary" size="small">{{ row.goods_no }}</el-tag> 
                            <el-tag class="u-m-r-5 u-m-t-5" type="warning" size="small">{{ row.cate }}</el-tag>
                            <el-tag class="u-m-r-5 u-m-t-5" type="info" size="small">{{ row.delivery_delay_day }}天发货</el-tag>
                            <el-tag class="u-m-r-5 u-m-t-5" type="info" size="small">{{ row.warehouse }}</el-tag>
                        </div>
                    </div>
                </div>
                
            </template>
        </el-table-column> 
        <el-table-column prop="price1" label="销售价" width="120" align="center" >
            <template #default="{ row }">
                <div>
                    <el-text type="danger" class="u-line-2" >{{ row.price1 }}</el-text> 
                </div>
                <div class="u-m-t-6">
                    <el-link type="primary" @click="emit('detailPriceEvent', row.id)" >价格详情</el-link>
                </div>
            </template>
        </el-table-column>  
        <el-table-column prop="sku" label="商品规格" width="200" >
            <template #default="{ $index }">
                <el-tree :data="skuList[$index].sku" :props="defaultProps"  />
            </template>
        </el-table-column>
        <el-table-column prop="recommend_remark" label="商家推荐语" width="120" >
            <template #default="{ row }">
                <el-text type="warning" class="u-line-2" >{{ row.recommend_remark }}</el-text>
            </template>
        </el-table-column>
        <el-table-column label="更新时间" width="100" >
            <template #default="{row}">
                <div v-for="item in row.uptime.split(' ')" :key="item">
                    <el-text type="info" class="u-font-12">{{ item }}</el-text>
                </div>
            </template>
        </el-table-column>
        <el-table-column 
            label="上架状态" 
            align="center" 
            :fixed="isH5? false :'right'"
            :width="isH5? 120 :'auto'" 
        > 
            <template #header>
                <el-select v-model="filterOnValue" style="width: 100px" size='small'>
                    <el-option
                        v-for="item in filterOnOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </template>
            <template #default="{row}">
                <el-switch 
                    size="large"
                    inline-prompt
                    v-model="row.on" 
                    active-value="1"  
                    inactive-value="0"
                    active-text="上架中"
                    inactive-text="未上架" 
                    :loading="row.switchLoading" 
                    :before-change="() => beforeProdOnChange(row)"
                    /> 
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
            background
            layout="prev, pager, next, slot"
            :total="total" 
        >
            <el-text class="u-p-l-10 u-font-12 " type="info">共 {{ total }} 条数据</el-text>
        </el-pagination>
    </div> 
    <el-dialog v-model="dialogVisible">
        <img w-full style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
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
import useProductSku from '@/hook/useProductSku'
const {
    sku2treeData
} = useProductSku()
const cate = cateStore()
const { freight_list } = toRefs(cate)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const emit = defineEmits(["detailEvent", "detailPriceEvent"]);
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
    }
});
const currentRow = ref()
const $api:any = inject('$api')
const skuList = ref([])
const loading = ref(false)
const curP = ref(1)
const total = ref(0)
const pageSize = ref(20)
const paramsObj = computed(() => {
    return {
        p: curP.value,
        on: filterOnValue.value,
        ...props.customParams
    }
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
const filterOnValue = ref('')
const filterOnOptions = ref([
    {
        label: '全部',
        value: ''
    },
    {
        label: '上架中',
        value: '1'
    },
    {
        label: '未上架',
        value: '2'
    },
])
onMounted(async () => { 
    await refreshData() 
    user.getSubAccData()
})
watch(
    () => [curP.value, paramsObj.value],
    async (val) => {
        await refreshData()
    },
    {deep: true}
) 
async function refreshData() { 
    loading.value = true; 
    await getData()
    loading.value = false;
} 
const getData = async () => { 
    const res = await $api.product2({params: paramsObj.value, loading: false}) 
    skuList.value = res.list.map(ele => ({
        ...ele, 
        switchLoading: false, 
        sku: sku2treeData(ele.sku), 
        filesList: ele.ewm ? [{url: ele.ewm} ]: [] 
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

const beforeProdOnChange = async (item) => {
    item.switchLoading = true  
    return new Promise(async (resolve, reject)=>{
        
        let res = await changeProductOnStatus(item) 
        item.switchLoading = false
        console.log(res)
        if(res.code == 1) { 
            ElNotification({
                title: '系统消息',
                message: res.msg,
                type: 'success',
                position: 'bottom-right',
            })
            return resolve(true)
        }else { 
            ElNotification({
                title: '系统消息',
                message: res.msg,
                type: 'error',
                position: 'bottom-right',
            })
            return resolve(false)
        } 
    })
    
}

const changeProductOnStatus = async (prod) => { 
    let res 
    try {
        res = await $api.change_product_status({params: {id: prod.id}}); 
    } catch (error) {
        res = error
    }  
    return res
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
@import "@/styles/operate.scss";
// 
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