# Giao diện bản đồ màn hình chính

Thiết kế theo ba ảnh tham chiếu của người dùng: các cụm điều khiển nổi nền tối, chữ trắng, các trạng thái đang chọn/đang bật dùng màu xám `#41484c`, cùng màu nút Google vệ tinh. Ảnh vệ tinh phủ toàn màn hình, header không còn chiếm một dải riêng.

## Thành phần

- Header: cụm trang chủ/quay lại và tên dự án bên trái; thời tiết thực cùng tìm kiếm, âm thanh, ngôn ngữ, thông tin, toàn màn hình bên phải. Hàng tiện ích và hàng tham quan dùng chung chiều rộng thực, thẳng cả mép trái/phải; các nút cao 44 px, khoảng cách ngang 8 px trên desktop. Hàng tham quan nằm cách hàng tiện ích 12 px khi cùng ở góc phải phía trên; chữ tự thích ứng ở khung hẹp.
- Bộ lọc: bốn viên chủ đề nằm ngang hàng logo và căn đúng tâm màn hình trên desktop. Hai cột bên bằng nhau giữ tâm độc lập với độ rộng logo và cụm tiện ích. Khung hẹp tách hàng để tránh chồng nút; giữ nguyên dữ liệu lọc mốc và cuộn ngang khi thiếu chỗ.
- Tham quan: gom tự động tham quan, toàn cảnh tỉnh, diễn giải di sản thành một hàng. Khi thiếu chiều rộng, hai thao tác sau hiển thị bằng biểu tượng với nhãn trợ năng.
- Địa điểm: các thẻ tách rời trên bản đồ, không có nền đen, viền hoặc bóng chung bao ngoài; khoảng cách thẻ 14 px trên desktop, 8 px trên khung hẹp. Bỏ tiêu đề “Hành trình di sản”, biểu tượng mốc đỏ, số thứ tự và bộ đếm. Ảnh rộng bằng toàn bộ phần trong khung thẻ, giữ nguyên chiều cao cũ tại từng kích thước màn hình; `object-fit: cover` cắt ảnh vừa khung mà không kéo giãn. Desktop hiện đủ bảy mục; khung dưới 900 px chia bốn cột, điện thoại chia ba cột. Không cần cuộn ngang. Dùng nền xám và viền xám sáng cho địa điểm đang chọn, thu gọn và mở lại.
- Tên địa điểm chỉ có một dòng. Khung hẹp dùng tên ngắn rõ nghĩa như “Ao Bà Om”, “Chùa Âng”, “Bảo tàng Khmer”; tên dài được giới hạn bằng dấu ba chấm khi thiếu chỗ. Tên đầy đủ vẫn nằm trong nhãn trợ năng và tooltip.
- Nút thu gọn/mở lại địa điểm nằm sát bên phải thanh kéo xoay hướng, cách 12 px và cùng tâm dọc. Khi thanh kéo ẩn trên màn hình ngang thấp, nút nằm về bên phải vùng bản đồ. Nút tách khỏi lưới bảy thẻ nên không chiếm một cột; cả hàng tự nâng theo chiều cao thực của lưới.
- Khi bảng thông tin mở, thanh tự chuyển sang nhóm gọn gồm điểm đang xem và tối đa hai điểm gần nhất trong phạm vi 5 km, tính từ tọa độ thật bằng hàm khoảng cách hiện có. Điểm không có địa điểm lân cận trong phạm vi này giữ riêng một thẻ. Đóng bảng khôi phục đủ bảy thẻ. Chuột/chạm chọn trực tiếp; phím trái/phải, lên/xuống theo lưới và Home/End chuyển tiêu điểm, Enter chọn địa điểm.

## Bố cục thích ứng

`HeaderTopBar` đo chiều rộng/chiều cao thực bằng `ResizeObserver`; `LandmarkCarousel` đo chiều cao thanh hành trình. Hai phép đo chỉ cập nhật thuộc tính CSS, không thay đổi kích thước canvas hoặc chạy vòng lặp React theo từng pixel cuộn.

Khi mở thông tin bên phải, header và thanh địa điểm dùng chung `--story-controls-offset` của bảng hiện có. Thanh lân cận thu chiều rộng theo số thẻ, không giữ khoảng trống của các mục đã ẩn. Đóng bảng vẫn trả tiêu điểm về địa điểm. Bộ nút bản đồ và thanh xoay dành khoảng trống cho ảnh trên màn hình nhỏ.

Màn hình ngang thấp dùng dãy nút bản đồ nằm ngang và ẩn thanh xoay/zoom phụ; các nút zoom, la bàn và thao tác bản đồ vẫn sẵn có. Màn hình chi tiết của các địa điểm tiếp tục dùng giao diện riêng.

## Kiểm tra

- `npm run lint`
- Build Vite với các tài nguyên công khai đã có trong `dist`.
- `node tests/main-map-interface-test.cjs`: bố cục 320–3840 px, mục tiêu chạm, lọc mốc, chuột/bàn phím/cảm ứng, thu gọn, ngôn ngữ, tìm kiếm, thông tin, bảng xem nhanh và mở/thu nhỏ/mở lại/đóng chi tiết Đền thờ Bác mà giữ nguyên trạng thái.
- `node tests/museo-detail-test.cjs --quick-window-motion-only`: tương tác ảnh, tab, giảm chuyển động, đóng và trả tiêu điểm của bảng xem nhanh.
- `node scripts/audit-unused.mjs`: kiểm tra tài nguyên đang dùng, không xóa thêm tài nguyên.
