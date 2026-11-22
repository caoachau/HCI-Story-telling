# Văn hóa · Hoạt động · Con người

Ảnh chính và ảnh trong popup chi tiết có nút mở rộng. Ảnh mở lớn trong khung phía trên thanh điều hướng; giữ toàn bộ ảnh, chỉ lấy vùng ảnh đã xác định nếu nguồn là mẫu giao diện. Thu nhỏ hoặc Escape giữ nguyên chủ đề, bộ lọc và popup đang đọc.

Trang mặc định giữ ba thẻ Văn hóa, Hoạt động và Con người. Nền đổi về đen trung tính, chữ trắng ngà và đồng nhạt; trạng thái chọn dùng nâu đồng thay cho nền vàng sáng. Tiêu đề được tăng cỡ chữ.

Trang con dùng bố cục mẫu mới do người dùng gửi: nhóm và bộ lọc xếp dọc bên trái, một ảnh lớn cùng nhãn giới thiệu bên phải, dải ảnh chọn phía dưới. `CultureExhibitView.tsx` quản lý phần xem trước; `khmerCultureLabels.ts` chứa nhãn trưng bày ngắn dựa vào nội dung đã có. Nhãn giới thiệu tên đối tượng đang xem, tóm tắt và gợi ý quan sát, không suy đoán chất liệu hay niên đại.

Chọn ảnh chỉ cập nhật ảnh chính, nhãn giới thiệu và thẻ đang chọn. Mũi tên chuyển qua các ảnh; dải hỗ trợ kéo chuột, vuốt và phím trái/phải. “Xem chi tiết” mới mở bài đầy đủ, ảnh liên quan và nguồn tư liệu trong popup. Đóng popup giữ chủ đề, bộ lọc và vị trí cuộn của dải ảnh. Thay bộ lọc giữ lựa chọn nếu còn thuộc bộ đó, nếu không chọn mục đầu tiên. Mỗi nhóm nhớ chủ đề vừa xem; lần đầu Văn hóa mở Rôbăm, Hoạt động mở Ok Om Bok và Con người mở Thạch Sang.

Số lượng lấy từ dữ liệu: Văn hóa 12, Hoạt động 6, Con người 6. “Tìm chủ đề” mở danh mục tìm kiếm toàn bộ 24 bài; chọn kết quả quay về đúng nhóm và ảnh xem trước. “Nguồn tư liệu” giữ danh sách bài viết, nguồn ảnh và ảnh minh họa do người dùng cung cấp.

Ảnh gốc mới lưu nguyên vẹn tại `src/assets/museo/khmer-culture-user-reference.jpg`. Ảnh có cả chữ và nút của mẫu giao diện. `CulturePhotoImage.tsx` dùng khung SVG `viewBox="330 72 550 455"` để chỉ hiển thị phần ảnh mặt nạ, giữ tỷ lệ và không đưa giao diện in sẵn vào ảnh chính. Phần ảnh đó cũng làm nền mờ nhẹ cho các trang con. Gallery Rôbăm phân biệt ảnh này là hình minh họa do người dùng cung cấp, đồng thời giữ ảnh tư liệu và nguồn cũ.

Kiosk giữ menu dọc và ảnh/nhãn hai cột. Tablet xếp ảnh trên nhãn; điện thoại thu nhóm và bộ lọc thành hàng, nội dung cuộn bên trong khung và điều hướng chính vẫn ở đáy. Chừa chỗ cho thanh công cụ dùng chung. Hiệu ứng đổi ảnh nhẹ được bỏ khi bật giảm chuyển động.

Kiểm tra: `node tests/khmer-culture-hub-test.cjs`; lệnh cũ `node tests/khmer-culture-preview-test.cjs` chạy cùng bộ kiểm tra. Bao gồm bố cục, màu nền, ảnh cung cấp, chọn ảnh không mở popup, đồng bộ nhãn, bộ lọc và số đếm, popup và ảnh liên quan, quay lại đúng chỗ, danh mục, chọn nhanh nhiều ảnh, tiếng Anh và kích thước từ điện thoại đến 4K.
