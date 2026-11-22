# Giao diện bản đồ màn hình chính

Thiết kế theo ba ảnh tham chiếu của người dùng: các cụm điều khiển nổi nền tối, chữ trắng, các trạng thái đang chọn/đang bật dùng màu xám `#41484c`, cùng màu nút Google vệ tinh. Ảnh vệ tinh phủ toàn màn hình, header không còn chiếm một dải riêng.

Yêu cầu đã xác nhận ngày 28/10/2026: **giữ hiệu ứng bay cinematic `flyTo`**, gồm nhấc lên, di chuyển và hạ xuống theo khoảng cách. Tối ưu tải ảnh/bộ nhớ đệm độc lập với camera; không rút ngắn hoặc thay hiệu ứng bay bằng chuyển cảnh nhanh để làm chỉ số phản hồi thấp hơn. Nếu điều chỉnh chuyển động, phải giữ trải nghiệm bay và cải thiện độ mượt. Bài kiểm tra bảo vệ: `tests/map-flight-test.cjs`.

Điều chỉnh theo yêu cầu bay chậm và mượt hơn ngày 29/10: chuyến tới địa điểm dùng 3,6–6 giây; về toàn cảnh 3,8–5 giây; chuyển góc chương 2,2 giây. Kéo dài nhịp tăng/giảm tốc, nối tốc độ và gia tốc liên tục ở đoạn bay đều; vẫn dùng một đường `flyTo` liền mạch và cho phép kéo/đổi điểm để ngắt ngay. Chế độ giảm chuyển động giữ thời lượng ngắn riêng.

## Thành phần

- Header: cụm trang chủ/quay lại và tên dự án bên trái; thời tiết thực cùng tìm kiếm, âm thanh, ngôn ngữ, thông tin, toàn màn hình bên phải. Hàng tiện ích và hàng tham quan dùng chung chiều rộng thực, thẳng cả mép trái/phải; các nút cao 44 px, khoảng cách ngang 8 px trên desktop. Hàng tham quan nằm cách hàng tiện ích 12 px khi cùng ở góc phải phía trên; chữ tự thích ứng ở khung hẹp.
- Bộ lọc: bốn viên chủ đề nằm ngang hàng logo và căn đúng tâm màn hình trên desktop. Hai cột bên bằng nhau giữ tâm độc lập với độ rộng logo và cụm tiện ích. Khung hẹp tách hàng để tránh chồng nút; giữ nguyên dữ liệu lọc mốc và cuộn ngang khi thiếu chỗ.
- Tham quan: gom tự động tham quan, toàn cảnh tỉnh, **Khám phá câu chuyện** thành một hàng. Khi thiếu chiều rộng, hai thao tác sau hiển thị bằng biểu tượng với nhãn trợ năng.
- Mở đầu: bản đồ và dải thẻ địa điểm hiển thị trực tiếp, không có khung giới thiệu hay nút Hướng dẫn nổi phía trên dải ảnh. Nút thông tin **(i)** có mục **Cách khám phá**; hướng dẫn ba bước trong thanh công cụ vẫn mở lại được như trước.
- Hết phiên: sau giới hạn năm phút của cửa sổ xem nhanh, bản đồ trở về toàn cảnh và hiện lời mời **“Khám phá những câu chuyện di sản Trà Vinh”**, thông báo lượt trước đã kết thúc, hướng dẫn chọn địa điểm để đọc/nghe và nút **“Chạm để khám phá”**. Nút này bắt đầu lượt mới và đưa tiêu điểm về thẻ địa điểm. Cửa sổ giữ tiêu điểm bên trong, hỗ trợ Enter/Escape và không bị màn hình chờ 75 giây che lên. Bản Việt–Anh dùng cùng hành vi.
- Màn hình chờ dùng ngôn ngữ hướng tới việc chọn điểm, đọc/nghe chuyện, có nút đóng và nút bắt đầu dùng được bằng bàn phím; bỏ thuật ngữ WGS-84 và quảng bá độ phân giải ảnh khỏi lời mời khám phá. Ghi nguồn bản đồ vẫn ở phần ghi nguồn.
- Địa điểm: các thẻ tách rời trên bản đồ, không có nền đen, viền hoặc bóng chung bao ngoài; khoảng cách thẻ 14 px trên desktop, 8 px trên khung hẹp. Bỏ tiêu đề “Hành trình di sản”, biểu tượng mốc đỏ, số thứ tự và bộ đếm. Ảnh rộng bằng toàn bộ phần trong khung thẻ, giữ nguyên chiều cao cũ tại từng kích thước màn hình; `object-fit: cover` cắt ảnh vừa khung mà không kéo giãn. Desktop hiện đủ bảy mục; khung dưới 900 px chia bốn cột, điện thoại chia ba cột. Không cần cuộn ngang. Dùng nền xám và viền xám sáng cho địa điểm đang chọn, thu gọn và mở lại.
- Tên địa điểm chỉ có một dòng. Khung hẹp dùng tên ngắn rõ nghĩa như “Ao Bà Om”, “Chùa Âng”, “Bảo tàng Khmer”; tên dài được giới hạn bằng dấu ba chấm khi thiếu chỗ. Tên đầy đủ vẫn nằm trong nhãn trợ năng và tooltip.
- Nút thu gọn/mở lại địa điểm nằm sát bên phải thanh kéo xoay hướng, cách 12 px và cùng tâm dọc. Khi thanh kéo ẩn trên màn hình ngang thấp, nút nằm về bên phải vùng bản đồ. Nút tách khỏi lưới bảy thẻ nên không chiếm một cột; cả hàng tự nâng theo chiều cao thực của lưới.
- Khi bảng thông tin mở, thanh tự chuyển sang nhóm gọn gồm điểm đang xem và tối đa hai điểm gần nhất trong phạm vi 5 km, tính từ tọa độ thật bằng hàm khoảng cách hiện có. Điểm không có địa điểm lân cận trong phạm vi này giữ riêng một thẻ. Đóng bảng khôi phục đủ bảy thẻ. Chuột/chạm chọn trực tiếp; phím trái/phải, lên/xuống theo lưới và Home/End chuyển tiêu điểm, Enter chọn địa điểm.

## Bố cục thích ứng

`HeaderTopBar` đo chiều rộng/chiều cao thực bằng `ResizeObserver`; `LandmarkCarousel` đo chiều cao thanh hành trình. Hai phép đo chỉ cập nhật thuộc tính CSS, không thay đổi kích thước canvas hoặc chạy vòng lặp React theo từng pixel cuộn.

Khi mở thông tin bên phải, header và thanh địa điểm dùng chung `--story-controls-offset` của bảng hiện có. Thanh lân cận thu chiều rộng theo số thẻ, không giữ khoảng trống của các mục đã ẩn. Đóng bảng vẫn trả tiêu điểm về địa điểm. Bộ nút bản đồ và thanh xoay dành khoảng trống cho ảnh trên màn hình nhỏ.

Dải địa điểm tự thu gọn ngay khi chọn điểm và mở cửa sổ thông tin; đóng cửa sổ bằng nút đóng, Escape, Home/Back hoặc trở về bản đồ sẽ tự mở lại danh sách theo bộ lọc hiện tại. Mở trực tiếp liên kết địa điểm cũng bắt đầu với dải đã thu gọn. Nút thu/mở thủ công vẫn dùng được; lần chọn điểm tiếp theo lại tự thu gọn. Khi đóng, tiêu điểm trở về thẻ địa điểm vừa xem sau khi dải được phục hồi.

Dải thẻ được giữ trong DOM cả khi thu gọn và mở trang chi tiết; chỉ ẩn bằng `hidden`/`inert`. Chế độ lân cận ẩn các thẻ ngoài nhóm, không gỡ ảnh khỏi trang. Ảnh được nạp trước với ưu tiên thấp và giải mã khi tải xong, tránh tạo lại/tải lại ảnh khi đóng cửa sổ; không chờ camera bay xong để hiện dải.

Thanh bản đồ và công cụ kể chuyện được gộp thành một cột nền tối bên phải: zoom, 2D/3D, orbit, la bàn, hướng dẫn, câu chuyện/nguồn, nghe/bản chữ, QR và một nút ngôn ngữ/trợ năng. Bỏ thanh ngang ở góc trái dưới và nút Nội dung đã lưu. Các nút cao 44 px; màn hình thấp cuộn dọc và dùng Arrow Up/Down, Home/End để tiếp cận toàn bộ nút.

Khi mở bảng thông tin trên desktop, thanh nằm phía trái bảng để không che ảnh/nội dung. Ở bảng thông tin phủ màn hình điện thoại hoặc cửa sổ đọc, công cụ kể chuyện thu thành nút Công cụ bên phải; nội dung dialog vẫn mở được bằng chuột/chạm và trả tiêu điểm khi đóng. Các trang chi tiết độc lập dùng thanh dọc bên phải cùng cách mở công cụ.

## Kiểm tra

- `npm run lint`
- `node tests/merged-tools-test.cjs`: thanh kết hợp, cột phải, nút 44 px, dialog bằng pointer, một nút trợ năng, 2D/3D, bàn phím và 320–1600 px, tránh bảng thông tin và công cụ trong bảng điện thoại; dải địa điểm hiện lại ở khung hình đầu tiên sau khi đóng trên desktop/điện thoại, giữ nguyên ảnh và không mở lại cửa sổ khi camera bay xong.
- Build Vite với các tài nguyên công khai đã có trong `dist`.
- `node tests/main-map-interface-test.cjs`: bố cục 320–3840 px, mục tiêu chạm, lọc mốc, chuột/bàn phím/cảm ứng, thu gọn, ngôn ngữ, tìm kiếm, thông tin, bảng xem nhanh và mở/thu nhỏ/mở lại/đóng chi tiết Đền thờ Bác mà giữ nguyên trạng thái.
- `node tests/museo-detail-test.cjs --quick-window-motion-only`: tương tác ảnh, tab, giảm chuyển động, đóng và trả tiêu điểm của bảng xem nhanh.
- `node scripts/audit-unused.mjs`: kiểm tra tài nguyên đang dùng, không xóa thêm tài nguyên.
