# Không gian — bản đồ được cung cấp ngày 26/10/2026

## Ảnh và tọa độ

- `map-current-v2.webp` được sao chép nguyên byte từ `Desktop/mapmoi.webp` (2560×1440). Không chỉnh màu, tạo ảnh mới, làm mờ hoặc vẽ mốc trực tiếp vào ảnh.
- `map-current-marked-v2.png` là bản có chữ và chấm đỏ từ `Desktop/mapmoi.png`. Bản WebP đi kèm chỉ đổi định dạng, dùng trong phần nguồn để đối chiếu.
- Hai bản dùng cùng một khung ảnh. `map-current-coordinates.json` lưu tâm của tám **chấm đỏ riêng biệt**, không lấy tâm chữ viết tay. Đây là tọa độ pixel/phần trăm ảnh, không phải GPS.
- `content.ts` đọc vị trí từ JSON; cả tám nút và ảnh cùng nằm trong một mặt phẳng nên giữ đúng tương quan khi thay kích thước, kéo hoặc nhìn gần.

| Mã | Tên đã xác nhận | X (%) | Y (%) |
| --- | --- | ---: | ---: |
| 01 | Đền thờ | 45,291 | 19,296 |
| 02 | Nhà trưng bày | 56,069 | 15,101 |
| 03 | Nhà đón tiếp khách | 76,528 | 30,337 |
| 04 | Hiện vật chiến tranh | 62,085 | 33,748 |
| 05 | Thuyền độc mộc | 69,927 | 43,356 |
| 06 | Nhà sàn Bác Hồ | 74,436 | 70,114 |
| 07 | Khuôn viên | 26,716 | 52,994 |
| 08 | Hồ sen | 40,554 | 63,455 |

## Cách trình bày

Sau phản hồi màu đỏ quá nặng, đỏ chỉ còn là điểm nhấn: nút mốc trắng, viền/số đỏ; mốc đang chọn có nền đỏ/chữ trắng. Nhãn mốc trắng/chữ đỏ. Panel, thẻ danh sách trắng và chữ chính trung tính; số thứ tự có nền đỏ rất nhạt. Không đổi màu ảnh hoặc footer chung.

Trên màn ngang desktop, một ảnh duy nhất phủ hết section, kể cả sau panel. Panel trắng bo hai góc dưới, kết thúc sát đường viền trên của navigation, không chừa khe hở; danh sách cuộn trong panel. Mặt phẳng ảnh tự chừa đủ nửa đường kính mốc cộng khoảng hở để mốc phía đông không bị panel che ở 4K. Ở màn hẹp, giữ bố cục bản đồ trên/danh sách dưới.

Chọn mốc hoặc thẻ sẽ hiện một phần tóm tắt; nút Xem chi tiết mở câu chuyện tương ứng. Giữ nhìn gần/kéo ảnh, điều hướng trước/sau, trở về danh sách, focus bàn phím, chạm và chế độ giảm chuyển động. ID nội bộ `camping` được giữ để không làm hỏng liên kết cũ, nhưng nội dung hiển thị đã đổi thành Khuôn viên.

Kiểm tra tập trung: `node tests/den-tho-bac-spaces-test.cjs`. Ảnh đối chiếu được lưu tại `preview/den-tho-bac-spaces-red-final-*-list.png` và `*-pond.png`.
