import {MAP_URL} from "@/constant/data.ts";
import L from 'leaflet';
const GetMap = (
    control: any=null,
    language:any = 'zh'
): L.Map => {
    const options: L.MapOptions = {
        center: [30.6667, 104.0667],
        minZoom: 0,
        maxZoom: 30,
        zoom: 10,
        zoomControl: true,
        doubleClickZoom: true,
        attributionControl: true,
        dragging: true,
        boxZoom: true,
        scrollWheelZoom: true,
        zoomSnap: 0.5,
    };
    const map = L.map('map', options);
    L.tileLayer(MAP_URL, {
        attribution: '',
    }).addTo(map);
    if (control){
        map.pm.addControls(control);
    }
    map.pm.setLang(language);
    return map;
};
export default GetMap;