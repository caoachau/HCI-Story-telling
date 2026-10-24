# Cồn Chim: bố cục trưng bày cho màn hình tương tác

Ngày đối chiếu: 24/10/2026. Bối cảnh: màn hình cố định, ngang 4K; điện thoại là phần xem tiếp qua QR. Người dùng chọn hướng giống sát bảo tàng Khmer về bố cục, tỉ lệ và kiểu chữ, ảnh sáng rõ hơn, đồng thời yêu cầu tìm thêm mẫu màn hình tương tác thực tế.

## Tham chiếu và quyết định thiết kế

Đã đọc mã và xem ảnh thực tế của các màn giới thiệu, tổng quan, lịch sử, văn hóa và giá trị di sản ở bảo tàng Khmer trong dự án. Các file bảo tàng được đối chiếu bằng SHA-256 với bản chụp trước khi sửa Cồn Chim; không chỉnh chúng.

Đã tìm và xem các trường hợp sau trên website của đơn vị thực hiện hoặc bảo tàng:

| Tham chiếu | Điều quan sát được | Áp dụng tại Cồn Chim |
| --- | --- | --- |
| [National Gallery of Art / Ideum](https://ideum.com/portfolio/national-gallery-tours) | Lựa chọn hành trình theo sở thích; ảnh và thông tin tác phẩm; bản đồ và QR. Ảnh triển khai cho thấy một đối tượng được đặt làm trọng tâm, các lựa chọn phụ nằm thấp hơn. | Mỗi màn có một nhóm lựa chọn chính; ảnh nhận biết đi trước câu chuyện; QR mở đúng nội dung đang xem. |
| [TouchStory / Ideum](https://ideum.com/news/touchstory-officially-launches) | Canvas ảnh, điểm chạm mở lớp nội dung; ảnh, audio, video, phóng to và QR. Đã xem ảnh chụp ứng dụng, không lấy giao diện trình biên tập làm giao diện cho khách. | Giữ ảnh đầy đủ trong lớp quan sát, điểm chạm và danh sách chi tiết; tóm tắt trước, hỏi sâu sau; media chỉ mở theo yêu cầu. |
| [ArtLens Wall / Cleveland Museum of Art](https://www.clevelandart.org/artlens-gallery/artlens-wall) | Tìm hiểu từ hình ảnh và các nhóm chủ đề, có thể chọn riêng điều thu hút mình. Đây là tham chiếu cho cách khám phá, không phải sao chép bố cục một bức tường nhiều người dùng sang kiosk đơn. | Danh sách sáu câu chuyện với bộ lọc, mở độc lập và giữ lựa chọn khi quay lại. |
| [Cooper Hewitt: Designing the Pen](https://www.cooperhewitt.org/new-experience/designing-pen/) | Trải nghiệm lịch sử dùng bàn tương tác để khám phá hình ảnh, thông tin ngữ cảnh và các đối tượng liên quan. Trang ghi rõ Pen được sử dụng 2015–2020. | Giữ đường chuyển sang câu chuyện liên quan và cho phép xem tiếp ở thiết bị cá nhân; không bổ sung phần cứng Pen hoặc yêu cầu tài khoản. |

Các quyết định bố cục là phần diễn giải cho bài toán Cồn Chim, không phải một tiêu chuẩn chung do các nguồn trên quy định. Không sao chép ảnh tác phẩm, thương hiệu hoặc phần mềm của các trường hợp tham chiếu vào sản phẩm.

## Hệ thống hình ảnh

Dùng đúng Montserrat Black của bảo tàng cho tiêu đề và Space Mono cho mô tả ngắn, với Arial cho nút và phần đọc. Native CSS / React / Lucide có sẵn. DESIGN_VARIANCE 4, MOTION_INTENSITY 3, VISUAL_DENSITY 7, ưu tiên bám mẫu và đọc được trên màn lớn.

Màn mở đầu theo bố cục bảo tàng: ảnh tràn khung, tiêu đề ở trái, ba lựa chọn sở thích, dock năm mục, đổi ảnh thủ công và dải tên ảnh phía dưới. Chữ và ảnh dùng chung một bố cục, thay các khối trắng rời của bản trước.

Khung và chữ theo sắc độ bảo tàng, có lớp hỗ trợ đọc cục bộ ở trái. Ảnh không dùng filter, blur, mask hoặc giảm opacity; vùng ảnh chính phía phải giữ màu gốc. Ảnh nền có thể cắt theo khung; lớp đọc và lớp quan sát hiển thị ảnh đầy đủ. Không tự chạy slideshow hoặc video. Chuyển động giới hạn ở phản hồi thao tác và mở cửa sổ, có reduced motion.

Ảnh mở đầu được thay bằng JPEG gốc 2441×1373 của Hữu Phúc / Báo Sài Gòn Giải Phóng, giữ nguyên byte nguồn. Thumbnail dùng bản nhẹ hơn. Đây là nâng chất lượng nguồn từ ảnh 1000 px, không phải tạo ảnh 4K hoặc làm nét bằng AI. Nguồn và tác giả hiển thị cạnh ảnh, được ghi tại `assets/CREDITS.md`.

## Màn mở đầu và đủ năm section

| Màn | Bố cục | Thao tác chính |
| --- | --- | --- |
| Giới thiệu | Ảnh rộng, tiêu đề hai dòng, ba sở thích, dock năm mục | Chọn sở thích hoặc vào thẳng một section; đổi ảnh thủ công |
| 01 Tổng quan | Ảnh sông/cồn, dải ba chủ đề, vùng đọc tiếp phía dưới | Chọn gian bếp, ruộng/ao, người dân hoặc mở điểm khám phá |
| 02 Điểm khám phá | Sơ đồ chủ đề bên trái, sáu thẻ câu chuyện bên phải; có bộ lọc và chế độ chỉ danh sách | Mở bất kỳ chuyện nào; giữ bộ lọc và điểm đã mở khi quay lại |
| 03 Chuyện của cồn | Banner, dòng thời gian nối ba mốc; bên dưới là ngữ cảnh / ảnh / lối đọc sâu | Đổi mốc ngay trên màn, đọc/nghe hoặc hỏi sâu; phần chữ dài cuộn riêng |
| 04 Đời sống & con người | Một cảnh ảnh lớn, giới thiệu và công cụ đọc ở trái, dải ba chủ đề phía dưới | Đổi chủ đề, hỏi sâu, quan sát ảnh, xem nguồn |
| 05 Trải nghiệm | Ba lựa chọn ảnh lớn, một vùng xem trước cho lựa chọn hiện tại | Xem các bước bắt đầu hoặc quan sát đường làng; hỏi thêm |

Năm mục đều là màn nội dung đầy đủ. Dock không dùng dialog thay section. Thanh chuyển section ở cùng vị trí phía dưới: màn đầu có tiến trình nhỏ như bảo tàng; các màn nội dung có tên năm mục và trước/tiếp. QR luôn mở nội dung tương ứng lựa chọn hiện tại. Đổi section giữ mốc lịch sử, chủ đề con người và hoạt động; nút Màn chính chủ động làm mới cho lượt khách tiếp theo.

## Chức năng khảo sát được giữ

- Tóm tắt ba ý, đọc thêm tùy chọn, nghe tiếng Việt bằng giọng thiết bị; tạm dừng, tiếp tục và dừng khi rời nội dung.
- Câu hỏi độc lập, nguồn và ngày, phân biệt tư liệu đối chiếu với gợi ý hỏi người dân.
- Phóng ảnh, điểm chạm, ẩn/hiện chú giải và danh sách chi tiết; lỗi ảnh có trạng thái và thử lại.
- Xem trước hoạt động, nguyên liệu/dụng cụ, ba bước cho người mới, quyền bỏ qua, gợi ý ứng xử có lý do.
- QR tạo cục bộ, giữ đúng chuyện/chế độ/câu hỏi/chi tiết/bước; ghi chú tự nguyện chỉ ở trang mang theo trên điện thoại.
- Không có tài khoản, lời kể giả, video tự phát hoặc lời hứa về lịch đón khách chưa xác minh.

Chưa có URL công khai: cấu hình `VITE_CON_CHIM_PUBLIC_URL` sau như đã thống nhất. Localhost hiển thị trạng thái chưa sẵn sàng, không tạo QR trỏ vào máy của khách. Sơ đồ là bản đồ chủ đề, được ghi rõ không dùng chỉ đường. Chi tiết phạm vi tư liệu và nhu cầu KT01–KT07 nằm trong [đối chiếu khảo sát](con-chim-personas.md).

## Xác minh

TypeScript và build Vite; bộ tương tác KT01, bộ KT02–KT07, kiểm tra chạm 4K, khung bản đồ thực và ảnh chụp các section. Kiểm tra 3840×2160, 2560×1440, 1920×1080 với DPR 2, 1280×720 và trang mang theo 390/320 px. Kiểm tra thêm hình học nhãn dòng thời gian để ngăn chồng lên phần nội dung bên dưới.

Lighthouse được chạy lại sau khi thay ảnh gốc. Báo cáo: `.browser-profile/con-chim-reference-lighthouse.json`. Các chỉ số là kết quả ở localhost, không thay thế phản hồi thẩm mỹ hoặc thử thao tác trên màn hình lắp đặt thực tế.

Kết quả bản cuối: performance 92, accessibility 100, best practices 100, LCP 1,8 giây, CLS 0; kiểm tra tương phản qua. Hai bộ tương tác và tích hợp khung bản đồ 4K đều qua. Đối chiếu 148 file bảo tàng: không có thay đổi.

Ảnh xem lại: `preview/con-chim-personas-4k-home.png`, `preview/con-chim-personas-4k-overview.png`, `preview/con-chim-kt01-4k-explore.png`, `preview/con-chim-personas-4k-history.png`, `preview/con-chim-personas-4k-community.png`, `preview/con-chim-personas-4k-experiences.png`. Các ảnh 1280 px tương ứng được chụp trong bộ kiểm tra.
