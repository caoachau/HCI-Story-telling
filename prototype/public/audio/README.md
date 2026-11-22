# Audio mẫu

`demo.mp3` là đoạn nhạc gõ tổng hợp dài khoảng 24 giây, được tạo riêng để thử các nút phát, tua và chuyển bài. Đây không phải lời thuyết minh, bản thu nghệ nhân hay tư liệu âm nhạc Khmer. Không sử dụng giọng đọc AI hoặc audio có bản quyền của bên thứ ba.

Chỉ có một bản file; nhiều track có ID khác nhau cùng tham chiếu file này. Khi có thuyết minh thật, cấu hình MP3 tại `src/audio/config.ts`. Chế độ demo mặc định bật khi chạy dev và tắt trong bản production; có thể điều khiển bằng `VITE_AUDIO_DEMO_ENABLED`.

## Bản thu Tổng quan Bảo tàng Khmer

`khmer-overview/` chứa bảy bài tiếng Việt do người dùng cung cấp, thay audio mẫu tại Tổng quan và chi tiết liên quan. `collections.mp3` nối ND01 và ND02 thành một file dài khoảng 3:10; sáu bài còn lại giữ nguyên MP3 gốc. Bảng ánh xạ và nguồn kịch bản nằm trong `docs/qr-audio.md`.
