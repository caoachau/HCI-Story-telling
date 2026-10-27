# Lịch sử: UI toàn cảnh và bộ ảnh sửa

> C?p nh?t d?n repo 27/10/2026: c?c b?n ?nh/bi?n th? kh?ng c?n d?ng ?? ???c x?a. Ph?n d??i gi? l?ch s? ngu?n v? c?ch x? l?; t?n t?p c? kh?ng c? ngh?a t?p v?n n?m trong repo. Danh s?ch x?a v? hash n?m ? `prototype/docs/cleanup-2026-10-27.json`. C?c ?nh hi?n d?ng v? b?n ??i chi?u ???c gi? c? l? do trong `prototype/scripts/asset-retention.json`.

Cập nhật 26/10/2026. Bảy mẫu giao diện được giữ nguyên tại `*-reference.png`. Bản chạy dùng ảnh gốc trong bộ người dùng sửa sau đó, không dùng ảnh khôi phục từ mẫu hoặc các năm cắt ghép cũ.

| Mốc hiển thị | Ảnh gốc đang dùng | Tệp nguồn trong Desktop/New folder |
| --- | --- | --- |
| 1969 | `1969-original.jpg` | `69.jpg` — bối cảnh tưởng niệm |
| 1970 | `1970-original.jpg` | `1031970.jpg` — người dân trước đền |
| 1971 | `1971-original.webp` | `71.webp` — cổng đền |
| 1972 | `1972-original.webp` | `72.webp` — ngôi đền dựng lại |
| 1975 | `1975-original.webp` | `75.webp` — cổng và tường bao |
| 1989 | `1989-original.jpg` | `89.jpg` — bằng công nhận |
| 2012 | `2012-original.jpg` | `2012.jpg` — nhà sàn |

Thứ tự 1970/1971 theo chính bộ ảnh sửa; không lấy thứ tự ảnh trong UI mẫu cũ. Checksum và kích thước của bảy tệp trùng nguồn, lưu trong [manifest.json](manifest.json). Không AI tái tạo, làm nét, kéo giãn tỷ lệ hay tăng màu ảnh. Bộ ảnh được dùng minh họa mốc sự kiện theo phân bổ người dùng; không khẳng định năm chụp từng ảnh chỉ từ vị trí trên timeline.

UI có ảnh nền toàn cảnh, năm trắng lớn bằng font thật, nội dung và nút viền đỏ bên trái, timeline ngang chỉ gồm năm/gạch chân chọn ở trên footer sáu phần hiện tại. Năm 1972 hiển thị gọn trên timeline, ID câu chuyện `1971–1972` vẫn được giữ để không mất liên kết. Cụm nguồn/toàn màn hình/đóng dùng lại chức năng hiện có. Không còn dấu cộng, chấm timeline hoặc các mặt nạ/blur trong chữ số cũ.

Ảnh giữ tỷ lệ và canh riêng từ cạnh phải; phần đọc tối bên trái hòa bằng gradient. Do khung và phối cảnh của ảnh gốc khác mẫu UI rộng, phần ảnh không khớp 100% từng pixel với mẫu; không tạo thêm chi tiết tư liệu để giả khớp. Trên màn hẹp, nội dung cuộn và timeline có thể kéo ngang.

Mỗi mốc mở một phiên bản reader riêng với đúng ảnh sửa, giữ tóm tắt, tư liệu dài, nguồn và giọng đọc hiện có. Phím trái/phải, Home/End, cảm ứng, trạng thái tải/lỗi/thử lại, focus sau popup và giảm chuyển động được giữ. Bảy cảnh có chuyển tiếp ngắn riêng; chọn nhanh hủy ảnh chờ cũ và giữ lựa chọn cuối.

299 kiểm tra trình duyệt đạt ở chín kích thước từ 320px tới 4K. TypeScript/build đạt; 118 tệp của các trang được bảo vệ không đổi. Ảnh đối chiếu: `preview/den-tho-bac-history-immersive-1672x941-1969.png` và các mốc còn lại cùng tiền tố.
