const EARTH_RADIUS_KM: f64 = 6371.0; // 地球半径，单位：公里
#[tauri::command]
// 计算两个经纬度点之间的距离（单位：公里）
fn haversine_distance(start:[f64;2],end:[f64;2]) -> f64 {
    // 将经纬度从度数转换为弧度
    let lat1_rad = start[0].to_radians();
    let lon1_rad =  start[1].to_radians();
    let lat2_rad = end[0].to_radians();
    let lon2_rad = end[1].to_radians();

    // 经纬度差值
    let dlat = lat2_rad - lat1_rad;
    let dlon = lon2_rad - lon1_rad;

    // Haversine 公式
    let a = (dlat / 2.0).sin().powi(2) + lat1_rad.cos() * lat2_rad.cos() * (dlon / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());

    // 计算距离
    EARTH_RADIUS_KM * c
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![haversine_distance])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
