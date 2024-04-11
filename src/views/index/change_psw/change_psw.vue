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
        <!-- <el-form-item label="旧密码" prop="password">
            <el-input 
                v-model="dynamicValidateForm.password" 
                type="password" 
                autocomplete="off" 
                clearable
                style="max-width: 400px;"
            />
        </el-form-item> -->
        <el-form-item label="新密码" prop="passworda">
            <el-input 
                v-model="dynamicValidateForm.passworda" 
                type="password" 
                autocomplete="off" 
                clearable
                style="max-width: 400px;"
            />
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
            <el-input
                v-model="dynamicValidateForm.checkPass"
                type="password"
                autocomplete="off"
                clearable
                style="max-width: 400px;"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">提交</el-button> 
        </el-form-item>
    </el-form>  
</template>
  
<script lang="ts" setup>
import { reactive, ref, inject } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { deepClone } from '@/utils' 

const $api: any = inject('$api')  
const formRef = ref<FormInstance>()  
const dynamicValidateForm = reactive<{ 
    password: string 
    passworda: string 
    checkPass: string
}>({ 
    password: '', 
    passworda: '', 
    checkPass: ''
}) 
const validateOldPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入旧密码'))
  }
}
const validateNewPass = (rule: any, value: any, callback: any) => {
    console.log(rule)
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (dynamicValidateForm.checkPass !== '') {
      if (!formRef.value) return
      formRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validateNewPass2 = (rule: any, value: any, callback: any) => {
    console.log(rule)
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== dynamicValidateForm.passworda) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<typeof ruleForm>>({
    password: [{
        required: true,
        message: '请输入旧密码',
        trigger: ['change', 'blur'],
    }],
    passworda: [{ validator: validateNewPass, trigger: ['blur'] }],
    checkPass: [{ validator: validateNewPass2, trigger: ['blur'] }],
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
    const res = await $api.change_psw({
        ...data
    })
    if(res.code == 1) {
        ElMessage.success(res.msg)
        router.push({
            name: 'product_list'
        })
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