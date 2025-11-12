use tauri::{TitleBarStyle, WebviewUrl, WebviewWindowBuilder};

pub fn init_main_window(app: &tauri::App) -> tauri::Result<()> {
    let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        .title("moss")
        .inner_size(1360.0, 860.0)
        .min_inner_size(1200.0, 720.0)
        .visible(false);

    #[cfg(target_os = "macos")]
    let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

    let window = win_builder.build()?;

    #[cfg(target_os = "macos")]
    {
        use cocoa::appkit::{NSColor, NSWindow};
        use cocoa::base::{id, nil};

        let ns_window = window.ns_window().expect("ns_window") as id;
        unsafe {
            let bg_color = NSColor::colorWithRed_green_blue_alpha_(
                nil,
                20.0 / 255.0,
                20.0 / 255.0,
                20.0 / 255.0,
                1.0,
            );
            ns_window.setBackgroundColor_(bg_color);
        }
    }

    Ok(())
}
