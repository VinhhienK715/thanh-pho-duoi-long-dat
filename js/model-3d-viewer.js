/**
 * model-3d-viewer.js
 * Phiên bản sửa lỗi và kiểm tra Tải Ảnh (16 Frames) - Tích hợp Hỗ trợ MOBILE (Touch Events)
 */

document.addEventListener('DOMContentLoaded', () => {
    // LOG KHỞI ĐỘNG: Kiểm tra xem script có chạy không
    console.log("--- Bắt đầu script model-3d-viewer.js (Hỗ trợ Mobile) ---"); 

    // LƯU Ý: Nếu bạn có 16 frame, hãy đổi lại thành 16. Hiện tại đang là 14.
    const totalFrames = 14; 
    
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
                    setupTouchInteraction(); // <--- ĐÃ THÊM
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
        // Đảm bảo frameIndex luôn nằm trong khoảng [1, totalFrames]
        // Math.ceil() ở đây để xử lý số âm từ phép toán modulo
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

    // --- 3. CÀI ĐẶT CÁC SỰ KIỆN TƯƠNG TÁC CHUỘT (PC/Laptop) ---
    function setupInteraction() {
        // Tương tác Cuộn chuột (Wheel)
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

        // Tương tác Rê chuột (Mousemove/Drag)
        let lastClientX = null;
        let framesToAdvance = 0;
        const moveSensitivity = 125; // Cần rê 125 pixel mới chuyển 1 frame

        viewerContainer.addEventListener('mousemove', (event) => {
            if (isPreloading) return;
            
            if (lastClientX !== null) {
                const deltaX = event.clientX - lastClientX;
                framesToAdvance += deltaX / moveSensitivity;

                if (Math.abs(framesToAdvance) >= 1) {
                    // Hướng: Rê SANG PHẢI (deltaX > 0) -> Chuyển frame NGƯỢC LẠI (-1)
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
    
    // --- 4. BỔ SUNG: Cài đặt TƯƠNG TÁC CẢM ỨNG (MOBILE) ---
    function setupTouchInteraction() {
        let startClientX = null;
        let framesToAdvanceTouch = 0;
        const touchSensitivity = 70; // Độ nhạy cho mobile

        viewerContainer.addEventListener('touchstart', (event) => {
            if (isPreloading) return;
            // Chỉ xử lý nếu có 1 ngón tay 
            if (event.touches.length === 1) {
                startClientX = event.touches[0].clientX;
            } else {
                startClientX = null;
            }
        }, { passive: true }); 

        viewerContainer.addEventListener('touchmove', (event) => {
            if (isPreloading || startClientX === null) return;
            
            // CHẶN cuộn trang mặc định để ưu tiên quay mô hình
            // LƯU Ý: Có thể cần loại bỏ nếu bạn muốn người dùng cuộn trang web khi không chạm vào mô hình
            event.preventDefault(); 

            const currentClientX = event.touches[0].clientX;
            const deltaX = currentClientX - startClientX;
            
            framesToAdvanceTouch += deltaX / touchSensitivity;

            if (Math.abs(framesToAdvanceTouch) >= 1) {
                // Hướng: Vuốt SANG PHẢI (deltaX > 0) -> Chuyển frame NGƯỢC LẠI (-1)
                const direction = framesToAdvanceTouch > 0 ? -1 : 1; 
                const steps = Math.floor(Math.abs(framesToAdvanceTouch)); 
                
                for(let i = 0; i < steps; i++) {
                    currentFrame = currentFrame + direction;
                }
                displayFrame(currentFrame);
                framesToAdvanceTouch %= 1; 
                // Cập nhật vị trí bắt đầu mới để tính toán chính xác hơn
                startClientX = currentClientX; 
            }
        }, { passive: false }); // Cần passive: false để event.preventDefault() hoạt động

        viewerContainer.addEventListener('touchend', () => {
            startClientX = null;
            framesToAdvanceTouch = 0;
        });
        viewerContainer.addEventListener('touchcancel', () => {
            startClientX = null;
            framesToAdvanceTouch = 0;
        });

        console.log("Tương tác Cảm ứng (Touch Interaction) đã được thiết lập.");
    }

    // Bắt đầu quá trình tải ảnh
    preloadAndRenderImages();
});
