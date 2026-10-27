# Ảnh tab Người giữ đền

> C?p nh?t d?n repo 27/10/2026: c?c b?n ?nh/bi?n th? kh?ng c?n d?ng ?? ???c x?a. Ph?n d??i gi? l?ch s? ngu?n v? c?ch x? l?; t?n t?p c? kh?ng c? ngh?a t?p v?n n?m trong repo. Danh s?ch x?a v? hash n?m ? `prototype/docs/cleanup-2026-10-27.json`. C?c ?nh hi?n d?ng v? b?n ??i chi?u ???c gi? c? l? do trong `prototype/scripts/asset-retention.json`.

## Mẫu hiện tại: giuden.png

Ảnh mẫu mới do người dùng cung cấp: `C:/Users/ASUS/OneDrive/Máy tính/giuden.png`, 1672×941.

- `witness-layout-v2-original.png`: bản mẫu mới, giữ nguyên byte.
- `witness-layout-v2.webp`: bản WebP quality 94, giữ nguyên kích thước.
- Ảnh lớn bên phải hiển thị vùng x405/y288/w1212/h569 trong mẫu bằng CSS. Đã bỏ nhãn HTML “NHÂN CHỨNG” và cắt 44px ở mép trên để loại cả nhãn cùng nền đen in sẵn trong ảnh. Giữ tỷ lệ ảnh và đủ gương mặt, bàn tay, chân của ba người; tệp nguồn giữ nguyên.
- Bố cục gồm cột trái hẹp, bộ chọn dọc, nhãn câu chuyện, tên nhân chứng có dấu chấm đỏ, tóm tắt, nút đọc và câu hỏi bên dưới. Tiêu đề, đường kẻ, tab, nhãn và chú thích đều là HTML/CSS.
- Nền toàn cảnh phía sau dùng lại `witness-background-v1.webp` đã phục hồi trước đây, làm dịu và tối riêng lớp nền như mẫu. Ảnh chính bên phải không blur. Footer và ba công cụ hiện tại được giữ; khoảng dọc được canh để nội dung không bị footer che.
- Hai tab tiếp tục dùng cùng bộ chọn tại cùng tọa độ; cột đầu và tiêu đề chung được canh đồng bộ. Ảnh mới của tab Nét vẽ ký ức giữ nguyên.
- 120 kiểm tra trình duyệt đạt trên chín kích thước từ 320px tới 4K: đúng ảnh mới, đủ khung, mặt/tay/chân không bị che, vị trí bộ chọn giữ nguyên, thao tác chạm, bàn phím, popup, focus, giảm chuyển động và ảnh lỗi/thử lại. 70 kiểm tra footer chung tiếp tục đạt.
- Lighthouse 4K: Performance 89, Accessibility 100, Best Practices 96; LCP 2,2 giây, CLS 0,002, TBT 0 ms. Mục chưa đạt là độ phân giải ảnh: vùng ảnh trong mẫu chỉ có 1212×613, thấp hơn kích thước phóng ở 4K; không tạo thêm chi tiết gương mặt để che hạn chế tệp nguồn.

## Nền minh họa được phục hồi ở lần trước

Ảnh mẫu trước đây: `C:/Users/ASUS/Downloads/Three Witnesses of Living Memory.png`.

- `witness-demo-original.png`: giữ nguyên mẫu để đối chiếu.
- `witness-background-v1.png`: ảnh nền sau khi gỡ chữ, nút và dải nền giao diện bằng công cụ imagegen, chế độ **edit**.
- `witness-background-v1.webp`: hiện chỉ dùng làm nền phía sau; đổi định dạng bằng Pillow, quality 94, giữ kích thước 1672 × 941.
- [cleanup-prompt.json](cleanup-prompt.json): lưu nguyên prompt, chế độ xử lý và đường dẫn kết quả.
- [manifest.json](manifest.json): kích thước và SHA-256 của ảnh gốc cùng các bản xử lý.

Prompt yêu cầu giữ cả ba người, gương mặt, tư thế, bàn tay, trang phục, công trình và bố cục; chỉ gỡ các chữ và thành phần UI in trên ảnh. Những vùng từng bị chữ che đã được AI dựng lại. Đây là ảnh minh họa từ mẫu, không phải ảnh báo chí gốc đã xác minh. Cửa sổ câu chuyện tiếp tục dùng ảnh nhân chứng gốc từ Báo Công an nhân dân.

Chữ, nút và tab của ứng dụng là HTML tương tác thật. Phần ảnh phía trước giữ đủ khung theo mẫu mới, chỉ có hiệu ứng hòa ảnh khi vào tab; lớp nền phía sau không thay thế ảnh chính hoặc ảnh tư liệu trong popup.
