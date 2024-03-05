<template> 
	<div class="w">
		<iframe 
			id="bdIframe"
          :src="webview.url" 
          scrolling="auto"
          frameborder="0" 
		  height="auto"
		  width='100%'
        /> 
	</div>
        
</template>

<script setup lang='ts'>
import { reactive,ref,watch,onMounted,onBeforeMount, toRefs} from 'vue' 

import {useSettingsStore} from '@/stores/settings'
const useSettings = useSettingsStore()
const { webview } = toRefs(useSettings) 

watch(
	() => webview.value,
	(n) => {
		console.log(n)
		useSettings.setTitle(n.label)
	},
	{
		immediate: true
	}
) 
</script>
<style lang='scss' scoped>
.w {
	height: calc(100vh - 75px - ($header-h));
	iframe {
		height: calc(100vh - 80px - ($header-h));
	}
}
</style>