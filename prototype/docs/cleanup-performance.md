# Dọn dữ liệu và tối ưu hiệu suất — 04/10/2026

> Ghi ch?p l?ch s?. ??t d?n 27/10/2026 ?? x?a giao di?n C?n Chim c? v? ba b? test ch? d?nh cho giao di?n ??. Ki?m tra hi?n t?i d?ng `tests/con-chim-kt01-test.cjs`, `tests/con-chim-personas-test.cjs`; xem [b?o c?o d?n repo m?i](cleanup-2026-10-27.md). ?nh ki?m th? c? ???c d?n, c? th? t?o l?i b?ng c?c test t??ng ?ng c?n ???c duy tr?.

## Phạm vi dọn

Đối chiếu cả ba entry Vite (`index.html`, `con-chim.html`, `ao-ba-om.html`), import động, URL trong CSS và glob ảnh ghim bản đồ trước khi xóa. `npm run audit:unused` báo các file nguồn chưa được entry sử dụng; chỉ báo cáo, không tự xóa. Script không coi tài liệu, giấy phép hoặc tile URL sinh từ manifest là file dư.

- Xóa `_incoming-ui`, `.reference-assets`, ảnh/video chụp kiểm thử cũ và hồ sơ Chrome kiểm thử cũ.
- Xóa prototype HTML/JS tĩnh đã được React thay thế, cùng hai bộ test dành riêng cho prototype đó.
- Xóa giao diện Cồn Chim cũ, dữ liệu/cảnh Hạ Long và ảnh mẫu không được entry hiện tại import; dọn hai tài liệu thiết kế đã lỗi thời.
- Dọn JPG trùng WebP, ảnh tham khảo và vector không dùng. Giữ nguồn ảnh, prompt, giấy phép phông và tài liệu đề tài.
- Build sạch để loại bỏ asset mang hash của các lần build cũ. Giữ bộ tile bản đồ và manifest đang được các dịch vụ bản đồ sử dụng.

## Tối ưu đang chạy

| Tài sản | Trước | Sau | Cách xử lý |
| --- | ---: | ---: | --- |
| Alpha mask bán cung Cồn Chim | 850.384 byte | 39.741 byte | PNG LA, kiểm tra từng byte alpha không đổi |
| 7 ảnh ghim bản đồ | 17.417.381 byte | 3.559.256 byte | 640 × 640 WebP lossless sau Lanczos; giữ nền trong suốt, phù hợp chiều rộng hiển thị 128 px |
| Toàn cảnh Ao Bà Om | 3.335.120 byte | 2.400.736 byte | WebP lossless, kiểm tra toàn bộ pixel RGB không đổi |

Ảnh trong dữ liệu di sản và so sánh Ao Bà Om dùng chung bản WebP hiện có, tránh tải cả JPG lẫn WebP của cùng ảnh. Kích thước ảnh giải mã của bộ ghim giảm từ 1254 × 1254 xuống 640 × 640 cho mỗi ảnh.

Thanh tiến độ Ao Bà Om cập nhật một style trong `requestAnimationFrame`; không đổi state số thực và render lại toàn bộ năm section ở mỗi bước cuộn. ResizeObserver đồng bộ lại tiến độ khi ảnh lazy làm đổi chiều cao tài liệu; thanh có chiều rộng đầy đủ trước khi scale. Lenis dùng một callback ticker có thể gỡ khi đóng trang. Timeline GSAP gỡ ScrollTrigger của nó khi unmount; hiệu ứng magnetic ghi đè tween cũ và dừng khi gỡ phần tử.

Tailwind chỉ quét `src` và ba entry HTML theo [cấu hình nguồn chính thức](https://tailwindcss.com/docs/detecting-classes-in-source-files). Hai dependency không dùng (`@studio-freight/lenis`, `autoprefixer`) và 11 package đi kèm đã được gỡ.

Các test trình duyệt tự đóng Chrome và xóa đúng profile do test đó tạo. `preview/` nằm trong `.gitignore` để ảnh chụp kiểm tra không vào source control.

## Kiểm tra

```powershell
npm run lint
npm run build
npm run audit:unused
node --experimental-vm-modules tests/motion-lifecycle-test.mjs
node tests/app-assets-test.cjs
node tests/con-chim-motion-test.cjs
node tests/con-chim-timeline-test.cjs
node tests/con-chim-zip-test.cjs --production-smoke
```

Test vòng đời kiểm tra 20 lần mở/đóng, chỉ một ticker khi mở và không còn ticker khi đóng. Test tài sản kiểm tra đủ bảy ghim WebP trên bản đồ ở DPR 2, năm section Ao Bà Om, ảnh so sánh, thanh tiến độ và lỗi tài nguyên nội bộ. Bộ Cồn Chim kiểm tra mở trang, cuộn/vuốt, toàn màn hình, ảnh tải chậm, modal/focus, bố cục desktop/mobile và reduced motion.

Tất cả các kiểm tra trên đã qua. Audit cuối: 0 file nguồn dư, 0 import thiếu. Đã xóa ảnh chụp kiểm thử vừa sinh; test tự dọn profile và thư mục profile rỗng cũng được xóa.

Dung lượng `src` giảm từ 48.773.586 xuống khoảng 8.830.000 byte; `assets` giảm từ 15.322.836 xuống 2.406.459 byte. Riêng các profile kiểm thử cũ chiếm 7.838.387.590 byte. Cộng nguồn/ảnh dư, incoming, reference, preview và asset build cũ, lần dọn này giải phóng khoảng **8,2 GB trên đĩa** (đơn vị thập phân). Dung lượng profile là dữ liệu phát triển, không phải dung lượng tải của ứng dụng.
