# Hiện vật chiến tranh: ba ảnh và ba câu chuyện

Cập nhật ngày 27/10/2026. Vào **Không gian → 04 Hiện vật chiến tranh → Xem chi tiết**, hoặc `/den-tho-bac.html?section=spaces&story=map-artifacts`.

## Thiết kế

Giữ giao diện đọc tối, chữ trắng ngà và nhấn đỏ hiện có. Cột trái là ba câu chuyện liên tục; bên phải giữ ảnh lớn và ba thumbnail. Cuộn qua nội dung một hiện vật sẽ chuyển sang đúng ảnh của hiện vật kế tiếp. Chọn thumbnail cuộn đến nội dung tương ứng.

Mỗi mục có hai thông tin chính, nội dung lịch sử, gợi ý quan sát, bản đọc biển và liên kết đối chiếu. Ảnh lớn dùng `contain`, giữ đủ đầu xe, nòng pháo, chân bệ, biển tên và dấu Tiền Phong. Có phóng 200%, kéo ảnh và liên kết xem AVIF gốc. Điện thoại dùng ảnh cố định phía trên phần chữ cuộn; bản đọc biển giúp xem thông tin mà không phụ thuộc vào kích thước chữ trong ảnh.

Chỉ cập nhật điểm 04 và câu chuyện `map-artifacts`. Giữ footer sáu phần, nguồn chung, đọc tóm tắt theo yêu cầu, Escape, trả tiêu điểm và giảm chuyển động.

## Nội dung đã đối chiếu

| Hiện vật | Thông tin đưa lên giao diện | Cơ sở |
| --- | --- | --- |
| Xe Jeep | Được dùng khi tiếp quản Dinh Tỉnh trưởng Vĩnh Bình, ngày 30/4/1975 | Biển trong bac-23 và bài ảnh Tiền Phong |
| Pháo 105 mm | Gắn với trận Tầm Phương, Huỳnh Chí Thiện và mốc đêm 12, rạng sáng 13/8/1969 | Biển trong bac-24 và phóng sự SGGP từ lời kể người tham gia |
| Trực thăng HU 1A | Biển ghi Đại đội Bộ binh 509, trận Tân An và ngày 19/5/1964 | Biển trong bac-25; tên và mốc được ghi rõ là dẫn theo biển |
| Tên HU-1 / UH-1 | Dòng HU-1 đổi tên thành UH-1 năm 1962; biệt danh Huey bắt nguồn từ HU-1 | Tư liệu lịch sử của U.S. Army / Redstone Arsenal |

Không tự gán đời xe Jeep, kiểu pháo cụ thể, số hiệu trực thăng hoặc thông số kỹ thuật cho các hiện vật khi ảnh và hồ sơ chưa xác định.

## Nguồn nghiên cứu

1. Cảnh Kỳ, **Về thăm Đền thờ Bác**, Tiền Phong, 01/05/2026: https://tienphong.vn/ve-tham-den-tho-bac-post1839811.tpo. Bài gốc có đủ ba ảnh.
2. **Bài 7: “Vợ” của… nhiều người**, Sài Gòn Giải Phóng, 09/10/2014: https://www.sggp.org.vn/bai-7-vo-cua-nhieu-nguoi-post19171.html. Phỏng vấn Huỳnh Chí Thiện, Mười Vân, ghi đêm 12–13/8/1969.
3. **Aviation Systems · Bell (model 204) HU-1A/HU-1B**, U.S. Army / Redstone Arsenal: https://history.redstone.army.mil/avi-systems.html. Dùng cho lịch sử tên gọi dòng trực thăng.
4. Biển thuyết minh nằm trong ba ảnh người dùng cung cấp. Bản đọc trong giao diện giữ nội dung biển, chỉ chuẩn hóa viết hoa/khoảng trắng để dễ đọc.

Đã xem thêm bài họp mặt Tiểu đoàn 509 trên Báo Trà Vinh ngày 19/03/2023 và bài về đại đoàn kết trên Báo Trà Vinh. Những bài này nêu các mốc Tân An/Tầm Phương khác biển trong ảnh, nên không dùng làm căn cứ độc lập cho ngày trên biển. Mốc HU1A vẫn được ghi dưới dạng “Mốc ghi trên biển”; mốc Tầm Phương dùng biển và phóng sự SGGP đồng thuận tháng 8/1969. Thông tin về dòng HU-1 không xác nhận số hiệu hay biến thể của riêng chiếc đang trưng bày.

## Nguồn ảnh

Ba AVIF gốc do người dùng cung cấp, có dấu Tiền Phong. Ghi **Cảnh Kỳ / Báo Tiền Phong** và dẫn về bài gốc. Tổng 894.918 byte, giữ nguyên SHA-256; xem [manifest](den-tho-bac-war-artifacts-manifest.json).

## Kiểm tra

- TypeScript và build Vite đạt.
- `tests/den-tho-bac-war-artifacts-test.cjs`: 85 kiểm tra đạt, gồm bố cục 320 px–4K, ba AVIF nguyên bản, ảnh trọn khung, thông tin mốc sự kiện, nguồn ảnh, cuộn đồng bộ, bản đọc biển, phóng 200%, bàn phím/cảm ứng, lỗi/thử lại và trả tiêu điểm.
- Kiểm tra cuối xác nhận nghe tóm tắt có đủ ba sự kiện và bản đọc biển hoạt động trong bản build sau cùng.
- `tests/den-tho-bac-reader-gallery-test.cjs`: 71 kiểm tra đạt, gồm các câu chuyện đang có và lối vào bộ 93 ảnh nhà trưng bày.
- `tests/den-tho-bac-spaces-test.cjs`: 100 kiểm tra đạt cho bản đồ tám điểm và từng cửa sổ chi tiết.
- Kiểm tra tài nguyên: không thiếu tệp, không có tệp runtime không sử dụng.

Ảnh đối chiếu: `preview/den-tho-bac-war-artifacts-jeep.png`, `preview/den-tho-bac-war-artifacts-gun-plaque.png`, `preview/den-tho-bac-war-artifacts-390x844-helicopter.png`.
