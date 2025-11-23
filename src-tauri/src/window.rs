use tauri::{AppHandle, Manager, WebviewWindow, WindowEvent};
use tauri_plugin_decorum::WebviewWindowExt;

pub const MAIN_WINDOW_LABEL: &str = "main";
pub const SETTINGS_WINDOW_LABEL: &str = "settings";

pub fn init_main_window(handle: &AppHandle) -> tauri::Result<WebviewWindow> {
    let win = handle.get_webview_window(MAIN_WINDOW_LABEL).unwrap();
    win.create_overlay_titlebar()?;
    {
        let handle = handle.clone();
        win.on_window_event(move |event| {
            if let WindowEvent::CloseRequested { .. } = event {
                handle.exit(0);
            }
        })
    }

    #[cfg(target_os = "macos")]
    win.set_traffic_lights_inset(16.0, 20.0)?;

    Ok(win)
}

pub fn init_settings_window(handle: &AppHandle) -> tauri::Result<WebviewWindow> {
    let win = handle.get_webview_window(SETTINGS_WINDOW_LABEL).unwrap();
    win.hide()?;
    win.create_overlay_titlebar()?;
    {
        let handle = handle.clone();
        win.on_window_event(move |event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                if let Some(w) = handle.get_webview_window(SETTINGS_WINDOW_LABEL) {
                    w.hide().unwrap();
                }
            }
        });
    }

    #[cfg(target_os = "macos")]
    win.set_traffic_lights_inset(20.0, 20.0)?;

    Ok(win)
}
