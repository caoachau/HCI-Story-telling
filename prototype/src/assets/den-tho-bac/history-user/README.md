# Bộ ảnh lịch sử người dùng cung cấp

> C?p nh?t d?n repo 27/10/2026: c?c b?n ?nh/bi?n th? kh?ng c?n d?ng ?? ???c x?a. Ph?n d??i gi? l?ch s? ngu?n v? c?ch x? l?; t?n t?p c? kh?ng c? ngh?a t?p v?n n?m trong repo. Danh s?ch x?a v? hash n?m ? `prototype/docs/cleanup-2026-10-27.json`. C?c ?nh hi?n d?ng v? b?n ??i chi?u ???c gi? c? l? do trong `prototype/scripts/asset-retention.json`.

Người dùng cung cấp 7 màn hình PNG ngày 25/10/2026 và yêu cầu dùng chúng cho từng mốc lịch sử của Đền thờ Bác Hồ.

| File gửi | Mốc hiển thị | File dùng trên web |
|---|---|---|
| 69.png | 1969 | 1969.webp |
| 70.png | 1970 | 1970.webp |
| 71.png | 1971 | 1971.webp |
| 72.png | 1971–1972 | 1971-1972.webp |
| 75.png | 1975 | 1975.webp |
| 89.png | 1989 | 1989.webp |
| 12.png | 2012 | 2012.webp |

Các bản `*-original.png` là bản sao nguyên byte. `manifest.json` ghi kích thước, đường dẫn nguồn và SHA-256 để đối chiếu. WebP được chuyển định dạng ở chất lượng 94, giữ nguyên kích thước và nội dung, tổng khoảng 1,89 MB thay cho khoảng 14,52 MB PNG. Không dùng AI tạo lại, không ghép thêm hay chỉnh màu các hình này.

Ảnh nguồn chứa cả giao diện. `history.css` dùng vùng cắt CSS tại x≈650–1985, y≈72–598 để chỉ hiển thị tổ hợp năm và hình, bảo toàn tỷ lệ. Chữ bên trái, nguồn, nút đọc/nghe, dấu + và timeline được dựng bằng HTML thật. Mốc 1989 có dấu + in sẵn: nút chạm được đặt đúng trên dấu đó.

Chưa có hồ sơ nguồn/niên đại cho từng ảnh thành phần. Dòng “Ảnh tư liệu · Mốc …” chỉ mốc đang xem, không xác nhận niên đại ảnh thành phần. Nội dung sự kiện được biên soạn và đối chiếu riêng. Ảnh trong cửa sổ đọc vẫn dùng các ảnh báo chí đã có nguồn của dự án.

Theo yêu cầu bỏ mọi dấu cộng trong Lịch sử, đã bỏ các nút + và dùng [1989-no-plus.webp](1989-no-plus.webp) thay bản hiển thị 1989 cũ. Dấu cộng in sẵn trong ảnh 1989 được xóa bằng imagegen tích hợp; giữ [bản PNG kết quả](1989-no-plus.png), ảnh gốc và [prompt đầy đủ](remove-plus-prompt.md). Bộ ảnh nguồn gốc vẫn giữ nguyên để đối chiếu.
