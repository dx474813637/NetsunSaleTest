<template>
    <el-table 
        v-loading="loading" 
        :data="skuList" 
        style="width: 100%"  
        :highlight-current-row="isRadioGroup"
        @current-change="handleCurrentTableChange"
        :max-height="maxHeight"
        > 
        <el-table-column fixed="left" label="ID" :width="isRadioGroup ?70:70" >
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
        <el-table-column fixed="left"  label="商品名" width="300" >
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
                            <el-tag class="u-m-r-5 u-m-t-5" type="info" size="small">{{ row.delivery_delay_day }}天发货</el-tag>
                            <el-tag class="u-m-r-5 u-m-t-5" type="info" size="small">{{ row.warehouse }}</el-tag>
                        </div>
                    </div>
                </div>
                
            </template>
        </el-table-column>
        <!-- <el-table-column fixed="left"  label="商品名" width="200" >
            <template #default="{row}">
                <el-link  @click="emit('detailEvent', row.id)">
                    <el-text type="primary" >{{ row.name }}</el-text>
                </el-link> 
            </template>
        </el-table-column> -->
        <el-table-column prop="price1" label="销售价" width="120" >
            <template #default="{ row }">
                <el-text type="danger" class="u-line-2" >{{ row.price1 }}</el-text>
            </template>
        </el-table-column>
        <el-table-column prop="cate" label="分类" width="100" />
        <!-- <el-table-column prop="goods_no" label="商品款号" width="120" /> -->
        <el-table-column prop="recommend_remark" label="商家推荐语" width="120" >
            <template #default="{ row }">
                <el-text type="warning" class="u-line-2" >{{ row.recommend_remark }}</el-text>
            </template>
        </el-table-column>
        <el-table-column prop="sku" label="商品规格" width="200" >
            <template #default="{ $index }">
                <el-tree :data="skuList[$index].sku" :props="defaultProps"  />
            </template>
        </el-table-column>
        <el-table-column label="更新时间" width="100" >
            <template #default="{row}">
                <div v-for="item in row.uptime.split(' ')" :key="item">
                    <el-text type="info" class="u-font-12">{{ item }}</el-text>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="上架状态" fixed="right" width="100"> 
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
        <!-- <el-table-column label="二维码" fixed="right" aligin="center" width="80"> 
            <template #default="{row, $index}">
                <div class="table-box">
                    <el-upload 
                        :ref="(el) => setUploadRef(el, $index, uploadRefs2)" 
                        action="" 
                        :class="{
                            limit: row.filesList.length == 1
                        }"  
                        v-model:file-list="row.filesList"
                        list-type="picture-card" 
                        :headers="configHeader" 
                        :limit="1"
                        :on-exceed="(files, uploadFiles) => handlePictureExceed(files, uploadFiles, row, $index )"
                        :http-request="(options) => upload(options, row ) "
                        :before-upload="beforeUpload">
                        <el-icon>
                            <i-ep-Plus />
                        </el-icon>

                        <template #file="{ file }">
                            <div>
                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                        <el-icon><i-ep-zoom-in /></el-icon>
                                    </span>
                                    <span v-if="!disabled" class="el-upload-list__item-delete"
                                        @click="handleRemove(file, $index, uploadRefs2, row)">
                                        <el-icon>
                                            <i-ep-Delete />
                                        </el-icon>
                                    </span>
                                </span>
                            </div>
                        </template>
                    </el-upload>
                </div>
            </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right" width="60" v-if="isEditBtn"> 
            <template #default="{row}">
                <el-button 
                    link 
                    type="primary" 
                    size="small" 
                    @click="router.push({name: 'product_edit', params: {id: row.id}})"
                    >编辑</el-button>  
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
const {
    sku2treeData
} = useProductSku()
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
const skuList = ref([])
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
const setUploadRef = (el: any, index: string, prop) => {
    if (el) { 
        prop[index] = el 
    }
}
const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}
async function handlePictureExceed(files: UploadFile, uploadFiles, items, index) {
    console.log('handlePictureExceed')
    const res = await upload({ file: files[0] }, items)
    if ( res ) {
        // console.log(uploadRefs)
        uploadRefs2[index]!.clearFiles()
        const file = files[0] 
        file.uid = genFileId()
        uploadRefs2[index]!.handleStart(file)
    }
}
async function upload(param: any , items ) {
    // console.log(propName) 
    const formData = new FormData()
    formData.append('file', param.file)
    const res = await $api.upimg(formData)
    const res2 = await $api.save_product_ewm({params: {id: items.id, ewm: res.list[0]}})
    // console.log(res)
    if (res2.code == 1) { 
        items.filesList[items.filesList.length - 1].url = res.list[0];  
        ElMessage.success('图片上传成功')
        return true
    }
    return false
}
const handleRemove = async (file: UploadFile, index: string, propName, propName2, quick = false ) => { 
    if(typeof(index) != "undefined") {
        const res = await $api.save_product_ewm({params: {id: propName2.id, ewm: ''}})
        propName[index].clearFiles(); 
        propName2.filesList = []
        // if(quick) {
        //     uploadImgIndex.value = +index
        //     render({prop:'img', positionArr: [0, index]})
        // }
    }else {
        // console.log(file)
        // let i = dynamicValidateForm[propName].findIndex(ele => ele.url == file.url)
        // dynamicValidateForm[propName].splice(i, 1)
    }
    ElMessage.success('图片移除成功')
}

const getData = async () => { 
    const res = await $api.product({params: paramsObj.value, loading: false}) 
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

const changeProductOnStatus = async (prod) => { 
    const res = await $api.change_product_status({params: {id: prod.id}}); 
    return res
}


</script>
<style lang='scss' scoped>
@import "@/styles/table.scss";
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