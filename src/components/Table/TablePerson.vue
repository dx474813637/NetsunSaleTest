<template>
    <el-table 
        v-loading="loading" 
        :data="dataList" 
        style="width: 100%"  
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
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
        <el-table-column label="团长信息" width="350" >
            <template #default="{ row }">
                <div class="u-flex u-flex-items-center"> 
                    <el-avatar :src="row.img1" fit="cover" :size="35" style="flex: 0 0 auto" >{{ row.name1.split('')[0] }}</el-avatar>
                    <el-text class="u-m-l-8 u-line-2">{{ row.name1 }}</el-text> 
                    <el-tag 
                        type="danger" 
                        effect="dark" 
                        size="small"
                        class="u-m-l-8"
                    >UID：{{ row.login }}</el-tag>  
                </div> 
            </template>
        </el-table-column> 
        <el-table-column label="手机" width="140" align="center" >
            <template #default="{ row }">
                <div class="u-flex u-flex-center">
                    <el-text >{{ row.tel1 }}</el-text>  
                </div> 
            </template>
        </el-table-column> 
        <el-table-column label="身份" width="auto" align="center" >
            <template #default="{ row }">
                <div class="u-flex u-flex-center">
                    <el-tag 
                        type="primary" 
                        effect="light"
                        round
                        v-if="row.scene == '2'"
                    >团长</el-tag> 
                    <el-tag 
                        type="warning" 
                        effect="light"
                        round
                        v-if="row.scene == '1'"
                    >达人</el-tag>  
                </div> 
            </template>
        </el-table-column> 
        <el-table-column label="" width="200" align="center" >
            <template #default="{ row }">
                <div class="u-flex u-flex-center">
                    <el-text type="info" >{{ row.uptime }}</el-text>  
                </div> 
            </template>
        </el-table-column>  
        <el-table-column label="发展人" align="center" width="220" :fixed="isH5? false :'right'">
            <template #default="{ row }">
                <div class="u-flex u-flex-center" :style="{
                    cursor: uid? 'default': 'pointer'
                }" @click="UidClick(row.share)">  
                    <el-tag 
                        :type="uid?'info': 'warning'"  
                        size="small"
                        class="u-m-r-8"
                    >{{ row.share }}</el-tag>  
                    <el-text :type="uid?'info': 'warning'"   class="u-line-2">{{ row.name2 }}</el-text> 
                    <el-icon 
                        v-show="uid? false : true" 
                        size="16" 
                        color="#e6a23c"
                        class="u-m-l-5"
                    ><Operation /></el-icon>
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
let uploadRefs2: any = [] 

const getData = async () => { 
    const res = await $api.tuan_list({params: paramsObj.value, loading: false})
    if(res.code == 1) {
        console.log(res)
        dataList.value = res.list 
        total.value = +res.total
    }
   
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
                type: 'success',
                position: 'bottom-right',
            })
            return resolve(false)
        } 
    })
    
}
function UidClick(uid) {
    router.replace({name: 'workers2t_list', query: {uid}})
}
const changeProductOnStatus = async (prod) => { 
    const res = await $api.change_product_status({params: {id: prod.id}}); 
    return res
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