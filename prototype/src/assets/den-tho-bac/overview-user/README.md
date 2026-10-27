# Ba ảnh Tổng quan do người dùng cung cấp

> C?p nh?t d?n repo 27/10/2026: c?c b?n ?nh/bi?n th? kh?ng c?n d?ng ?? ???c x?a. Ph?n d??i gi? l?ch s? ngu?n v? c?ch x? l?; t?n t?p c? kh?ng c? ngh?a t?p v?n n?m trong repo. Danh s?ch x?a v? hash n?m ? `prototype/docs/cleanup-2026-10-27.json`. C?c ?nh hi?n d?ng v? b?n ??i chi?u ???c gi? c? l? do trong `prototype/scripts/asset-retention.json`.

> Bản lưu của lần thiết kế trước. Sau yêu cầu sửa khung ảnh mới nhất, màn 01 dùng lại `01-background.webp`; màn 02–03 dùng nền ngang phục hồi từ mẫu mới. Xem [overview-remake](../overview-remake/README.md) để biết asset và cách canh khung hiện tại. Các mô tả cách hiển thị bên dưới ghi lại lần thiết kế trước, đã được thay bằng cách canh chủ thể ở tài liệu mới.

Ngày 25/10/2026, người dùng yêu cầu thay Tổng quan bằng ba màn hình và cho chuyển tự động hoặc chạm chọn. Thứ tự hiển thị:

| Ảnh | Nội dung | Tệp dùng trên web |
|---|---|---|
| 01 | Từ lòng dân thành di sản · Đền thờ Bác Hồ | `01-background.webp` |
| 02 | Dấu xưa còn mãi · Mô hình ngôi đền xưa | `02-background.webp` |
| 03 | Hình bóng Bác trong lòng dân · Tượng Bác Hồ | `03-background.webp` |

Bản `*-original.png` giữ nguyên byte theo ảnh gửi. `manifest.json` ghi SHA-256 và kích thước 1672×941. Các bản `01.webp`, `02.webp`, `03.webp` là bản chuyển định dạng của nguyên mẫu cũ, được giữ để đối chiếu.

Nền hiện dùng `01-background.webp`, `02-background.webp`, `03-background.webp`. Theo chỉnh sửa mới nhất, **ảnh chính luôn hiển thị trọn vẹn đúng tỷ lệ 1672:941**, dùng `contain`, không cắt đầu/chân tượng, câu trích dẫn, biển tên cổng hoặc công trình để lấp khung. Một lớp ảnh nền riêng hòa phần mép dư vào không gian toàn màn hình; ảnh chính không làm mờ, không thêm khung bo và không có chuyển cảnh phóng/thu. Ở màn dọc, ảnh đầy đủ nằm phía trên phần chữ để chủ thể không bị nội dung che.

Header đã bỏ; cụm Nguồn tư liệu, Toàn màn hình và Đóng nổi gọn ở góc phải, navigation nằm bên dưới. Tiêu đề, nội dung, CTA và ba tab là HTML thật; hàng chú thích/điều khiển dưới ảnh đã bỏ. Chuyển tự động mỗi 12 giây bằng hòa ảnh, không zoom; cùng một đồng hồ RAF điều khiển cả tiến trình và chuyển ảnh, giữ thời gian còn lại khi tạm dừng. Chạm lại tab ảnh đang chọn để dừng hoặc tiếp tục; trạng thái hiển thị cạnh thanh tiến trình. Giảm chuyển động của thiết bị tắt tự động và hiệu ứng.

Ba nền được chỉnh bằng công cụ image generation tích hợp, chế độ **edit**, tham chiếu bản gốc tương ứng. Yêu cầu xóa chữ UI, vạch tiến trình, chú thích, số tab, mũi tên và khung bo; giữ khung cảnh, vật thể và chữ thực trên công trình. Những vùng trước đây bị UI che được AI dựng lại, nên đây là nền trình bày demo, không phải ảnh tư liệu nguyên bản. Bản PNG kết quả được lưu cùng thư mục, bản WebP quality 94 được dùng trên web. Không dùng script/Python để chỉnh nội dung ảnh; Pillow chỉ chuyển định dạng kết quả.

Prompt đầy đủ, theo từng ảnh: [clean-background-prompts.json](clean-background-prompts.json).

| Ảnh | PNG chỉnh sửa | WebP dùng trên web |
|---|---|---|
| 01 | [01-background.png](01-background.png) | [01-background.webp](01-background.webp) |
| 02 | [02-background.png](02-background.png) | [02-background.webp](02-background.webp) |
| 03 | [03-background.png](03-background.png) | [03-background.webp](03-background.webp) |

Những ảnh và lời mô tả trên ảnh được cung cấp cho trải nghiệm, không gán tác giả hoặc nguồn báo chí chưa được xác nhận. Câu chuyện đọc sâu tiếp tục dùng các nguồn đã có của dự án.
