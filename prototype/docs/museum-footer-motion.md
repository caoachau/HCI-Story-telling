# Footer bảo tàng và ảnh 03 Đền thờ Bác

Cập nhật theo yêu cầu và ảnh cung cấp ngày 27/10/2026.

## Bảo tàng Văn hóa Khmer

- Chuyển năm mục từ dock trong màn giới thiệu thành footer dùng chung ở mọi section. Giữ tông nâu/vàng; mục đang chọn là viên nền vàng nâu. Footer nằm sát đáy, rộng toàn màn hình, cùng hình thức với Đền thờ Bác.
- Tổng quan trong footer trở về màn giới thiệu có ảnh nền và ba hướng khám phá. Nút “Khám phá bảo tàng” và liên kết bỏ qua tiếp tục mở phần tổng quan chi tiết. Cả hai trạng thái đều thuộc mục footer đầu tiên; các section vẫn có thể được duyệt bằng PageUp/PageDown và cử chỉ hiện có.
- Ba ảnh hướng khám phá tăng từ khoảng 4.8cqw lên 8cqw, tối đa 240 px. Trên điện thoại ảnh dùng trọn chiều rộng ô; màn ngang thấp dùng ảnh 56 px để giữ đủ ba mục.
- Ảnh nền bỏ mặt nạ tối hai bên và các lớp tối chồng nhau. Một gradient nhẹ hỗ trợ đọc chữ; footer dùng nền tối 50% với blur 6 px.
- Cụm QR/toàn màn hình/đóng chuyển lên góc phải trên, dùng cùng tọa độ, kích thước và đường chia nút như Đền thờ Bác, giữ màu vàng. QR cũng hoạt động khi mở trang bảo tàng độc lập.
- Chuyển section dùng hai section thật cùng được vẽ trong 0.38–0.48 giây. Section cũ tạm thời có `inert` và `aria-hidden`; section mới hiện đồng thời. Kết thúc sẽ ẩn section cũ và dọn style. Không dùng scale, không chờ tối màn hình rồi mới đổi nội dung, không có màn quét tối. Bấm liên tục giữ yêu cầu cuối; giảm chuyển động và thu nhỏ trang dừng/chốt chuyển cảnh.
- Các viewer vẫn làm mờ/vô hiệu footer và cụm công cụ khi mở. Hoàn nguyên tiêu điểm và hiệu ứng nhấn mục Di sản chuyển sang footer mới.

Mã chính: `MuseumChrome.tsx`, `museum-chrome.css`, `useMuseumScreens.ts`. Bỏ dock và animation dock cũ trong `KhmerMuseumIntro.tsx` / `useKhmerIntroMotion.ts`.

## Đền thờ Bác

Tab ảnh 03 dùng nguyên tệp PNG 1774 × 887 được người dùng cung cấp. Căn theo câu chữ ở y=80 và đáy bệ ở y=790; cùng một tỷ lệ cho hai chiều. Trên màn ngang, câu chữ tránh cụm công cụ và bệ nằm trên footer. Chỉ có một lớp ảnh, tránh xuất hiện hai cột chữ do ghép bản lấp nền. Ảnh 01, 02 và các nội dung đọc hiện có tiếp tục dùng nguồn riêng.

Nguồn, hash và cách căn: `src/assets/den-tho-bac/overview-remake/manifest.json` và `README.md` cùng thư mục.

## Kiểm tra

- TypeScript và build Vite đạt.
- `tests/museum-chrome-test.cjs`: 179 kiểm tra đạt, gồm bảy kích thước màn hình, footer, ba ảnh, công cụ, QR, chuyển cảnh, bấm nhanh, giảm chuyển động, mở/thu nhỏ/mở lại/đóng từ bản đồ và ảnh 03.
- `tests/den-tho-bac-overview-test.cjs`: 193 kiểm tra đạt, gồm ba ảnh trên 11 kích thước, câu chữ/bệ ảnh mới, tự chuyển, tạm dừng, retry, nguồn và cảm ứng 4K.
- Audit tài nguyên: không thiếu tệp, không có tài nguyên không dùng trong phạm vi kiểm tra hiện có.

Ảnh xem trước: `preview/den-tho-bac-museum-chrome-1920x1080.png`, `preview/den-tho-bac-museum-chrome-390x844.png`, `preview/den-tho-bac-statue-new-1920.png`.
