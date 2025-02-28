import {createRouter, createWebHashHistory, Router, RouteRecordRaw, RouterOptions} from "vue-router";
const routes:RouteRecordRaw[]=[
    {
        path:"/",
        redirect:"map",
        children:[
            {
                path:"map",
                component:()=>import("../views/Map.vue")
            }
            ]
    },
    {
        path:"/name",
        component:()=>import("../views/name.vue")
    }

]
const options:RouterOptions={
    history:createWebHashHistory(),
    routes
}
const router:Router=createRouter(options)
export default router