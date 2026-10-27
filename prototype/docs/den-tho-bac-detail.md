# Đền thờ Bác Hồ: bản demo trang chi tiết tương tác

> Hi?n tr?ng 27/10: T?ng quan 03 d?ng ?nh g?c m?i; hai nh?n tr?n ?nh Con ng??i v? n?n th?a ?? ???c b?; panel v? ghim Kh?ng gian d?ng ?en/tr?ng/??, panel g?c vu?ng. C?c m?c d??i l? l?ch s? tri?n khai. ?nh m?u c? v? ph?n l?n ?nh ki?m th? ?? ???c d?n theo [b?o c?o cleanup](cleanup-2026-10-27.md); [k? ho?ch hi?u ?ng m?i](den-tho-bac-motion-plan.md) ch?a ???c tri?n khai.

## Cập nhật 26/10: tờ lật có đường cong sát gáy

- Thay đường cắt hình chữ nhật bo góc bằng SVG Bézier của một trang, đối xứng trái/phải. Nội dung, nền kính và highlight được clip trong từng mặt; viền dùng cùng đường bao. Wrapper 3D, khung/gáy/viền ngoài, bốn tab và footer giữ đúng vai trò riêng.
- Kiểm tra hai chiều tại góc thực 0°, 45°, 90°, 135°, 180°; xác nhận vùng sát gáy/góc ngoài được cắt bằng hit-test trình duyệt. Build/TypeScript, 39 kiểm tra chuyển động và 95 kiểm tra chức năng/bố cục đều đạt. Đã xem lại ảnh dừng và cập nhật video 129 frame của ba lượt lật.
- [Video và ảnh dừng theo góc](../preview/values-page-turn-review.html). [Chi tiết đường bao](../src/assets/den-tho-bac/values-user/README.md).

## Cập nhật 26/10: footer chung cho cả sáu section

- Tổng quan, Lịch sử, Không gian, Con người, Hoạt động và Giá trị di sản dùng một kích thước footer chung. Bỏ các ghi đè riêng về chiều cao, khoảng đệm, cỡ icon và nút của Tổng quan/Lịch sử; thu gọn Tổng quan cho đồng bộ.
- Đơn vị footer độc lập với tỉ lệ nội dung từng section: cao 88px tại 1920×1080, co giãn cùng viewport. Nền `rgba(12,12,12,0.68)` và blur 8px chỉ trên footer, vẫn nhìn thấy nhẹ ảnh phía sau. Giữ viền trên mảnh, sáu chức năng, chữ/icon trắng và nút chọn đỏ dạng pill.
- 147 kiểm tra trình duyệt đạt trên 1774×887, Full HD, 4K, 1280×720, 1440×900 và mobile. Kiểm tra tọa độ/kích thước từng nút giữa cả sáu section, vùng chạm, tab ảnh, cuộn danh sách bản đồ và nội dung phía trên footer. TypeScript/build đạt. Đã đối chiếu ảnh chụp `preview/den-tho-bac-shared-footer-*.png`.
- Các ghi chép kích thước footer riêng của Lịch sử/Tổng quan bên dưới là lịch sử, được thay bằng cấu hình chung này.

## Cập nhật 26/10: ảnh gốc Tổng quan và panel sát footer

- Thay cả ba nền Tổng quan bằng đúng JPEG gốc được gửi, bỏ nền phục hồi và toàn bộ filter màu. Giữ chi tiết tự nhiên, tỷ lệ ảnh và scale phủ tối thiểu; từng ảnh có điểm căn riêng.
- Tab 01 dùng nhãn “CÂU CHUYỆN” và số lớn như 02/03. Sau phản hồi tiếp theo, xóa wrapper và pseudo-element nền cục bộ; dùng một gradient loang trên toàn hero, đậm vừa sau chữ và tan mềm theo cả hai chiều. Chỉ lớp gradient được blur; ảnh gốc và chữ vẫn sắc nét. Giữ chữ, CTA, tab, footer và chức năng.
- Panel trắng Không gian kết thúc sát đường viền trên footer, bỏ khe 16px theo yêu cầu mới nhất. Giữ bo hai góc dưới, chiều cao co giãn và cuộn danh sách bên trong.
- [Ảnh và cách căn Tổng quan](../src/assets/den-tho-bac/overview-remake/README.md). Các ghi chép nền phục hồi bên dưới là lịch sử; không còn mô tả nguồn ảnh đang dùng.
- TypeScript/build đạt; 193 kiểm tra Tổng quan và 100 kiểm tra Không gian đạt, gồm cảm ứng 4K, retry, tự chuyển, popup và cuộn bàn phím. Đã mở ảnh chụp cả ba tab và panel. Lighthouse Tổng quan 1774×887: hiệu năng 96, accessibility 100, best practices 100; LCP 1,4 giây, CLS 0, TBT 0ms. Ba hash ảnh gốc trùng manifest; 118 tệp di sản được bảo vệ không đổi.

## Cập nhật 26/10: một kiểu timeline chung theo mốc 1970

- Bảy năm dùng cùng khoảng cách trải ngang, đường phân cách phía trên, cỡ/độ đậm chữ, gạch đỏ dưới năm chọn và nút mũi tên tròn của mẫu 1970. Bỏ các ghi đè riêng cho nhóm 1969/1989/2012.
- Giữ chiều cao đường biên footer như mốc 1970 để timeline không nhảy vị trí khi chuyển năm. Ảnh, chữ số năm lớn, câu chuyện, nguồn và các chức năng giữ nguyên.
- Build và 320 kiểm tra Lịch sử đạt. Đối chiếu thêm 28 bố cục tại 1280px, 1672px, Full HD và 4K: tọa độ timeline, từng nút năm và đường biên footer trùng mốc 1970. 118 tệp di sản được bảo vệ không đổi. Ảnh kiểm tra: `preview/den-tho-bac-history-timeline-1672-*.png`.

## Cập nhật 26/10: sửa cấu trúc và chuyển động sách kính

- Giữ thiết kế lớn, bốn tab, nội dung và footer. Tách nền phòng, khung/gáy/viền, hai trang nội dung, một tờ lật hai mặt và bộ điều khiển. Bổ sung hai viền cong bên ngoài mảnh 1,1px; khung đứng yên.
- Một tờ tồn tại xuyên suốt component, quay liên tục quanh gáy trong 900ms bằng Web Animations API. Ảnh đích được tải và decode trước; nội dung front/back cố định. Tab đang chọn, URL và bộ đếm chỉ đổi sau khi animation hoàn tất; thao tác mới bị chặn trong lượt, không hủy animation cũ.
- Hai mặt ẩn mặt sau, back xoay 180°. Clip riêng nội dung bên dưới để chữ cũ không xuyên qua ảnh mới; bỏ ảnh toàn khung, border/bóng/blur khỏi tờ lật. Nền phòng vẫn nhìn xuyên qua kính.
- Đã quay chuyển động lật tới, lật lui và chọn tab, kèm các ảnh giữa lượt. [Xem video và ảnh kiểm tra](../preview/values-page-turn-review.html). [Cấu trúc và nguồn asset](../src/assets/den-tho-bac/values-user/README.md). Các mô tả chuyển động cũ bên dưới được thay bằng bản này.
- Panel Không gian đã được cập nhật tiếp: sát vạch footer, không còn khoảng hở 16px; giữ bo hai góc dưới và cuộn danh sách bên trong.
- 95 kiểm tra chức năng/bố cục sách và 25 kiểm tra chuyển động đạt; video 163 frame đã được mở phát lại trong Chrome. 100 kiểm tra Không gian đạt. TypeScript/build đạt, 118 tệp di sản được bảo vệ không đổi. Lighthouse sách 1672×941: 87/100/100, LCP 2,4 giây, CLS 0,001, TBT 0ms.

## Cập nhật 26/10: Không gian dùng bản đồ mới và tám mốc đã xác nhận

- Dùng nguyên ảnh sạch `mapmoi.webp` 2560×1440. Tám vị trí lấy từ các chấm đỏ trong bản đánh dấu cùng khung, tên ngắn đã được xác nhận: Đền thờ, Nhà trưng bày, Nhà đón tiếp khách, Hiện vật chiến tranh, Thuyền độc mộc, Nhà sàn Bác Hồ, Khuôn viên, Hồ sen.
- Tiết chế màu đỏ sau phản hồi: mốc trắng/viền đỏ, mốc chọn nền đỏ; thẻ trắng, chữ chính trung tính và số thứ tự nhấn đỏ. Không nhuộm đỏ cả panel, không chỉnh màu bản đồ hay footer.
- Panel desktop bo hai góc dưới, kết thúc sát vạch navigation; danh sách cuộn bên trong. Chọn một điểm hiện tóm tắt riêng, mở chi tiết đúng câu chuyện; giữ nhìn gần, kéo, bàn phím và cảm ứng.
- [Nguồn ảnh, bảng tọa độ và cách căn](../src/assets/den-tho-bac/map-current-README.md). Kiểm tra: `tests/den-tho-bac-spaces-test.cjs`; ảnh đối chiếu `preview/den-tho-bac-spaces-red-final-1920x1080-list.png` và `-pond.png`.
- 100 kiểm tra trình duyệt đạt ở tám kích thước 320px–4K, gồm chạm thật, tọa độ, tám popup và cuộn bàn phím. TypeScript/build đạt, 118 tệp di sản được bảo vệ không đổi. Lighthouse 1920×1080: 92/100/100; LCP 1,8 giây, CLS 0, TBT 0ms.

## Cập nhật 26/10: dựng lại ba nền Tổng quan theo mẫu

- Dùng nền trống đúng bố cục mẫu: 01 v3 (gỡ UI bằng built-in imagegen edit), 02–03 v2 có sẵn. Không import screenshot có chữ; chữ, nút, ba tab ngang và navigation giữ nguyên. Đủ chân cổng, tượng và bệ; bỏ phần nền đen bù ở hai mép.
- Ảnh, filter màu nhẹ và hai gradient trong suốt nằm trên các lớp riêng. Scale nhỏ nhất đủ phủ màn hình, điểm căn riêng cho từng ảnh, không zoom chuyển cảnh hoặc dùng ảnh lặp/blur hai cạnh. Footer chung không đổi.
- 181 kiểm tra chức năng trên 11 viewport 320px–4K và 30 kiểm tra bố cục trên năm viewport đạt. TypeScript/build đạt; 118 file trang di sản khác giữ nguyên SHA-256. Lighthouse 1774×887: 95/100/100, LCP 1,5 giây, CLS 0.
- [Trang kéo đối chiếu ba mẫu](../preview/overview-reference-review.html). [Nguồn nền, cách canh và prompt](../src/assets/den-tho-bac/overview-remake/README.md). Các mục cũ bên dưới lưu lịch sử thay đổi.

Khởi tạo 24/10/2026, cập nhật 26/10/2026. Trang riêng: `/den-tho-bac.html`. Chỉ thêm nội dung chi tiết cho địa điểm `den-tho-bac`; nối vào nút xem câu chuyện của ứng dụng bản đồ. Không thay trang chủ hoặc các trang di sản khác.

## Cập nhật: sách kính lớn hơn và lật hai mặt theo mẫu hiệu ứng

- Dùng trực tiếp `sach trong suot.png` 1893×831 có alpha thật làm khung sách. Giữ bốn ảnh/nội dung và footer sáu phần hiện tại; không dùng ảnh hướng dẫn hiệu ứng làm UI phẳng. Ở 1672×941, sách khoảng 1552×727: rộng hơn 14%, cao hơn 22% so với khung cũ.
- Xóa hàng câu hỏi cùng nút “Mở một góc nhìn khác”. Trang kính xoay 3D quanh gáy, có mặt trước/sau và ánh viền từ asset được cung cấp; đi tiếp lật phải sang trái, quay lại lật ngược. Chọn tab giữ gạch chân chuyển động đến đúng nhãn mới.
- Khi bấm liên tục, lượt mới thay lượt đang chạy và giữ nội dung cuối. Overlay không nhận thao tác, không có nút/ID lặp; CTA khóa ngắn trong lúc đổi nội dung rồi khôi phục. Tắt chuyển động và màn hẹp chuyển trực tiếp, giữ điều hướng bàn phím/cảm ứng.
- 94 kiểm tra trình duyệt ở tám kích thước 320px–4K đạt; TypeScript/build đạt. Bản WebP lossless có RGBA trùng từng pixel với PNG gốc, nhỏ hơn 35%. Bỏ preload ảnh Tổng quan cũ không còn dùng. Lighthouse 1672×941: 87/100/100, LCP 2,4 giây, CLS 0,001, TBT 0ms. Chi tiết nguồn: [values-user/README.md](../src/assets/den-tho-bac/values-user/README.md). Ảnh trước/đang/sau lật: `preview/den-tho-bac-values-glass-book-before-turn.png`, `-turning.png`, `-after-turn.png`.

## Cập nhật: Lịch sử theo UI toàn cảnh và bộ ảnh sửa năm

- Dựng lại bảy màn với năm trắng lớn, ảnh gốc toàn cảnh canh phải, nội dung trái, timeline năm/gạch đỏ và footer hiện tại. Đúng bộ ảnh sửa: 1969 tưởng niệm, 1970 người dân trước đền, 1971 cổng, 1972 đền dựng lại, 1975 cổng/tường bao, 1989 bằng công nhận, 2012 nhà sàn. Không dùng ảnh AI phục hồi hoặc năm cắt ghép cũ.
- Giữ ID nội bộ `1971–1972`, hiển thị 1972 gọn trên timeline. Reader riêng từng mốc mở đúng ảnh gốc sửa, giữ các tóm tắt/nguồn/giọng đọc đã có. Không còn dấu cộng hoặc blur trong chữ số.
- 299 kiểm tra trình duyệt ở chín kích thước 320px–4K đạt. TypeScript/build đạt; 118 tệp được bảo vệ không đổi. Nguồn và giới hạn khung ảnh: [history-immersive/README.md](../src/assets/den-tho-bac/history-immersive/README.md).

## Cập nhật mới nhất: Tổng quan dùng ba ảnh gốc, giữ chất liệu tự nhiên

- Thay cả ba nền phục hồi AI bằng JPEG nguyên bản: `01-photo-original.jpg` (2048×1366), `02-photo-original.jpeg` (2048×1536), `03-photo-original.jpg` (2560×1919). SHA-256 trùng các ảnh tương ứng trên Desktop. Không tạo ảnh mới, tăng nét, tăng màu, kéo giãn hoặc làm mờ ảnh.
- Canh ảnh theo những điểm thật trong ảnh gốc: đầu cờ và bậc đền; biển tên và chân cổng mô hình; đầu tượng và đáy bệ. Một ảnh duy nhất cho mỗi cảnh, mép phải đến cạnh màn hình; khoảng đọc tối bên trái chuyển mềm vào ảnh bằng gradient CSS. Không dùng ảnh nền phụ, dải ảnh nhân đôi hay blur ở hai mép. Cách này thay cho yêu cầu cover trước đó vì cover cắt mất bệ của ảnh 4:3.
- Giữ ba tab ngang, đồng hồ 12 giây, chuyển cảnh fade, chọn ảnh bằng chuột/chạm/bàn phím, nguồn, popup và footer sáu phần. Tab 03 có số/vạch đỏ nhưng tên ảnh trắng; công cụ nền đen trong suốt, viền trắng, không blur. Chỉ footer giữ blur 8px theo yêu cầu trước.
- Ở 1774×887: đầu tượng y≈256 (29%), tâm x≈1097 (62%), đáy bệ y≈784, footer y=795. Thấy đủ đầu, thân, chân và bệ. Góc chụp ảnh gốc khác nền mẫu, nên tượng lệch phải khoảng 71px và đáy bệ thấp hơn khoảng 25px so với mẫu; không tái tạo phối cảnh để giả khớp 100%. Nâng công cụ 12px để tránh che dòng chữ thật trong ảnh.
- 181 kiểm tra trình duyệt đạt trên 11 viewport từ 320px đến 4K. TypeScript và build đạt. Lighthouse 1774×887: Performance 91, Accessibility 100, Best Practices 100; LCP 1,9 giây, CLS 0, TBT 0ms. 118 tệp được bảo vệ không đổi.
- Ảnh đối chiếu cả ba tab: `preview/den-tho-bac-overview-reference-1774x887-01.png`, `02.png`, `03.png` cùng tiền tố. Chi tiết nguồn và cách canh: [overview-remake/README.md](../src/assets/den-tho-bac/overview-remake/README.md).

## Cập nhật: Người giữ đền theo mẫu giuden.png

- Dùng đúng vùng ảnh nhân chứng từ `giuden.png`: cột trái hẹp, ảnh rộng bên phải, nhãn NHÂN CHỨNG bằng HTML, nền toàn cảnh tối phía sau. Chuyển câu hỏi về dưới nút đọc ở cột trái; bổ sung nhãn câu chuyện báo chí và dấu chấm đỏ sau tên như mẫu.
- Bộ chọn hai câu chuyện vẫn là cùng node DOM và cùng tọa độ. Cột đầu, tiêu đề và khoảng cách chung được canh đồng bộ cho cả Người giữ đền và Nét vẽ ký ức; ảnh chân dung mới của tab Nét vẽ được giữ nguyên.
- Ảnh chính giữ đủ ba người, tay và chân, không blur. Vùng x405/y244/w1212/h613 được cắt bằng CSS từ mẫu; không tạo lại gương mặt hay chỉnh sửa ảnh bằng AI. Chỉ nền phía sau dùng lại ảnh đã phục hồi trước đây và làm dịu như mẫu.
- Giữ footer sáu phần và ba công cụ hiện tại; khoảng dọc được nén nhẹ để ảnh, chú thích, câu hỏi và nút đọc cùng nằm phía trên footer. Popup tiếp tục dùng ảnh báo chí gốc, giọng đọc theo yêu cầu và trả focus về nút đọc khi đóng.
- 120 kiểm tra trình duyệt đạt ở chín kích thước từ 320px tới 4K, gồm ảnh đúng mẫu, đủ khung, các vùng quan trọng không bị che, bộ chọn cố định, bàn phím, cảm ứng, popup, giảm chuyển động và thử lại ảnh. 70 kiểm tra footer chung tiếp tục đạt. TypeScript và build đạt.
- Ảnh và thông tin xử lý: [people-user/README.md](../src/assets/den-tho-bac/people-user/README.md). Ảnh đối chiếu: `preview/den-tho-bac-people-witness-1672x941.png`.

## Cập nhật: Giá trị di sản thành bốn trang sách, giữ footer hiện tại

- Bốn mẫu được dựng thành `ValuesSection` với trang ảnh trái, tiêu đề chữ hẹp và nội dung bên phải, khe sách và nền kính bằng CSS. Tên bốn trang: Lòng kính yêu, Sức mạnh cộng đồng, Giá trị lịch sử, Tiếp nối hôm nay.
- Ảnh của từng mẫu được hiển thị bằng vùng cắt CSS đúng x194/y196/w600/h407. Tất cả chữ, nút, tab, bộ đếm và liên kết đều là HTML thật. Nền phòng trưng bày được phục hồi bằng công cụ imagegen từ mẫu 03. Footer trong ảnh hoàn toàn không được dùng; chỉ footer chung sáu phần của ứng dụng hiển thị.
- Các nút đọc và điều hướng nối tới nội dung dựng đền, Người giữ đền, Lịch sử và câu chuyện học hỏi đã có. Trước/sau quay vòng qua bốn trang; chọn bằng cảm ứng, phím trái/phải, Home/End. `value=affection|community|history|continuity` mở trực tiếp từng trang, trạng thái được giữ khi sang section khác rồi quay lại.
- 85 kiểm tra trình duyệt đạt ở tám kích thước từ 320px tới 4K: đúng ảnh, chuyển trang, bốn CTA, một footer duy nhất, nội dung không chồng nút, focus và giảm chuyển động. 70 kiểm tra footer chung tiếp tục đạt.
- Lighthouse 4K: Performance 93, Accessibility 100, Best Practices 96; LCP 1,7 giây, CLS 0,001, TBT 0 ms. Điểm còn hạn chế là ảnh trang trái chỉ có khoảng 600×407 trong mẫu gốc, thấp hơn kích thước khi phóng 4K. Không tự tạo chi tiết ảnh tư liệu bằng AI. Ảnh, prompt và nguồn: [values-user/README.md](../src/assets/den-tho-bac/values-user/README.md).

## Lịch sử thay đổi: nền Tổng quan phục hồi từ mẫu (đã được thay bằng ảnh gốc)

- Xác định nền cũ `03333.jpg` là ảnh 4:3, khác phối cảnh mẫu 03. Thay nền 02–03 bằng bản ngang 1774×887 gỡ UI từ các mẫu được cung cấp; màn 01 dùng lại nền ngang đã phục hồi trong dự án. Giữ tất cả ảnh gốc để đối chiếu.
- Canh một lớp nền duy nhất dựa trên tỷ lệ ảnh, tâm chủ thể và giới hạn đáy footer, không áp dụng cover mù. Ở 1774×887: tâm tượng x≈1026, đỉnh đầu y≈261, đáy bệ y≈759, footer bắt đầu y=795. Có đủ đầu, thân, chân và bệ, không dải ảnh phụ hay blur hai mép.
- Chữ 03, tiêu đề hai dòng trắng/đỏ, CTA, ba tab nằm ngang và cụm công cụ được canh theo mẫu. Tab 03 có tên trắng; số và vạch đỏ. Có gradient đọc chữ trái và phía dưới. Footer vẫn dùng chức năng hiện tại; chỉ Tổng quan được canh khoảng cách theo mẫu.
- 167 kiểm tra Tổng quan đạt: chu kỳ 12 giây, tạm dừng/tiếp tục, chọn tay, lỗi/thử lại, giảm chuyển động, native touch 4K, khung nền tại 11 kích thước và kiểm tra tọa độ tượng/bệ. Lighthouse 1774×887: Performance 96, Accessibility 100, Best Practices 100; LCP 1,4 giây, CLS 0, TBT 10 ms.
- Đã chụp trước/sau ở viewport yêu cầu. Những vùng nền từng bị UI che được AI phục hồi; nét chữ HTML và vạch tiến trình đang chạy có thể khác ảnh tĩnh, không tuyên bố khớp từng pixel. Tài liệu asset và prompt: [overview-remake/README.md](../src/assets/den-tho-bac/overview-remake/README.md).

## Cập nhật: Hoạt động thành bốn cột ảnh theo mẫu được cung cấp

- Dựng `ActivitiesSection` theo `hd lam lai.png`: nền tối, tiêu đề trắng/đỏ, bốn cột ảnh cao ngang hàng, nhãn đỏ, nút mũi tên viền trắng và số 26 / 19 / 02 / 03 lớn ở cuối ảnh. Giữ dòng gợi ý tham quan và footer sáu phần phủ đáy màn hình.
- Bộ ảnh mới ghép theo đúng nội dung: 26/01 dùng `New folder/1031970.jpg`; 19/05 dùng `1905.jpg`; 02/09 dùng `0209.jpg`; ba điều để nhớ dùng `03 dieu.jpg`. Không dùng ảnh chân dung `anh bac.png` hoặc ảnh mô hình `022.png` cho bốn cột này.
- Lưu nguyên bản, chuyển WebP, không tạo ảnh bằng AI hoặc làm mờ. Canh ảnh bàn thờ và tượng Bác phía dưới phần chữ, hòa mép trên bằng mặt nạ trong suốt. Lớp gradient tối giúp đọc nội dung; không có blur. Ảnh gốc, nguồn và SHA-256 tại `src/assets/den-tho-bac/activities-user`.
- Mỗi cột mở câu chuyện riêng, dùng đúng ảnh của cột đó, có ba ý tóm tắt, nghe theo yêu cầu, nội dung mở rộng và nguồn tư liệu. Các câu chuyện cũ vẫn tồn tại cho Lịch sử và những section khác. Đóng cửa sổ trả focus về đúng nút vừa chọn.
- Chuyển cảnh xuất hiện ngắn, lần lượt giữa bốn cột; không tự phát nội dung. Chế độ giảm chuyển động tắt hiệu ứng. Ảnh lỗi có nút thử lại và vẫn đọc được câu chuyện.
- 48 kiểm tra trình duyệt đạt: tám kích thước từ 320px tới 4K, bốn ảnh và câu chuyện đúng cột, không tràn ngang, bố cục ngang desktop, vùng chạm, popup, focus, cảm ứng thật, giảm chuyển động và thử tải lại ảnh. 70 kiểm tra footer chung tiếp tục đạt. TypeScript, build và kiểm tra khoảng trắng đạt; 118 tệp di sản được bảo vệ không thay đổi.
- Lighthouse 4K: Performance 88, Accessibility 100, Best Practices 100; LCP 2,3 giây, CLS 0,021, TBT 0 ms. Báo cáo cục bộ tại `.browser-profile/den-tho-bac/activities-lighthouse.json`.

## Cập nhật: hai tab Con người dùng chung bộ chọn phía trên bên trái

- Hai câu chuyện dùng cùng `PeopleSection`: tiêu đề, cột trái và bộ chọn dọc luôn tồn tại tại một vị trí. Chọn Người giữ đền / Nét vẽ ký ức chỉ thay phần nội dung; không chuyển bộ chọn từ dưới lên trên. Nút hiện tại có vạch đỏ, nền sáng nhẹ và mũi tên như mẫu Nét vẽ ký ức.
- Người giữ đền: tên nhân chứng, tóm tắt và nút đọc dưới bộ chọn; toàn ảnh ba nhân vật chiếm hai cột phía phải, chú thích và câu hỏi nằm dưới ảnh. Nét vẽ ký ức: giữ ảnh tư liệu dưới bộ chọn, ảnh họa sĩ ở giữa và nội dung bên phải. Cả hai dùng chung nền tối, chữ trắng/đỏ và hệ khoảng cách.
- Ảnh gốc và ảnh minh họa đã có được giữ nguyên; không tạo ảnh mới, không làm mờ hay zoom ảnh. Chuyển cảnh ngắn chỉ áp dụng cho nội dung. Footer sáu phần vẫn phủ đáy màn hình, nội dung không bị che.
- Bộ chọn giữ nguyên node và focus khi chuyển tab; hỗ trợ chuột, chạm, phím lên/xuống, Home/End và URL `person=portrait`. Dự phòng khoảng scrollbar để nội dung dài không đẩy lệch vị trí hai nút.
- 108 kiểm tra trình duyệt đạt ở tám kích thước từ 320px tới 4K: tọa độ hai nút giữ nguyên với sai số dưới 0,5px, bộ chọn không bị tạo lại, ảnh đủ khung, vùng chạm, chuyển tab thật bằng cảm ứng, điều hướng bàn phím, popup đúng nội dung, focus, giảm chuyển động và thử tải lại ảnh lỗi.
- 70 kiểm tra footer chung tiếp tục đạt; build và TypeScript đạt, 118 tệp được bảo vệ không đổi. Lighthouse 4K màn Người giữ đền: Performance 93, Accessibility 100, Best Practices 100; LCP 1,7 giây, CLS 0,002, TBT 0 ms.

## Cập nhật: footer tối trong suốt dùng chung sáu phần

- Thay footer trắng bằng `rgba(12,12,12,0.38)`, `position: absolute`, `bottom: 0`, `width: 100%`, viền trắng mảnh phía trên. Chỉ footer mới dùng `backdrop-filter: blur(8px)`; ảnh Tổng quan tiếp tục là một background `cover` căn giữa, không ảnh nền phụ hoặc blur hai mép.
- Toàn bộ icon và chữ điều hướng trắng. Mục hiện tại đỏ dạng pill; năm mục còn lại nền trong suốt. Giữ sáu chức năng và trạng thái chọn theo `aria-current`, không thay đổi nội dung/ảnh hay hành vi điều hướng.
- Main/background phủ hết viewport, footer chồng lên nội dung nền. Chừa khoảng cho timeline, bảng điểm ghé, nút đọc và phần chân trang của câu chuyện để không bị footer che. Khung ảnh nhân chứng cùng câu hỏi giữ vị trí đọc rõ như trước. Ba tab 01–02–03 vẫn cùng hàng ngang phía trên footer.
- Style dùng chung tại `src/features/den-tho-bac/detail-navigation.css`, không còn một bản footer riêng chỉ áp dụng cho Tổng quan. Ở màn hẹp, sáu nút vẫn nằm trong dải điều hướng cuộn ngang.
- Xác nhận: 70 kiểm tra footer trên cả sáu phần và 90 kiểm tra hồi quy hai tab Con người đạt; các điều khiển vẫn chạm được phía trên footer. Build, TypeScript đạt; 118 tệp được bảo vệ không đổi. Lighthouse 4K: Performance 89, Accessibility 100, Best Practices 100; LCP 2,2 giây, CLS 0, TBT 0 ms.

## Cập nhật: ảnh Tổng quan phủ kín, không làm mờ

- Cả ba ảnh dùng một lớp background phủ kín viewport với `background-size: cover`, `background-position: center`, `background-repeat: no-repeat`; áp dụng cho desktop thường, 4K, khung rộng và khung hẹp. Bỏ các khung canh riêng và mặt nạ ở hai mép ảnh.
- Xóa hẳn lớp ảnh phụ `db-overview-ambient` khỏi DOM và CSS. Bỏ blur của ảnh, cụm công cụ và navigation; chỉ giữ gradient tối trong suốt bên trái. Không có dải ảnh phụ, blur hay khoảng trống ở hai mép.
- Bỏ đường phân cách dọc trang trí trên navigation. Nội dung, vị trí chữ/nút, ba mục 01–02–03 nằm ngang và toàn bộ chức năng tự chuyển/chạm chọn/đọc câu chuyện giữ nguyên.
- Background có mô tả ảnh truy cập được bằng `role="img"` và `aria-label`; tải và giải mã ảnh trước khi chuyển cảnh, giữ trạng thái lỗi cùng nút thử lại.
- Xác nhận 147 kiểm tra trình duyệt đạt, gồm phủ kín/căn giữa ở mười kích thước, không có filter/backdrop-filter ở Tổng quan, ba mục cùng hàng ngang, tự chuyển, chạm thật và popup. Build, TypeScript đạt; 118 tệp được bảo vệ không đổi. Lighthouse 4K: Performance 89, Accessibility 100, Best Practices 100; LCP 2,2 giây, CLS 0, TBT 0 ms.

## Ghi nhận lần chỉnh trước: Tổng quan 01–02–03 theo mẫu trắng/đỏ

- Dựng lại ba màn theo các mẫu mới: tiêu đề trắng/đỏ bằng Montserrat, số trắng đậm và số tab đang chọn màu đỏ, nút viền trắng bo tròn; cụm Nguồn tư liệu / Toàn màn hình / Đóng dùng nền tối, viền trắng. Không có header toàn chiều ngang, nút play/stop hay hàng chú thích.
- Ảnh phủ toàn bộ viewport, gồm cả phía sau navigation. Navigation nền tối, tab Tổng quan đỏ bo tròn; cách trình bày này chỉ áp dụng khi ở Tổng quan. Các section khác giữ bố cục hiện có.
- Thay ba nền AI cũ bằng ảnh gốc mới được cung cấp; giữ bản gốc và chuyển WebP quality 88 cho web. Canh ảnh riêng bằng CSS để thấy cột cờ, mái đền, biển cổng, toàn bộ tượng và câu chữ phía trên. Màn 03 giữ tỷ lệ ảnh và hòa mép, không phóng tượng để lấp chiều ngang. Ở màn dọc, toàn ảnh nằm phía trên chữ.
- Giữ tự chuyển 12 giây và một đồng hồ RAF cho tiến trình; chạm ảnh đang chọn để dừng/tiếp tục, chọn ảnh khác bắt đầu lượt mới. Cửa sổ đọc và nguồn, điều hướng lịch sử, chạm thật ở 4K, giảm chuyển động và khôi phục ảnh lỗi được kiểm tra trong `tests/den-tho-bac-overview-test.cjs`: 147 kiểm tra đạt.
- Bố cục 4K, 1920×1080, 1280×720, màn ngang rộng/thấp và khung dọc đều được chụp đối chiếu. 118 tệp Bảo tàng, Cồn Chim, Ao Bà Om được bảo vệ không đổi. Ảnh gốc, tác vụ định dạng và nguồn đối chiếu: [overview-remake/README.md](../src/assets/den-tho-bac/overview-remake/README.md).
- Build Vite và TypeScript đạt. Lighthouse desktop 3840×2160: Performance 88, Accessibility 100, Best Practices 100; LCP 2,3 giây, CLS 0, TBT 0 ms. Bản kiểm tra tại `.browser-profile/den-tho-bac/overview-remake-lighthouse.json`.

## Cập nhật: Con người, tab Nét vẽ ký ức

- Bố cục theo `ve.png`: tiêu đề trắng/đỏ ở trên, ba cột chia bằng đường mảnh. Cột trái gồm hai tab dọc và ảnh chân dung Bác Hồ; cột giữa là ảnh cận họa sĩ; cột phải là nội dung, CTA viền trắng và chú thích tư liệu.
- Hai tệp `1.jpg`, `2.jpg` được giữ nguyên. Ảnh tư liệu đen trắng hiển thị đủ khung cùng dấu ảnh; popup dùng ảnh phỏng vấn gốc. Ảnh cận lấy đúng vùng ảnh của mẫu bằng CSS, không tạo hoặc chỉnh sửa gương mặt bằng AI. Tác giả ảnh ghi theo chú thích mẫu, không tự bổ sung ngày chụp hoặc URL bài báo. Chi tiết: [portrait-user/README.md](../src/assets/den-tho-bac/portrait-user/README.md).
- Chuyển tab có hòa ảnh và nội dung xuất hiện nhẹ, không zoom chuyển động. Giữ popup đọc/nghe, các công cụ nổi và navigation. Có thể mở trực tiếp tab bằng `/den-tho-bac.html?section=people&person=portrait`; lựa chọn tab được giữ khi tải lại.
- Kiểm tra trình duyệt: 90 kiểm tra đạt cho cả hai tab, gồm khung ngang 4K/1920/1280, khung ngang rộng/thấp, màn hẹp, tỷ lệ ảnh, vùng chạm, nội dung câu chuyện, ảnh gốc trong popup, focus, giảm chuyển động và tải lại ảnh lỗi. Build và TypeScript đạt; 118 tệp được bảo vệ không đổi.
- Lighthouse desktop 3840×2160: Performance 95, Accessibility 100, Best Practices 96; LCP 1,5 giây, CLS 0,002, TBT 0 ms. Cảnh báo duy nhất của Best Practices là độ phân giải ảnh cận từ mẫu khi phóng lên màn 4K; giữ nguyên ảnh được cung cấp, không nội suy ảnh để tăng điểm.

## Cập nhật: Con người, tab Người giữ đền

- Dựng lại tab đầu theo `Three Witnesses of Living Memory.png`: ảnh phủ vùng nội dung, headline ba dòng trắng/đỏ bên trái, tên và đoạn giới thiệu nhân chứng, nút viền trắng Mở câu chuyện, hai tab dưới đường kẻ cùng câu hỏi gợi mở bên phải.
- Ảnh chính hiện trọn khung và giữ đúng tỷ lệ ở 4K, 1920×1080, 1280×720 và các khung hẹp; thấy đủ ba người, cánh tay và bàn chân. Chuyển cảnh hòa ảnh ngắn, không zoom. Khi màn dọc, ảnh nằm trên chữ; nút và tab vẫn trong vùng nhìn thấy.
- Chữ, CTA và tab là phần tử tương tác thật. Cửa sổ mở đúng câu chuyện Phan Văn Tiềm; đóng trả focus về CTA. Tab Nét vẽ ký ức giữ bố cục hiện có và mở câu chuyện riêng. Cụm công cụ nổi cùng navigation sáu phần giữ nguyên.
- AI chỉ xử lý gỡ phần UI in trên ảnh mẫu, bản gốc được lưu riêng. Ghi rõ ảnh minh họa trên màn; cửa sổ đọc vẫn giữ ảnh báo chí gốc. Nguồn tư liệu giải thích cách xử lý. Tệp, chế độ và prompt đầy đủ: [people-user/README.md](../src/assets/den-tho-bac/people-user/README.md).
- Kiểm tra trình duyệt thật bằng `tests/den-tho-bac-people-test.cjs`: toàn ảnh, vùng chạm, chữ không che mặt/tay/chân, hai tab, popup và focus, chạm thật, giảm chuyển động và tải lại ảnh lỗi. Ảnh đối chiếu lưu trong `preview/den-tho-bac-people-*`.
- Kết quả: 53 kiểm tra trình duyệt đạt; build Vite và TypeScript đạt. Lighthouse desktop ở 3840×2160: Performance 92, Accessibility 100, Best Practices 100; LCP 1,8 giây, CLS 0, TBT 0 ms. 118 tệp Bảo tàng, Cồn Chim và Ao Bà Om trong danh sách bảo vệ không đổi.

## Đọc brief

Một màn hình tương tác đặt cố định, ngang 4K, hỗ trợ du khách khám phá di tích và kể chuyện số. Người dùng yêu cầu sáng hơn các bản trước, bố cục đa dạng theo 16 ảnh tham chiếu. Dùng React, CSS riêng, Lucide và phông chữ đã có trong dự án. DESIGN_VARIANCE 6, MOTION_INTENSITY 3, VISUAL_DENSITY 5: đa dạng bố cục trong cùng hệ chữ, màu và điều hướng.

Hệ màu trắng ngà / chữ đen / đỏ, với màu đất và xanh ở các thẻ giá trị theo mẫu người dùng gửi. Ảnh Không gian hiện dùng nguyên `map.png` được cung cấp, chỉ đổi định dạng WebP, không lọc sáng/màu. Tiêu đề Montserrat Black, phần đọc Be Vietnam Pro. Không thêm lớp tối hoặc blur. Tổng quan dùng màu và bố cục của ba ảnh gửi, tự chuyển 12 giây có tạm dừng theo yêu cầu mới; các section khác không tự chuyển nội dung.

## Chuyển các ảnh tham chiếu thành sáu màn phù hợp

| Màn | Mẫu tham chiếu | Cách triển khai |
| --- | --- | --- |
| 01 Tổng quan | Bộ màn hình 01, 02, 03 do người dùng cung cấp | Trình chiếu toàn ảnh theo đúng tỷ lệ, tự chuyển 12 giây hoặc chạm chọn. Các lối vào in trên ảnh có nút HTML thật; hòa ảnh và chuyển động ngắn. Có tạm dừng, trước/sau, nguồn, toàn màn hình và các điều khiển host. |
| 02 Lịch sử hình thành | Bộ 7 ảnh 69, 70, 71, 72, 75, 89, 12 do người dùng cung cấp | Tổ hợp ảnh và số năm gốc phía phải; chữ, CTA và timeline tương tác phía trái/dưới. Bảy mốc từ 1969 đến 2012 có hòa ảnh và hiệu ứng riêng, giữ phím trái/phải/Home/End. |
| 03 Không gian di tích | `map.png` với sáu dấu cộng và nhãn có sẵn | Giữ toàn ảnh ở đúng tỷ lệ 3:2, đặt nút thật trên 01, 02, 04, 05, 06, 07. Bảng nội dung bên trái, ảnh rộng sát phải, không che nhãn. Mỗi địa điểm có hai gợi ý quan sát, câu hỏi, đọc/nghe, nhìn gần và hiệu ứng riêng. Có phóng/kéo, đặt lại và chuyển điểm trước/sau. |
| 04 Con người & ký ức | Ảnh 5, 6, 13: một đối tượng làm trọng tâm, câu chuyện chọn riêng | Ảnh nhân chứng lớn, hai lựa chọn câu chuyện, phần gợi mở câu hỏi. Tên và ảnh nhân chứng được đối chiếu từ báo chí. |
| 05 Hoạt động tưởng niệm | Ảnh 1, 8: cột nội dung, ngày lớn, đường chia dọc | Bốn cột gợi nhắc ngày khánh thành, sinh nhật Bác, 2/9 và ba điều cho mỗi chuyến ghé. Không giả lập lịch đặt chỗ, khung giờ hay lễ hội chưa xác minh. |
| 06 Giá trị di sản | Ảnh 10, 15, 16: ảnh và chủ đề để tự chọn | Ba thẻ ảnh lệch nhịp; mỗi lựa chọn có một điều mang theo và một câu chuyện để mở tiếp. |

Màu sắc, cách chia cột, nhịp ảnh và trục thời gian được học từ ảnh gửi. Nội dung ở các ảnh tham chiếu, như lễ hội Ok Om Bok, mốc bảo tàng nước ngoài, núi và hình ảnh phim, không được đưa vào nội dung Đền thờ Bác. Các nhãn section và chú thích nguồn phục vụ định hướng của kiosk; không áp dụng các giới hạn dành riêng cho landing page tiếp thị.

## Thao tác cho khách

- Sáu section độc lập, chuyển trực tiếp hoặc dùng trước/tiếp. Nút luôn ở cùng vùng phía dưới; phần cuối có điểm kết thúc rõ.
- Dòng thời gian, chi tiết trên ảnh, câu chuyện con người và thẻ giá trị có trạng thái lựa chọn thật. Chuyển section giữ lựa chọn.
- Các mốc 01 Đền thờ, 02 Ao nước, 04 Nhà trưng bày, 05 Hiện vật, 06 Khuôn viên, 07 Nhà sàn theo đúng `map.png`. Nút ảnh và danh sách chọn cùng nội dung. Phần Hiện vật gợi ý cách đọc chú thích và đặt câu hỏi, không tự tạo danh mục hoặc niên đại đồ vật.
- Yêu cầu mới nhất giữ ảnh kèm các dấu trong ảnh được ưu tiên: khôi phục 03 Tán cây & lối đi. Ảnh nền phủ section theo tỷ lệ gốc, không kéo méo; vùng cắt được tính theo tọa độ cao/thấp nhất của các điểm để luôn giữ nút trong màn. Bảy tâm nút được kiểm tra bằng hit-test thực để bảo đảm bảng nổi không che. Khung nhỏ hiển thị trọn ảnh và đặt bảng thông tin xuống dưới; cột grid được giới hạn theo viewport để mốc bên phải không tràn khỏi màn.
- Ảnh và mốc không gian luôn nằm trong cùng lớp biến đổi khi phóng/kéo; không đổi tọa độ mốc. Kéo chỉ kích hoạt khi đã phóng; nút chọn địa điểm không kích hoạt kéo. `ResizeObserver` có cleanup. Hiệu ứng phản hồi lựa chọn, chuyển ảnh, chuyển câu chuyện và phóng/kéo tôn trọng chế độ giảm chuyển động.
- Lịch sử có bảy mốc cùng một hàng, trước/tiếp và phím trái/phải/Home/End. Trên khung hẹp, timeline cuộn ngang để hiện lựa chọn. Dấu cộng trên hình và CTA mở câu chuyện liên quan.
- Lịch sử dùng chính tổ hợp ảnh/năm người dùng gửi, không tạo lại ảnh. Chữ giới thiệu và các nút là HTML, nội dung dài nằm trong cửa sổ đọc. Phân biệt sự kiện lịch sử được đối chiếu với niên đại ảnh thành phần chưa xác minh.
- Cửa sổ đọc bằng `dialog` gốc: focus, Escape, nền không tương tác và trả focus. Ba ý chính trước; thông tin dài và nguồn mở tùy chọn.
- Giọng đọc thiết bị chỉ phát khi khách chọn nghe, có nút dừng; đóng câu chuyện hoặc chuyển sang tab ẩn dừng giọng đọc. Giọng đọc không bị gán là tiếng nhân chứng.
- Phóng ảnh để quan sát, có chú thích và nguồn; lỗi ảnh giữ phần chữ và cho thử lại.
- Địa chỉ có `?section=history` hoặc `?section=spaces`; có thể mở câu chuyện bằng `?story=stilt-house`. Không yêu cầu tài khoản.
- Bản iframe trao đổi với host bằng channel riêng `den-tho-bac-detail`, kiểm tra origin và source; phóng/thu và đóng giữ nguyên iframe cho tới khi khách đóng chi tiết.

## Phạm vi tư liệu

Các mốc dùng trong demo: khởi công 10/3/1970, khánh thành lần đầu 26/1/1971, xếp hạng quốc gia năm 1989, phiên bản nhà sàn năm 2012 tỷ lệ 97%. Nguồn chính:

- [Cục Du lịch Quốc gia Việt Nam, bài Bùi Anh Đức / Nhân Dân, 05/09/2022](https://www.dulichvn.org.vn/index.php/item/chuyen-xay-giu-den-tho-bac-ho-trong-khang-chien-51088).
- [Báo Công an nhân dân, 02/05/2023](https://cand.vn/Tieu-diem-van-hoa/den-tho-bac-ho-o-tra-vinh-tam-long-sat-son-cua-nhan-dan-nam-bo-i691437/). Ngày được kiểm tra từ `article:published_time`, không suy ra từ tên ảnh.
- [Hồ sơ điểm đến trên Tuổi Trẻ](https://sso.tuoitre.vn/su-kien/binh-chon-diem-den/thong-tin-dia-diem/khu-di-tich-lich-su-den-tho-chu-tich-ho-chi-minh.pdf), không ghi ngày trong tài liệu.
- [Đại học Trà Vinh: hoạt động báo công tháng 5/2023](https://www.tvu.edu.vn/tuoi-tre-truong-dh-tra-vinh-bao-cong-dang-bac/).
- [Cổng thông tin Đảng bộ địa phương: lễ báo công ngày 2/9 tại Long Đức](https://duyenhai.vinhlong.dcs.vn/pho-bi-thu-tinh-uy-lam-minh-dang-du-le-bao-cong-dang-bac-voi-phuong-long-duc-1008727.ngn).

Không dùng các nhân vật, trống đồng, số thống kê hoặc lời trích chưa có nguồn trong dữ liệu chi tiết cũ. Không thêm ảnh lịch sử giả: ảnh công trình về sau được phân biệt với thời điểm mốc lịch sử. Không đưa mốc khánh thành lần hai năm 1972 vào trục chính vì các bài đã đối chiếu ghi ngày khác nhau. Phiên bản nhà sàn được ghi rõ là tái hiện, không phải nơi Bác từng sống tại Long Đức.

Văn hóa và thiên nhiên được lồng vào không gian, hoạt động tưởng niệm và giá trị di sản. Không ép thêm du lịch cộng đồng hoặc lễ hội theo mùa vốn thuộc các điểm đến khác. Hướng dẫn quan sát và câu hỏi mở là phần biên soạn của bản trải nghiệm, không phải lời trích của nhân chứng hoặc nội quy chính thức. Các ngày trên màn hoạt động được ghi rõ là dịp gợi nhắc, không phải thông báo sự kiện sắp tới.

Nguồn và kích thước năm ảnh: [README tư liệu](../src/assets/den-tho-bac/README.md).

Hai lớp tiền cảnh lịch sử mới dùng ảnh minh họa có alpha, tạo bằng image_gen tích hợp từ hai ảnh gốc. Vì công cụ tái dựng một số chi tiết, UI ghi rõ là minh họa từ ảnh tư liệu về sau và dẫn nguồn ảnh gốc; không trình bày thành ảnh chụp sự kiện. Năm ảnh JPEG trong trang đọc và phần Không gian giữ nguyên. Tệp, prompt đầy đủ và giới hạn sử dụng được lưu trong README tư liệu và `history-art-prompts.json` cùng thư mục.

## Xác minh và xem trước

Chạy `node node_modules/typescript/bin/tsc --noEmit`, build production và `node tests/den-tho-bac-test.cjs`.

Bộ kiểm tra mở sáu màn ở 3840×2160, 1920×1080, 1280×720, 768×1024, 390×844 và 320×720; kiểm tra hình học vùng chạm, điều hướng, lựa chọn, đọc/nghe, Escape/focus, nguồn, lỗi ảnh/thử lại, reduced motion và tích hợp bản đồ thực. Riêng lịch sử kiểm tra cả bốn cảnh ở ba độ phân giải ngang, chọn năm, nút trước/tiếp, phím mũi tên và sự kiện chạm ở 4K. `--flows-only` bỏ vòng kiểm tra hình học sáu màn; `--skip-host` bỏ phần tích hợp để kiểm tra độc lập.

Ảnh xem trước nằm tại `preview/den-tho-bac-{1920|3840|1280}-{overview|history|spaces|people|activities|values}.png`. Bốn cảnh lịch sử: `preview/den-tho-bac-history-{1970|1971|1989|2012}.png`. Báo cáo Lighthouse: `.browser-profile/den-tho-bac/lighthouse.json`, và `history-lighthouse.json` cho bố cục lịch sử mới. Bản chụp SHA-256 của 118 file trang di sản đang có: `.browser-profile/den-tho-bac/preserved-baseline.json`.

Các phép đo ở localhost là kiểm tra kỹ thuật. Cần xem tiếp phản hồi của người dùng và thử trên màn lắp đặt thực tế để đánh giá mức hấp dẫn, khoảng cách đọc và vị trí vùng chạm.

Kết quả bản bàn giao: TypeScript và build production qua; sáu section vừa màn và các luồng đọc/nghe, nguồn, ảnh, phóng/thu, đóng/mở qua. Đã phát sự kiện chạm thực qua Chrome ở 4K để kiểm tra thanh chuyển mục và điểm quan sát. Đối chiếu SHA-256: 118 file trang di sản trước đó không thay đổi. Lighthouse tại localhost, 3840×2160, DPR 1: performance 99, accessibility 100, best practices 100; LCP 0,9 giây, CLS 0,001; không có lỗi console hoặc lỗi tương phản.

Cập nhật lịch sử theo mẫu `163355`: bốn cảnh trên timeline ngang đều vừa khung tại 3840×2160, 1920×1080 và 1280×720. Kiểm tra chọn năm, điểm kết thúc, nút mốc trước/tiếp, phím mũi tên, dấu cộng mở đúng câu chuyện và sự kiện chạm 4K đều qua. Bộ kiểm tra toàn bộ sáu màn và tích hợp bản đồ vẫn qua. Lighthouse cho riêng `?section=history`: performance 99, accessibility 100, best practices 100; LCP 0,9 giây, CLS 0,002.

Cập nhật điểm không gian theo ảnh `194112`: sáu nút trên ảnh tương ứng năm địa điểm; giữ nguyên tọa độ 01 và 02. Nhà sàn ở phía dưới bên phải, nhà trưng bày ở phía trên, hai điểm khuôn viên ở bên trái ao và phía phải ngôi đền. Kiểm tra vùng chạm trong ảnh ở 3840, 1920, 1280 và 390 px; cả năm phần giải thích vừa màn ngang. Chọn điểm, đồng bộ danh sách, mở đúng câu chuyện, hai điểm KV dùng chung nội dung và thao tác chạm 4K đều qua. TypeScript, production build và tích hợp bản đồ qua; 118 file di sản trước đó giữ nguyên. Báo cáo `.browser-profile/den-tho-bac/spaces-lighthouse.json`: performance 97, accessibility 100, best practices 96; phần trừ điểm chất lượng ảnh là do ảnh trên cao gốc 1200×806 được hiển thị lớn hơn trên màn 4K, không có lỗi tương phản hoặc console.

## Kiểm tra bản thiết kế lại Lịch sử và Không gian

Bản Lịch sử tách thành `HistorySection.tsx`; tiền cảnh minh họa có alpha thật, không dùng mặt nạ gradient làm mờ hình chữ nhật. Bản Không gian tách thành `SpacesSection.tsx`, dùng ảnh gốc và các tọa độ đã xác nhận. `MemorialMedia.tsx` giữ nguyên cơ chế ảnh tải/lỗi/thử lại và chú thích nguồn dùng chung.

TypeScript, production build và bộ kiểm tra sáu màn qua ở 3840×2160, 1920×1080, 1280×720, 768×1024, 390×844, 320×720. Kiểm tra cả bốn năm lịch sử; năm địa điểm, sáu nút ảnh, hai điểm KV dùng chung nội dung; phóng ảnh thật lên 150%, kéo bằng pointer, chọn địa điểm đưa mốc vào tầm nhìn, đặt lại về 100%; sự kiện chạm 4K, đọc/nghe, Escape, focus và tích hợp host đều qua. Các hiệu ứng tôn trọng reduced motion. Không có lỗi trình duyệt; 118 file của các trang di sản đã có giữ nguyên.

Lighthouse localhost, native 3840×2160 DPR 1: `history-v2-lighthouse.json` đạt performance 91, accessibility 100, best practices 100, LCP 2,0 giây, CLS 0. `spaces-v2-lighthouse.json` đạt 97/100/96, LCP 1,3 giây, CLS 0. Cả hai không có lỗi tương phản, tên nút không khớp nhãn, hoặc console. Điểm best practices của Không gian vẫn bị giới hạn bởi kích thước ảnh trên cao gốc so với khung hiển thị 4K.

### Chỉnh lại Lịch sử để thấy trọn năm và ảnh

Năm chuyển sang chữ SVG lồng ảnh trong viewBox có lề, giữ đủ bốn chữ số. Tiền cảnh đặt thấp và căn giữa; tỷ lệ nhà sàn được điều chỉnh riêng theo hình. Timeline bỏ vạch thước nhỏ, dùng năm lớn trên trục nối và ảnh thu nhỏ kèm tên sự kiện bên dưới; năm đang chọn màu đỏ. Bốn JPEG thu nhỏ tổng khoảng 125 KB, ảnh lớn giữ nguyên.

Kiểm tra vùng mực thực của chữ số, lề khung năm, toàn ảnh tiền cảnh và bốn ảnh timeline qua cho từng mốc 1970/1971/1989/2012 ở 1920×1080, 3840×2160, 1280×720. Kiểm tra sáu màn không tràn ngang, các nút vừa vùng hiển thị; điều hướng, trước/tiếp, đọc/nghe, ảnh, nguồn và chạm 4K qua. TypeScript và production build qua. Báo cáo `history-v3-lighthouse.json`: performance 89, accessibility 100, best practices 100; LCP 2,1 giây, CLS 0; không có lỗi tương phản hoặc console.

### Ảnh tổng thể phủ kín Không gian và giữ mốc

Dùng nguyên `memorial.jpg` làm nền phủ sát bốn cạnh của section, giữ tỷ lệ ảnh; chỉ chỉnh sáng và sắc độ bằng CSS. Theo ảnh mới nhất, khôi phục cả mốc đỏ 03 cạnh hai mốc 01–02 và bốn vị trí xanh. Bảng thông tin đặt gọn phía trên bên phải, giữ vùng Nhà sàn/03 bên dưới trống. Tọa độ nút vẫn tính trên ảnh gốc; phép cắt và phóng/kéo cùng áp dụng cho ảnh và nút. Khi trở về 100% hoặc đổi kích thước, góc nhìn chuẩn được phục hồi để hiện đủ mốc.

Đã sửa lỗi cột grid giãn theo nội dung trong khung hẹp khiến phần ảnh và mốc bên phải ra ngoài màn. Hit-test xác nhận cả bảy tâm nút nằm trong vùng nhìn và không bị bảng/nhãn khác chặn ở 3840, 1920, 1280, 768, 390, 320 px. Ở ba cỡ ngang lớn, ảnh phủ đúng toàn section và cả sáu bảng địa điểm vừa khung, không cần cuộn trong bảng. Đọc/nghe, phóng/kéo/reset, chạm 4K và tích hợp host qua; TypeScript và production build qua. 118 file di sản có trước giữ nguyên.

Báo cáo `spaces-full-lighthouse.json` ở 3840×2160: performance 96, accessibility 100, best practices 100; LCP 1,3 giây, CLS 0,001; không có lỗi tương phản, nhãn nút hoặc console. Tệp ảnh gốc có SHA-256 `3fe15eb704dbeea59bdf2dc96c3695f405b1e83d5b5ff71c89f82fbb550dab10`.

### Bố cục Lịch sử theo trực tiếp ảnh 163355

Thay tiền cảnh công trình nhỏ bằng hai tranh cắt ghép toàn cảnh có alpha: công trình, cây xanh và người tham quan chạy suốt cạnh dưới. Canvas sát hai cạnh, chữ năm khổng lồ ở phía sau hơi giảm màu, đoạn giới thiệu nhỏ phía trái, ba dấu cộng và nguồn ảnh ở góc dưới phải. Timeline thu gọn còn 84 đơn vị thiết kế; giữ đủ bốn năm, ảnh nhỏ và tương tác cũ. Dấu cộng trên nhóm người mở hoạt động tưởng niệm hoặc gợi ý tham quan, không gán danh tính cho người trong minh họa.

Hai ảnh minh họa tạo bằng image_gen tích hợp; không phải ảnh chụp sự kiện trong năm đang chọn. PNG được giữ để đối chiếu, trang dùng WebP quality 0,94 giảm từ tổng 4,58 MB xuống khoảng 1,20 MB. Alpha của hai WebP giống hệt PNG gốc. Tệp và prompt đầy đủ trong `src/assets/den-tho-bac/history-panorama-prompts.json`.

TypeScript, production build và bộ kiểm tra sáu màn qua ở các cỡ 320–3840 px. Bốn cảnh đều giữ chữ số trong lề SVG, lớp tiền cảnh chạy hết chiều ngang, timeline chiếm dưới 10% chiều cao màn; câu chuyện đọc/nghe, phím mũi tên, ba điểm tương tác và native touch 4K qua. 118 file trang di sản đã có giữ nguyên. Lighthouse bản tối ưu tại 3840×2160: performance 95, accessibility 100, best practices 100; LCP 1,4 giây, CLS 0,001; không có lỗi tương phản hay console. Báo cáo: `history-reference-lighthouse.json`.

### 25/10/2026 · Bảy mốc từ ảnh người dùng cung cấp

Thay toàn bộ minh họa Lịch sử trước đó bằng bộ 69, 70, 71, 72, 75, 89, 12 PNG. Thứ tự trải nghiệm: **1969 → 1970 → 1971 → 1971–1972 → 1975 → 1989 → 2012**. Riêng mốc giai đoạn 1971–1972 dùng hình số 1972 đúng ảnh gửi. Các chữ số lớn và ảnh là một tổ hợp gốc, không dựng lại bằng AI. Dùng CSS cắt phần minh họa, giữ tỷ lệ; chữ, nút và timeline đều là thành phần tương tác thật. Giữ bản PNG nguyên byte và manifest SHA-256 trong `src/assets/den-tho-bac/history-user/`.

Bổ sung bốn câu chuyện riêng: khởi nguồn tưởng niệm, dựng lại đền, bước sang thời bình và công nhận di tích. Mỗi dấu mốc có tiêu đề, tóm tắt, điểm nhấn, ba điều để nhớ, câu hỏi và nguồn. Đối chiếu sự kiện với bài [Cục Du lịch Quốc gia Việt Nam](https://www.dulichvn.org.vn/index.php/item/chuyen-xay-giu-den-tho-bac-ho-trong-khang-chien-51088) và tư liệu báo chí đã có. Không xem chữ “Ảnh tư liệu năm…” in sẵn trong PNG là bằng chứng niên đại của ảnh thành phần; giao diện chỉ gọi là hình minh họa, giải thích tại mục tư liệu.

| Dấu mốc | Hiệu ứng ảnh khi chọn |
|---|---|
| 1969 | Hiện dần, thu nhẹ về khung |
| 1970 | Trượt ngang theo hướng di chuyển |
| 1971 | Mở nhẹ theo chiều ngang |
| 1971–1972 | Nâng hình từ dưới |
| 1975 | Lắng về khung từ cỡ lớn hơn |
| 1989 | Đưa hình tài liệu vào với góc xoay rất nhỏ |
| 2012 | Dịch cảnh ngang kết hợp thu nhẹ |

Ảnh cũ lưu đến khi ảnh mới tải và decode xong, sau đó hòa chuyển. Hủy phản hồi tải cũ khi khách đổi mốc nhanh. Có trạng thái tải/lỗi và nút thử lại. Chỉ tải trước mốc kế tiếp. Chữ và ghi chú hiện theo nhịp ngắn; không tự chạy timeline hoặc phát âm thanh. Nút + mở ngữ cảnh liên quan; mốc 1989 đặt nút thật trùng dấu + có sẵn. Timeline có bảy năm, nhãn ngắn, tiến độ, trước/sau, Home/End và phím mũi tên; trên màn hình hẹp tự cuộn mốc đang chọn vào vùng nhìn.

Sáu tab chính có chuyển động riêng cho nội dung: Tổng quan nâng chữ và thu ảnh; Lịch sử hòa cảnh; Không gian đưa bảng hướng dẫn từ phải; Con người đưa ảnh/chữ từ hai phía; Hoạt động lần lượt hiện các dịp; Giá trị hiện các khung ảnh theo nhịp. Mọi hiệu ứng hữu hạn và bị tắt bởi `prefers-reduced-motion` hoặc tùy chọn giảm chuyển động từ host. Không đổi ảnh gốc hay các mốc của section Không gian.

Kiểm chứng bản bảy mốc: production build và TypeScript qua; bộ Chrome đầy đủ qua cho sáu section tại 320, 390, 768, 1280, 1920, 3840 px. Kiểm tra cả bảy ảnh ở ba cỡ ngang lớn; bảy tên hiệu ứng khác nhau; câu chuyện từng mốc; chọn nhanh không trả về ảnh cũ; cố ý chặn ảnh rồi thử tải lại; phím mũi tên và End, cuộn timeline hẹp; giọng đọc, đóng/phục hồi focus; native touch 4K; bảy điểm trên ảnh tổng thể; luồng host và lưu lựa chọn. Không có exception trình duyệt. 118 file di sản có trước giữ nguyên SHA-256; bảy PNG sao chép khớp nguồn. Các điểm Lighthouse ở những mục trước là số đo của phiên bản trước, chưa đo lại cho bản bảy ảnh này.

### 25/10/2026 · Sơ đồ mới `map.png`, sáu điểm chạm

Bản mới thay cách đánh dấu 01–03, NSBH/NTB/KV bằng đúng sáu mốc người dùng gửi: **01 Đền thờ Bác Hồ, 02 Ao nước, 04 Nhà trưng bày, 05 Hiện vật, 06 Khuôn viên, 07 Nhà sàn Bác Hồ**. Giữ số thứ tự không liên tục, không tự thêm 03. `site-map-original.png` nguyên byte; `site-map.webp` cùng kích thước, giảm từ 3,14 MB xuống 0,64 MB. Chi tiết nguồn và tọa độ tại `src/assets/den-tho-bac/site-map.md`.

Hiển thị trọn ảnh căn phải, đúng tỷ lệ 3:2 để không cắt nhãn có sẵn. Bảng trắng phía trái có ảnh nhận biết, giới thiệu ngắn, hai gợi ý quan sát, câu hỏi và CTA đọc/nghe. Sáu lựa chọn phía dưới đồng bộ với nút thật trên dấu cộng. “Nhìn gần” phóng đến điểm đang chọn; phóng/kéo giới hạn trong ảnh; quay tổng thể/reset hoặc đổi kích thước phục hồi đầy đủ nhãn. Nút trước/sau theo thứ tự ảnh, có điểm đầu/cuối. Nút thông tin về sơ đồ giải thích nội dung và phạm vi sử dụng.

| Điểm | Chuyển cảnh bảng nội dung | Phản hồi trên bản đồ |
|---|---|---|
| 01 Đền thờ | Mở nhẹ từ khung nhỏ hơn | Vòng định vị thu về dấu cộng |
| 02 Ao nước | Hiện nổi nhẹ từ dưới | Hai gợn vòng lan ra |
| 04 Nhà trưng bày | Trượt nội dung từ phải | Khung mở theo chiều ngang |
| 05 Hiện vật | Lấy nét từ khung lớn hơn | Khung vuông thu về điểm |
| 06 Khuôn viên | Trượt từ trái, gợi ý hiện theo nhịp | Vòng mở quanh vị trí |
| 07 Nhà sàn | Dựng nội dung từ dưới | Vòng định vị đi lên |

Tất cả chuyển động chỉ chạy một lần khi chọn điểm; giảm chuyển động từ hệ điều hành hoặc host sẽ tắt. Nội dung Ao nước, Khuôn viên và Hiện vật được bổ sung độc lập. Phần Hiện vật chỉ đưa cách quan sát/chú thích, không tự tạo ảnh cận cảnh, danh tính hoặc niên đại cho đồ vật chưa có tư liệu.

Bộ kiểm tra `--map-only` qua: sáu câu chuyện đúng điểm, hai gợi ý và câu hỏi, sáu hiệu ứng khác nhau, trước/sau, toàn ảnh và sáu nhãn không bị che ở 1280/1920/3840 px; sáu tâm nút chạm được ở 320/390/768/1280/1920/3840 px. Nhìn gần/về tổng thể, phóng 150%, kéo, chọn điểm khi phóng và reset qua. Native touch cả sáu mốc tại 3840×2160, giọng đọc/Escape, đọc chi tiết, lưu lựa chọn và tích hợp host qua; không có exception trình duyệt. 118 file trang di sản có trước giữ nguyên.

TypeScript và production build cuối qua. Lighthouse cục bộ tại 3840×2160: performance 95, accessibility 100, best practices 96; LCP 1,43 giây, CLS 0,00013, tương phản và console qua. Báo cáo `map-supplied-lighthouse.json`. Điểm best practices phản ánh giới hạn độ phân giải của ảnh nguồn: bản 1536×1024 được hiển thị 2700×1800 trên màn 4K. Bản đồ vẫn giữ nội dung gốc; chữ/nút HTML có độ nét theo màn hình.

### 25/10/2026 · Tổng quan bằng bộ ảnh 01, 02, 03

Thay Tổng quan cũ bằng ba ảnh cung cấp: Đền thờ Bác Hồ, Mô hình ngôi đền xưa, Tượng Bác Hồ. `OverviewSlideshow.tsx` độc lập với Lịch sử và Không gian; lưu lựa chọn ở trang cha khi chuyển section. Không tạo lại ảnh. Bản PNG giữ nguyên byte, bản hiển thị WebP và SHA-256 trong `src/assets/den-tho-bac/overview-user/`.

Ảnh hiển thị trọn theo tỷ lệ 1672:941. Các chữ và bố cục đã in trong ảnh được giữ, đặt nút HTML thật đúng vùng Lịch sử, Không gian, Khám phá, 01–02–03 và mũi tên sang chương. Thanh điều hướng sáu phần vẫn ở dưới. Để dành diện tích ảnh, thanh đầu trang chung được ẩn riêng tại Tổng quan; nguồn, toàn màn hình và đóng host có nút tương đương trong thanh điều khiển ảnh.

Tự chuyển 12 giây khi ảnh tải và decode xong. Ảnh cũ được giữ trong lúc tải ảnh mới, hòa cảnh và chuyển nhẹ sau khi sẵn sàng. Có nút trước/sau vòng tròn, tạm dừng/tiếp tục và tiến độ ảnh. Chọn ảnh bằng tay sẽ dừng tự chạy để đọc. Đặt chuột hoặc focus vào điều khiển, mở câu chuyện, ẩn tab trình duyệt sẽ tạm dừng. Chế độ giảm chuyển động từ hệ điều hành hoặc host tắt tự chạy và hiệu ứng, vẫn cho chọn thủ công. Timer, sự kiện và observer có cleanup.

Ảnh lỗi có thử lại và lối mở câu chuyện. Trên khung hẹp có tiêu đề, mô tả và nút HTML dễ đọc phía dưới ảnh. Giọng đọc vẫn chỉ bắt đầu khi khách chọn nghe trong câu chuyện.

Kiểm chứng: `den-tho-bac-overview-test.cjs` qua, gồm chờ đúng chu kỳ tự chuyển thật, dừng hơn một chu kỳ, trước/sau quay vòng, ba ảnh và toàn bộ vùng chạm tại 1280/1920/3840 px; hai CTA mở đúng câu chuyện, CTA mô hình mở Lịch sử; nhớ ảnh khi quay lại; nguồn; hover/focus; lỗi ảnh/thử lại; giảm chuyển động; hiển thị 320/390/768 px; native touch 4K chọn đủ ba ảnh. Kiểm tra host riêng qua: có đóng/thu màn hình, thu và mở lại giữ đúng ảnh, đóng được iframe. TypeScript và production build qua; không có exception trình duyệt. 118 file di sản khác giữ nguyên SHA-256.

Lighthouse trên viewport 3840×2160: performance 96, accessibility 100, best practices 100; LCP 1,386 giây, CLS 0,00002. Báo cáo `overview-slideshow-lighthouse.json`. Đây là đo trình duyệt cục bộ, không thay cho thử nghiệm trên thiết bị lắp đặt thực tế.
# Cập nhật mới nhất: danh sách tám mốc → tóm tắt riêng → popup chi tiết · 25/10/2026

- Bảng bên phải có hai trạng thái loại trừ nhau. Ban đầu chỉ hiện danh sách tám mốc với số, tên đầy đủ và chủ đề; không mở sẵn tóm tắt mốc 01.
- Chọn một dòng hoặc một ghim thay danh sách bằng tóm tắt của đúng mốc đó, sử dụng toàn bộ chiều cao bảng phải. Bảy lựa chọn còn lại không còn chen bên dưới. Tám ghim trên ảnh giữ nguyên để có thể chọn điểm khác trực tiếp.
- Tóm tắt gồm ảnh, tên, mô tả, gợi ý quan sát và câu hỏi. “Xem chi tiết” mới mở popup; phần thông tin đầy đủ trong popup mở sẵn. Đóng popup giữ nguyên mốc và đưa focus về nút vừa bấm.
- Nút “Tất cả 8 điểm” trở lại danh sách, trả ảnh về toàn cảnh và đưa focus về dòng vừa chọn. Trạng thái danh sách/tóm tắt được lưu cùng mốc khi đổi section rồi quay lại.
- Cụm ba công cụ nổi, navigation, ảnh nền và tám tọa độ được giữ nguyên. Màn 4K hiển thị danh sách đầy đủ; phần tóm tắt có vùng đọc riêng và nút chi tiết luôn trong bảng.

## Ghi nhận lần chỉnh trước: Tổng quan giữ trọn ba ảnh demo

- Bỏ cách cắt ảnh `cover` và các chuyển cảnh phóng ảnh của Tổng quan. Ảnh chính giữ trọn tỷ lệ 1672:941, đủ tượng Bác, chân tượng, câu trích dẫn, cổng và công trình trong khung hình được cung cấp.
- Section và các lớp chuyển cảnh vẫn phủ kín vùng nội dung. Ảnh chính dùng `contain`, phần mép dư hòa bằng lớp nền riêng; không làm mờ ảnh chính hoặc thêm viền/khung bo.
- Ở màn dọc, đặt toàn bộ ảnh phía trên phần chữ để nội dung và điều khiển không đè lên tượng hoặc câu trích dẫn. Cụm công cụ nổi ba nút và navigation giữ nguyên.
- Giữ tự chuyển 12 giây, chạm chọn và dừng/tiếp tục; chuyển cảnh chỉ hòa ảnh, không phóng/cắt ảnh trong quá trình đổi.
- Không sửa nội dung ba tệp ảnh nền trong lần chỉnh này. Kiểm tra toàn ảnh ở 4K, 1920×1080, 1280×720, khung ngang rộng/thấp và khung dọc.

## Ghi nhận lần chỉnh trước: ảnh toàn cảnh mới, tám tọa độ tương tác

- Thay bản đồ cũ bằng ảnh sạch `map.png`; dùng `map1.png` làm nguồn đối chiếu vị trí và thông tin tám mốc 01–08.
- Đặt bản đồ lớn bên trái, bảng thông tin bên phải. Ghim tròn có số, nhãn tên, trạng thái chọn rõ; bảng thông tin và danh sách tám điểm luôn đồng bộ. Cụm công cụ nổi và navigation giữ nguyên.
- Tám điểm theo đúng chú giải: Đền thờ; Nhà trưng bày thân thế và sự nghiệp (ba phòng chuyên đề); Nhà đón tiếp; Hiện vật chiến tranh; Mô hình Bác Hồ với thuyền độc mộc; Mô hình Nhà sàn; Vui chơi/cắm trại; Hồ sen/cây xanh.
- Mỗi điểm có nội dung riêng, hai gợi ý quan sát, câu hỏi đọc sâu và liên kết đối chiếu bản được cung cấp. Không thêm giờ mở cửa, danh mục hiện vật hoặc thông tin phục vụ chưa được cung cấp.
- Tọa độ được đối chiếu theo đặc trưng ảnh, lưu trong `src/assets/den-tho-bac/map-current-coordinates.json`. Ảnh và mốc dùng chung mặt phẳng để không lệch khi đổi kích thước, phóng 1.5× hoặc kéo.
- Tám chuyển cảnh hữu hạn cho bảng thông tin; vòng nhấn sáng định vị trên bản đồ; giảm chuyển động của thiết bị tắt các hiệu ứng. Hỗ trợ chạm, danh sách chọn, phím mũi tên và Home/End.
- Giữ nguyên ảnh gốc, chỉ chuyển WebP. Credit VTV Times được ghi theo chú thích bản được cung cấp; ảnh cận vị trí là phần nhìn gần của ảnh toàn cảnh, không dựng thêm công trình bằng AI.

## Ghi nhận lần chỉnh trước: bỏ header, dùng cụm công cụ nổi

- Bỏ toàn bộ header chứa thương hiệu và khẩu hiệu trên sáu phần Đền thờ Bác. Nội dung bắt đầu từ mép trên, giữ navigation bên dưới; lấy lại 76px ở 1920×1080 và 152px ở 4K so với header cũ.
- Chỉ giữ Nguồn tư liệu, Toàn màn hình và Đóng trong một cụm nổi nền sáng, viền mảnh, bo tròn và bóng nhẹ ở góc phải. Không kéo nền thành dải ngang. Cỡ chạm tối thiểu 44px, co thành biểu tượng khi khung hẹp; vẫn có tên truy cập đầy đủ.
- Dòng hướng dẫn Lịch sử dịch sang trái cụm nút. Các tiêu đề và đoạn giới thiệu bố trí tránh vùng công cụ. Tổng quan tiếp tục phủ kín vùng nội dung, không thu nhỏ/căn giữa ảnh.
- Chạm lại tab ảnh Tổng quan đang chọn để dừng/tiếp tục tự động; biểu tượng trạng thái nằm cạnh thanh tiến trình. Chọn ảnh khác bắt đầu lại thời gian xem. Cụm nổi chỉ có ba nút được yêu cầu.
- Nút Đóng gửi hành động về host bản đồ. Khi xem trang độc lập, nút trở về trang bản đồ gốc.
- Lịch sử vẫn giữ chú thích mốc năm trong ảnh; nút Nguồn cạnh chú thích đã xóa.

## Ghi nhận lần chỉnh trước

- Tổng quan phủ kín toàn bộ vùng nội dung giữa header và navigation, ở mọi tỷ lệ màn hình; không dùng khung ảnh căn giữa. Host trang chi tiết dùng `inset: 0`, không giới hạn chiều rộng cho các địa điểm.
- Header Tổng quan đã khôi phục. Navigation sáu phần giữ biểu tượng và tên, bỏ số thứ tự, bộ đếm trang và hai nút mũi tên.
- Xóa toàn bộ hàng dưới ảnh chứa số/tên ảnh, tự động và các nút công cụ. Nguồn, toàn màn hình, đóng và tạm dừng tự động có ở header.
- Nền Tổng quan được xử lý bỏ UI in sẵn; chữ, CTA và ba tab được dựng bằng HTML thật. Chi tiết nguồn, prompt và các bản trước/sau: `src/assets/den-tho-bac/overview-user/README.md`.
- Thanh tiến trình và chuyển ảnh dùng một đồng hồ RAF 12 giây. Tạm dừng/đọc cửa sổ/ẩn tab giữ thời gian còn lại; tải ảnh không tính vào thời gian xem. Chọn ảnh bằng chạm không tắt tự động. Tùy chọn giảm chuyển động tắt tự động và chuyển cảnh.
- Làm mềm cục bộ phần rỗng tròn của số năm trên ảnh Lịch sử bằng mặt nạ elip và backdrop blur, giữ ảnh và viền ngoài số rõ. Bản đồ và sáu mốc được giữ nguyên.
- Giới hạn năm phút chỉ còn áp dụng cho màn xem nhanh; trang kể chuyện mở toàn màn hình không bị cắt ngang bởi thông báo hết lượt. Chế độ thu hút khi trở về bản đồ vẫn hoạt động.


### Lịch sử — bộ tham chiếu ngày 26/10/2026

- Thay đủ bảy nền bằng ảnh sạch người dùng gửi cùng bảy layout. Bản PNG gốc và SHA-256 được giữ trong `src/assets/den-tho-bac/history-exact`; ứng dụng tải WebP lossless có RGB trùng hoàn toàn với PNG.
- Cụm năm lớn dùng đường viền SVG lấy riêng từ từng mẫu, cùng kích thước và vị trí đo trên khung 1672 × 941, giữ hình dáng 0/6/8/9. Ngày, tiêu đề, phần đọc, nút, timeline và footer vẫn là HTML tương tác.
- Phân biệt bố cục lớn (1969, 1989, 2012) và gọn (1970, 1971, 1972, 1975): giãn mốc timeline, độ rộng gạch đỏ, đường phân cách, vị trí nút và cụm công cụ theo từng mẫu. Giữ nền footer đen 38% và blur 8px theo yêu cầu mới nhất.
- Chụp đủ bảy mốc ở 1672 × 941 và các mốc đại diện ở 1774 × 887, 3840 × 2160. Bản đối chiếu có thanh kéo: `preview/history-reference-review.html`.
- 320 kiểm tra Chrome đạt: nền/khung ảnh, đường nét và vị trí năm, tọa độ nút đọc/chú thích, timeline, chín viewport, popup, bàn phím, chạm 4K, giảm chuyển động, tải lỗi/thử lại và giữ mốc khi đổi section. Không có lỗi trình duyệt. Build, TypeScript và kiểm tra khoảng trắng đạt; 118 file của các trang chi tiết khác giữ nguyên hash.
- Lighthouse desktop của Lịch sử: performance 88, accessibility 100, best practices 100; LCP 2,3 giây, CLS 0, TBT 0. Cách khử răng cưa chữ HTML/SVG và footer trong hơn vẫn có thể tạo chênh lệch pixel nhỏ so với ảnh mẫu.
