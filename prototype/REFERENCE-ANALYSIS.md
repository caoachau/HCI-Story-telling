# Phân tích tư liệu và chuyển động Fly-to

Tư liệu người dùng gửi trong `New folder.zip` gồm ảnh vệ tinh tổng thể 2D/3D, ảnh nhìn từ trên xuống tại các địa điểm và ba video quay màn hình. Các ảnh xác định hình dáng bản đồ và cảnh quan; video dùng để tham chiếu nhịp di chuyển của camera.

## Những điểm rút ra từ tư liệu

- Toàn cảnh thể hiện sông, đường bờ và cấu trúc khu vực bằng ảnh vệ tinh. Ảnh Ao Bà Om thể hiện mặt ao gần vuông, vành cây và không gian xung quanh. Giữ hình dáng có trong ảnh gốc, không tự bổ sung đường, công trình hoặc địa điểm lân cận.
- Cảm giác “bay tới” đến từ phóng to liên tục đồng thời dịch chuyển tâm nhìn. Các vùng xung quanh dần ra khỏi khung; chi tiết nơi đến rõ lên sau đó.
- Ảnh và video gốc có pin vàng, nút điều khiển, thẻ địa điểm của Google; video còn có thanh trình duyệt. Đây là chi tiết của công cụ ghi hình, không phải thành phần cần sao chép vào giao diện Heritage.
- Video tới Cồn Chim xuất hiện các mảng ảnh ghép khác màu. Không dùng hiện tượng tải ảnh này làm hiệu ứng chuyển cảnh.

## Đoạn video tham chiếu chính

Mốc dưới đây thuộc `VID ĐỊA ĐIỂM +360 TẠI CHỔ.webm`, được xác nhận bằng giải mã tuần tự theo thời gian của từng khung hình. Video dài khoảng **190,885 giây**. Không dùng số khung hình suy ra từ FPS vì bản ghi WebM có thời gian khung hình không đều.

| Mốc thời gian | Quan sát |
| --- | --- |
| 146,022 giây | Chọn Ao Bà Om khi vẫn nhìn thấy toàn cảnh. |
| 146,533–147,523 giây | Camera tiến dần qua cấp độ khu vực và khu dân cư. |
| 148,000 giây | Nhận ra ao và các công trình xung quanh; ảnh đang tải nên chưa thật sắc nét. |
| 148,512 giây | Ao chiếm phần lớn khung hình. |
| 149,026–152,028 giây | Camera ổn định ở cảnh gần; phù hợp để tham chiếu trạng thái đã đến nơi. |

`TOÀN CẢNH.webm` dài khoảng **54,575 giây**, chủ yếu tham chiếu góc nhìn tổng thể và chuyển động xoay. `MAP TỚI CỒN CHIM.mp4` dài **9 giây**. Không tìm thấy khung video hoàn toàn sạch pin và giao diện; ảnh Ao gốc phù hợp hơn để làm lớp chi tiết cuối.

## Áp dụng vào prototype

Giữ một lớp camera và cùng bản đồ xuyên suốt Screen 03 → 05 → 06. Nhịp mục tiêu: chọn marker **300 ms** → chuẩn bị **200 ms** → pan/zoom **1.200 ms** → ổn định **300 ms** → popup trượt lên **450 ms**, từ Y +40 px, opacity 0 và scale 0,98. Đóng popup giữ trạng thái tập trung; Back trở về toàn cảnh.

Ảnh tổng thể đã bỏ giao diện được lưu tại `assets/tra-vinh-aerial.png`; đối chiếu ảnh gốc cho thấy các đường nét lớn vẫn thẳng hàng. Ảnh cận cảnh tham chiếu nằm tại `assets/ao-ba-om-aerial-reference.png`.

**Giới hạn mô phỏng:** zoom **2,8×** và lớp ảnh cận cảnh neo tại Ao là chuyển tiếp phục vụ kể chuyện trong prototype, không phải phép chiếu GIS hoặc ghép ảnh đã đăng ký tọa độ. Phóng toàn tỉnh 2,8× không tương đương tỷ lệ địa lý của ảnh mặt ao. Không suy ra khoảng cách, tọa độ, đường đi hoặc vị trí chi tiết mới từ lớp chuyển tiếp này; không đặt thêm marker lân cận lên ảnh cận cảnh khi chưa có căn cứ.
