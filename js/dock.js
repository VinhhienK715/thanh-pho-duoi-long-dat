/**
 * dock.js
 * * Mô tả: File này chứa logic để tự động tạo (render) Thanh Điều Hướng (Dock)
 * xử lý active state và hiệu ứng cuộn (scroll) cho Dock.
 */

// Danh sách các trang và đường dẫn tương ứng
const navItems = [
    { name: "Tổng Quan", href: "gioi-thieu-tong-quan.html" },
    { name: "Vị Trí", href: "vi-tri-toa-lac.html" },
    { name: "Lịch Sử", href: "lich-su-hinh-thanh.html" },
    { name: "Cấu Trúc", href: "cau-truc-cua-dia-dao.html" },
    { name: "Giá Trị", href: "gia-tri-cua-dia-dao.html" },
    { name: "Mô Hình", href: "mo-hinh-va-mo-phong-3d.html" },
    { name: "Trò Chơi", href: "tro-choi-tuong-tac.html" }
];

/**
 * Lấy tên file hiện tại từ URL để xác định trang active.
 */
function getCurrentPageFileName() {
    const pathname = window.location.pathname;
    const parts = pathname.split('/');
    let filename = parts[parts.length - 1];
    
    // Xử lý trường hợp URL là root (/) nếu cần
    if (!filename || filename.toLowerCase() === 'index.html') {
        filename = 'index.html'; 
    }
    return filename.toLowerCase();
}

/**
 * Xử lý hiệu ứng Dock khi cuộn trang
 */
function handleScroll() {
    const dock = document.getElementById('main-dock-nav');
    if (!dock) return;

    const scrollThreshold = 100; 

    if (window.scrollY > scrollThreshold) {
        dock.classList.add('scrolled');
    } else {
        dock.classList.remove('scrolled');
    }
}

/**
 * Xây dựng và chèn cấu trúc Dock vào DOM.
 */
function renderDock() {
    const currentPage = getCurrentPageFileName();
    
    // 1. Tạo các mục điều hướng (Dock Items)
    const itemsHtml = navItems.map(item => {
        const isActive = (item.href.toLowerCase() === currentPage);
        const activeClass = isActive ? 'active' : '';
        
        return `<a href="${item.href}" class="dock-nav-item ${activeClass}">${item.name}</a>`;
    }).join('');

    // 2. Tạo toàn bộ cấu trúc Dock
    const dockHtml = `
        <nav class="dock-nav" id="main-dock-nav">
            <a href="index.html" class="logo-resized">
                <img src="assets/images/logo.png" alt="Logo">
            </a>
            
            <div class="dock-nav-items-container">
                ${itemsHtml}
            </div>
        </nav>
    `;

    // 3. Chèn Dock vào ngay đầu thẻ <body>
    document.body.insertAdjacentHTML('afterbegin', dockHtml);

    // 4. Kích hoạt logic cuộn cho Dock
    window.addEventListener('scroll', handleScroll);
    // Kích hoạt ngay lần đầu tiên để xử lý trường hợp refresh giữa trang
    handleScroll(); 
}

// Chạy hàm render Dock sau khi DOM đã tải xong

document.addEventListener('DOMContentLoaded', renderDock);
