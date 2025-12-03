/**
 * model-3d-viewer.js
 * Phiên bản sửa lỗi và kiểm tra Tải Ảnh (16 Frames)
 */

document.addEventListener('DOMContentLoaded', () => {
    // LOG KHỞI ĐỘNG: Kiểm tra xem script có chạy không
    console.log("--- Bắt đầu script model-3d-viewer.js ---"); 

    const totalFrames = 16; 
    
    // Đảm bảo các ID HTML Tồn tại
    const viewerContainer = document.getElementById('model-viewer-container');
    const overlay = document.getElementById('loading-overlay');
    
    if (!viewerContainer) {
        console.error("LỖI KHÔNG TÌM THẤY: Không tìm thấy ID 'model-viewer-container'. Vui lòng kiểm tra lại file HTML.");
        return; // Dừng nếu container không có
    }
    
    // Kiểm tra đường dẫn ảnh (Chắc chắn khớp với thư mục của bạn)
    const baseImagePath = 'assets/images/model-3d/frame_'; 
    const imageExtension = '.png'; 
    
    let currentFrame = 1; 
    let isPreloading = true;
    let imagesLoaded = 0;
    
    // --- 1. PRELOAD VÀ CHÈN CÁC FRAME ẢNH VÀO DOM ---
    function preloadAndRenderImages() {
        for (let i = 1; i <= totalFrames; i++) {
            // Định dạng tên file: 01, 02, ... 16
            const frameNumber = String(i).padStart(3, '0'); 
            const imagePath = `${baseImagePath}${frameNumber}${imageExtension}`;
            
            const img = new Image();
            img.className = 'model-frame';
            img.id = `model-frame-${i}`;
            
            img.onload = () => {
                imagesLoaded++;
                const percent = Math.floor((imagesLoaded / totalFrames) * 100);
                if (overlay) {
                    overlay.innerHTML = `<p class="H3-text">Đang tải mô hình... (${percent}%)</p>`;
                }

                if (imagesLoaded === totalFrames) {
                    console.log("Tải hoàn tất: 16/16 frames.");
                    isPreloading = false;
                    if (overlay) {
                        overlay.style.display = 'none';
                    }
                    displayFrame(currentFrame); 
                    setupInteraction();
                }
            };
            
            img.onerror = () => {
                // LOG LỖI TẢI ẢNH: Cung cấp thông báo chi tiết
                console.error(`❌ LỖI TẢI ẢNH (404/Sai tên): Không tìm thấy file: ${imagePath}.`);
                if(overlay) {
                     overlay.innerHTML = `<p class="H3-text" style="color: red;">Lỗi tải ảnh!</p><p class="H4-text">Không tìm thấy file: ${imagePath}.</p>`;
                }
            };

            // Gán source và chèn ảnh vào container
            img.setAttribute('src', imagePath); 
            viewerContainer.appendChild(img);
        }
    }

    // --- 2. LOGIC HIỂN THỊ FRAME ---
    function displayFrame(frameIndex) {
        // ... (Giữ nguyên logic tính toán frame vòng lặp 1-16) ...
        currentFrame = ((frameIndex - 1 + totalFrames * 10) % totalFrames) + 1;

        document.querySelectorAll('.model-frame').forEach(frame => {
            frame.classList.remove('active');
        });

        const activeFrame = document.getElementById(`model-frame-${currentFrame}`);
        if (activeFrame) {
            activeFrame.classList.add('active');
        } else {
             // LOG LỖI HIỂN THỊ: Nếu frame cần hiển thị không tồn tại
             console.warn(`⚠️ CẢNH BÁO: Không tìm thấy frame ID: model-frame-${currentFrame} để hiển thị.`);
        }
    }

    // --- 3. CÀI ĐẶT CÁC SỰ KIỆN TƯƠNG TÁC CHUỘT (Độ nhạy đã điều chỉnh) ---
    function setupInteraction() {
        // ... (Giữ nguyên logic tương tác từ phiên bản trước) ...
        let frameOnScroll = currentFrame;
        let scrollDelta = 0;
        const scrollSensitivity = 125; // Cần cuộn 125 pixel mới chuyển 1 frame

        viewerContainer.addEventListener('wheel', (event) => {
            event.preventDefault(); 
            scrollDelta += event.deltaY;

            if (Math.abs(scrollDelta) >= scrollSensitivity) {
                const direction = scrollDelta > 0 ? 1 : -1;
                frameOnScroll = frameOnScroll + direction;
                displayFrame(frameOnScroll);
                scrollDelta = scrollDelta % scrollSensitivity; 
            }
        });

            let lastClientX = null;
            let framesToAdvance = 0;
            const moveSensitivity = 125; // Cần rê 125 pixel mới chuyển 1 frame

            viewerContainer.addEventListener('mousemove', (event) => {
                if (isPreloading) return;
                
                if (lastClientX !== null) {
                    const deltaX = event.clientX - lastClientX;
                    framesToAdvance += deltaX / moveSensitivity;

                    if (Math.abs(framesToAdvance) >= 1) {
                        const direction = framesToAdvance > 0 ? -1 : 1; 
                        const steps = Math.floor(Math.abs(framesToAdvance)); 
                        
                        for(let i = 0; i < steps; i++) {
                            currentFrame = currentFrame + direction;
                        }
                        displayFrame(currentFrame);
                        framesToAdvance %= 1; 
                    }
                }
                lastClientX = event.clientX; 
            });

            viewerContainer.addEventListener('mouseleave', () => {
                lastClientX = null;
            });
            console.log("Tương tác (Interaction) đã được thiết lập.");
        }

    // Bắt đầu quá trình tải ảnh
    preloadAndRenderImages();
});