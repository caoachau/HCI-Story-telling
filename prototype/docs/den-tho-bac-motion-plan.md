# Kế hoạch hiệu ứng trang chi tiết Đền thờ Bác Hồ

Ngày 27/10/2026. Trạng thái: **đã triển khai trên trang chi tiết Đền thờ Bác Hồ**, gồm `/den-tho-bac.html` và cửa sổ chi tiết trong ứng dụng bản đồ. Các bảng bên dưới giữ yêu cầu thiết kế ban đầu; kết quả và điều chỉnh thực tế được ghi cuối tài liệu.

Người dùng đã đồng ý giữ các hiệu ứng hiện có. Những mục “tinh chỉnh” bên dưới là đề xuất về nhịp phối hợp; hình ảnh, hướng chuyển cảnh và thao tác đang dùng là mốc đối chiếu. Việc dọn code/ảnh của giao diện cũ được ghi riêng trong [báo cáo dọn repo](cleanup-2026-10-27.md).

## Hướng thiết kế và vai trò ba repo

Trải nghiệm giống một cuộc tham quan sáu gian: nhìn toàn cảnh → theo dấu lịch sử → khám phá không gian → gặp con người → tìm hiểu hoạt động → đọc sách về giá trị di sản. Mỗi gian có cách chuyển động riêng; sách kính là điểm nhấn mạnh nhất. Giữ màu đen, trắng, đỏ, panel Không gian góc vuông, vị trí sáu nút điều hướng và cách căn ảnh đã chỉnh.

| Nguồn | Cách áp dụng trong dự án |
| --- | --- |
| [scroll-craft](https://github.com/nateherkai/scroll-craft), [SKILL.md đã đọc](https://github.com/nateherkai/scroll-craft/blob/main/plugins/nateherk-design/skills/scroll-craft/SKILL.md) | Dùng cách lập nhịp kể chuyện, chọn hiệu ứng theo nội dung, xác định lớp ảnh/chữ và phương án mobile trước khi làm. Áp dụng vào cấu trúc sáu tab hiện tại. |
| [GSAP](https://github.com/greensock/gsap) | Điều phối thứ tự ảnh, tiêu đề, nội dung, nút; gom các chuyển động đang chạy chồng lên nhau thành timeline có thể hủy và dọn sạch. Dự án đã có dependency GSAP. |
| [Three.js](https://github.com/mrdoob/three.js/) | Làm mẫu thử khung trưng bày ảnh có chiều sâu trong cửa sổ xem ảnh. Chỉ đưa vào bản chính sau khi so sánh với ảnh phẳng hiện tại. Dự án đã có dependency Three.js. |

Trang desktop chủ yếu chuyển tab trong một khung cố định. ScrollTrigger chỉ dùng ở vùng thực sự cuộn: nội dung dài trên mobile hoặc phần đọc. Mỗi vùng giữ cuộn tự nhiên và một chủ thể điều khiển; GSAP không tranh quyền cuộn với bản đồ hoặc trang chủ.

## Danh sách hiệu ứng

Thời lượng bên dưới là mức khởi đầu để dựng bản xem thử, tính bằng mili giây. Những thời lượng ghi “hiện tại” được giữ làm chuẩn. Khoảng dịch chuyển mới tính theo CSS pixel, có giới hạn trên màn lớn.

| Mã | Vị trí và thao tác | Hiệu ứng hiện tại cần giữ | Đề xuất cụ thể | Trạng thái |
| --- | --- | --- | --- | --- |
| C01 | Mở chi tiết / chuyển một trong sáu tab | Footer, công cụ, trạng thái chọn và focus ổn định | Nội dung của gian tự chạy nhịp vào riêng; chọn tab phản hồi ngay. Không cộng thêm một lớp chuyển động toàn màn lên hiệu ứng của gian. | Giữ + điều phối |
| C02 | Nút, mũi tên, tab phụ | Màu đỏ khi chọn, viền focus, phản hồi hover | Thống nhất đổi màu 150–200 ms; mũi tên dịch 3 px. Cảm ứng nhận phản hồi khi nhấn; không phụ thuộc hover. | Tinh chỉnh |
| O01 | Chuyển ba ảnh Tổng quan | Hòa ảnh khoảng 900 ms; ảnh nguyên tỷ lệ, không phóng thêm; ảnh 03 cũ đã khôi phục ngày 27/10 và căn riêng để thấy rõ dòng chữ, toàn bộ bệ chân phía trên footer | GSAP chỉ điều phối lớp hòa ảnh và nội dung. Ảnh đích decode xong mới bắt đầu; giữ ảnh đang xem khi tải lỗi. | Giữ |
| O02 | Chữ trên ảnh Tổng quan | Chữ xuất hiện nhẹ khoảng 650 ms | Hiện tiêu đề theo dòng, dịch tối đa 8–12 px; đoạn mô tả rồi CTA cách nhau 60–80 ms. Tổng nhịp khoảng 650–800 ms, nằm trong lượt hòa ảnh. Chữ tiếng Việt vẫn là HTML đọc được. | Tinh chỉnh |
| O03 | Thanh tiến độ và tự chuyển | Chu kỳ 12 giây; tạm dừng khi hover, focus, mở đọc hoặc ẩn trang | Đồng bộ thanh tiến độ với một bộ đếm hiện tại. Người xem tiếp tục điều khiển dừng/chạy và chọn ảnh trực tiếp. | Giữ |
| H01 | Chọn mốc Lịch sử | Bảy kiểu vào cảnh riêng khoảng 750 ms; lớp cũ mờ đi khoảng 650 ms | Giữ hướng chuyển động riêng từng mốc; phối hợp năm → tiêu đề → đoạn tóm tắt → nút, lệch nhau khoảng 60 ms. Tổng lượt trong 750–850 ms. | Giữ + điều phối |
| H02 | Năm lớn / trục năm | Phông số trắng, kích thước và vị trí từng năm; underline đỏ | Năm xuất hiện bằng độ mờ và độ dịch sẵn có. Underline theo lựa chọn trong 250 ms; giữ cùng cao độ trục năm ở mọi cảnh. | Giữ |
| H03 | Chọn liên tiếp / ảnh tải chậm | Chọn cuối cùng thắng; trạng thái lỗi và thử lại | Hủy timeline cũ đúng phạm vi, chờ ảnh cuối đã sẵn sàng rồi chuyển. Năm và nội dung luôn cùng một mốc. | Gia cố |
| S01 | Vào Không gian | Panel đen góc vuông vào từ phải khoảng 550 ms; danh sách hiện nhẹ | Lệch nhịp số và tên mỗi hàng 35–45 ms, tối đa 250 ms cho toàn danh sách. Chỉ chạy khi mở danh sách. | Tinh chỉnh |
| S02 | Chọn điểm 01–08 | Tám cách vào panel riêng khoảng 500 ms; ghim chọn đỏ và vòng nhấn khoảng 850 ms một lượt | Ghim phản hồi ngay, số/tên/ảnh trong panel theo sau; đồng bộ danh sách và bản đồ. Bảo toàn tọa độ đã xác nhận. | Giữ + điều phối |
| S03 | Nhìn gần / kéo bản đồ | Zoom 1 ↔ 1,5 khoảng 700 ms; kéo trực tiếp theo tay | Giữ ảnh và ghim trong cùng hệ tọa độ, zoom về cùng điểm nhìn. Khi kéo, chuyển động theo tay ngay. | Giữ |
| S04 | Từ tóm tắt về danh sách | Khôi phục hàng đang chọn, vị trí cuộn và focus | Nội dung panel mờ đổi trong 200–250 ms; vỏ panel và kích thước đứng yên. | Tinh chỉnh |
| P01 | Đổi hai tab Con người | Hòa ảnh khoảng 500–650 ms; khung ảnh vừa chiều cao/rộng; tên và câu chuyện đổi cùng ảnh | Ảnh trước, tên sau khoảng 80 ms, nội dung và nút sau tiếp 60 ms. Chuyển động chữ tối đa 8 px. | Tinh chỉnh |
| P02 | Chân dung / ảnh nhân chứng | Theo cập nhật 27/10: ảnh rộng 100% trong cột hiện tại, không giới hạn theo chiều cao; tỷ lệ người giữ nguyên. Nhãn HTML “NHÂN CHỨNG” / “HỌA SĨ” bám góc trên trái, chú thích bên dưới | Giữ ảnh đứng yên trong lúc đọc. Màn thấp cho vùng ảnh cuộn dọc để xem trọn ảnh; cột, tab và footer giữ vị trí. Ảnh gốc trong cửa sổ đọc tiếp tục có chú thích và nguồn. | Giữ + cập nhật chiều rộng |
| A01 | Vào Hoạt động | Bốn cột xuất hiện lần lượt khoảng 650 ms, lệch nhau khoảng 70 ms | Desktop giữ nhịp bốn cột. Mobile chỉ cho cột vừa vào vùng nhìn xuất hiện một lần, 400–500 ms, dịch 8 px. | Giữ + bổ sung mobile |
| A02 | Mốc ngày / lời mời | Ngày, tháng đúng nội dung; màu đỏ và mũi tên khi tương tác | Đường nhấn đỏ mở theo chiều ngang trong 200 ms khi focus/chọn; ngày tháng hiện nguyên giá trị. | Thêm nhẹ |
| V01 | Lật sách Giá trị di sản | Một tờ kính hai mặt quay quanh gáy, đường cong sát gáy, mask liên tục; 900 ms, easing hiện tại | Giữ nguyên Web Animations API và cấu trúc sách đã kiểm tra. Khung/gáy đứng yên; ảnh đích decode trước; khóa lượt đang lật; cập nhật tab, URL và nút hành động khi lượt kết thúc. | Giữ nguyên — điểm nhấn |
| V02 | Vào gian sách / chọn tab sách | Bốn tab, underline di chuyển theo nhãn | Có thể cho khung sách hiện bằng opacity 350 ms khi vào gian. Underline đi theo nhãn sau khi lật hoàn tất, 200–250 ms. Hiệu ứng vào gian kết thúc trước lúc lật. | Tinh chỉnh phụ trợ |
| R01 | Mở / đóng cửa sổ đọc | Dialog thật, Escape, khóa cuộn, trả focus, dừng giọng đọc khi đóng | Nền tối hiện 150 ms, khung đọc hiện 220 ms và dịch 6 px; đóng 160 ms, sau đó trả focus. Thao tác đóng vẫn phản hồi ngay khi đang mở. | Tinh chỉnh |
| R02 | Phóng ảnh / đọc liên tục | Phóng ảnh 1,5 lần; chú thích và nguồn ảnh | Theo mẫu mới 27/10: chữ chia mục và cuộn liên tục bên trái; ảnh cùng chú thích giữ cố định bên phải. Nguồn mở theo yêu cầu; toàn bộ nội dung câu chuyện được giữ. | Đã cập nhật theo mẫu |
| R03 | Tiến độ đọc | Vùng văn bản có cuộn thực | Thanh đỏ mảnh theo phần nội dung đã cuộn, chỉ hiện khi có tràn nội dung. Đo lại khi đổi cỡ chữ, ảnh tải xong hoặc đổi kích thước. | Thêm |
| R04 | Cuộn chữ đổi ảnh | Mỗi mục chữ gắn với một ảnh có nguồn | Ảnh giữ vị trí, chỉ đổi khi mục kế tiếp đi tới đầu vùng đọc. Cuộn ngược đổi ảnh ngược lại. Chọn ảnh nhỏ hoặc dùng phím điều hướng sẽ cuộn đến mục tương ứng. Chờ decode và giữ ảnh hiện tại nếu ảnh đích chậm/lỗi; lựa chọn cuối cùng thắng. | Đã triển khai 27/10 |
| T01 | Xem ảnh trong khung trưng bày | Ảnh phẳng và các điều khiển hiện tại là phương án mặc định | Mẫu thử Three.js: ảnh nguyên vẹn đặt trên một mặt phẳng trong khung mỏng, nghiêng tối đa ±2° theo con trỏ, trở về giữa khoảng 300 ms. Chữ/chú thích nằm ngoài canvas. Chỉ một khung hoạt động khi cửa sổ mở. | Thử nghiệm riêng |
| L01 | Tải ảnh / lỗi mạng | Ảnh cũ, thông báo lỗi và nút thử lại | Giữ ổn định kích thước ảnh khi tải; sau decode hòa vào 180–250 ms. Giữ thông báo và focus có thể sử dụng ngay. | Gia cố |

Các hướng vào cảnh Lịch sử đang giữ: 1969 hòa ảnh; 1970 từ phải; 1971 từ trái; 1971–1972 từ dưới; 1975 từ trên; 1989 hòa ảnh kèm dịch lên nhẹ; 2012 từ trái. Các biên độ hiện tại trong `history.css` là chuẩn để đối chiếu, không làm đồng nhất tất cả thành cùng một hiệu ứng.

## Ảnh, nội dung và âm thanh

- Tổng quan dùng đúng ba ảnh gốc đang có; giữ thông số căn từng ảnh. Mobile bố trí ảnh phía trên, chữ phía dưới, giữ tỷ lệ.
- Lịch sử giữ bảy ảnh nền, phông chữ số và các vùng đo hiện tại. Ánh sáng/gradient là lớp riêng, ảnh giữ màu và chi tiết đang dùng.
- Không gian giữ bản đồ 2560 × 1440 và tám tọa độ trong `map-current-coordinates.json`.
- Con người giữ các vùng cắt đã bỏ nhãn và nền thừa; chuyển động không được làm mất chủ thể ở giữa lượt.
- Hoạt động giữ ngày tháng, thứ tự nội dung và cả ảnh gốc mở trong phần đọc.
- Giá trị di sản giữ ảnh trang sách, alpha của khung kính và tính liên tục của tờ lật. Lưu ảnh/video tại các góc giữa lượt để so sánh.
- Điều chỉnh cách chia đoạn, nhấn tiêu đề và chú thích để dễ đọc; thông tin lịch sử, tên người, ngày tháng và nguồn giữ theo dữ liệu hiện có.
- Giọng đọc tiếp tục chỉ chạy sau thao tác của người xem, dừng khi đóng hoặc chuyển câu chuyện. Kế hoạch này dùng phản hồi hình ảnh cho các thao tác, giữ hành vi âm thanh hiện tại.

## Mobile và giảm chuyển động

| Điều kiện | Hành vi |
| --- | --- |
| Desktop / kiosk lớn | Giữ sáu gian trong khung hiện tại; điều phối bằng thao tác chọn và các timeline hữu hạn. |
| Màn hẹp / cảm ứng | Giảm độ dịch còn 0–8 px, ưu tiên fade ngắn; chỉ reveal trong vùng cuộn thực; thao tác bản đồ vẫn nhận kéo/chạm trực tiếp. Sách giữ phương án chuyển trang trực tiếp ở breakpoint hiện có. |
| `prefers-reduced-motion` hoặc nút giảm chuyển động của trang chủ | Hiện nội dung ở trạng thái cuối, tắt dịch chuyển/lật/tilt và reveal theo cuộn; màu chọn, focus và thông tin tiến độ vẫn rõ. Tuân thủ cả tùy chọn OS lẫn tùy chọn host. |
| Mất WebGL / thiết bị không phù hợp | T01 dùng lại ảnh HTML phẳng và đầy đủ thao tác xem ảnh. |

## Cách triển khai

1. **Khóa bản hiện tại.** Ghi lại Tổng quan, bảy mốc Lịch sử, tám điểm Không gian, hai cảnh Con người, bốn hoạt động và bốn trang sách. Mỗi hiệu ứng có clip/ảnh trước–giữa–sau để so sánh.
2. **Dựng một mẫu GSAP ở Tổng quan.** Dùng timeline theo phạm vi component, xử lý decode, hủy khi đổi lựa chọn và tùy chọn giảm chuyển động. Kiểm tra cả 03 ảnh, mobile, bàn phím và chuyển tab liên tiếp trước khi mở rộng.
3. **Áp dụng từng gian.** Lịch sử → Con người → Hoạt động → Không gian → cửa sổ đọc. Giữ các đường chuyển động đã ghi; mỗi thuộc tính transform/opacity chỉ do một cơ chế điều khiển tại một thời điểm. Quy tắc CSS cũ chỉ được gỡ khi đã xác định timeline thay thế tương ứng.
4. **Sách kính.** Chỉ bổ sung hiệu ứng bên ngoài tờ lật sau khi các kiểm tra góc xoay, mask, focus và thao tác liên tiếp đạt. WAAPI tiếp tục sở hữu chuyển động tờ sách.
5. **Mẫu thử Three.js T01.** Tải khi mở xem ảnh, giới hạn độ phân giải canvas; dựng hình khi có thay đổi, dừng lúc cửa sổ đóng; giải phóng geometry/material/texture/renderer. So sánh độ rõ của ảnh và độ mượt với phương án hiện tại trước khi quyết định đưa vào.
6. **Đối chiếu toàn trang.** Kiểm tra standalone và iframe, màn 390 × 844, 1280 × 720, 1920 × 1080 và 4K; thiết bị cảm ứng; đổi cỡ chữ; giảm chuyển động; mất/tải chậm ảnh; mở/đóng nhanh và chuyển tab liên tiếp. Đo hiệu năng thực tế rồi mới kết luận.

GSAP sẽ dùng [`gsap.context()`](https://gsap.com/docs/v3/GSAP/gsap.context()/) để thu hồi timeline khi component gỡ và [`gsap.matchMedia()`](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) để quản lý điều kiện thiết bị. [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) gắn với đúng phần tử cuộn. Mẫu Three.js theo hướng [render khi có thay đổi](https://threejs.org/manual/pages/rendering-on-demand.html) và [giải phóng tài nguyên](https://threejs.org/manual/pages/how-to-dispose-of-objects.html).

Các tệp dự kiến tác động: component từng gian trong `src/features/den-tho-bac/`, CSS tương ứng và một hook điều phối motion chung. Dữ liệu câu chuyện, nguồn ảnh, tọa độ bản đồ và xử lý lật sách được giữ theo các ràng buộc trên.

## Điều kiện hoàn thành

- Những hiệu ứng đã đồng ý giữ còn đầy đủ, cùng hướng và cùng hành vi; sách lật vẫn 900 ms.
- Không có khoảng trắng/chớp đen, ảnh méo, năm sai, chữ cũ xuyên qua trang sách hoặc nhãn đã xóa xuất hiện lại.
- Nội dung đọc được và các nút dùng được ngay cả khi ảnh lỗi, giảm chuyển động hoặc mẫu 3D không chạy.
- Sau khi đóng trang/cửa sổ, không còn timeline, ScrollTrigger hay vòng vẽ do phần đó tạo ra chạy nền.
- Các bộ kiểm tra Đền thờ Bác và kiểm tra tích hợp đạt; chỉ số hiệu năng được so sánh trước/sau trên cùng thiết bị.

[Bản đối chiếu lật sách hiện có](../preview/values-page-turn-review.html) được giữ khi dọn repo để phục vụ bước 1.

## Kết quả triển khai ngày 27/10/2026

Các hiệu ứng phù hợp với hệ thống kiosk vì sáu mục vẫn do người xem chọn, chuyển động có điểm dừng và phản hồi khi chạm. Cuộn vẫn là cuộn gốc của trình duyệt. Những hiệu ứng cần chuột được giới hạn riêng, không trở thành điều kiện sử dụng nội dung.

| Phạm vi | Đã triển khai |
| --- | --- |
| C01–C02 | Timeline theo component, tự thu hồi khi đổi mục; phản hồi màu và nhấn; footer, công cụ và focus giữ nguyên. |
| O01–O03 | Hòa ảnh 900 ms; tiêu đề theo dòng, mô tả rồi CTA. Ảnh 03 cũ được khôi phục theo yêu cầu ngày 27/10; giữ chu kỳ 12 giây và các điều kiện tạm dừng. |
| H01–H03 | Giữ bảy hướng chuyển ảnh và phông số; phối hợp năm và câu chuyện. Khi ảnh mới chưa sẵn sàng hoặc lỗi, cả ảnh và nội dung của mốc đang xem được giữ cùng nhau. Chọn cuối cùng thắng; thông báo lỗi nêu rõ mốc đang xem. |
| S01–S04 | Giữ tám hướng vào panel, pulse một lượt, tọa độ ghim, kéo và zoom. Danh sách fade 230 ms mỗi hàng, lệch 35 ms: chênh lệch bắt đầu giữa hàng đầu/cuối là 245 ms, cả lượt hoàn thành khoảng 505 ms trong nhịp vào panel 550 ms. |
| P01–P02 | Ảnh hiện 600 ms; tên, vai trò, câu chuyện, nút lệch 60–80 ms; chữ dịch tối đa 8 px. Giữ vùng cắt tư liệu; cập nhật 27/10 cho ảnh phủ chiều ngang cột và nhãn HTML bám góc theo yêu cầu mới. |
| A01–A02 | Desktop bốn cột hiện lần lượt; màn hẹp chỉ hiện khi vào vùng cuộn thực, mỗi cột một lượt. Focus bàn phím hiện nội dung ngay. Gạch đỏ ngày tháng khi tương tác; dòng hướng dẫn cuối mục có bố cục riêng cho điện thoại. |
| V01–V02 | Giữ toàn bộ cơ chế lật WAAPI 900 ms. Chỉ thêm fade 350 ms bên ngoài sách và underline 250 ms; thao tác lật kết thúc ngay fade bên ngoài. |
| R01–R04 | `StoryReader` dùng bố cục nền tối theo mẫu mới: chữ trái, ảnh và dải ảnh nhỏ bên phải. Mở 220 ms, đóng 160 ms, trả focus và dừng giọng đọc. Cuộn chữ đổi ảnh theo mục; thanh tiến độ đo vùng chữ thật và tự cập nhật khi mở nguồn hoặc resize. |
| T01 | Khung ảnh Three.js là tùy chọn “Xem trong khung trưng bày” trong cửa sổ đọc, chỉ hiện khi có chuột, rộng hơn 900 px và không giảm chuyển động. Tải Three.js sau thao tác chọn, nghiêng tối đa ±2°, chỉ render khi thay đổi, trả về ảnh HTML khi WebGL lỗi. Màn cảm ứng giữ ảnh thường và phóng ảnh 1,5 lần. |
| L01 | Ảnh HTML fade 220 ms sau decode; giữ thông báo lỗi/thử lại và loại trừ ảnh trong tờ sách để tránh tranh quyền điều khiển. |

Mã điều phối nằm trong [memorial-motion.ts](../src/features/den-tho-bac/memorial-motion.ts), [memorial-motion.css](../src/features/den-tho-bac/memorial-motion.css), [useReaderMotion.ts](../src/features/den-tho-bac/useReaderMotion.ts) và [PhotoFrame.tsx](../src/features/den-tho-bac/PhotoFrame.tsx). Không thêm dependency. Đối chiếu SHA-256 của 116 ảnh/phông/tài sản trong bản chụp trước triển khai: không có thay đổi.

Ảnh đối chiếu các mục nằm ở `preview/motion-before/` và `preview/motion-after/`. [Kết quả kiểm tra](den-tho-bac-motion-validation.md) ghi môi trường, các bộ kiểm tra và giới hạn của phép đo. Hiệu năng trên thiết bị kiosk vật lý cần được đo tại thiết bị đó; mô phỏng viewport 4K không đại diện cho GPU của kiosk.

## Cửa sổ đọc theo ảnh mẫu — 27/10/2026

Áp dụng cho các câu chuyện được mở từ Tổng quan, Lịch sử, Không gian, Con người, Hoạt động và Giá trị di sản của Đền thờ Bác. Tiêu đề và nút đóng ở đầu, nguồn và giọng đọc ở chân cửa sổ. Màn ngang giữ chữ bên trái, ảnh lớn và dải ảnh nhỏ bên phải; màn hẹp giữ ảnh phía trên vùng chữ cuộn độc lập.

Nội dung được chia thành các mục có ảnh tương ứng. Câu chuyện “Giữ lại dấu tích, mở thêm cách hiểu” có bốn mục theo mẫu; các câu chuyện khác dùng ba mục dựa trên ba ý chính hiện có. Giữ nguyên nội dung gốc, ngày tháng, nguồn và chú thích ảnh; bổ sung ảnh bối cảnh từ những tài sản đã có trong repo. Không tạo ảnh hoặc sự kiện mới để lấp gallery.

Chi tiết triển khai: [reader-content.ts](../src/features/den-tho-bac/reader-content.ts), [useReaderGallery.ts](../src/features/den-tho-bac/useReaderGallery.ts), [reader-gallery.css](../src/features/den-tho-bac/reader-gallery.css). Bộ kiểm tra riêng: [den-tho-bac-reader-gallery-test.cjs](../tests/den-tho-bac-reader-gallery-test.cjs).

Đã kiểm tra bảy viewport 320–3840 px: vị trí khung ảnh giữ nguyên khi cuộn tới/ngược, chờ hết phần chữ rồi đổi ảnh, chọn ảnh nhỏ, bàn phím, ảnh chậm/lỗi/thử lại, phóng ảnh, nguồn, giọng đọc, Escape/trả focus, reduced motion và chạm 4K mô phỏng. Kiểm tra tích hợp với bản đồ và các luồng câu chuyện hiện có tiếp tục đạt. Ảnh xem thử: `preview/den-tho-bac-reader-gallery-1404x790.png`, `1920x1080.png`, `390x844.png` cùng tiền tố.
