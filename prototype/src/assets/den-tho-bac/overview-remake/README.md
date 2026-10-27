# Nền Tổng quan Đền thờ Bác

Cập nhật ngày 27/10/2026 theo ảnh người dùng gửi.

| Tab | Ảnh dùng trực tiếp | Kích thước |
| --- | --- | --- |
| 01 | `01-photo-original.jpg` | 2048 × 1366 |
| 02 | `02-photo-original.jpeg` | 2048 × 1536 |
| 03 | `03-shrine-user.png` | 1774 × 887 |

Ảnh 03 được sao chép nguyên byte từ `Golden Ho Chi Minh Shrine Display.png` do người dùng cung cấp. Không chỉnh sửa pixel, màu hoặc chữ trên ảnh. Hash và kích thước nằm trong [manifest.json](manifest.json). Ảnh chụp cũ `03-photo-original.jpg` tiếp tục phục vụ các nội dung đọc hiện có.

Ảnh được co giãn đồng nhất. Với tab 03 trên màn ngang, câu chữ ở vùng nguồn y=80 nằm dưới cụm công cụ, đáy bệ ở y=790 nằm trên footer. Vị trí hai tab ảnh cạnh bệ được căn theo tọa độ thực. Màn dọc trình bày trọn ảnh phía trên nội dung. Mỗi cảnh chỉ có một lớp ảnh, không ghép bản phóng lớn phía sau, không tạo mép ảnh kép.

Ba cảnh dùng chung gradient nhẹ để đọc chữ. Chỉ lớp gradient được làm mềm; hình ảnh không có filter. Nút khám phá, phím mũi tên, tự chuyển 12 giây, tạm dừng, thử lại khi lỗi, popup và giảm chuyển động tiếp tục hoạt động.

Các bản nền cũ được ghi trong lịch sử manifest; tên cũ không có nghĩa tệp đó vẫn nằm trong repo. Tài nguyên đối chiếu được giữ theo `scripts/asset-retention.json`.

Kiểm tra: `tests/den-tho-bac-overview-test.cjs` và `tests/museum-chrome-test.cjs`.
