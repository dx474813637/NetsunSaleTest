<template>
    <div style="width: 100%;">
        <div class="u-p-5">
            <el-alert title="旺铺信息已认证" :closable="false" type="success" v-if="cpy_info.rz == 1" />
            <el-alert title="旺铺信息未认证" :closable="false" type="error" v-else />
        </div>
        
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
            <!-- <el-form-item prop="name" label="密码">
                <el-input v-model="dynamicValidateForm.name" />
            </el-form-item>  -->
            <el-form-item label="旺铺名称" prop="company">
                <el-input v-model="dynamicValidateForm.company" clearable />
            </el-form-item>
            <el-form-item label="旺铺logo" prop="logo" required>
                <!-- <el-input v-model="dynamicValidateForm.logo" /> -->
                <el-upload 
                    ref="logo" 
                    action=""  
                    :class="{
                        limit: dynamicValidateForm.logo.length == 1
                    }"  
                    v-model:file-list="dynamicValidateForm.logo"
                    list-type="picture-card" 
                    :limit="1"
                    :headers="configHeader"  
                    :http-request="(options) => upload(options, dynamicValidateForm.logo) "
                    :before-upload="beforeUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>

                    <template #file="{ file }"> 
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                    <el-icon><zoom-in /></el-icon>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete"
                                    @click="handleRemove(file, undefined, 'logo')">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-upload> 
            </el-form-item>
            <el-form-item label="旺铺介绍" prop="info">
                <el-input
                    v-model="dynamicValidateForm.info"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    type="textarea"
                    placeholder="公司介绍"
                />
                <!-- <div style=" width: 100%"> 
                    <Editor 
                        mode="simple" 
                        hideToolbar
                        editorHeight="200px"
                        ref="editor" 
                    />
                </div> -->
            </el-form-item>
            <el-form-item label="实名公司名称" prop="rz_company" >
                <el-input v-model="dynamicValidateForm.rz_company" :disabled="cpy_info.rz == 1"  clearable/>
            </el-form-item>
            <el-form-item label="统一社会信用代码" prop="rz_no">
                <el-input v-model="dynamicValidateForm.rz_no" :disabled="cpy_info.rz == 1" clearable />
            </el-form-item>
            <el-form-item label="营业执照" prop="rz_pic" required clearable>
                <!-- <el-input v-model="dynamicValidateForm.rz_pic" /> -->
                <el-upload 
                    ref="rz_pic" 
                    action=""  
                    :class="{
                        limit: dynamicValidateForm.rz_pic.length == 1
                    }"  
                    :disabled="cpy_info.rz == 1"
                    v-model:file-list="dynamicValidateForm.rz_pic"
                    list-type="picture-card" 
                    :limit="1"
                    :headers="configHeader"  
                    :http-request="(options) => upload(options, dynamicValidateForm.rz_pic) "
                    :before-upload="beforeUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>

                    <template #file="{ file }"> 
                        <div>
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                    <el-icon><zoom-in /></el-icon>
                                </span>
                                <span v-if="cpy_info.rz != 1" class="el-upload-list__item-delete"
                                    @click="handleRemove(file, undefined, 'rz_pic')">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-upload> 
            </el-form-item> 
            <el-form-item label="公司地址" prop="address" required >
                <el-input v-model="dynamicValidateForm.address" clearable />
            </el-form-item>
            <el-form-item label="联系电话" prop="tel" required> 
                <el-input v-model="dynamicValidateForm.tel" clearable  />
            </el-form-item>
            <el-form-item label="联系人" prop="name" required>
                <el-input v-model="dynamicValidateForm.name" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div> 
        <el-dialog v-model="dialogVisible">
            <img w-full style="width: 100%" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref, inject, onMounted, watch, toRefs } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus' 
import type { FormInstance, UploadFile, UploadRequestOptions, UploadRawFile, UploadProps, FormRules, TableColumnCtx  } from 'element-plus'
import { deepClone } from '@/utils'
import Editor from '@/components/Editor/Editor.vue'
import { baseStore } from '@/stores/main'
const { configHeader } = baseStore()
import { userStore } from '@/stores/user'
const user = userStore()
const { cpy_info } = toRefs(user)
// import { DomEditor } from '@wangeditor/editor'
import {
    Delete, Plus, ZoomIn, CirclePlus, FolderOpened 
} from '@element-plus/icons-vue'

const dialogImageUrl = ref('')
const disabled = ref(false)
const dialogVisible = ref(false)
const editor = ref() 
const initInfo = ref(false)
const $api: any = inject('$api')
const formRef = ref<FormInstance>() 
const dynamicValidateForm = reactive<{
    company: string
    rz_company: string
    rz_no: string
    logo: Array<any>
    rz_pic: Array<any>
    address: string
    tel: string
    name: string 
    info: string
    id: string 
}>({
    company: '',
    rz_company: '',
    rz_no: '',
    logo: [],
    rz_pic: [],
    address: '',
    tel: '',
    name: '',
    info: '',
    id: '' 
})
watch(
    () => editor.value?.editorRef,
    (n) => { 
        if(initInfo.value) {
            n.setHtml(dynamicValidateForm.info)
            initInfo.value = false
        }
    }
)
watch(
    () => initInfo.value,
    (n) => { 
        if(editor.value?.editorRef && n) {
            editor.value.editorRef.setHtml(dynamicValidateForm.info)
            initInfo.value = false
        }
    }
)
watch(
    () => editor.value?.valueHtml,
    (n) => {
        // console.log(editor.value.editorRef) 
        dynamicValidateForm.info = n
    }
)
const checkRzPic = (rule: any, value: any, callback: any) => {
  if (value.length == 0) { 
    callback(new Error('请上传，不能为空'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules<typeof ruleForm>>({
    company: [{
        required: true,
        message: '不能为空',
        trigger: ['change', 'blur'],
    }],
    info: [{
        required: true,
        message: '不能为空',
        trigger: ['change', 'blur'],
    }],
    rz_company: [{
        required: true,
        message: '不能为空',
        trigger: ['change', 'blur'],
    }],
    rz_no: [{
        required: true,
        message: '不能为空',
        trigger: ['change', 'blur'],
    }],
    rz_pic: [{
        validator: checkRzPic,  
        trigger: ['change', 'blur'],
    }]
})
watch(
    () => dynamicValidateForm.rz_pic[0],
    (n) => { 
        formRef.value.validateField('rz_pic')
    },
    {
        deep: true
    }
)
onMounted(async () => { 
    await getData() 
})
async function getData() {
    await user.getCpyData() 
    dynamicValidateForm.company = cpy_info.value.company
    dynamicValidateForm.address = cpy_info.value.address
    dynamicValidateForm.id = cpy_info.value.id 
    if(cpy_info.value.logo) {
        dynamicValidateForm.logo = cpy_info.value.logo.split('|').map((ele:any) => ({url: ele})) 
    }
    if(cpy_info.value.rz_pic) {
        dynamicValidateForm.rz_pic = cpy_info.value.rz_pic.split('|').map((ele:any) => ({url: ele})) 
    }
        
    dynamicValidateForm.info = cpy_info.value.info
    if(cpy_info.value.info) initInfo.value = true
    dynamicValidateForm.name = cpy_info.value.name
    dynamicValidateForm.tel = cpy_info.value.tel 
    dynamicValidateForm.rz_no = cpy_info.value.rz_no 
    dynamicValidateForm.rz_company = cpy_info.value.rz_company 
}
function submitForm(formEl: FormInstance | undefined) { 
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            console.log('submit!')
            let params = deepClone(dynamicValidateForm);
            await submitApi({
                ...params, 
                logo: dynamicValidateForm.logo[0].url, 
                rz_pic: dynamicValidateForm.rz_pic[0].url
            })
        } else {
            console.log('error submit!')
            return false
        }
    })
}
async function submitApi(data) {
    const res = await $api.edit_company({
        ...data
    })
    if (res.code == 1) {
        ElMessage.success(res.msg)
        // router.push({
        //     name: 'product_list'
        // })
    }
} 
async function upload(param: any , propName, index:any) {
    // console.log(propName) 
    const formData = new FormData()
    formData.append('file', param.file)
    const res = await $api.upimg(formData)
    // console.log(res)
    if (res.code == 1) { 
        propName[propName.length - 1].url = res.list[0];  
        ElMessage.success('图片上传成功')  
        return true
    }
    return false
}
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    //   if (rawFile.type !== 'image/jpeg' ) {
    // console.log(rawFile.type)
    if (!/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(rawFile.type)) {
        ElMessage.error('图片格式有误！请检查！')
        return false
    } 
    // else if (rawFile.size / 1024 / 1024 > 2) {
    //     ElMessage.error('图片大小请勿超过2MB！')
    //     return false
    // }
    return true
}

const handleRemove = (file: UploadFile, index: string, propName, propName2, quick = false ) => { 
    if(typeof(index) != "undefined") {
        propName[index].clearFiles(); 
        propName2.filesList = []
        // if(quick) {
        //     uploadImgIndex.value = +index
        //     render({prop:'img', positionArr: [0, index]})
        // }
    }else {
        console.log(file)
        let i = dynamicValidateForm[propName].findIndex(ele => ele.url == file.url)
        dynamicValidateForm[propName].splice(i, 1)
    }
    ElMessage.success('图片移除成功')
}

const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!
    dialogVisible.value = true
}
async function handlePictureExceed(files: UploadFile, uploadFiles, propName) {
    console.log('handlePictureExceed')
    const res = await upload({ file: files[0] }, propName)
    if (res) {
        // console.log(uploadRefs)
        uploadRefs[index].clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        uploadRefs[index]!.handleStart(file)
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