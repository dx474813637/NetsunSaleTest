<!--  -->
<template>
	<div style="border: 1px solid #dcdfe6; border-radius: 4px; overflow: hidden;">
		<Toolbar 
			:style="{
				borderBottom: hideToolbar? 'none' : '1px solid #dcdfe6'
			}" 
			:editor="editorRef" 
			:defaultConfig="toolbarConfig" 
			:mode="mode" 
		/>
		<Editor 
			style="width: 100%; overflow-y: hidden;" 
			:style="{
				height: editorHeight
			}"
			v-model="valueHtml" 
			:defaultConfig="editorConfig" 
			:mode="mode"
			@onCreated="handleCreated" 
		/>
	</div>
</template>

<script setup lang='ts'>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// import { DomEditor } from '@wangeditor/editor'


const editorRef = shallowRef()
const props = defineProps({
	mode: {
		type: String,
		default: 'default'
	},
	toolbarKeys: {
		type: Array,
		default: () => []
	},
	hideToolbar: {
		type: Boolean,
		default: false
	},
	editorHeight: {
		type: String,
		default: '500px'
	}
})
// 内容 HTML
const valueHtml = ref('')

// 模拟 ajax 异步获取内容
onMounted(() => {
	  
})
let toolbarConfig = {}
if(props.toolbarKeys.length > 0) {
	toolbarConfig.toolbarKeys = props.toolbarKeys
}
if(props.hideToolbar) {
	toolbarConfig.toolbarKeys = []
} 
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor == null) return
	editor.destroy()
}) 
const handleCreated = (editor) => {
	editorRef.value = editor // 记录 editor 实例，重要！ 
}

defineExpose({
	editorRef,
	valueHtml,
	mode: props.mode, // 或 'simple'
	toolbarConfig,
	editorConfig,
	handleCreated
})
</script>
<style lang='scss' scoped></style>