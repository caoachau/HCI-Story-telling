# Nhà trưng bày Đền thờ Bác Hồ

Ngày triển khai: 27/10/2026. Nguồn: 93 ảnh thực tế trong thư mục `F:\1. Đang lam\tmp\ntb`.

## Hiện trạng và hướng thiết kế

Điểm 02 trước đây dùng ảnh sơ đồ trên cao, ba đoạn giới thiệu chung và ảnh bối cảnh. Bộ ảnh mới cho thấy mô hình ngôi đền, tư liệu trên nền xanh, các tủ nền vàng/đỏ và nhiều ảnh về việc xây dựng, gìn giữ di tích. Chưa có ảnh panorama hoặc sơ đồ mặt bằng đủ cơ sở để dựng phòng 360°.

Giữ giao diện đọc tối, chữ trắng ngà, màu đỏ nhấn, footer sáu phần, nguồn tư liệu, giọng đọc theo yêu cầu, native dialog, Escape và trả tiêu điểm. Chỉ thay phần chi tiết của `map-exhibition` và ảnh/tóm tắt ở điểm 02; các câu chuyện khác giữ bố cục đang có.

## Tổ chức đủ ảnh

| Chủ đề | Số ảnh | Vai trò |
| --- | ---: | --- |
| Nhìn bao quát | 5 | Mô hình, tủ kính, sơ đồ và sa bàn |
| Quê hương & gia đình | 11 | Chân dung, ngôi nhà và nơi chốn |
| Hành trình qua tư liệu | 13 | Tranh, sách báo và tư liệu giấy |
| Dấu mốc & những cuộc gặp | 16 | Cụm ảnh, hoạt động và bảng trích dẫn |
| Những người xây, giữ đền | 6 | Các mảng chân dung và ảnh gắn với đền |
| Hiện vật & kỷ vật | 26 | Góc rộng và chi tiết trong tủ kính |
| Ngôi đền trong ký ức | 6 | Ảnh đen trắng và ảnh màu |
| Tiếp nối hôm nay | 10 | Hoạt động tham quan, tưởng niệm và trao tặng |
| Tổng | 93 | Mỗi ảnh thuộc đúng một nhóm |

## Trải nghiệm

Chữ cuộn ở cột trái, ảnh và chú thích giữ ở cột phải. Cuộn sang chủ đề mới sẽ mở ảnh đầu của nhóm đó. Chọn thumbnail hoặc trước/sau sẽ mở đúng ảnh và đưa nội dung về chủ đề tương ứng. Các góc chụp trùng mảng trưng bày vẫn được giữ để đối chiếu, không loại bỏ.

Ảnh lớn hiển thị trọn khung; phóng 100–300%, kéo bằng chuột hoặc cuộn/cảm ứng để xem kỹ nhãn. Bộ đếm đi theo lộ trình 93 ảnh. Nút “Toàn bộ 93 ảnh” mở bảng ảnh theo tám nhóm trong cùng cửa sổ. Điện thoại đặt ảnh cố định phía trên nội dung cuộn; màn hình ngang thấp giữ hai cột và rút gọn thanh công cụ.

Ảnh được giải mã trước khi thay ảnh đang hiển thị; lựa chọn cũ không thể ghi đè ảnh mới. Tải lỗi giữ lại ảnh trước và cho thử lại. Chỉ tải trước ảnh kế tiếp; thumbnail dùng lazy loading. Ảnh gốc, chú thích và nguồn vẫn có thể xem khi bật giảm chuyển động.

Đối chiếu nguồn và SHA-256: [exhibition-user/README.md](../src/assets/den-tho-bac/exhibition-user/README.md), [manifest.json](../src/assets/den-tho-bac/exhibition-user/manifest.json).

## Kiểm tra

- TypeScript và build Vite đạt.
- `tests/den-tho-bac-exhibition-test.cjs`: 143 kiểm tra đạt, gồm chín kích thước 320 px–4K, đủ 93 ảnh giải mã được theo hành trình, giữ nguyên byte ảnh gốc, cuộn đồng bộ chủ đề, xem toàn bộ ảnh, phóng/thu, bàn phím, lỗi/thử lại, nguồn ảnh, cảm ứng và trả tiêu điểm.
- `tests/den-tho-bac-reader-gallery-test.cjs`: 71 kiểm tra đạt cho các câu chuyện hiện có, bao gồm tải ảnh chậm, lỗi ảnh và giảm chuyển động.
- `tests/den-tho-bac-spaces-test.cjs`: 100 kiểm tra đạt cho tám điểm trên bản đồ, danh sách/tóm tắt, nguồn sơ đồ, thu phóng và cảm ứng.
- Kiểm tra tài nguyên: không thiếu tệp và không có tệp runtime không sử dụng.
