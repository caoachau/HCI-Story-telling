# Trà Vinh Heritage — Prototype bàn tương tác

Bản đầu hoàn thành ngày 20/09/2026. Giao diện dành cho màn hình cảm ứng lớn đặt nằm nghiêng, một hướng đọc từ cạnh trước. Chạy bằng HTML, CSS và JavaScript thuần, không cần cài thư viện.

## Mở bản demo

**Nhanh nhất:** mở `index.html` bằng Chrome hoặc Edge. Các ảnh và mã nguồn đều nằm trong thư mục, không cần mạng để xem nội dung.

**Chạy qua localhost:** mở terminal trong thư mục `prototype`, chạy:

```powershell
node server.js
```

Truy cập **http://127.0.0.1:4173**. Màn hình mở thẳng bản đồ toàn cảnh. Dùng nút toàn màn hình ở góc phải hoặc phím **F11** trên máy tính.

Nếu cổng 4173 đang bận, sử dụng một cổng khác:

```powershell
$env:PORT = '4174'
node server.js
```

## Các màn đã làm

- Màn hình chờ: bản đồ toàn cảnh Trà Vinh, bảy địa điểm, biểu tượng văn hóa và bộ lọc Văn hóa/Thiên nhiên.
- Fly-to: chọn điểm 300 ms → chuẩn bị 200 ms → camera pan/zoom 2,8× trong 1.200 ms → dừng 300 ms → popup trượt lên 450 ms. Bản đồ và marker giữ nguyên phần tử DOM xuyên suốt ba trạng thái.
- Popup Ao Bà Om nằm trên bản đồ vừa zoom, có lưu địa điểm trong phiên, đóng, khám phá câu chuyện và Xem 360°. Đóng giữ nguyên góc nhìn; nút Quay lại/Toàn cảnh/Bản đồ bay về toàn cảnh trong 1.000 ms. Escape đóng popup rồi trở về toàn cảnh.
- Bấm lặp không khởi động lại chuyến bay. Thoát, kết thúc phiên và đổi địa điểm hủy chuyển động cũ. Giảm chuyển động bỏ qua pan/zoom và các khoảng chờ.
- Ao Bà Om: mở đầu; chọn chủ đề; hai nhánh với ba cảnh mỗi nhánh.
- Nhánh truyền thuyết có tương tác mở chi tiết ánh đèn; luôn ghi rõ là minh họa truyền thuyết.
- Nhánh văn hóa dùng nội dung sự kiện năm 2024; hình vẽ là minh họa không gian, không phải ảnh sự kiện.
- Toàn cảnh: ảnh kéo ngang, nút trái/phải, hai hotspot, đường quay lại đúng nội dung trước đó.
- Quiz: đúng/sai, giải thích, xem lại và bỏ qua; tổng kết và chuyển sang Chùa Âng.
- Hướng dẫn, nguồn tư liệu, bản đọc, trợ năng, tiến độ tạm và kết thúc phiên.

## Quy tắc phiên

- Bắt đầu bộ đếm khi mở một nội dung chính.
- **Một nội dung hiển thị quá 300 giây sẽ về bản đồ toàn cảnh**, ngay cả khi đang đọc hoặc nghe. Đây không phải thời gian không hoạt động. Bản đồ chờ ban đầu không chạy bộ đếm.
- Chuyển sang cảnh, địa điểm hoặc nội dung chính khác bắt đầu thời gian mới.
- Lọc trên bản đồ, mở hotspot, mở hướng dẫn, chỉnh chữ, trả lời trong cùng quiz hoặc chỉnh panorama không làm mới thời gian.
- Kết thúc sẽ hủy chuyến bay, dừng giọng đọc, đóng lớp phủ, xóa tiến độ, địa điểm đã lưu, đáp án và thiết lập tạm.
- Tab bị đưa xuống nền được kiểm tra thời hạn khi quay lại; không dùng localStorage hoặc tài khoản.

## Phạm vi và giới hạn

- **Ao Bà Om đã có luồng hoàn chỉnh.** Chùa Âng và các địa điểm còn lại có thẻ giới thiệu; giao diện ghi rõ nội dung chưa triển khai.
- Bản đồ dùng ảnh tham khảo do người dùng cung cấp, đã xử lý phần ghim và giao diện dính trong ảnh bằng công cụ imagegen. Chuyển tiếp từ toàn tỉnh sang ảnh cận Ao ở mức zoom 2,8× là mô phỏng kể chuyện; ảnh chưa được ghép theo tọa độ GIS. Không suy ra khoảng cách, đường đi hoặc vị trí công trình mới từ chuyển tiếp này. Xem [phân tích tư liệu](REFERENCE-ANALYSIS.md).
- Nút **Xem 360°** nối vào màn toàn cảnh hiện có: ảnh rộng kéo ngang, có nhãn mô phỏng, chưa phải dữ liệu 360° hoặc không gian 3D.
- Audio dùng giọng đọc tiếng Việt có sẵn của hệ điều hành/trình duyệt. Nếu chưa có giọng Việt, giao diện thông báo và vẫn cung cấp bản đọc; chưa có bản thuyết minh thu âm riêng. Một số giọng hệ thống có thể cần mạng.
- Đã kiểm tra bố cục trên trình duyệt ở 1920 × 1080, 1440 × 960, 1366 × 768 và 390 × 844. Cần thử tiếp trên bàn cảm ứng thật để đánh giá tầm với, góc nghiêng, độ chói và sử dụng theo nhóm. Ở cỡ chữ lớn, vùng nội dung có thể cuộn để tránh mất chữ.
- Đây là prototype học tập chạy cục bộ. Xem `assets/CREDITS.md` để biết nguồn và trạng thái quyền sử dụng ảnh; không mặc định ảnh được cấp phép tái xuất bản.

## Xem ảnh giao diện

- [Video Fly-to Ao Bà Om](preview/fly-to-ao-ba-om.webm)
- [Màn hình chờ toàn cảnh](preview/01-fly-overview.png)
- [Bản đồ](preview/02-ban-do.png)
- [Thẻ Ao Bà Om](preview/03-ao-ba-om.png)
- [Ao Bà Om sau khi camera đến nơi](preview/03-fly-focused.png)
- [Chọn câu chuyện](preview/04-chon-cau-chuyen.png)
- [Cảnh truyền thuyết](preview/05-cau-chuyen.png)
- [Bản đồ 1920 × 1080](preview/06-ban-do-1920.png)
- [Bản đồ 1366 × 768](preview/07-ban-do-1366.png)

## Kiểm tra

```powershell
node --test tests/session.test.cjs
node tests/browser-test.cjs
```

Kiểm tra trình duyệt dùng Chrome headless đã cài trên Windows; có thể đặt `CHROME_PATH` nếu Chrome ở vị trí khác. Không cần Playwright/npm install. Script tạo hồ sơ Chrome riêng trong `.browser-profile` và ảnh trong `preview`.

Kiểm tra tự động bao gồm: mở offline, DOM bản đồ được giữ nguyên, thứ tự và thời gian các bước fly-to, transform giữa chuyến bay, popup mở trễ, đóng/mở lại, hủy chuyến bay, giảm chuyển động, lọc marker, hai nhánh câu chuyện, panorama, quiz, trợ năng, xóa phiên, quá hạn thời gian và bố cục thích ứng. Các kiểm tra này không thay thế usability test với người dùng thật.

## Tệp chính

| Tệp | Mục đích |
| --- | --- |
| `index.html` | Điểm mở prototype |
| `styles.css` | Bố cục, màu sắc, trạng thái trợ năng và thích ứng kích thước |
| `map.css` | Bản đồ toàn cảnh, marker văn hóa, popup và bố cục thích ứng |
| `map.js` | Camera liên tục, các trạng thái fly-to, hủy chuyến bay và giữ nguyên DOM |
| `art.js` | Bản đồ, biểu tượng địa điểm và minh họa SVG tự thiết kế |
| `app.js` | Nội dung, điều hướng và các tương tác |
| `session.js` | Quy tắc thời hạn của nội dung |
| `server.js` | Máy chủ cục bộ tùy chọn, chỉ lắng nghe 127.0.0.1 |

Tài liệu nền và kịch bản: [thư mục tài liệu đề tài](../tai-lieu-de-tai/README.md).
