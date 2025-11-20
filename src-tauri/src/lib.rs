use log::LevelFilter;
use tauri_plugin_decorum::WebviewWindowExt;

mod commands;
mod window;

#[cfg(debug_assertions)]
fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    tauri_plugin_prevent_default::debug()
}

#[cfg(not(debug_assertions))]
fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
    tauri_plugin_prevent_default::init()
}

pub fn run() {
    use log::info;
    use tauri::Manager;
    use tauri_plugin_log::{Target, TargetKind};

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                ])
                .level(if cfg!(debug_assertions) {
                    LevelFilter::Debug
                } else {
                    LevelFilter::Info
                })
                .build(),
        )
        .plugin(prevent_default())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(win) = app.get_webview_window(window::MAIN_WINDOW_LABEL) {
                win.set_focus().unwrap();
            }
        }))
        .plugin(tauri_plugin_decorum::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(commands::ProcessingState::default())
        .invoke_handler(tauri::generate_handler![
            commands::upscale_image,
            commands::cancel_upscale,
            commands::check_model_available,
            commands::download_model
        ])
        .setup(|app| {
            info!("moss app starting");
            let main_window = window::init_main_window(app).unwrap();

            main_window.create_overlay_titlebar().unwrap();
            #[cfg(target_os = "macos")]
            main_window.set_traffic_lights_inset(16.0, 20.0).unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
