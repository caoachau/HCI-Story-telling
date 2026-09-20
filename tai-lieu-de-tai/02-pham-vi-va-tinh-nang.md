# PHẠM VI VÀ DANH SÁCH TÍNH NĂNG

Phiên bản 1.0 · 19/09/2026 · Căn cứ dựng prototype Figma.

## 1. Các quyết định làm nền

- Sản phẩm chính: bàn tương tác có màn hình cảm ứng lớn đặt nằm nghiêng, một hướng đọc từ cạnh trước.
- Người dùng: cá nhân hoặc nhóm dùng chung một phiên; một người thao tác tại một thời điểm.
- Trải nghiệm trung tâm: bản đồ → câu chuyện theo lựa chọn → tương tác → tiếp tục khám phá.
- Hướng dẫn: nút “? Hướng dẫn” trong giao diện; nhân sự tại chỗ hỗ trợ khi cần.
- Nội dung không tự chuyển cảnh. Quá 5 phút giữ nguyên một nội dung sẽ tự trở về màn hình chờ.
- Figma là sản phẩm trình diễn tương tác; media, panorama và bộ đếm có thể được mô phỏng và phải được ghi rõ trong tài liệu bàn giao.

## 2. Phạm vi nội dung bản đầu

| Địa điểm | Mức triển khai |
| --- | --- |
| Ao Bà Om | Nội dung hoàn chỉnh: hai nhánh, panorama, quiz, tổng kết |
| Chùa Âng | Marker và thẻ giới thiệu có nguồn; là điểm đến sau khi khám phá Ao Bà Om. Kịch bản đầy đủ được viết ở đợt sau |
| Bảo tàng Văn hóa Khmer, Chùa Hang, Cồn Chim, Biển Ba Động | Marker và thẻ giới thiệu ngắn sau khi kiểm chứng tư liệu; ghi rõ câu chuyện chưa có trong bản demo |

Sáu marker phục vụ cách tổ chức khám phá; không đồng nghĩa sáu câu chuyện hoàn chỉnh. Không gắn nút “Bắt đầu câu chuyện” hoạt động giả cho nội dung chưa có. Bản đồ là sơ đồ khám phá vùng văn hóa Trà Vinh, không phải bản đồ chỉ đường hoặc khẳng định địa giới hành chính hiện hành.

## 3. Tính năng bắt buộc và tiêu chí hoàn thành

| ID | Tính năng | Hành vi bắt buộc | Tiêu chí kiểm tra |
| --- | --- | --- | --- |
| F01 | Màn hình chờ | TVC hoặc chuỗi hình lặp, lời mời “Chạm để khám phá”; mặc định tắt tiếng | Chạm vùng mời mở bản đồ ở trạng thái ban đầu |
| F02 | Bản đồ | Sáu marker; có thẻ/danh sách địa điểm ở vùng gần cạnh trước | Chọn được Ao Bà Om bằng marker và bằng thẻ |
| F03 | Bộ lọc | Tất cả, Văn hóa, Thiên nhiên; marker và danh sách đổi đồng bộ | Bỏ lọc trả lại đầy đủ địa điểm; có thông báo nếu không có kết quả |
| F04 | Focus và popup | Nhấn marker làm nổi địa điểm, mở ảnh và giới thiệu; bản đồ còn nhìn thấy | Đóng popup quay về đúng bản đồ, không bắt đầu lại phiên |
| F05 | Câu chuyện | Cảnh ngắn, nút trước/sau, chỉ báo vị trí; người dùng chủ động chuyển | Đi được từ mở đầu đến tổng kết; nút quay lại có điểm đến xác định |
| F06 | Chọn nhánh | Hai nhánh nội dung riêng: Truyền thuyết; Văn hóa – lễ hội | Đổi nhánh được; tiêu đề và nội dung đúng nhánh |
| F07 | Audio và văn bản | Play/pause, phụ đề, transcript; văn bản chứa đủ nội dung cốt lõi | Theo dõi được khi tắt tiếng; audio cảnh trước dừng khi chuyển cảnh |
| F08 | Panorama/hotspot | Một không gian minh họa, hai hotspot thông tin; có nút xoay trái/phải bên cạnh thao tác kéo | Mở, đóng hotspot; thoát về đúng nơi đã mở; ghi rõ phần mô phỏng |
| F09 | Quiz | Một câu cho mỗi nhánh, phản hồi đúng/sai và giải thích; cho phép bỏ qua | Sai không khóa hành trình; câu hỏi chỉ dựa trên nội dung đã trình bày |
| F10 | Tổng kết | Hiển thị nhánh đã xem, quiz đã trả lời hay bỏ qua; chọn nhánh khác hoặc điểm tiếp theo | Không hiển thị “100% toàn bộ Ao Bà Om” khi mới xem một nhánh |
| F11 | Hướng dẫn | Ba bước ngắn bằng hình và chữ; nút đóng | Có thể mở khi chưa biết thao tác; đóng về ngữ cảnh trước đó |
| F12 | Trợ năng | Chữ thường/lớn, tương phản cao, phụ đề, giảm chuyển động | Có trạng thái sau thay đổi trên bản đồ và ít nhất một cảnh truyện; chữ không che nút |
| F13 | Kết thúc và đặt lại | Nút kết thúc có xác nhận; quá thời hạn nội dung tự về chờ | Dừng media, đóng popup, xóa tiến độ và lựa chọn, về mặc định |
| F14 | Điều hướng chung | Bản đồ, Quay lại, ? Hướng dẫn, Trợ năng, Kết thúc | Luồng đang dùng không có nút cụt; overlay đóng về nội dung trước |

Mặc định đầu phiên: không có địa điểm/nhánh được chọn; bộ lọc Tất cả; chữ thường; tương phản thường; phụ đề bật; âm thanh tắt. Chuyển động nền chỉ ở mức nhẹ, có cách giảm. Không dùng màu làm dấu hiệu duy nhất cho câu trả lời hoặc trạng thái đã xem.

## 4. Phần mở rộng

| Tính năng | Điều kiện triển khai sau |
| --- | --- |
| 3D Chùa Âng | Có tư liệu/model phù hợp và luồng Ao Bà Om đã kiểm thử |
| QR mở trên điện thoại | Có trang đích hoặc mẫu màn hình phụ rõ ràng; không mặc định chuyển tiến độ |
| Chuỗi khám phá theo chủ đề | Có đủ câu chuyện hoàn chỉnh để nối |
| Timeline lịch sử | Có mốc thời gian và nguồn xác thực; không dùng truyền thuyết làm niên đại |
| Tìm kiếm bằng bàn phím | Chỉ thêm khi số địa điểm tăng; bản đầu dùng danh sách và lọc |

AR, đăng nhập, tài khoản cá nhân, đặt tour/phòng, nhận diện vị trí tự động và tương tác nhiều người đồng thời nằm ngoài phạm vi bản demo đầu.

## 5. Quy tắc phiên 5 phút

R01. Một phiên bắt đầu khi khách chạm từ màn hình chờ vào bản đồ.

R02. Một “nội dung” là một màn chính đang xem: bản đồ tổng, thẻ địa điểm, cảnh truyện, màn chọn nhánh, panorama, câu hỏi hoặc tổng kết. Mỗi nội dung có mã riêng trong sơ đồ điều hướng.

R03. Bộ đếm bắt đầu khi mở nội dung chính. Khi thời gian hiển thị vượt 300 giây, hệ thống trở về chờ. Chuyển sang nội dung chính khác bắt đầu bộ đếm mới; cả lượt khám phá có thể dài hơn 5 phút.

R04. Chạm chỗ trống, kéo bản đồ/panorama, lọc trên cùng bản đồ, chỉnh âm lượng, bật phụ đề hoặc phản hồi đáp án trong cùng câu hỏi không tạo nội dung chính mới và không làm mới bộ đếm.

R05. Hướng dẫn, trợ năng, transcript, nguồn tham khảo, hotspot và xác nhận kết thúc là lớp phủ của màn hiện tại. Mở/đóng chúng không đặt lại và không tạm dừng bộ đếm. Quay lại một màn chính khác bắt đầu một lượt hiển thị mới cho màn đó.

R06. Đang đọc hoặc đang phát media vẫn chịu giới hạn 5 phút theo yêu cầu hiện tại. Không thêm gia hạn hay hộp hỏi tiếp tục tự động vào bản đầu. Kịch bản chia cảnh ngắn và không dùng một media dài hơn 5 phút.

R07. Kết thúc chủ động: nút “Kết thúc” → “Kết thúc lượt khám phá này?” → “Tiếp tục khám phá” đóng hộp thoại hoặc “Kết thúc” đưa về chờ. Việc đóng hộp thoại không làm mới thời gian của nội dung đang xem.

R08. Sau kết thúc hoặc quá hạn, xóa dữ liệu tạm: địa điểm, nhánh, cảnh, đáp án và cờ đã xem; dừng media; đặt bản đồ, bộ lọc và trợ năng về mặc định. Phiên sau không kế thừa lựa chọn của khách trước.

R09. Figma phải thể hiện được kết quả đặt lại. Nếu giới hạn công cụ không mô phỏng chính xác bộ đếm xuyên nhiều lớp phủ, ghi rõ giới hạn này. Có thể làm một luồng kiểm tra riêng rút ngắn thời gian, được đánh dấu “Minh họa timeout — thời gian thực là 5 phút”; không thay đổi quy tắc nghiệp vụ.

## 6. Cấu trúc màn hình để dựng Figma

| Mã | Nhóm frame | Ghi chú |
| --- | --- | --- |
| K01 | Chờ | Điểm bắt đầu và điểm về sau reset |
| K02 | Bản đồ | Thường, lọc, chọn bằng danh sách |
| K03 | Popup địa điểm | Ao Bà Om; Chùa Âng; bốn thẻ giới thiệu |
| K04 | Mở đầu câu chuyện | C01 trong kịch bản |
| K05 | Chọn nhánh | C02 trong kịch bản |
| K06 | Cảnh truyện | A01–A03 và B01–B03 |
| K07 | Panorama và thông tin | P01, H01–H02; transcript là overlay |
| K08 | Quiz | QA, QB và các trạng thái trả lời |
| K09 | Tổng kết | E01, thay nội dung theo nhánh |
| K10 | Hướng dẫn, trợ năng | Overlay, có biến thể chữ và chuyển động |
| K11 | Kết thúc | Xác nhận và đường về K01 |

Đây là 11 nhóm frame, không phải 11 frame tổng cộng. Nên tách các page Figma: 00_Brief, 01_Flow, 02_Components, 03_Wireframe, 04_Prototype, 05_Test. Đây là quy ước đặt tên của nhóm.

## 7. Nguyên tắc bố cục bàn nghiêng

- Khởi đầu bằng frame 1920 × 1080; chỉ dùng như kích thước thiết kế, không suy ra kích thước chạm ngoài thực tế.
- Vùng xa ưu tiên hình ảnh; vùng gần ưu tiên lựa chọn và nút điều khiển. Có danh sách thay thế cho marker/hotspot xa.
- Mỗi cảnh một ý chính; vị trí nút trước/sau nhất quán. Nội dung hướng về cạnh trước của bàn.
- Phong cách màu: xanh rừng, kem, nâu đất; kiểm tra độ đọc được trước khi chốt màu chữ và nền.
- Khi người dùng đang đọc, giảm chuyển động không cần thiết. Không yêu cầu vuốt, kéo hoặc dùng nhiều ngón để hoàn thành nhiệm vụ cốt lõi.
- Đánh giá khả năng nhìn và chạm bằng bố trí gần thiết bị thật. Demo chuột trên laptop không đủ chứng minh tầm với.

## 8. Checklist bàn giao và kiểm thử

- [ ] Từ K01 đi được đến tổng kết của cả hai nhánh mà không cần người trình diễn bấm hộ.
- [ ] Mở panorama trực tiếp từ popup rồi quay lại đúng popup; mở từ truyện rồi trở về đúng cảnh.
- [ ] Chọn nhánh khác, trả lời sai, bỏ qua quiz, mở trợ năng và kết thúc đều có kết quả rõ.
- [ ] Xem được nguồn của nội dung; ảnh minh họa truyền thuyết có nhãn phân biệt.
- [ ] Người mới bắt đầu phiên không thấy lựa chọn và tiến độ của phiên trước.
- [ ] Trạng thái “chưa có trong demo” không dẫn vào màn rỗng.
- [ ] Kiểm tra với 3–5 người: bắt đầu, chọn Ao Bà Om, đổi nhánh, dùng không âm thanh và kết thúc.
- [ ] Ghi số người hoàn thành không cần hỗ trợ, chỗ bấm nhầm, thông tin nhớ được và khó khăn về tầm với; chưa điền kết quả giả.

Sau khi đạt các mục trên mới ưu tiên làm đẹp TVC, mở rộng Chùa Âng hoặc bổ sung 3D.
