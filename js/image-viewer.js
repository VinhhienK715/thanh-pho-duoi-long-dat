/**
 * image_viewer.js
 * Chức năng: Hiển thị hình ảnh phóng to (lightbox) khi click vào một hình ảnh trong thư viện.
 * Yêu cầu: HTML cần có một div với ID 'lightbox-modal' và một img với ID 'lightbox-image'.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy các phần tử cần thiết
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-image');
    // Lấy tất cả ảnh mà bạn muốn có tính năng zoom (ví dụ: tất cả ảnh trong .image-gallery-item)
    const galleryItems = document.querySelectorAll('.image-gallery-item img');

    // Nếu không tìm thấy các thành phần HTML, dừng kịch bản để tránh lỗi
    if (!modal || !modalImg || galleryItems.length === 0) {
        console.warn("Lỗi: Không tìm thấy modal, ảnh modal hoặc các ảnh trong thư viện. Vui lòng kiểm tra lại cấu trúc HTML.");
        return;
    }

    // 2. Thiết lập sự kiện click cho các ảnh trong thư viện
    galleryItems.forEach(img => {
        img.style.cursor = 'pointer'; // Gợi ý cho người dùng rằng ảnh có thể click
        img.addEventListener('click', function() {
            // Lấy đường dẫn của ảnh đã được click
            modalImg.src = this.src; 
            // Hiển thị modal
            modal.style.display = 'flex';
        });
    });

    // 3. Thiết lập sự kiện đóng modal (khi click vào nền tối)
    modal.addEventListener('click', function(event) {
        // Chỉ đóng nếu click vào chính modal (nền đen) hoặc nút đóng
        if (event.target === modal || event.target.classList.contains('close-btn')) {
            modal.style.display = 'none';
        }
    });

    // Thêm chức năng đóng bằng phím ESC (tùy chọn)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    console.log("Image Viewer Script đã được khởi động.");
});