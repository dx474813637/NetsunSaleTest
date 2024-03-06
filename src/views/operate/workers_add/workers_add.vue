<template>
    <div class="u-p-15 u-radius-15 bg-white box-border">
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
            <el-form-item label="员工UID" prop="uid">
                <el-input 
                    v-model="dynamicValidateForm.uid"  
                    autocomplete="off" 
                />
            </el-form-item> 
            <el-form-item label="验证码" prop="code">
                <div class="u-flex u-flex-items-center ">
                    <el-input 
                        class="u-flex-1 u-m-r-20"
                        v-model="dynamicValidateForm.code"   
                    />
                    <el-button 
                        type="primary"   
                        icon="Message"
                        :disabled="getCodeDisabled"  
                        :loading="getCodeLoading"   
                        @click="getCodeBtn"
                        > 
                        <span v-if="!getCodeCountDownShow">发送短信验证码</span> 
                        <div class="u-flex u-flex-items-center" v-else>
                            <el-countdown 
                                :valueStyle="{
                                    color: '#fff',
                                    fontSize: '14px', 
                                }" 
                                style="margin-top: -5px;"
                                format="ss"
                                :value="time" 
                                @finish="countDownFinish"  
                            />
                            <span>秒后可重新发送</span>
                        </div>
                        
                    </el-button>
                </div>
                
            </el-form-item> 
            <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">提交</el-button> 
            </el-form-item>
        </el-form> 
    </div>
    
</template>
  
<script lang="ts" setup>
import { reactive, ref, inject, computed } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { deepClone } from '@/utils' 
const TIME_COUNT_DOWN = 1000 * 60
const TIME_COUNT_DOWN2 = 1000 * 5
const time = ref(TIME_COUNT_DOWN)
const getCodeLoading = ref(false)
const getCodeDisabled = computed(() => getCodeLoading.value || !dynamicValidateForm.uid || getCodeCountDownShow.value)
const getCodeCountDownShow = ref(false)
const $api: any = inject('$api')  
const formRef = ref<FormInstance>()  
const dynamicValidateForm = reactive<{ 
    code: string 
    uid: string  
}>({ 
    code: '', 
    uid: '',  
})   
const rules = reactive<FormRules<typeof ruleForm>>({
    uid: [{
        required: true,
        message: '员工UID不能为空',
        trigger: ['change', 'blur'],
    }], 
    code: [{
        required: true,
        message: '验证码不能为空',
        trigger: ['change', 'blur'],
    }], 
})  
 
function countDownFinish() { 
    console.log('f') 
    getCodeLoading.value = false
    getCodeCountDownShow.value = false
}
async function getCodeBtn() {
    if(getCodeLoading.value) return
    getCodeLoading.value = true
    try {
        const res = await $api.get_code({
            params: {
                uid: dynamicValidateForm.uid
            },
            loading: false
        })
        if(res.code == 1) {
            ElMessage.success(res.msg) 
            getCodeCountDownShow.value = true 
            time.value = Date.now() + TIME_COUNT_DOWN 
        }
    } catch (error) {
        console.log(error)
        getCodeCountDownShow.value = true 
        time.value = Date.now() + TIME_COUNT_DOWN2
    }
    getCodeLoading.value = false
    
}
function submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return 
    formEl.validate(async (valid) => { 
        if (valid) {
            console.log('submit!')
            // console.log(dynamicValidateForm)
            // let params = formParams2apiParams()
            let params = deepClone(dynamicValidateForm);
            // console.log(params)
            await submitApi(params)
        } else {
            console.log('error submit!')
            return false
        }
    })
}
 
 

async function submitApi(data) { 
    const res = await $api.uid_bind_handle({
        params: {
            ...data
        }
    })
    if(res.code == 1) {
        ElMessage.success(res.msg)
        router.push({
            name: 'workers_list'
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