<template>
    <div style="width: 400px;height: 300px;">
        <vue3-video-play width="100%" height="100%" title="" :src="options.src" :poster="options.poster" @play="onPlay"
            @pause="onPause" @timeupdate="onTimeupdate" @canplay="onCanplay" autoPlay />
    </div>

</template>


<script setup lang="ts"> 
import { reactive, watch } from 'vue';

const props = defineProps({
    src: {
        type: String,
        default: ''
    }, 
});
const options = reactive({
    src: "", //视频源
    poster: '', //封面
})
watch(
    () => props.src,
    (n) => {
        console.log(n)
        options.src = n
    },
    {
        immediate: true
    }
)
const onPlay = (ev) => {
    console.log('播放')
}
const onPause = (ev) => {
    console.log(ev, '暂停')
}

const onTimeupdate = (ev) => {
    console.log(ev, '时间更新')
}
const onCanplay = (ev) => {
    console.log(ev, '可以播放')
}
</script>

<style scoped></style>