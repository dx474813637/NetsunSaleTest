<template>
    <el-dialog customClass="cusTomClass" v-model="dialogTableVisible" width="1000px" :title="title" @open="open" :close-on-press-escape="false" >
        <div class="home-w">
            1   
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, inject, onMounted, watch, computed } from 'vue'
import router from '@/router/guard'
import { genFileId, ElMessage } from 'element-plus' 
import type { FormInstance, UploadFile, UploadRequestOptions, UploadRawFile, UploadProps, FormRules, TableColumnCtx  } from 'element-plus'
import { deepClone } from '@/utils'
import Editor from '@/components/Editor/Editor.vue'
import { baseStore } from '@/stores/main'
const { configHeader } = baseStore()
// import { DomEditor } from '@wangeditor/editor'
import {
    Delete, Plus, ZoomIn, CirclePlus, FolderOpened 
} from '@element-plus/icons-vue'


const disabled = ref(false)
const dialogVisible = ref(false)
 
const $api: any = inject('$api')

const dynamicValidateForm = reactive<{ 
    pic: Array<any> 
}>({ 
    pic: [], 
})  
const emit = defineEmits(["setShow", "updateList"]);
const dialogTableVisible = computed({
    set(v) {
		console.log(v)
        emit('setShow', v)
    },
    get() {
        return props.show
    }
})
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
async function open() {
    
} 
</script>
<style lang='scss' scoped></style>