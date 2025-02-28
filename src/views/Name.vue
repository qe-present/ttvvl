<script setup>
import {listen,emit} from "@tauri-apps/api/event";
import {onMounted, ref} from "vue";
let lat = ref(0);
let lng = ref(0);
let markerIndex = ref(0); // 0 替换成起点 1 替换成终点
let inputValue = ref('');
let oldTooltip=null


const handleClicked = () => {
  emit('message-to-main-window', {
    tooltipContent:inputValue.value,
    close: true,
  });
}
const handleCancel = () => {
  emit('message-to-main-window', {
    tooltipContent:oldTooltip,
    close: true,
  });
}
onMounted(
  () => {
    listen('message-to-second-window', (event) => {
      let payload = event.payload;
      lat.value = payload.lat;
      lng.value = payload.lng;
      markerIndex.value = payload.markerIndex;
      inputValue.value=payload.tooltipContent;
      oldTooltip=payload.tooltipContent
    });
  }
)

</script>
<template>
  <div  data-tauri-drag-region class="titlebar"  >
  <h1>{{markerIndex===0?'起点':'终点'}}</h1>
  <div v-if="lat>0">纬度：{{lat  }}</div>
  <div v-if="lng>0">经度：{{lng  }}</div>
  <div>名称
    <br/>
    <input v-model="inputValue"></input>
  </div>
  <br/>
  <button type="button" @click="handleClicked" class="sure">确定</button>
  <button type="button" @click="handleCancel" class="cancel">取消</button>
  </div>
</template>
<style >
.sure{
  padding: 10px ;
  margin-right: 10vw;
  background-color: #5174ff;
}
.cancel{
  padding: 10px ;
  margin-right: 10vw;
  background-color: #ffb43e;

}

</style>