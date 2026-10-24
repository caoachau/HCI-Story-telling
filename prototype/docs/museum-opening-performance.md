# Chuyển từ thông tin nhanh vào trang Bảo tàng Khmer

Giữ nguyên bố cục, nội dung và các hiệu ứng chính. Tối ưu việc chuẩn bị màn hình và thứ tự chạy hiệu ứng thay vì giảm độ phong phú của trang.

## Những điểm đã sửa

- Trước đây trang khởi tạo cả sáu section: 887 phần tử và 81 thẻ ảnh trong trang chi tiết. Lần mở đầu giờ chỉ dựng section giới thiệu: 169 phần tử và 6 thẻ ảnh. Năm section còn lại dựng khi được chọn; section đã xem giữ lại trạng thái.
- `museumPreload.ts` tải trước module, stylesheet, hai font địa phương và decode ảnh hero. Giữ tham chiếu ảnh đã decode. Tải khi hover/focus “Xem chi tiết”, hoặc sau khi popup ổn định. Chỉ áp dụng việc chuẩn bị màn hình sớm cho bảo tàng Khmer.
- Module đã tải được đọc đồng bộ qua một wrapper ổn định; nếu chưa có, React `use()` chờ cùng Promise trong Suspense. Tránh thêm một lần fallback khoảng 300 ms khi gọi lazy lần đầu trên Promise đã resolve, đồng thời giữ nguyên danh tính component khi mở lại.
- Màn hình giới thiệu được chuẩn bị ở kích thước viewport với opacity 0, `inert` và `aria-hidden`; không chạy entrance hoặc ambient motion. Popup vẫn nhận mọi tương tác. Đóng popup hoặc chọn địa điểm khác hủy bước chuẩn bị.
- Khi click, metadata và nút phụ rút nhẹ trong 180 ms; ảnh và tiêu đề vẫn giữ vị trí. Chờ ảnh/font/module sẵn sàng trước khi bàn giao. Không đóng popup rồi tạo thêm một entrance toàn màn hình độc lập.
- Clone ảnh có kích thước hộp cố định. Chuyển tiếp dùng translate, scale và opacity trong 620 ms; ảnh con bù tỷ lệ để giữ nguyên tỷ lệ tự nhiên. Vệt sáng cũng chạy bằng transform. Không tween width, height, top, left hoặc blur của hộp ảnh.
- Nội dung vào theo lớp sau ảnh. Parallax và glow tương tác khởi tạo sau entrance; hạt sáng tạm dừng trong giai đoạn mở. Vẫn giữ tiêu đề theo dòng, ornament, film grain, ánh sáng, parallax, hover, dock và chuyển chương.
- Đặt trạng thái đầu của entrance theo một lượt ghi style, đợi màn hình được vẽ rồi khởi tạo GSAP. Shade có phần tử riêng; không tween biến CSS kế thừa trên toàn cây trang. Bỏ lệnh gán `scrollTop = 0` trên section vừa mount vì nó đã ở vị trí 0 và lệnh gán ép tính layout đồng bộ.
- Khi trang chi tiết che bản đồ: dừng camera flight/orbit, slider, auto-tour và prefetch nền; tạm dừng animation marker. Giữ nguyên canvas và kích thước bản đồ. Khi trở về, khôi phục bản đồ và orbit trước đó nếu vẫn cùng địa điểm. Các callback camera không được tự đóng trang chi tiết đang mở.
- Resize hoặc đưa trang vào nền kết thúc chuyển tiếp đang chạy. Đóng/hủy sớm dọn clone, timeline, RAF, listener và trạng thái nút. Reduce motion mở thẳng nội dung đầy đủ.

## Đo trước và sau

Chrome headless, bản production Vite, viewport 1440 × 960, cache HTTP tắt. Cùng thao tác chọn bảo tàng, chờ popup hoàn tất và mở chi tiết. Thời gian frame được đo bằng RAF trong cửa sổ click → entrance hoàn tất + 180 ms. CPU 4× là mô phỏng CPU chậm; số đo headless có dao động GPU/font/ảnh và không đại diện cho mọi thiết bị.

| CPU 4× | Trước | Sau |
| --- | ---: | ---: |
| Phần tử trong trang lúc mở | 887 | 169 |
| Thẻ ảnh trong trang lúc mở | 81 | 6 |
| Thời gian frame p95 | 41,6 ms | 27,7 ms |
| Frame dài nhất | 347,2 ms | 152,8 ms |
| Frame > 33,4 ms | 17 | 6 |
| Click → entrance hoàn tất | 2.304 ms | 1.523 ms |

Kết quả từ `preview/museum-opening-before.json` và `preview/museum-opening-optimized.json`. Trong lượt đo cuối, cả hai mức CPU đều đã chuẩn bị xong màn hình đầu trước click. Đây là phép đo tương đối trong môi trường phát triển, không cam kết 60 fps trên mọi máy. Bước mở đầu vẫn có thể chậm hơn khi chưa warm hoặc mạng/thiết bị chậm.

## Kiểm tra và tái đo

```powershell
$env:TEST_BASE_URL='http://127.0.0.1:4173'
node tests/museo-detail-test.cjs --opening-only
node tests/museo-detail-test.cjs --motion-only
node tests/museo-detail-test.cjs
$env:PROFILE_LABEL='current'
node tests/museo-detail-test.cjs --opening-profile
```

`--opening-only` kiểm tra click sớm/nhấn lặp, hình không méo, hình học hộp không đổi trong flight, các chapter dựng theo nhu cầu, canvas bản đồ được giữ, quay lại đúng chapter và focus, shell chuẩn bị không nhận tương tác, resize trong flight, mobile đủ một màn hình, hủy trước bàn giao và reduced motion. `--motion-only` kiểm tra chuyển động và tương tác hiện có. Bộ kiểm tra đầy đủ kiểm tra nội dung, gallery, dialog và layout các section.

Đã qua TypeScript, production build, 1.656 kiểm tra trong bộ đầy đủ, kiểm tra entrance/hover/parallax hiện có, 12 kiểm tra vòng đời chuyển tiếp mới và kiểm tra chuyển động lịch sử/văn hóa. Các lượt trình duyệt không ghi nhận exception hoặc asset nội bộ trả về 404. Đã xem ảnh chụp luồng chuyển tiếp và màn hình hoàn tất trên desktop/mobile.

Để đo riêng trường hợp đã chuẩn bị xong, đặt `PROFILE_WAIT_PREPARED=1`. Để tìm lệnh đọc style/layout chậm, đặt `PROFILE_READS=1`; instrumentation chỉ chạy trong trình duyệt kiểm thử, không có trong mã ứng dụng.
