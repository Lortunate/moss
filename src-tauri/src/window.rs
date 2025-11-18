use tauri::{WebviewUrl, WebviewWindow, WebviewWindowBuilder};

pub fn init_main_window(app: &tauri::App) -> tauri::Result<WebviewWindow> {
    WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        .title("moss")
        .inner_size(1360.0, 860.0)
        .min_inner_size(1200.0, 720.0)
        .title_bar_style(tauri::TitleBarStyle::Overlay)
        .hidden_title(true)
        .visible(false)
        .build()
}
