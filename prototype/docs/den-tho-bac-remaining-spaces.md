# Hoàn thiện các mốc Không gian còn lại

Phạm vi: **01 Đền thờ**, **03 Nhà đón tiếp khách**, **06 Nhà sàn Bác Hồ**, **08 Hồ sen**. Các bộ ảnh đã hoàn thiện của điểm 02, 04, 05 và 07 được giữ lại.

## Bố cục và nội dung

| Mốc | Nội dung | Ảnh trong cửa sổ |
| --- | --- | --- |
| 01 · Đền thờ | Phân biệt nhà bao che, ngôi đền nhỏ và bàn thờ; lịch sử dựng đền | 3 ảnh báo chí: lối vào, mặt trước ngôi đền, bàn thờ |
| 03 · Nhà đón tiếp | Định vị trên sơ đồ, câu hỏi chuẩn bị tham quan, gợi ý hành trình | Sơ đồ có đánh dấu 03, ảnh cổng và ảnh toàn khu ghi rõ là bối cảnh |
| 06 · Nhà sàn | Xác định phiên bản tại Trà Vinh năm 2012; quan sát cấu trúc | 2 ảnh chụp tại Trà Vinh: chính diện và bên hông |
| 08 · Hồ sen | Cảnh quan từ bờ hồ và mối liên hệ với lối đi, khuôn viên | Ảnh bờ hồ và sơ đồ toàn khu đánh dấu 08 |

Giữ bố cục đọc liên tục bên trái, ảnh cố định bên phải; ảnh đổi theo phần chữ đang đọc. Ảnh giữ nguyên tỉ lệ, không crop mất nội dung; chú thích và nguồn nằm dưới ảnh. Phóng ảnh 200% với thao tác kéo/cuộn gốc. Ở màn hình nhỏ, ảnh ở trên và chữ cuộn phía dưới; màn hình ngang thấp giữ hai cột để phần chữ còn đủ chiều cao.

Các dấu 03 và 08 là lớp giao diện căn theo vùng ảnh thực tế sau `object-fit: contain`. Tọa độ lấy từ `map-current-coordinates.json`, không phải GPS. Khi phóng ảnh, ẩn lớp dấu; khi thu lại, đánh dấu được căn lại. Không sửa pixel của ảnh/sơ đồ.

## Xác minh ảnh

Tải **8 JPEG gốc**, tổng **5.404.378 byte**, không nén lại hoặc phóng nội suy:

- 5 ảnh Báo Công lý: kích thước 2048 × 1365 hoặc 2048 × 1536.
- 3 ảnh Pháp Luật TP.HCM: 1920 × 1080 hoặc 3840 × 2160.
- Hai góc định vị dùng lại ảnh toàn khu 2560 × 1440 được người dùng cung cấp, không sao chép trùng tài nguyên.

Đường dẫn bài gốc, URL ảnh, ngày đăng, kích thước, dung lượng, mã SHA-256 và ghi chú xác minh từng ảnh được lưu trong `den-tho-bac-remaining-spaces-manifest.json`. Ảnh được lưu cục bộ để không phụ thuộc hotlink; nguồn bài báo vẫn truy cập qua nút dưới ảnh và trong cửa sổ Nguồn tư liệu.

**Giới hạn điểm 03:** chưa tìm được ảnh cận cảnh nhà đón tiếp với chú thích đủ để xác minh. Không gán ảnh cổng hoặc công trình khác là nhà đón tiếp. Ảnh cổng có chú thích rõ “không phải ảnh nhà đón tiếp”; sơ đồ đánh dấu đúng mốc theo bản người dùng cung cấp. Không tự thêm giờ mở cửa, giá vé hoặc dịch vụ đang hoạt động.

Không dùng ảnh nhà sàn ở Hà Nội/Cà Mau thay cho phiên bản tại Trà Vinh. Không dùng ảnh hồ sen ở địa điểm khác. Không nhầm bàn thờ ngôi đền nhỏ với tượng Bác ở nhà trưng bày. Không khẳng định lịch nở sen dựa trên ảnh.

## Nguồn đối chiếu

1. [Báo Công lý · 14/05/2023](https://congly.vn/den-tho-bac-ho-bieu-tuong-tam-long-trung-kien-cua-dong-bao-tinh-tra-vinh-378335.html): ảnh được chú thích riêng từng công trình.
2. [Báo Nhân Dân · 29/04/2022](https://nhandan.vn/chu-tich-quoc-hoi-dang-huong-den-tho-bac-ho-va-nghia-trang-liet-si-tinh-tra-vinh-post695210.html): khởi công, khánh thành lần đầu và phiên bản nhà sàn.
3. [Báo Nhân Dân · 27/01/2025](https://nhandan.vn/den-tho-bac-ho-niem-tu-hao-cua-nguoi-dan-tra-vinh-post857901.html): xác nhận phiên bản nhà sàn tại Trà Vinh.
4. [Pháp Luật TP.HCM · 30/01/2025](https://tuoitre.vn/plo/den-tho-bac-ho-tai-tra-vinh-bieu-tuong-long-biet-on-cua-mien-nam-post830292.html): bộ ảnh cổng, toàn khu, góc nghiêng nhà sàn.
5. [Báo Trà Vinh · 13/05/2023](https://travinh.baovinhlong.vn/xa-hoi/diem-den-cua-vung-dat-tra-vinh-28682.html): ghi nhận nhà đón tiếp trong khu di tích.
6. [Báo Thanh Niên · 18/04/2022](https://thanhnien.vn/tra-vinh-khanh-thanh-cong-trinh-tu-bo-khu-di-tich-lich-su-den-tho-bac-ho-1851449836.htm): các hạng mục tu bổ cảnh quan, gồm ao sen.

Đối chiếu ngày 27/10/2026. Nhận xét về bố cục, đường nét và gợi ý tham quan được biên soạn theo ảnh; các câu hỏi tại nơi đón tiếp là gợi ý cho du khách.

## Kiểm tra

- `npm run lint`
- Build Vite
- `node tests/den-tho-bac-remaining-spaces-test.cjs`
- `node tests/den-tho-bac-reader-gallery-test.cjs`
- `node tests/den-tho-bac-spaces-test.cjs`
- `npm run audit:unused`

Kết quả ngày 27/10/2026: TypeScript và build đạt; bộ kiểm tra bốn mốc mới **169 PASS**, bộ đọc ảnh **71 PASS**, bản đồ Không gian **100 PASS**. Xác minh từ 320 px đến 4K và màn hình ngang thấp; ảnh đúng nguồn, cuộn chữ/đổi ảnh, khung ảnh ổn định, tọa độ 03/08, nguồn, lỗi tải/thử lại, cảm ứng/giảm chuyển động, Escape và trả focus. Rà soát tài nguyên: **0 tệp thiếu, 0 tệp không dùng**.

Ảnh kiểm tra nằm tại `preview/den-tho-bac-remaining-map-{temple,reception,stilt-house,pond}-{width}x{height}.png`, với các kích thước 1404×790, 390×844 và 844×390.
