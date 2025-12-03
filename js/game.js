/**
 * game.js
 * Logic cho trò chơi trắc nghiệm Địa đạo Củ Chi
 * Gồm 3 gói: Dễ, Trung bình, Khó.
 * Tính năng: Chọn gói, tính giờ, xác nhận đáp án, hiển thị kết quả.
 */

const quizData = {
    "GÓI DỄ": [
        { q: "Địa đạo Củ Chi thuộc tỉnh/thành phố nào hiện nay?", a: "TP. Hồ Chí Minh", options: ["Hà Nội", "TP. Hồ Chí Minh", "Quảng Trị", "Tây Ninh"] },
        { q: "Địa đạo Củ Chi nằm ở khu vực nào của TP. Hồ Chí Minh?", a: "Tây Bắc", options: ["Đông", "Tây Bắc", "Nam", "Đông Nam"] },
        { q: "Địa đạo Củ Chi được xây dựng chủ yếu trong thời kỳ nào?", a: "Kháng chiến chống Mỹ", options: ["Kháng chiến chống Mỹ", "Kháng chiến chống Pháp", "Thời Lê sơ", "Thời Trịnh – Nguyễn phân tranh"] },
        { q: "Chiều dài hệ thống địa đạo Củ Chi khi hoàn chỉnh là bao nhiêu?", a: "250 km", options: ["10 km", "50 km", "200 km", "250 km"] },
        { q: "Địa đạo Củ Chi có bao nhiêu tầng cơ bản?", a: "3", options: ["1", "2", "3", "4"] },
        { q: "Vật liệu chính để đào địa đạo là gì?", a: "Đất sét pha laterit", options: ["Đá", "Đất xốp", "Đất sét pha laterit", "Gạch"] },
        { q: "Một tên gọi quen thuộc của đất Củ Chi là gì?", a: "Đất thép", options: ["Đất son", "Đất thép", "Đất trắng", "Đất phù sa"] },
        { q: "Địa đạo Củ Chi được ví như:", a: "“Thành phố dưới lòng đất”", options: ["“Biển bạc biển vàng”", "“Thành phố dưới lòng đất”", "“Ngôi nhà trên cát”", "“Pháo đài đá”"] },
        { q: "Bếp Hoàng Cầm trong địa đạo dùng để:", a: "Nấu ăn hạn chế khói", options: ["Chữa bệnh", "Nấu ăn hạn chế khói", "Điều chế vũ khí", "Sưởi ấm"] },
        { q: "Hầm bí mật dùng để:", a: "Cất giấu tài liệu, cán bộ", options: ["Làm nhà ở", "Cất giấu tài liệu, cán bộ", "Tập luyện thể thao", "Trồng nấm"] },
        { q: "Một điểm tham quan nổi tiếng hiện nay của địa đạo Củ Chi là:", a: "Bến Dược – Bến Đình", options: ["Bến Dược – Bến Đình", "Đồi A1", "Thành cổ Quảng Trị", "Rừng U Minh"] },
        { q: "Địa đạo Củ Chi là biểu tượng của tinh thần:", a: "Kiên cường bất khuất", options: ["Hòa giải", "Cần cù lao động", "Kiên cường bất khuất", "Sáng tạo nghệ thuật"] },
        { q: "Hệ thống giếng nước trong địa đạo dùng để:", a: "Cung cấp nước sinh hoạt", options: ["Chưng cất rượu", "Cung cấp nước sinh hoạt", "Cất giấu tài liệu", "Bẫy địch"] },
        { q: "Một loại hầm chiến đấu thường có ở địa đạo:", a: "Hầm chữ L", options: ["Hầm chông Xòe", "Hầm chữ L", "Hầm chữ Z", "Hầm chữ U"] },
        { q: "Địa đạo Củ Chi là di tích thuộc loại hình:", a: "Di tích lịch sử – văn hóa", options: ["Di tích thiên nhiên", "Di tích khảo cổ", "Di tích lịch sử – văn hóa", "Di tích kiến trúc"] }
    ],
    "GÓI TRUNG BÌNH": [
        { q: "Địa đạo Củ Chi bắt đầu hình thành từ giai đoạn nào?", a: "1948–1960", options: ["1946–1950", "1950–1954", "1948–1960", "1965–1975"] },
        { q: "Đất sét Củ Chi có đặc điểm đặc biệt giúp địa đạo không sụt lở là:", a: "Càng để lâu càng rắn chắc", options: ["Rất mềm", "Chứa nhiều sỏi", "Càng để lâu càng rắn chắc", "Có nhiều nước"] },
        { q: "Hệ thống địa đạo có chiều sâu trung bình tầng 3 là:", a: "8–10 m", options: ["3–4 m", "5–6 m", "8–10 m", "12–15 m"] },
        { q: "Lỗ thông hơi trong địa đạo thường được ngụy trang như:", a: "Tất cả", options: ["Tổ mối", "Khúc gỗ", "Hòn đá", "Tất cả"] },
        { q: "Một chức năng quan trọng của tầng 1 địa đạo là:", a: "Đường di chuyển chiến đấu", options: ["Kho chứa vũ khí", "Trạm phẫu thuật", "Nơi họp chi bộ", "Đường di chuyển chiến đấu"] },
        { q: "Những bẫy chông trong địa đạo chủ yếu nhằm:", a: "Cả A, B, C", options: ["Tước khí tài", "Gây thương vong", "Làm đối phương khiếp sợ", "Cả A, B, C"] },
        { q: "Bếp Hoàng Cầm có cơ chế tán khói bằng:", a: "Hệ thống tản khói dài và thấp", options: ["Đường ống thoát thẳng", "Hệ thống tản khói dài và thấp", "Quạt tay", "Nồi áp suất"] },
        { q: "Địa đạo Củ Chi nối liền với khu rừng nào?", a: "Rừng cao su Dầu Tiếng", options: ["Rừng Sác", "Rừng Mã Đà", "Rừng cao su Dầu Tiếng", "Rừng Nam Cát Tiên"] },
        { q: "Một trong những lý do khiến Mỹ khó phát hiện địa đạo là:", a: "Tất cả", options: ["Địa đạo quá sâu", "Hệ thống cửa hẹp, kín", "Ngụy trang tự nhiên tốt", "Tất cả"] },
        { q: "Trong chiến tranh, địa đạo còn được dùng làm:", a: "Trường học nhỏ", options: ["Trường học nhỏ", "Sân thể thao", "Cơ sở sản xuất lương thực lớn", "Nhà tù"] },
        { q: "Hòa bình lập lại, địa đạo được công nhận di tích quốc gia vào năm:", a: "2016", options: ["2003", "2013", "2015", "2016"] },
        { q: "Bến Dược có công trình nổi tiếng nào?", a: "Đền tưởng niệm liệt sĩ", options: ["Đền tưởng niệm liệt sĩ", "Tượng đài chiến sĩ", "Cột cờ", "Nhà trưng bày quân khí"] },
        { q: "Bến Đình nổi tiếng vì là nơi:", a: "Trung tâm chỉ huy của Huyện ủy Củ Chi", options: ["Trung tâm chỉ huy của Huyện ủy Củ Chi", "Khu sản xuất vũ khí", "Trường y dã chiến", "Khu dân cư"] },
        { q: "Một loại vũ khí thô sơ từng sản xuất trong địa đạo:", a: "Mìn tự tạo", options: ["Mìn tự tạo", "Bom napalm", "Đạn pháo", "Súng máy"] },
        { q: "Di tích Củ Chi hiện nay có thêm khu trải nghiệm:", a: "Tập bắn", options: ["Tập bắn", "Nấu ăn", "Tập võ", "Leo núi"] }
    ],
    "GÓI KHÓ": [
        { q: "Mệnh danh “vùng đất thép” của Củ Chi được hình thành do:", a: "Cả B và C", options: ["Địa chất đặc biệt", "Sức chống chịu kiên cường của quân dân", "Có nhiều căn cứ kháng chiến", "Cả B và C"] },
        { q: "Kết cấu hầm tránh bom trong địa đạo được thiết kế nhằm:", a: "Tất cả", options: ["Chịu áp lực cao từ bom phá", "Phân tán sức nổ", "Tạo khoảng đệm an toàn", "Tất cả"] },
        { q: "Hệ thống \"cửa sập\" trong địa đạo thường được làm bằng:", a: "Gỗ dầu hoặc gỗ sao", options: ["Gỗ dầu hoặc gỗ sao", "Sắt", "Nhựa", "Xi măng"] },
        { q: "Một điểm khó khăn khi đào địa đạo vào mùa mưa là:", a: "Tất cả", options: ["Đất trơn trượt", "Đường hầm dễ ngập nước", "Khí độc tích tụ", "Tất cả"] },
        { q: "Hệ thống “giao thông hào” nối địa đạo có vai trò:", a: "Tất cả", options: ["Che giấu di chuyển trên mặt đất", "Tránh máy bay trinh sát", "Kết nối hầm chiến đấu", "Tất cả"] },
        { q: "Vai trò của địa đạo trong chiến dịch Mậu Thân 1968:", a: "Căn cứ tập kết và xuất phát lực lượng", options: ["Kho dự trữ lương thực", "Căn cứ tập kết và xuất phát lực lượng", "Bệnh viện lớn", "Trại tù"] },
        { q: "Một yếu tố giúp địa đạo bền vững qua bom đạn là:", a: "Cả A và C", options: ["Kết cấu đất laterit", "Sử dụng giằng tre", "Tường hầm uốn cong", "Cả A và C"] },
        { q: "Lý do Mỹ sử dụng chiến thuật \"cày ủi – tìm diệt\" ở Củ Chi:", a: "Phá hủy hệ thống hầm", options: ["Phá hủy hệ thống hầm", "San bằng làng mạc", "Tìm kho vũ khí", "Tăng tốc tiến quân"] },
        { q: "Địa đạo có bao nhiêu loại hầm ngụy trang điển hình?", a: "7", options: ["3", "5", "7", "10"] },
        { q: "Một trong những “kênh trao đổi thông tin” quan trọng trong địa đạo là:", a: "Chuông báo động dây cơ", options: ["Chuông báo động dây cơ", "Radio quân sự", "Đèn nháy", "Sòi hơi"] },
        { q: "Người đào địa đạo thường sử dụng công cụ nào?", a: "Cuốc chim nhỏ và thúng đất", options: ["Cuốc lớn", "Xẻng quân dụng", "Cuốc chim nhỏ và thúng đất", "Máy đào cơ giới"] },
        { q: "Trong lịch sử, khu vực Củ Chi thuộc “Vùng căn cứ nào” của miền Nam?", a: "Tam giác Sắt", options: ["Tam giác Sắt", "Tứ giác Long Xuyên", "Cánh đồng Chum", "Rừng Tháp Mười"] },
        { q: "Một chiến thuật phòng vệ đặc biệt trong địa đạo là:", a: "Hầm giả – hầm thật", options: ["Hầm bẫy thông tầng", "Hầm nước xoáy", "Hầm giả – hầm thật", "Bẫy cọc độc"] },
        { q: "Địa đạo có hệ thống y tế dã chiến bao gồm:", a: "Cả A, B, C", options: ["Trạm phẫu thuật", "Kho thuốc", "Phòng điều trị", "Cả A, B, C"] },
        { q: "Giá trị lớn nhất của địa đạo Củ Chi đối với hậu thế là:", a: "B + A (tổng hòa giá trị lịch sử & tinh thần)", options: ["Minh chứng về trí tuệ và sáng tạo", "Bài học về lòng yêu nước và ý chí đấu tranh", "Địa điểm du lịch nổi tiếng", "B + A (tổng hòa giá trị lịch sử & tinh thần)"] }
    ]
};

// =======================
// BIẾN TOÀN CỤC VÀ TRẠNG THÁI GAME
// =======================
let currentQuizData = [];
let currentQuestionIndex = 0;
let score = 0;
let incorrectCount = 0;
let timerInterval;
let startTime;
let currentLevel = "";
let selectedAnswer = null; // Lưu trữ đáp án tạm thời trước khi xác nhận

const optionLabels = ["A", "B", "C", "D"];

// =======================
// CHUYỂN MÀN HÌNH
// =======================
function showScreen(screenId) {
    document.getElementById('quiz-selection-screen').style.display = 'none';
    document.getElementById('quiz-game-screen').style.display = 'none';
    document.getElementById('quiz-result-screen').style.display = 'none';
    document.getElementById(screenId).style.display = 'block';
}

// =======================
// TIMER LOGIC
// =======================
function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimer() {
    const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('quiz-timer').textContent = `Thời gian: ${formattedTime}`;
}

function getFinalTime() {
    stopTimer();
    const elapsedSeconds = Math.floor((new Date() - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// =======================
// LOGIC QUIZ
// =======================

/**
 * Bắt đầu Quiz khi người dùng chọn gói
 * @param {string} level Tên gói câu hỏi: "GÓI DỄ", "GÓI TRUNG BÌNH", "GÓI KHÓ"
 */
function startQuiz(level) {
    currentLevel = level;
    // Khởi tạo lại các biến trạng thái
    currentQuizData = quizData[level];
    currentQuestionIndex = 0;
    score = 0;
    incorrectCount = 0;
    selectedAnswer = null;
    
    // Cập nhật giao diện và bắt đầu game
    document.getElementById('quiz-level-display').textContent = `GÓI: ${level}`;
    showScreen('quiz-game-screen');
    startTimer();
    loadQuestion();
}

/**
 * Tải và hiển thị câu hỏi hiện tại
 */
function loadQuestion() {
    if (currentQuestionIndex >= currentQuizData.length) {
        showResult();
        return;
    }

    const questionData = currentQuizData[currentQuestionIndex];
    
    // Cập nhật bộ đếm và câu hỏi
    document.getElementById('question-counter').textContent = `Câu ${currentQuestionIndex + 1} / ${currentQuizData.length}`;
    document.getElementById('question-text').innerHTML = `${currentQuestionIndex + 1}. ${questionData.q}`;

    const optionButtons = document.querySelectorAll('.btn-option');

    // Cập nhật nội dung các đáp án và đặt lại trạng thái
    optionButtons.forEach((button, index) => {
        const optionText = questionData.options[index];
        const label = optionLabels[index];
        
        // Đặt lại trạng thái nút
        button.className = 'btn btn-option H3-text'; // Đặt lại class về ban đầu
        button.disabled = false;
        button.innerHTML = `<span class="option-label">${label}.</span> ${optionText}`;
        button.onclick = () => handleAnswerClick(label, optionText);
    });
}

/**
 * Xử lý khi người dùng click vào đáp án (Mở modal xác nhận)
 * @param {string} label Nhãn đáp án (A, B, C, D)
 * @param {string} answerText Nội dung đáp án
 */
function handleAnswerClick(label, answerText) {
    selectedAnswer = label;
    const modal = document.getElementById('confirmation-modal');
    document.getElementById('selected-answer-text').textContent = label + ". " + answerText;
    modal.style.display = 'block';

    // Cài đặt hành động cho nút CHẮC CHẮN trong modal
    document.getElementById('confirm-answer-btn').onclick = () => checkAnswer(label);
}

/**
 * Đóng Modal Xác Nhận
 */
function closeConfirmationModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
    selectedAnswer = null;
}

/**
 * Kiểm tra đáp án, cập nhật điểm và chuyển sang câu hỏi tiếp theo
 * @param {string} selectedLabel Nhãn đáp án được chọn (A, B, C, D)
 */
function checkAnswer(selectedLabel) {
    closeConfirmationModal(); 

    const currentQ = currentQuizData[currentQuestionIndex];
    const correctOptionText = currentQ.a;
    let isCorrect = false;

    // Tìm nhãn đáp án đúng (A, B, C, D)
    let correctLabel = '';
    const optionButtons = document.querySelectorAll('.btn-option');
    optionButtons.forEach((button, index) => {
        const optionText = currentQ.options[index];
        const label = optionLabels[index];
        if (optionText === correctOptionText) {
            correctLabel = label;
        }

        button.disabled = true; // Vô hiệu hóa tất cả các nút sau khi trả lời
        
        // Hiển thị kết quả trực quan
        if (label === selectedLabel) {
            if (label === correctLabel) {
                button.classList.add('correct');
                isCorrect = true;
            } else {
                button.classList.add('incorrect');
            }
        }
    });

    // Tô màu đáp án đúng nếu trả lời sai
    if (!isCorrect) {
        document.querySelector(`.btn-option[data-option="${correctLabel}"]`).classList.add('correct');
        incorrectCount++;
    } else {
        score++;
    }

    // Chuyển sang câu hỏi tiếp theo sau 1.5 giây
    currentQuestionIndex++;
    setTimeout(loadQuestion, 1500);
}

/**
 * Hiển thị màn hình kết quả cuối cùng
 */
function showResult() {
    const finalTime = getFinalTime();
    const resultColor = score / currentQuizData.length > 0.6 ? '#4CAF50' : (score / currentQuizData.length > 0.3 ? '#FFC107' : '#F44336');

    document.getElementById('final-level').textContent = currentLevel;
    document.getElementById('correct-count').textContent = score;
    document.getElementById('incorrect-count').textContent = incorrectCount;
    document.getElementById('final-time').textContent = finalTime;
    document.querySelector('#quiz-result-screen .H1-text').style.setProperty('--card-color-final', resultColor);


    showScreen('quiz-result-screen');
}

// Khởi tạo ban đầu: đảm bảo chỉ hiển thị màn hình chọn gói
document.addEventListener('DOMContentLoaded', () => {
    // Chỉ hiển thị màn hình chọn gói khi tải trang
    showScreen('quiz-selection-screen');

    // Thêm event listener cho việc đóng modal khi click ra ngoài
    const modal = document.getElementById('confirmation-modal');
    window.onclick = function(event) {
        if (event.target == modal) {
            closeConfirmationModal();
        }
    }
});

// Gán hàm global để HTML có thể gọi
window.startQuiz = startQuiz;
window.handleAnswerClick = handleAnswerClick;
window.closeConfirmationModal = closeConfirmationModal;