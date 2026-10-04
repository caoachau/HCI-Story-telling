# Chuyển động trang chi tiết Cồn Chim

> Trang hiện tại được đối chiếu lại theo lịch sử chat: một header, bán cung theo ảnh người dùng, mỗi section là một màn hình. Các hiệu ứng hoạt động bên trong bố cục này.

## Hướng thiết kế và khảo sát

Trang kể chuyện di sản cho khách tham quan, dùng ảnh tư liệu, màu xanh rừng, Noto Serif và Be Vietnam Pro. Giữ bố cục từng màn hình, mặt nạ ảnh vòm, các chương, sáu góc khám phá, mục lục và đường dẫn hiện có. Khảo sát trước khi sửa: chuyển màn hình tức thì; phần lớn nội dung dùng cùng một fade ngắn; thư viện ảnh thay ảnh trước khi giải mã; modal chỉ có chuyển động mở.

DESIGN_VARIANCE: 7, MOTION_INTENSITY: 7, VISUAL_DENSITY: 4. Đây là nâng cấp chuyển động trên giao diện có sẵn. CSS và Web Animations API dùng chung đường cong giảm tốc `cubic-bezier(.16,1,.3,1)`, không thêm thư viện.

## Nhịp chuyển động

- Mở trang: địa danh, tên Cồn Chim, câu dẫn, nội dung và nút khám phá xuất hiện có thứ tự. Chữ chuyển theo nguyên từ để giữ dấu tiếng Việt và cách đọc tự nhiên. Ảnh vòm mở từ dưới lên; ảnh phụ hiện sau và có chiều sâu nhẹ theo con trỏ trên máy tính.
- Chuyển màn hình: nội dung cũ rời trong 150 ms; màn mới hiện theo từng lớp trong khoảng 600–1.050 ms. Khung vẫn chứa đúng một phần nội dung. Mỗi thao tác chuyển một chương hoặc một màn; yêu cầu mới thay thế yêu cầu đang chuyển.
- Câu chuyện và dấu mốc: vị trí, tiêu đề, nội dung, ảnh và hành động có độ trễ khác nhau. Đọc ngược đổi hướng chuyển động. Quay lại màn hình chạy lại nhịp hiện nội dung.
- Sau thao tác đầu tiên của người xem, màn mở đầu chuyển cảnh mỗi 7,2 giây khi đang được xem. Có nút tạm dừng; chọn cảnh bằng tay dừng tự động. Dừng khi người dùng tương tác với bộ chọn, rời màn hình, ẩn tab hoặc bật giảm chuyển động. Không tải ảnh các cảnh kế tiếp cùng lúc với ảnh mở đầu và phông chữ.
- Thư viện: tải và giải mã ảnh mới trước khi chuyển; giữ ảnh và chú thích hiện tại trong lúc chờ. Tải sẵn hai ảnh kề. Ảnh hòa chuyển có hướng, tiêu đề hiện theo từ, ảnh thu nhỏ xuất hiện lần lượt. Bấm liên tục chỉ hiển thị lựa chọn mới nhất.
- Vuốt ngang đổi ảnh trong thư viện và ảnh phóng lớn; vuốt dọc giữ hành vi đọc trang. Vuốt ảnh không kích hoạt nhầm nút mở ảnh.
- Modal mở và đóng có chuyển động; giữ nội dung trong DOM đến khi đóng xong để trả tiêu điểm về đúng nút mở. Bàn phím, Escape, lưu ảnh yêu thích và focus trap tiếp tục hoạt động.

## Hiệu năng và trợ năng

Chuyển động dùng `transform` và `opacity`; độ sâu dùng các thuộc tính biến đổi riêng. Không cập nhật React mỗi khung hình. Vòng lặp chiều sâu chỉ chạy khi con trỏ đang thay đổi và dừng khi ổn định. Hiệu ứng hữu hạn được hủy sau khi xong để giải phóng lớp dựng hình và trả lại trạng thái hover/focus của CSS.

Tôn trọng `prefers-reduced-motion` và thiết lập `reduce-motion` do ứng dụng bản đồ gửi đến, kể cả khi đổi giữa hiệu ứng. Giữ tiêu đề liền mạch cho trình đọc màn hình; các từ dùng để tạo chuyển động được ẩn khỏi cây trợ năng. Ảnh lỗi có trạng thái để người dùng chọn ảnh khác.

## Kiểm tra

```powershell
npm run lint
npm run build
node tests/con-chim-motion-test.cjs
node tests/con-chim-timeline-test.cjs
```

Kiểm tra chuyển động bổ sung chạy trên Chrome với bản production: hiệu ứng thực sự chạy và kết thúc; autoplay và tạm dừng; chuyển mục liên tiếp; ảnh tải chậm và giải mã; bấm đổi ảnh liên tục; vuốt ngang thật; bàn phím trong lightbox; chuyển động đóng và trả tiêu điểm; điện thoại 390px/320px; giao diện tối; giảm chuyển động từ hệ điều hành và ứng dụng.

Ảnh kiểm tra nằm tại `preview/con-chim-motion-*.png`. Kiểm tra timeline có sẵn bao phủ cuộn bánh xe, vuốt dọc, đọc đủ các chương, chiều cao màn hình, header tự ẩn, màn hình thấp, fallback không JavaScript và trang nhúng trong bản đồ.

Lượt kiểm tra cuối: TypeScript, build, hai bộ kiểm tra Chrome đều qua; không có exception trong trình duyệt. Lighthouse mobile trên trang chi tiết production đạt accessibility 100, best practices 93, performance 62. LCP đo trực tiếp tại localhost là 973 ms; mô phỏng mạng chậm là 12,8 giây. Kết quả mô phỏng cho thấy các tài nguyên cũ, nhất là mặt nạ ảnh PNG và tài nguyên chung, còn cần tối ưu cho mạng chậm; kết quả localhost không đại diện cho triển khai thực tế. Báo cáo nằm tại `.browser-profile/con-chim-motion-lighthouse.json`.
