<template>
    <el-dialog 
        customClass="cusTomClass" 
        v-model="dialogTableVisible" 
        destroy-on-close 
        draggable 
        width="1000px" 
        :title="title" 
        @open="open" 
        :close-on-press-escape="false" 
        >
        <div class="home-w">
            <div class="u-m-b-10">
                <el-text type="info">放置鼠标于图片上方长按可拖拽图片进行排序</el-text>
            </div>
            <draggable
                class="draggable-w u-flex u-flex-wrap u-m-b-20"
                v-model="dataList"
                ghost-class="ghost"
                :force-fallback="true"
                chosen-class="chosenClass"
                animation="300"
                @start="onDragStart"
                @update="onDragUpdate"
                @end="onDragEnd"
                :sort="true"
                handle=".drag"
                item-key="id"
            >
                <template #item="{ element, index }">
                    <div class="draggable-item u-m-b-15 u-m-r-15">  
                        <div class="image-w drag"> 
                            <el-image 
                                class="image-item" 
                                :key="element.url" 
                                :src="element.url" 
                                lazy  
                                fit="cover"
                            /> 
                            <div class="image-icon-w u-flex u-flex-items-center u-flex-around u-p-2">
                                <div class="icon-item u-p-4 u-flex u-flex-items-center u-flex-center" @click="showImgView(element, index)">
                                    <el-icon size="16">
                                        <ZoomIn />
                                    </el-icon>
                                </div>
                                <div class="icon-item u-p-4 u-flex u-flex-items-center u-flex-center" @click="deleteImgView(element, index)">
                                    <el-icon size="16">
                                        <Delete />
                                    </el-icon>
                                </div> 
                            </div>
                        </div>
                    </div>
                </template>
            </draggable> 
            <div>
                <el-upload
                    class="upload-demo"
                    action="" 
                    drag 
                    multiple
                    :headers="configHeader"  
                    :http-request="(options) => upload(options, dataList) "
                    :before-upload="beforeUpload" 
                >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        拖拽若干张图片至虚线框内 或 <em>点击进行上传</em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            <el-text type="info">本次上传图片列表</el-text>
                        </div>
                    </template>
                </el-upload>
            </div>
        </div>
    </el-dialog>
    <div class="demo-image__preview">
        <!-- element-plus内部组件 -->
        <el-image-viewer 
            @close="() => { showViewer = false }" 
            v-if="showViewer"  
            :url-list="previewSrcList" 
            :initial-index="viewerIndex"
            />
    </div> 
</template>

<script setup lang="ts">
import { reactive, ref, inject, onMounted, watch, computed } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus' 
import type { FormInstance, UploadFile, UploadRequestOptions, UploadRawFile, UploadProps, FormRules, TableColumnCtx  } from 'element-plus'
import { deepClone } from '@/utils'
import Editor from '@/components/Editor/Editor.vue'
import { baseStore } from '@/stores/main'
const { configHeader } = baseStore();
 
// import { DomEditor } from '@wangeditor/editor'
// import {
//     ZoomIn, Delete
// } from '@element-plus/icons-vue'
import draggable from "vuedraggable";

const disabled = ref(false)
const dialogVisible = ref(false)
 
const $api: any = inject('$api')

const props = defineProps({
	id: {
		type: String,
        detail: ''
	},
    show: {
        type: Boolean,
        detail: false
    },
    title: {
		type: String,
        detail: ''
	},
    list: {
        type: Array,
        default: () => []
    }
});  
const emit = defineEmits(["setShow", "updateData"]);
const dialogTableVisible = computed({
    set(v) {
		console.log(v)
        emit('setShow', v)
    },
    get() {
        return props.show
    }
})  
const viewerIndex = ref(0)
const previewSrcList = computed(() => props.list.map(ele => ele.url))
const dataList = computed({
    set(v) {
		console.log(v)
        emit('updateData', v)
    },
    get() {
        return props.list
    }
})
const showViewer = ref(false)
async function open() {
    
} 

const showImgView = (item, index) => { 
    showViewer.value = true 
    viewerIndex.value = index
}
const deleteImgView = (item, index) => {
    const list = deepClone(dataList.value)
    list.splice(index, 1)
    dataList.value = list
}
async function upload(param: any , propName ) {
    // console.log(propName) 
    const formData = new FormData()
    formData.append('file', param.file)
    console.log(formData)
    const res = await $api.upimg(formData)
    // console.log(res)
    if (res.code == 1) { 
        // propName[propName.length - 1].url = res.list[0];  
        let list = deepClone(dataList.value);
        list.push({
            url: res.list[0]
        })
        dataList.value = list
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
// 关闭
const confirm = () => {
//   emit("update:dragDialog", false);
};
// 提交
const submitDrag = () => {
//   emit("submitDrag");
}; 
// 拖动前
const onDragStart = () => {
//   emit("onDragStart");
}; 
const onDragEnd = () => { 
//   emit("onDragEnd");
}; 
const onDragUpdate = (e) => {
    // console.log(e)
//   emit("onDragUpdate");
}; 
</script> 
<style lang='scss' scoped>
.draggable-w { 
    .draggable-item {
        .image-w {
            position: relative;  
            overflow: hidden;
            border-radius: 5px; 
            transition: all .3s;
            &:hover {
                box-shadow: 0 0 8px rgba(0,0,0,.6);
            }
            .image-item { 
                width: 80px;
                height: 80px;
                display: block;
                cursor: move
            }
            .image-icon-w { 
                width: 100%;
                height: 100%;  
                background-color: rgba(0,0,0,.5);
                color: #fff; 
                .icon-item {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>