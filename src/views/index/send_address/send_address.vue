<template>
    <div style="width: 100%;">

        <el-form ref="formRef" :model="dynamicValidateForm" label-width="120px" :rules="rules"
            class="demo-dynamic u-p-20 box-border" label-position="top" scroll-to-error inline-message>

            <el-row>
                <el-col :span="14" :xs="24">
                    <el-form-item label="寄件人" prop="name">
                        <el-input placeholder="寄件人姓名" v-model="dynamicValidateForm.name" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            
            <el-row>
                <el-col :span="14" :xs="24">
                    <el-form-item label="详细地址（包括省市区）" prop="address">
                        <el-input v-model="dynamicValidateForm.address" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                            placeholder="详细地址（包括省市区）" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="14" :xs="24">
                    <el-form-item label="手机" prop="tel" required>
                        <el-input v-model="dynamicValidateForm.tel" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            
            
            <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
    <!-- <div> 
        <el-dialog v-model="dialogVisible">
            <img w-full style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div> -->
</template>

<script lang="ts" setup>
import { reactive, ref, inject, onMounted, watch, toRefs } from 'vue'
// import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus'
import type { FormInstance, UploadFile, UploadRequestOptions, UploadRawFile, UploadProps, FormRules, TableColumnCtx } from 'element-plus'
import { deepClone } from '@/utils'
import Editor from '@/components/Editor/Editor.vue'
import { baseStore } from '@/stores/main'
const { configHeader } = baseStore()
import { cateStore } from '@/stores/cate'
const cateObj = cateStore()
const { regional_list } = toRefs(cateObj)
import test from '@/utils/test.js'
// import { DomEditor } from '@wangeditor/editor'
// import {
//     Delete, Plus, ZoomIn, CirclePlus, FolderOpened 
// } from '@element-plus/icons-vue'

const dialogImageUrl = ref('')
const disabled = ref(false)
const dialogVisible = ref(false)
const editor = ref()
const initInfo = ref(false)
const $api: any = inject('$api')
const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<{
    name: string
    tel: string
    address: string
}>({
    name: '',
    tel: '',
    address: '',
})
const checkMobile = (rule: any, value: any, callback: any) => {
    if (!value) {
        callback(new Error('请输入手机号'))
    }
    else if (!test.mobile(value)) {
        callback(new Error('手机格式有误'))
    } else {
        callback()
    }
}
const rules = reactive<FormRules<typeof ruleForm>>({
    address: [{
        required: true,
        message: '不能为空',
        trigger: ['change', 'blur'],
    }],
    tel: [{
        validator: checkMobile,
        trigger: ['change', 'blur'],
    }],
    name: [{
        required: true,
        message: '不能为空',
        trigger: ['change', 'blur'],
    }]
})
onMounted(async () => {
    await getData()
    // cateObj.getRegionalData()
})
async function getData() {
    const res = await $api.address_detail2()
    if (res.code == 1) {
        dynamicValidateForm.address = res.list?.address
        dynamicValidateForm.tel = res.list?.tel
        dynamicValidateForm.name = res.list?.name
    }
}
function submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            console.log('submit!')
            let params = deepClone(dynamicValidateForm);
            console.log(params)
            await submitApi({
                ...params,
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
async function submitApi(data) {
    const res = await $api.edit_address2({
        ...data
    })
    if (res.code == 1) {
        ElMessage.success(res.msg)
        // router.push({
        //     name: 'product_list'
        // })
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
        thead tr th {
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