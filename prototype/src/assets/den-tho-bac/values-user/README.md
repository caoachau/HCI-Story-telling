# Giá trị di sản: bốn trang sách tương tác

## Cập nhật 26/10/2026: đường cong của tờ đang lật

- Tờ lật rộng đúng nửa sách và cao bằng khung sách. Phần nội dung dừng phía trên hàng điều khiển đứng yên; không dùng ảnh khung hai trang làm tờ lật.
- `RIGHT_LEAF_PATH` là đường Bézier chuẩn hóa theo một trang: mép trên và dưới hạ/nâng nhẹ vào gáy, mép trong lõm theo gáy, hai góc ngoài bo nhẹ. Trang trái là đường đối xứng. Hai clip-path dùng `objectBoundingBox` nên giữ hình dáng khi đổi kích thước.
- Wrapper chỉ giữ `rotateY`/`preserve-3d`; hai mặt chỉ giữ backface visibility. Mỗi mặt chứa một lớp con được clip theo đường SVG, bao trọn nội dung, nền kính và highlight. Viền 1,1px dùng cùng path/transform với clip; không còn border, shadow hay nền chữ nhật ở wrapper/mặt. Khung và viền ngoài sách vẫn là các lớp đứng yên.
- Đã dừng góc xoay thực tại 0°, 45°, 90°, 135°, 180° ở cả hai chiều. Kiểm tra hit-test của trình duyệt xác nhận góc vuông và khoảng lõm sát gáy nằm ngoài vùng hiển thị, còn nội dung trong trang được giữ. 39 kiểm tra chuyển động và 95 kiểm tra chức năng/bố cục đạt; TypeScript/build đạt. Bản quay mới có 129 frame của ba lượt lật tới/lui/chọn tab, đã xuất lại WebM.
- [Xem video và ảnh dừng theo góc](../../../../preview/values-page-turn-review.html). Tọa độ/góc thực: `.browser-profile/book-curve-angles.json`; ảnh: `preview/den-tho-bac-values-curve-{forward|reverse}-{góc}.png`. Mô tả clip bo góc đơn giản trong ghi chép cũ dưới đây đã được thay thế.

## Cập nhật 26/10/2026: tách khung đứng yên và tờ lật liên tục

- Giữ nguyên `glass-book-lossless.webp` (1893×831 RGBA, khớp từng pixel với PNG), nền phòng, bốn ảnh, chữ, kích thước sách, bốn tab và footer. Không tạo hoặc chỉnh sửa ảnh bằng AI trong lần sửa này.
- Nền phòng, ảnh khung kính/gáy và hai đường viền cong bổ sung nằm trên các lớp đứng yên. Asset vốn bị cắt sát vùng trong x63/y65/w1764/h700 nên viền hai bên bị mất; SVG bổ sung riêng hai cạnh và các góc nối với viền trên/dưới sẵn có, nét 1,1px không phóng dày ở 4K. Không xoay SVG hoặc ảnh khung.
- `.db-value-book-stage` giữ perspective/preserve-3d. Một `.db-value-turning-sheet` duy nhất tồn tại suốt vòng đời component, quay `rotateY(0 → ±180deg)` bằng một Web Animations API animation 900ms, easing mềm. Không đổi ảnh theo frame, không dùng `steps()`, timeout giữa trang hoặc key gây remount.
- Front/back là hai node riêng, đều ẩn mặt sau; back xoay 180°. Snapshot nội dung cố định từ đầu tới cuối lượt. Từng mặt có đường cắt bo góc đúng nửa trang; bỏ ảnh toàn khung, border, bóng và blur khỏi lớp lật. Không cắt container 3D.
- Hai lớp nội dung phía dưới được mở theo phần chưa bị tờ kính che, đồng bộ góc/perspective. Clip chạy liên tục, không thay ảnh; nhờ đó kính vẫn thấy nền phòng nhưng không thấy chữ/ảnh cũ xuyên qua trang mới.
- Ảnh đích tải và `decode()` trước khi bắt đầu. Chỉ sau `animation.finished` mới commit trang chính, URL, bộ đếm và tab đang chọn. Chặn thao tác mới cả khi tải lẫn đang lật; không hủy/khởi động lại animation. Khi lỗi ảnh giữ trang cũ và có Thử lại. Resize trong lượt hoặc bật giảm chuyển động hoàn tất lượt hiện tại gọn; màn hẹp đổi trực tiếp sau khi ảnh sẵn sàng.
- Kiểm tra chuyển động: `tests/den-tho-bac-book-motion-test.cjs`. Kiểm tra bốn trang/CTA/responsive: `tests/den-tho-bac-values-test.cjs`.
- 25 kiểm tra chuyển động và 95 kiểm tra chức năng/bố cục đạt trên tám viewport 320px–4K. Bản quay trực tiếp có 163 frame qua ba lượt, không có animation clock khởi động lại; WebM đã được kiểm tra giải mã/phát trong Chrome. TypeScript/build đạt. Lighthouse 1672×941: 87/100/100; LCP 2,4 giây, CLS 0,001, TBT 0ms.
- Bản quay trực tiếp ba lượt và ảnh giữa chuyển động: [trang xem lại](../../../../preview/values-page-turn-review.html). Video WebM tại `preview/den-tho-bac-values-page-turn.webm`; dữ liệu góc/clock tại `.browser-profile/book-motion-samples.json`, bản ghi frame tại `.browser-profile/book-motion-recording/frames.json`.

## Bộ nội dung gốc

Mẫu người dùng cung cấp ngày 25/10/2026, lần lượt:

| Tệp gốc | Bản lưu | Trang |
| --- | --- | --- |
| `Downloads/Open-book heritage exhibit with shrine photo-1.png` | `01-reference-original.png` | Lòng kính yêu |
| `Downloads/Open-book heritage_ community strength-2.png` | `02-reference-original.png` | Sức mạnh cộng đồng |
| `Downloads/Historical heritage open-book museum interface-3.png` | `03-reference-original.png` | Giá trị lịch sử |
| `Downloads/Students Carry Heritage Forward-4.png` | `04-reference-original.png` | Tiếp nối hôm nay |

Bản PNG được giữ nguyên byte; bốn WebP quality 94 giữ kích thước 1672×941. Các ảnh ở trang trái được hiển thị bằng khung CSS lấy vùng x194/y196/w600/h407 trong đúng mẫu. Không dùng toàn ảnh mẫu làm giao diện, không có chữ, nút hoặc footer in sẵn lộ ra trong khung. Chữ, điều khiển, bộ đếm và liên kết là HTML/CSS; hình khung sách mới dùng PNG RGBA được cung cấp.

Nền `exhibition-background-v1.png` được tạo bằng **built-in imagegen edit**, gỡ sách và toàn bộ UI khỏi mẫu 03 để phục hồi phòng trưng bày. Đây là nền minh họa được phục hồi, không phải ảnh tư liệu gốc đã xác thực. Không sửa nội dung bốn ảnh trang trái bằng AI. Bản WebP quality 90 chỉ chuyển định dạng. Prompt đầy đủ: [background-prompt.json](background-prompt.json). Kích thước và SHA-256: [manifest.json](manifest.json).

Không dùng footer trong ảnh. Section sử dụng duy nhất footer sáu phần hiện có của dự án. Bốn CTA nối tới câu chuyện dựng đền, tab Người giữ đền, dòng thời gian và câu chuyện học hỏi đã có. Trang đang chọn thay cùng ảnh; phím trái/phải, Home/End, cảm ứng, giảm chuyển động được hỗ trợ. Hàng câu hỏi đã được xóa theo cập nhật mới.

Font chữ hẹp Oswald được lưu tại `src/assets/fonts/oswald-variable.ttf`, lấy từ kho Google Fonts chính thức; giấy phép kèm `OFL-Oswald.txt`. Các đoạn văn và điều khiển dùng font chung của dự án.

Ảnh nằm trong các mẫu có vùng hữu dụng khoảng 600×407, nên độ nét khi phóng lớn ở 4K bị giới hạn bởi tệp đầu vào. Không tăng chi tiết ảnh tư liệu bằng AI để che hạn chế này. Kết quả kiểm tra bản sách hiện tại được ghi ở phần cập nhật đầu tệp.
