# Điểm 07: Khuôn viên

Cập nhật 27/10/2026. Vào **Không gian → 07 Khuôn viên → Xem chi tiết**, hoặc `/den-tho-bac.html?section=spaces&story=map-camping`.

## Thiết kế và nội dung

Giữ bố cục đọc tối, chữ trắng ngà và nhấn đỏ đang dùng: nội dung bên trái cuộn liên tục; ảnh bên phải giữ nguyên vị trí và chỉ đổi khi đến mục kế tiếp. Mỗi góc nhìn có tiêu đề, nội dung ngắn, gợi ý quan sát và đúng ảnh được cung cấp. Có năm thumbnail, phóng/thu, nguồn tham khảo, nghe tóm tắt, Escape và trả tiêu điểm.

1. **Đường dạo ven hồ**: ảnh ngang 1280×720 mở đầu, đồng thời thay ảnh sơ đồ ở bảng tóm tắt điểm 07. Nội dung giới thiệu mối liên hệ giữa mặt nước, cây xanh và đường dạo. Quy mô 5,4 ha được ghi rõ là của **toàn khu di tích**.
2. **Lối đi & ghế nghỉ**: cách hàng cây, ghế nghỉ và dải cây thấp tạo nhịp cho một đoạn đường dạo.
3. **Dưới tán cây lớn**: góc chụp dọc về thân, rễ và tán lá bên cạnh đường cong. Không gán loài cây hay tuổi cây khi chưa xác định.
4. **Những khóm tre**: hình ảnh tre trong cảnh quan và tư liệu về lũy tre tại địa điểm dựng đền. Không khẳng định khóm tre trong ảnh chính là cây từ thời xây đền.
5. **Công trình & cảnh quan**: dùng ảnh nhỏ như một góc tham khảo về kiến trúc, sân và cây xanh; giới hạn kích thước hiển thị, không tự xác định tên công trình từ ảnh độ phân giải thấp.

Điện thoại giữ ảnh ở phía trên phần chữ cuộn. Ảnh lớn trọn khung, không cắt mất rễ, tán cây hay đoạn đường. Giữ footer sáu phần và các điểm tham quan còn lại.

## Cơ sở nội dung

- [Cổng thông tin tỉnh Vĩnh Long, Địa danh · Đền thờ Bác Hồ](https://vinhlong.gov.vn/du-khach-old/diadanh_test): quy mô toàn khu di tích 5,4 ha, các hạng mục, công viên, hồ sen, cây xanh và lũy tre. Chỉ dùng phần về Đền thờ Bác Hồ, không lấy mô tả cảnh quan của các điểm khác trong cùng trang.
- [Báo Nhân Dân, Đền thờ Bác Hồ ở Trà Vinh, 01/02/2008](https://nhandan.vn/den-tho-bac-ho-o-tra-vinh-post485616.html): bối cảnh chọn nền đất cao có lũy tre bao quanh để dựng đền.
- Mô tả chi tiết từng ảnh dựa vào hình ảnh người dùng cung cấp. Không suy ra sơ đồ đường đi, giờ mở cửa, loại cây, tuổi cây hoặc tên công trình từ ảnh nhỏ.

## Ảnh gốc

Dùng đủ năm ảnh, giữ nguyên byte. Thứ tự tham quan được biên tập theo cảnh quan. Tên nguồn, kích thước và SHA-256: [manifest](den-tho-bac-grounds-manifest.json), [README nguồn ảnh](../src/assets/den-tho-bac/grounds-user/README.md).

## Kiểm tra

- TypeScript và build Vite đạt.
- `tests/den-tho-bac-grounds-test.cjs`: 86 kiểm tra đạt, gồm ảnh gốc, đủ năm góc nhìn ở tám kích thước 320 px–4K, cuộn đồng bộ theo hai chiều, phóng ảnh, giữ giới hạn ảnh tham khảo nhỏ, nguồn, nghe tóm tắt, lỗi/thử lại, cảm ứng và trả tiêu điểm.
- `tests/den-tho-bac-reader-gallery-test.cjs`: 71 kiểm tra đạt cho những cửa sổ đọc hiện có, gồm bộ 93 ảnh và mục Khuôn viên với năm ảnh.
- `tests/den-tho-bac-spaces-test.cjs`: 100 kiểm tra đạt cho tám điểm trên bản đồ, tóm tắt/chi tiết, nguồn sơ đồ, phím và cảm ứng.
- Kiểm tra tài nguyên: không thiếu tệp, không có tệp runtime không sử dụng.

Ảnh kiểm tra: `preview/den-tho-bac-grounds-1404x790-lakeside.png`, `preview/den-tho-bac-grounds-390x844-lakeside.png`, `preview/den-tho-bac-grounds-bamboo.png`.
