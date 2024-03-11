<template>
    <el-table 
        class="large-table"
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :highlight-current-row="isRadioGroup" 
        :max-height="maxHeight"
        stripe 
        > 
        <el-table-column label="ID" align="center" width="100" >
            <template #default="{ row }">
                <div class="u-flex u-flex-center">
                    <el-text >{{ row.id }}</el-text>  
                </div> 
            </template>
        </el-table-column> 
        <el-table-column label="店铺信息" width="350" >
            <template #default="{ row }">
                <div class="u-flex u-flex-items-start" v-if="row.info"> 
                    <el-avatar :src="row.info.logo" fit="cover" :size="35" style="flex: 0 0 auto" >{{ row.info.company.split('')[0] }}</el-avatar>
                    <div >
                        <div class="u-flex u-flex-items-center">
                            <el-text class="u-m-l-8 u-line-2">{{ row.info.company }}</el-text> 
                            <el-tag 
                                :type="row.info.rz == 1 ? 'success' : 'warning'" 
                                effect="light" 
                                size="small"
                                class="u-m-l-8"
                            >
                                <template v-if="row.info.rz == 1">
                                    <el-icon size="12"><SuccessFilled /></el-icon>
                                    <span class="u-m-l-4">已认证</span>
                                </template>
                                <template v-else >
                                    <el-icon size="12"><WarningFilled /></el-icon>
                                    <span class="u-m-l-4">未认证</span>
                                </template>
                            </el-tag>  
                        </div>
                        <el-text type="info" class="u-m-l-8 u-line-2">{{ row.info.info || '未填写简介' }}</el-text> 
                    </div>
                </div> 
            </template>
        </el-table-column> 
        <el-table-column label="商家商品数" width="140" align="center" >
            <template #default="{ row }">
                <div v-if="row.hasOwnProperty('all_total')"> 
                    <div>{{ row.on_count }}上架 / {{ row.all_total }}件</div> 
                </div>
                <div v-else>
                    <el-button 
                        type="primary" 
                        plain 
                        size="small" 
                        @click="getShopProdNum(row)"
                        :loading="row.loading"
                    >点击查询</el-button>
                </div> 
            </template>
        </el-table-column> 
        <el-table-column label="联系人" width="240" >
            <template #default="{ row }">
                <div v-if="row.info"> 
                    <div class="u-flex "> 
                        <el-icon><User /></el-icon>
                        <el-text class="u-m-l-5 u-m-r-8">{{ row.info.name || '无' }}</el-text>  
                        <el-icon ><Phone /></el-icon>
                        <el-text class="u-m-l-3">{{ row.info.tel || '无' }}</el-text>   
                    </div>  
                    <div class="u-flex u-flex-items-start u-m-t-5" >
                        <el-icon><MapLocation /></el-icon>
                        <el-text type="info" class="u-m-l-5">{{ row.info.address || '无' }}</el-text>  
                    </div> 
                </div>
            </template>
        </el-table-column>  
        <el-table-column label="认证信息" width="300" >
            <template #default="{ row }">
                <div class="u-flex u-flex-items-center" v-if="row.info">
                    <div >
                        <div class="u-flex u-flex-items-center">
                            <el-text class="u-m-l-8 u-line-2">{{ row.info.rz_company || '无' }}</el-text>   
                        </div>
                        <el-text type="info" class="u-m-l-8 u-line-2">{{ row.info.rz_no }}</el-text> 
                    </div>
                </div> 
            </template>
        </el-table-column>  
        <el-table-column label="" width="150" align="center" >
            <template #default="{ row }">
                <div class="u-flex u-flex-center">
                    <el-text type="info" >{{ row.ctime }}</el-text>  
                </div> 
            </template>
        </el-table-column>  
        <el-table-column label="发展" align="center" width="200"  :fixed="isH5? false :'right'">
            <template #default="{ row }">
                <div class="u-flex-column u-flex-center" >  
                    <el-tag 
                        type="danger"  
                        size="small"
                        plain
                        class="u-m-b-10"
                        v-if="row.uid != 0"
                    >发展人UID：{{ row.uid }}</el-tag>
                    <el-button type="success" icon="DocumentChecked" round plain size="small" 
                        @click="router.push({name: 'shop_order_list', query: {login: row.username}})" >商家订单</el-button>
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
import useProductSku from '@/hook/useProductSku'
import { useSettingsStore } from '@/stores/settings' 
const settings = useSettingsStore()
const { isH5 } = toRefs(settings)
const {
    sku2treeData
} = useProductSku()
const cate = cateStore()
const { freight_list } = toRefs(cate)
const dialogImageUrl = ref('')
const uid = ref('')
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
        p: curP.value,
        uid: uid.value
    }
})
watch(
    () => router.currentRoute.value.query.uid,
    (newVal:any ) => { 
        uid.value = newVal || ''
    },
    {immediate: true}
)
const defaultProps = {
  children: 'children',
  label: 'label',
}
onMounted(async () => {
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
    const res = await $api.shop_list({params: paramsObj.value, loading: false})
    if(res.code == 1) {
        console.log(res)
        dataList.value = res.list 
        total.value = +res.total
    }
   
}
async function getShopProdNum(data) {
    let i = dataList.value.findIndex(ele => ele.id == data.id);
    if(i == -1) return
    if(dataList.value[i].loading) return;
    dataList.value[i].loading = true
    try {
        const res = await $api.shop_product_num({params: {login: data.info.login}}); 
        if(res.code == 1) {
            dataList.value[i].all_total = res.all_total
            dataList.value[i].on_count = res.on_count

        }
    } catch (error) {
        
    }
    dataList.value[i].loading = false
   
} 
 
function UidClick(uid) {
    router.replace({name: 'workers2t_list', query: {uid}})
} 


</script>
<style lang='scss' scoped> 
@import '@/styles/operate.scss';
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