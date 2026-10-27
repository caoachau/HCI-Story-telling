# Kiểm tra hiệu ứng Đền thờ Bác Hồ

Ngày 27/10/2026. Đã triển khai theo [kế hoạch](den-tho-bac-motion-plan.md) trên trang độc lập và trang chi tiết mở từ bản đồ.

## Kết quả

- `npm run build`: đạt, đủ năm điểm vào ứng dụng.
- `npm run lint`: đạt kiểm tra TypeScript.
- `node scripts/audit-unused.mjs`: không thiếu tài sản, không còn tệp runtime thừa; 36.551 tile và 40 tệp nguồn/tham chiếu có mục đích được giữ.
- 116 tài sản ảnh/phông trong bản chụp trước triển khai giữ nguyên SHA-256.
- Chín bộ kiểm tra trình duyệt đạt, với 1.154 dòng xác nhận PASS và các assertion bổ sung. Không ghi nhận exception của ứng dụng trong các luồng được kiểm tra.

| Bộ kiểm tra trong `tests/` | PASS | Nội dung chính |
| --- | ---: | --- |
| `den-tho-bac-motion-test.cjs` | 37 | Điều phối sáu mục; đổi nhanh; ảnh lịch sử chậm; tiến độ đọc trên hai vùng cuộn; focus; reduced motion; cảm ứng 4K; Three.js chỉ render khi cần; mất context; cleanup sau unmount; mở/thu nhỏ/mở lại từ bản đồ và nhận tùy chọn host. |
| `den-tho-bac-overview-test.cjs` | 192 | Ba ảnh, tỷ lệ và vùng căn, CTA, điều khiển tự chuyển, lỗi ảnh/thử lại, chế độ cảm ứng. |
| `den-tho-bac-history-test.cjs` | 382 | Bảy mốc, chữ số native, đúng ảnh và câu chuyện, bảy hướng chuyển cảnh, bàn phím, lỗi ảnh và lựa chọn cuối cùng. |
| `den-tho-bac-spaces-test.cjs` | 99 | Tám điểm và tọa độ ghim, danh sách/tóm tắt, tám kiểu vào panel, kéo/zoom, focus và thao tác chạm. |
| `den-tho-bac-people-test.cjs` | 119 | Hai bố cục, vùng cắt đã duyệt, menu cố định, không khôi phục nhãn đã xóa, đọc/nghe và thử lại ảnh. |
| `den-tho-bac-activities-test.cjs` | 47 | Bốn ảnh và câu chuyện, bố cục desktop/mobile, nút trên footer, thao tác chạm và thử lại ảnh. |
| `den-tho-bac-values-test.cjs` | 94 | Bốn trang sách, nội dung và CTA tương ứng, chờ ảnh, lỗi/thử lại, điều hướng và reduced motion. |
| `den-tho-bac-book-motion-test.cjs` | 38 | Tờ kính, mask và gáy ở các góc 0°/45°/90°/135°/180°; khóa thao tác; commit sau 900 ms; ghi hình và lấy mẫu giữa lượt; ảnh đích tải chậm. |
| `den-tho-bac-navigation-test.cjs` | 146 | Hình học footer chung, sáu nút, nội dung và công cụ không bị che trên màn lớn; footer cố định trên mobile. |

Chạy từng bộ bằng `node tests/<tên-tệp>.cjs` sau khi build. Bộ motion nhận `--skip-host` nếu chỉ kiểm tra trang độc lập; mặc định kiểm tra cả luồng bản đồ thật. Chế độ `--baseline` chỉ dùng khi chủ động chụp lại mốc đối chiếu, vì sẽ ghi đè ảnh trong `preview/motion-before/`.

## Đối chiếu hình ảnh và thao tác

Chrome trên Windows; các bộ kiểm tra dùng nhiều viewport từ 320 × 720 đến 3840 × 2160, gồm 390 × 844, 768 × 1024, 1280 × 720 và 1920 × 1080. Cảm ứng được mô phỏng bằng CDP với `pointer: coarse`; giảm chuyển động kiểm tra cả media query hệ điều hành và thông điệp từ host.

- `preview/motion-before/`: ảnh trước và giữa lượt của các lựa chọn ở sáu mục, chụp từ bản build trước triển khai.
- `preview/motion-after/`: sáu mục desktop, Hoạt động mobile và khung ảnh trong cửa sổ đọc.
- [Đối chiếu lật sách](../preview/values-page-turn-review.html): giữ ảnh ở các góc giữa lượt và video đối chiếu hiện có.
- `preview/motion-after/book-motion-samples.json`: thời điểm và transform lấy mẫu từ lượt lật thật sau triển khai.
- Log kiểm tra cuối ở `preview/motion-*.log`. Ảnh/cache tạm của ma trận kiểm tra vẫn nằm trong `preview/` và `.browser-profile/`, đều đã được Git bỏ qua. Lệnh dọn lần này bị cơ chế duyệt tự động chặn với lý do “blocked by policy”; không ảnh hưởng bản build hay kết quả kiểm tra.

Rà ảnh thực tế đã phát hiện dòng hướng dẫn cuối mục Hoạt động bị ép quá hẹp trên điện thoại; đã chuyển thành bố cục hai cột nhỏ, nút ở hàng riêng. Đồng thời năm, tiêu đề và câu chuyện Lịch sử chỉ đổi khi ảnh đích đã sẵn sàng, tránh ghép nội dung mới với ảnh cũ.

## Giới hạn

Kiểm tra xác nhận khung Three.js ngừng render khi đứng yên, phục hồi ảnh HTML khi WebGL lỗi và không được bật trên màn cảm ứng. Ảnh HTML cùng chú thích vẫn tồn tại khi xem khung 3D. Các timeline và observer được thu hồi theo vòng đời component; chuyển tab liên tục không còn ghi animation vào component đã gỡ.

Chưa đo FPS/INP hay mức dùng GPU trước/sau trên kiosk vật lý. Viewport 4K và touch emulation kiểm tra bố cục/hành vi, không chứng minh hiệu năng của phần cứng triển khai. T01 vì vậy giữ trạng thái tùy chọn cho chuột, mặc định hiển thị ảnh thường.
