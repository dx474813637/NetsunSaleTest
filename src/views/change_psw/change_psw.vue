<template>
    <el-form 
        ref="formRef" 
        :model="dynamicValidateForm" 
        label-width="120px" 
        :rules="rules" 
        class="demo-dynamic u-p-20"
        label-position="top"
        scroll-to-error
        inline-message
        >
        <!-- <el-form-item prop="name" label="密码">
            <el-input v-model="dynamicValidateForm.name" />
        </el-form-item>  -->
        <el-form-item label="旧密码" prop="password">
            <el-input 
                v-model="dynamicValidateForm.password" 
                type="password" 
                autocomplete="off" 
            />
        </el-form-item>
        <el-form-item label="新密码" prop="passworda">
            <el-input 
                v-model="dynamicValidateForm.passworda" 
                type="password" 
                autocomplete="off" 
            />
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
            <el-input
                v-model="dynamicValidateForm.checkPass"
                type="password"
                autocomplete="off"
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
.domains2Price-rows {
    @include flex(x, start, start);
    width: 100%;
}  
::v-deep {
    
    .el-table {
        // --el-table-border-color: #dcdfe6;
        thead tr th{
            border-color: #dcdfe6;
        }
    }
    .el-tabs--border-card>.el-tabs__header {
        border-radius: 5px 5px 0 0;
    }
    .el-tabs--border-card {
        border-radius: 5px;
    }
    .el-form-item__label {
        font-weight: bold;
        font-size: 15px;
    }
    .el-upload--picture-card {
        --el-upload-picture-card-size: 65px;
        // background-color: var(--el-color-primary-light-9);
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

    .el-upload-list--picture-card .el-upload-list__item {
        --el-upload-list-picture-card-size: 65px;
        
    }

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
    }
} 
.domain2Item-box {
    @include flex(x, start, start);
    flex-wrap: wrap;
    width: 100%;
    .domain2Item {
        flex: 0 0 33%;
        .domain2Item-inp {
            width: 100%;
            @include flex(x);
            .item {
                flex: 1;
                &.remove-btn {
                    flex: 0 0 40px; 
                    &>div {
                        @include flex(x, start, center);
                        cursor: pointer;
                        &:hover {
                            .el-icon {
                                color: $uni-color-error;
                            }
                        }
                    }
                }
            }
        }
    }

}
.domains2Price-rows { 
    ::v-deep {
        .el-upload-list--picture-card .el-upload-list__item {
            margin: 0;
        }
    }
}
.tabs-item {
    @include flex(x)
}
.domains-box {
    padding: 20px 0;
    border-radius: 10px;
    transition: all .3s;
    border: 1px dashed #eee;

    &:hover {
        background-color: #f8f8f8;
        border-color: $uni-color-primary;
    }
}
</style>