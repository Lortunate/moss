use log::{error, info};
use std::sync::Mutex;
use tauri::State;

pub struct ProcessingState {
    pub token: Mutex<Option<moss_model::CancellationToken>>,
}

impl Default for ProcessingState {
    fn default() -> Self {
        Self {
            token: Mutex::new(None),
        }
    }
}

#[tauri::command]
pub async fn upscale_image(
    input_path: String,
    model_path: String,
    base_scale: f64,
    target_scale: f64,
    output_dir: String,
    state: State<'_, ProcessingState>,
) -> Result<String, String> {
    info!(
        "upscale_image: enter | input_path={}, model_path={}, base_scale={}, target_scale={}, output_dir={}",
        input_path, model_path, base_scale, target_scale, output_dir
    );
    // create and register cancellation token for this task
    let token = moss_model::CancellationToken::new();
    {
        let mut guard = state
            .token
            .lock()
            .map_err(|_| "lock poisoned".to_string())?;
        *guard = Some(token.clone());
    }

    let res = tauri::async_runtime::spawn_blocking({
        let input_path = input_path.clone();
        let model_path = model_path.clone();
        let output_dir = output_dir.clone();
        let token = token.clone();

        move || -> Result<String, String> {
            use moss_model::{RealEsrgan, SrPipeline};
            use opencv::imgcodecs;
            use std::path::{Path, PathBuf};

            let resolve_model_path = |mp: &str| -> Result<PathBuf, String> {
                let p = Path::new(mp);
                if p.exists() {
                    return Ok(p.to_path_buf());
                }
                let cwd =
                    std::env::current_dir().map_err(|e| format!("resolve cwd failed: {}", e))?;
                let candidates = [cwd.join("models").join(mp), cwd.join("../models").join(mp)];
                if let Some(found) = candidates.iter().find(|p| p.exists()).cloned() {
                    info!(
                        "Resolved model path via fallback: {}",
                        found.to_string_lossy()
                    );
                    Ok(found)
                } else {
                    Err(format!(
                        "model file not found: {} (tried: {}, {})",
                        mp,
                        candidates[0].to_string_lossy(),
                        candidates[1].to_string_lossy()
                    ))
                }
            };

            let input_mat = imgcodecs::imread(&input_path, imgcodecs::IMREAD_UNCHANGED)
                .map_err(|e| format!("Failed to read input image: {}", e))?;

            let model_path_resolved = resolve_model_path(&model_path)?;

            let model = RealEsrgan::from_path(&model_path_resolved)
                .map_err(|e| format!("Failed to load model: {}", e))?;
            let mut pipeline = SrPipeline::new(Box::new(model), base_scale);

            let out_mat = pipeline
                .run_to_scale(input_mat, target_scale.max(1.0), &token)
                .map_err(|e| format!("Upscale failed: {}", e))?;

            let in_path = Path::new(&input_path);
            let name = in_path
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("image");
            let ext = in_path
                .extension()
                .and_then(|e| e.to_str())
                .map(|s| s.to_ascii_lowercase())
                .unwrap_or_else(|| "png".to_string());
            let suffix = format!("_x{}", target_scale as i32);
            let out_name = format!("{}{}.{ext}", name, suffix);

            let out_dir = PathBuf::from(&output_dir);
            if !out_dir.exists() {
                std::fs::create_dir_all(&out_dir)
                    .map_err(|e| format!("Failed to create output dir: {}", e))?;
            }
            let out_path = out_dir.join(out_name);
            let out_path_str = out_path.to_string_lossy().to_string();

            imgcodecs::imwrite(&out_path_str, &out_mat, &opencv::core::Vector::new())
                .map_err(|e| format!("Failed to save output: {}", e))?;

            Ok(out_path_str)
        }
    })
    .await
    .map_err(|e| {
        error!("spawn_blocking join error: {}", e);
        format!("spawn_blocking join error: {}", e)
    })?;

    match res {
        Ok(out) => {
            info!("upscale_image: done -> {}", out);
            // clear token after task finished
            if let Ok(mut guard) = state.token.lock() {
                *guard = None;
            }
            Ok(out)
        }
        Err(e) => {
            error!("upscale_image error: {}", e);
            if let Ok(mut guard) = state.token.lock() {
                *guard = None;
            }
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn cancel_upscale(state: State<'_, ProcessingState>) -> Result<(), String> {
    if let Ok(guard) = state.token.lock() {
        if let Some(tok) = guard.as_ref() {
            tok.cancel();
            return Ok(());
        }
    }
    Err("no active task".to_string())
}
