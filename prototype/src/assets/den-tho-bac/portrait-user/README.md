# Ảnh tab Nét vẽ ký ức

> C?p nh?t d?n repo 27/10/2026: c?c b?n ?nh/bi?n th? kh?ng c?n d?ng ?? ???c x?a. Ph?n d??i gi? l?ch s? ngu?n v? c?ch x? l?; t?n t?p c? kh?ng c? ngh?a t?p v?n n?m trong repo. Danh s?ch x?a v? hash n?m ? `prototype/docs/cleanup-2026-10-27.json`. C?c ?nh hi?n d?ng v? b?n ??i chi?u ???c gi? c? l? do trong `prototype/scripts/asset-retention.json`.

Nguồn do người dùng cung cấp ngày 25/10/2026:

| Tệp trong dự án | Tệp gốc | Sử dụng |
| --- | --- | --- |
| `portrait-demo-original.png` | `C:/Users/ASUS/OneDrive/Máy tính/ve.png` | Giữ nguyên mẫu đối chiếu; bố cục ba cột, tiêu đề trắng/đỏ. |
| `portrait-demo.webp` | Đổi định dạng từ mẫu PNG, WebP quality 94 | Chỉ hiển thị vùng ảnh cận ở cột giữa bằng CSS. |
| `artist-interview-original.jpg` | `C:/Users/ASUS/OneDrive/Máy tính/1.jpg` | Ảnh đầy đủ trong cửa sổ câu chuyện. |
| `ho-chi-minh-portrait-original.jpg` | `C:/Users/ASUS/OneDrive/Máy tính/2.jpg` | Bản tư liệu trước đây, lưu để đối chiếu. |
| `ho-chi-minh-portrait-updated-original.png` | `C:/Users/ASUS/OneDrive/Máy tính/anh bac.png` | Bản gốc 1315×1196 mới người dùng yêu cầu thay cho ảnh bên trái. |
| `ho-chi-minh-portrait-updated.webp` | Đổi định dạng từ PNG mới, WebP quality 92 | Ảnh đang hiển thị bên trái tab Nét vẽ ký ức; giữ trọn khung bằng `object-fit: contain`. |

Không dùng AI chỉnh sửa người, gương mặt hoặc bức vẽ trong lần này. Cột giữa lấy vùng ảnh `x=501, y=239, width=522, height=627` trong mẫu 1672×941 bằng CSS; tệp gốc không bị cắt sửa. Đã bỏ nhãn HTML “HỌA SĨ” và cắt 44px ở mép trên để loại cả nhãn cùng nền đen in sẵn. Gương mặt, hai tay và bức chân dung vẫn nằm đầy đủ trong khung. Các nội dung UI khác đều nằm ngoài vùng này và được dựng bằng HTML tương tác thật.

Tác giả và đơn vị ảnh ghi theo chú thích trong mẫu: ảnh chân dung cũ ghi Đ.D; ảnh họa sĩ ghi Lê Dung; tư liệu ảnh ghi Báo Đắk Nông. Bản chân dung mới ghi “Ảnh tư liệu được cung cấp”, không tự gán tác giả hoặc ngày chụp. Chưa có địa chỉ bài báo gốc đi kèm bộ ảnh. Popup cho phép xem bản ảnh họa sĩ được cung cấp, đồng thời giữ các nguồn nội dung lịch sử đã có.

[manifest.json](manifest.json) ghi kích thước, dung lượng và SHA-256 để đối chiếu ảnh gốc.
