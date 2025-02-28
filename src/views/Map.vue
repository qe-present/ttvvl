<script setup lang="ts">
//@ts-nocheck
import GetMap from "@/utils/Map.ts";
import {MAP_CONTROL} from "@/constant/data.ts";
import {invoke} from "@tauri-apps/api/core";
import {emit,listen} from "@tauri-apps/api/event";
import {onMounted, ref} from 'vue';
import WindowManager from '@/utils/window';

const windowManager = new WindowManager();
let startName=ref<String>('起点');
let endName=ref<String>('终点');
let markerWindow,mainWindow,markerIndex=null;
let map: any = null
let markerList: L.Marker[] = [];
let distance=ref<number>(0);

listen('message-to-main-window', (event)=>{  //监听消息
  let payload:any=event.payload
  if(payload.close){
    windowManager.closeWindow('marker-name')
    mainWindow.show()
  }
  if(markerIndex===null){
    return
  }
  if(markerIndex===0){
    startName.value='起点'+payload.tooltipContent
  }else{
    endName.value='终点'+payload.tooltipContent
  }
  markerList[markerIndex].bindTooltip(payload.tooltipContent)
});
async function sendMsg(tooltipContent:String,nowClickMarkerId:Number) {  //发送消息
  markerWindow=await windowManager.getWindowByLabel('marker-name') //子窗口
  mainWindow=await windowManager.getWindowByLabel('main')  //父窗口
  if(markerWindow) {
    mainWindow.hide()
    markerWindow.show();
    markerIndex=markerList.findIndex(
        (marker:L.Marker)=>marker._leaflet_id===nowClickMarkerId
    )
    emit('message-to-second-window', { //发送消息 参数
          lat: markerList[0].getLatLng().lat,
          lng: markerList[0].getLatLng().lng,
          markerIndex:markerIndex,
          tooltipContent:tooltipContent
        }
    )
  }
}



async function get_distance(){
  let start=markerList[0].getLatLng(); //开始点
  let end=markerList[1].getLatLng();   //终点
  let startArray=[start.lat,start.lng];
  let endArray=[end.lat,end.lng];
  distance.value = await invoke('haversine_distance', { //发送给rust tauri
    start: startArray,
    end: endArray
  });
}
onMounted(() => {
  // openWindow()
  map = GetMap(MAP_CONTROL);
  map.on('pm:create', (e: any) => { //  map create事件
    let marker:L.Marker = e.marker;
    marker.on('click',(e)=>{ // marker的点击事件
      let nowClickMarkerId=e.target._leaflet_id  // 获取marker的id
      sendMsg(e.target.getTooltip(),nowClickMarkerId)  // 发送消息
    })
    markerList.push(marker);
    let length = markerList.length;
    if(length==2){  // 起始点 和终点
      get_distance()  //获取距离
    }else if(length>2){
      markerList[0].remove(); //移除第一个点
      markerList.shift();
      get_distance()   // 获取距离
    }

  })

})
</script>

<template>
<div id="map">

  <div id="distance-text" v-if="markerList.length>=2">从{{startName}}到{{endName}}的距离为</div>
  <div>
  <button type="button" id="show" >{{distance}}</button>
  </div>
  <div id="unit">
    公里
  </div>

</div>
</template>

<style scoped>
#map {
  margin: 0 auto;
  width: 100%;
  height: 900px;
}
#show {
  max-width: 200px;
  max-height: 50px;
  padding: 10px;
  background-color: blue;
  color: white;
  text-align: center;
  position: absolute;
  top: 100px;
  right: 10px;
  z-index: 999;
  border-radius: 20px;
}
#distance-text {
  max-width: 200px;
  max-height: 50px;
  padding: 10px;
  background-color: #af8433;
  color: white;
  text-align: center;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 999;
  border-radius: 20px;
}
#unit {
  max-width: 200px;
  max-height: 50px;
  padding: 10px;
  background-color: #af8433;
  color: white;
  text-align: center;
  position: absolute;
  top: 150px;
  right: 10px;
  z-index: 999;
  border-radius: 20px;
}

</style>