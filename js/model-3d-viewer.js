/**
 * model-3d-viewer.js
 * Phiên bản sửa lỗi và kiểm tra Tải Ảnh (16 Frames) - Tích hợp Hỗ trợ MOBILE (Touch Events)
 * ĐÃ KHẮC PHỤC LỖI IPAD VUỐT KHÔNG ĐƯỢC
 */

document.addEventListener('DOMContentLoaded', () => {
    // LOG KHỞI ĐỘNG: Kiểm tra xem script có chạy không
    console.log("--- Bắt đầu script model-3d-viewer.js (Hỗ trợ Mobile, đã sửa lỗi iPad) ---"); 

    // LƯU Ý: Nếu bạn có 16 frame, hãy đổi lại thành 16. Hiện tại đang là 14.
    const totalFrames = 14; 
    
    // Đảm bảo các ID HTML Tồn tại
    const viewerContainer = document.getElementById('model-viewer-container');
    const overlay = document.getElementById('loading-overlay');
    
    if (!viewerContainer) {
        console.error("LỖI KHÔNG TÌM THẤY: Không tìm thấy ID 'model-viewer-container'. Vui lòng kiểm tra lại file HTML.");
        return; 
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
            // Định dạng tên file: 001, 002, ... 014
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
                    console.log(`Tải hoàn tất: ${totalFrames}/${totalFrames} frames.`);
                    isPreloading = false;
                    if (overlay) {
                        overlay.style.display = 'none';
                    }
                    displayFrame(currentFrame); 
                    
                    // GỌI CẢ TƯƠNG TÁC CHUỘT VÀ TƯƠNG TÁC CẢM ỨNG
                    setupInteraction();
                    setupTouchInteraction(); 
                }
            };
            
            img.onerror = () => {
                console.error(`❌ LỖI TẢI ẢNH: Không tìm thấy file: ${imagePath}.`);
                if(overlay) {
                     overlay.innerHTML = `<p class="H3-text" style="color: red;">Lỗi tải ảnh!</p><p class="H4-text">Không tìm thấy file: ${imagePath}.</p>`;
                }
            };

            img.setAttribute('src', imagePath); 
            viewerContainer.appendChild(img);
        }
    }

    // --- 2. LOGIC HIỂN THỊ FRAME ---
    function displayFrame(frameIndex) {
        currentFrame = ((frameIndex - 1 + totalFrames * 10) % totalFrames) + 1;

        document.querySelectorAll('.model-frame').forEach(frame => {
            frame.classList.remove('active');
        });

        const activeFrame = document.getElementById(`model-frame-${currentFrame}`);
        if (activeFrame) {
            activeFrame.classList.add('active');
        } else {
             console.warn(`⚠️ CẢNH BÁO: Không tìm thấy frame ID: model-frame-${currentFrame} để hiển thị.`);
        }
    }

    // --- 3. CÀI ĐẶT CÁC SỰ KIỆN TƯƠNG TÁC CHUỘT (PC/Laptop) ---
    function setupInteraction() {
        // Tương tác Cuộn chuột (Wheel)
        let frameOnScroll = currentFrame;
        let scrollDelta = 0;
        const scrollSensitivity = 125; 

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

        // Tương tác Rê chuột (Mousemove/Drag)
        let lastClientX = null;
        let framesToAdvance = 0;
        const moveSensitivity = 125; 

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
        console.log("Tương tác Chuột (Interaction) đã được thiết lập.");
    }
    
    // ------------------------------------------------------------------
    // --- 4. CÀI ĐẶT TƯƠNG TÁC CẢM ỨNG (MOBILE/IPAD) - ĐÃ SỬA LỖI ---
    // ------------------------------------------------------------------
    function setupTouchInteraction() {
        let startClientX = null;
        let framesToAdvanceTouch = 0;
        const touchSensitivity = 70; // Độ nhạy cho mobile/ipad

        // 1. touchstart: Ghi lại vị trí bắt đầu
        viewerContainer.addEventListener('touchstart', (event) => {
            if (isPreloading) return;
            if (event.touches.length === 1) {
                startClientX = event.touches[0].clientX;
            } else {
                startClientX = null;
            }
        }, { passive: true }); // passive: true

        // 2. touchmove: Xử lý vuốt và CHẶN CUỘN TRANG (Quan trọng cho iPad/iOS)
        viewerContainer.addEventListener('touchmove', (event) => {
            if (isPreloading || startClientX === null) return;
            
            // Lệnh QUAN TRỌNG: Chỉ chặn cuộn khi vuốt ngang đủ một khoảng (10px)
            if (Math.abs(event.touches[0].clientX - startClientX) > 10) { 
                 event.preventDefault(); 
            }

            const currentClientX = event.touches[0].clientX;
            const deltaX = currentClientX - startClientX;
            
            framesToAdvanceTouch += deltaX / touchSensitivity;

            if (Math.abs(framesToAdvanceTouch) >= 1) {
                const direction = framesToAdvanceTouch > 0 ? -1 : 1; 
                const steps = Math.floor(Math.abs(framesToAdvanceTouch)); 
                
                for(let i = 0; i < steps; i++) {
                    currentFrame = currentFrame + direction;
                }
                displayFrame(currentFrame);
                framesToAdvanceTouch %= 1; 
                startClientX = currentClientX; // Cập nhật vị trí
            }
        }, { passive: false }); // <--- THIẾT LẬP BẮT BUỘC CHO event.preventDefault()

        // 3. touchend/touchcancel: Đặt lại trạng thái
        viewerContainer.addEventListener('touchend', () => {
            startClientX = null;
            framesToAdvanceTouch = 0;
        });
        viewerContainer.addEventListener('touchcancel', () => {
            startClientX = null;
            framesToAdvanceTouch = 0;
        });

        console.log("Tương tác Cảm ứng (Touch Interaction) đã được điều chỉnh cho iPad.");
    }

    // Bắt đầu quá trình tải ảnh
    preloadAndRenderImages();
});
