<template> 
    <el-form 
        ref="formRef" 
        :model="dynamicValidateForm" 
        label-width="120px" 
        :rules="rules" 
        class="demo-dynamic u-p-20 box-border"
        label-position="top"
        scroll-to-error
        inline-message
        > 
        <el-form-item label="手机号" prop="phone" v-if="mode == 'add'">
            <el-input 
                v-model="dynamicValidateForm.phone"  
                autocomplete="off" 
                clearable
                style="max-width: 400px;"
            />
        </el-form-item>
            <el-form-item label="公司名称" prop="name" v-if="mode == 'add'">
                <el-input 
                    v-model="dynamicValidateForm.name"  
                    autocomplete="off" 
                    clearable 
                    style="max-width: 400px;"
                />
            </el-form-item>
        <template  v-if="mode == 'edit'">
            <el-form-item label="id" prop="id">
                <el-input 
                    v-model="dynamicValidateForm.id"  
                    autocomplete="off" 
                    clearable
                    disabled 
                    style="max-width: 400px;"
                />
            </el-form-item>
            <el-form-item label="新密码" prop="psw">
                <el-input
                    v-model="dynamicValidateForm.psw"
                    type="password"
                    autocomplete="off"
                    show-password
                    clearable
                    style="max-width: 400px;"
                />
            </el-form-item>
        </template>
        
        <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">提交</el-button> 
        </el-form-item>
    </el-form>  
</template>
  
<script lang="ts" setup>
import { reactive, ref, inject, watch, toRefs } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import test from '@/utils/test.js'
import { deepClone } from '@/utils' 
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore(); 
const props = defineProps({
    id: {
        type: String,
        default: ''
    },  
}); 
const mode = ref('')
const $api: any = inject('$api')  
const formRef = ref<FormInstance>()  
const dynamicValidateForm = reactive<{ 
    id: string 
    phone: string
    psw: string  
    name: string  
}>({ 
    id: '', 
    phone: '', 
    psw: '',  
    name: '',  
}) 
watch(
    () => router.currentRoute.value.name,
    (newVal:any ) => { 
        // console.log(newVal)
        if(newVal == "sub_acc_add") {
            mode.value = 'add'
        }
        if(newVal == "sub_acc_edit") {
            mode.value = 'edit'
        }
    },
    {immediate: true}
)
watch(
    () => props.id,
    (newVal ) => {
        // console.log('id:' +newVal ); 
        if(!newVal) return
        dynamicValidateForm.id = newVal
    },
    {immediate: true}
) 
const rules = reactive<FormRules<typeof ruleForm>>( 
    mode.value == 'edit'? 
    { 
    psw: [{
        required: true,
        message: '请输入修改后的新密码',
        trigger: ['change', 'blur'],
    }], 
} : {
    phone: [{ 
        required: true,
        validator: (rule: any, value: any, callback: any) => { 
            if (!test.mobile(value)) { 
                callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        },
        trigger: ['change', 'blur'],
    }],  
})  
  
function submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return 
    formEl.validate(async (valid) => { 
        if (valid) {
            console.log('submit!')
            // console.log(dynamicValidateForm)
            // let params = formParams2apiParams()
            let params = deepClone(dynamicValidateForm);
            console.log(params)
            await submitApi(params)
        } else {
            console.log('error submit!')
            return false
        }
    })
}
 
 

async function submitApi(data) { 
    let fun = mode.value == 'add'? 'add_sub_account' : 'edit_sub_account'
    const res = await $api[fun]({
        params: {...data}
    })
    if(res.code == 1) {
        ElMessage.success(res.msg)
        
        if(mode.value == 'add') {
            ElMessageBox.alert(
                `您创建的子账户密码为${res.list.psw}`, 
                '新增成功', 
                { 
                    showClose: false,
                    type: 'success',
                    confirmButtonText: '确认并复制密码',
                    callback: (action: Action) => {
                        settings.copyEvent({type: 'text', content: res.list.psw})
                    },
                }
            )
        }
        else {
            router.push({
                name: 'sub_acc'
            })
        }
        
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