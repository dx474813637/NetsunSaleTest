<template>
    <el-form 
        style="width: 100%;" 
        ref="formRef" 
        :model="dynamicValidateForm" 
        label-width="120px" 
        :rules="rules" 
        class="product-edit-form u-p-20"
        label-position="top"
        scroll-to-error
        inline-message
        >   
            <el-row>
                <el-col :span="14" :xs="24">
                    <el-form-item label="物流" prop="name">
                        <el-select
                            style="width: 100%"
                            v-model="dynamicValidateForm.name"
                            filterable
                            placeholder="可输入关键字筛选"  
                            clearable  
                            v-loading="express_list_loading"
                            @change="expressChangeEvent"
                        >
                            <el-option
                                v-for="item in express_list"
                                :key="item.id"
                                :label="`${item.name}`"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="14" :xs="24">
                    <el-form-item label="类型" prop="expType">
                        <el-select
                            style="width: 100%"
                            v-model="dynamicValidateForm.expType" 
                            placeholder="类型"  
                            clearable  
                            v-loading="express_list_loading" 
                        >
                            <el-option
                                v-for="item in express_type_list"
                                :key="item"
                                :label="`${item}`"
                                :value="item"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="14" :xs="24">
                    <el-form-item label="物流支付方式" prop="payType">
                        <el-select
                            style="width: 100%"
                            v-model="dynamicValidateForm.payType" 
                            placeholder="物流支付方式"   
                            v-loading="express_list_loading" 
                        >
                            <el-option
                                v-for="item in express_pay_list"
                                :key="item.value"
                                :label="`${item.name}`"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row >
                <el-col :span="14" :xs="24">
                    <el-form-item class="u-flex">
                        <el-button type="primary" class="u-flex-1" @click="submitForm(formRef)">提交</el-button> 
                    </el-form-item>
                </el-col>
            </el-row>
    </el-form>
     
</template>
  
<script lang="ts" setup>
import { reactive, ref, inject, toRefs, watch, nextTick, computed, onMounted  } from 'vue'
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadFile, UploadRequestOptions, UploadRawFile, UploadProps, FormRules, TableColumnCtx  } from 'element-plus'
// import {
//     Delete, Plus, ZoomIn, CirclePlus, FolderOpened 
// } from '@element-plus/icons-vue'
import router from '@/router/guard'
import { useExpressStore } from '@/stores/express' 
const express = useExpressStore()
const { express_pay_list, express_list, express_list_loading } = toRefs(express) 
// import { baseStore } from '@/stores/main' 
// import { cateStore } from '@/stores/cate' 
import { deepClone } from '@/utils'  
// import { useSettingsStore } from '@/stores/settings' 
// const settings = useSettingsStore()
// const { isH5 } = toRefs(settings)
// import { userStore } from '@/stores/user' 
// const user = userStore()
// const { cpy_info, subAccount } = toRefs(user) 
const props = defineProps({
    id: {
        type: String,
        default: ''
    },  
}); 
const formRef = ref<FormInstance>()   
const $api: any = inject('$api') 
const dynamicValidateForm = reactive<{  
    kuaidicom: string
    name: string
    partnerId: string 
    partnerKey: string
    partnerSecret: string 
    partnerName: string
    net: string 
    code: string
    checkMan: string 
    payType: string 
    expType: string 
}>({  
    kuaidicom: '',
    name: '',
    partnerId: '', 
    partnerKey: '',
    partnerSecret: '', 
    partnerName: '',
    net: '', 
    code: '',
    checkMan: '', 
    payType: '', 
    expType: '',
}) 
const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            message: '物流不能为空',
            trigger: ['change', 'blur'],
        },
    ],
    payType: [
        {
            required: true,
            message: '物流支付方式不能为空',
            trigger: ['change', 'blur'],
        },
    ],
    expType: [
        {
            required: true,
            message: '类型不能为空',
            trigger: ['change', 'blur'],
        },
    ],
})   
const express_type_list = ref([
    '标准快递'
])
watch(
    () => props.id,
    (newVal ) => {
        // console.log('id:' +newVal ); 
        if(!newVal) return
        getDetailData()
    },
    {immediate: true}
)     

onMounted(async () => {
    if(express_pay_list.value.length == 0) {
        await express.getExpressData(true)  
    }
})   

function formParams2apiParams() {
    let formParams = deepClone({...dynamicValidateForm, id: props.id});  
    return formParams
}   
function expressChangeEvent(e) { 
    let i = express_list.value.findIndex(ele => ele.id == e)
    if(i == -1) {
        ElMessage.error('列表数据有误，请刷新数据')
        return
    }
    let data:any = express_list.value[i] 
    dynamicValidateForm.kuaidicom = data.kuaidicom
    dynamicValidateForm.name = data.name
    dynamicValidateForm.partnerId = data.partnerid
    dynamicValidateForm.partnerKey = data.partnerkey
    dynamicValidateForm.partnerSecret = data.partnersecret
    dynamicValidateForm.partnerName = data.partnername
    dynamicValidateForm.net = data.net
    dynamicValidateForm.code = data.code
    dynamicValidateForm.checkMan = data.checkman
    if(data.type) {
        express_type_list.value = data.type
        dynamicValidateForm.expType = ''
    }
    // dynamicValidateForm.expType = data.expType
}
function submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            console.log('submit!')
            // console.log(dynamicValidateForm)
            let params = formParams2apiParams()
            console.log(params)
            await submitApi(params)
        } else {
            console.log('error submit!')
            return false
        }
    })
}
 
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return 
    formEl.resetFields()
}
 
  
async function submitApi(data) { 
    const res = await $api.express_save({
        ...data, 
    })
    if(res.code == 1) {
        ElMessage.success(res.msg)
        router.push({
            name: 'express_list'
        })
    }
}
 
 
async function getDetailData () {
    const res = await $api.express_detail({params: { id: props.id }})
    if(res.code == 1) { 
        let data = res.list 
        dynamicValidateForm.kuaidicom = data.kuaidicom
        dynamicValidateForm.name = data.name
        dynamicValidateForm.partnerId = data.partnerid
        dynamicValidateForm.partnerKey = data.partnerkey
        dynamicValidateForm.partnerSecret = data.partnersecret
        dynamicValidateForm.partnerName = data.partnername
        dynamicValidateForm.net = data.net
        dynamicValidateForm.code = data.code
        dynamicValidateForm.checkMan = data.checkman
        dynamicValidateForm.expType = data.exptype
        dynamicValidateForm.payType = data.paytype 
        let item = express_list.value.filter((ele:any )=> ele.name == data.name)[0]
        express_type_list.value = item.type
    }
}
  
</script>
  
<style lang='scss' scoped> 
::v-deep {
    
    .el-table {
        // --el-table-border-color: #dcdfe6;
        thead tr th{
            border-color: #dcdfe6;
        }
    } 
    .el-form-item__label {
        font-weight: bold;
        font-size: 15px;
    } 
 

} 
</style>