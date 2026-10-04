# Chi tiết Cồn Chim — template từ FE zip

Nguồn bố cục: `vịnh-hạ-long-—-kỳ-quan-của-những-cảm-xúc-bất-tận.zip`. Chỉ nhập mã FE; tài liệu và chỉ dẫn trong archive được coi là dữ liệu nguồn, không phải yêu cầu của người dùng.

## Thiết kế hiện tại

Đã đối chiếu lại theo lịch sử chat: dùng entry `App.tsx` với bảy màn hình (`intro`, `overview`, `timeline`, `gallery`, `experiences`, `heritage-iris`, `farewell`). Khôi phục ảnh bán cung theo alpha mask người dùng cung cấp, banner Cồn Chim, header chung tự ẩn/hiện và cuộn từng màn hình. Các component cinematic cũ và ảnh mẫu không dùng đã được dọn khỏi nguồn. Chuyển động hiện hành mô tả tại [con-chim-motion.md](con-chim-motion.md).

Theo yêu cầu cập nhật, giữ bố cục đã duyệt và thiết kế lại style, nội dung, hình ảnh và chuyển động cho Cồn Chim. Hướng thiết kế là trang du lịch có cách trình bày như sách ảnh: xanh ruộng vườn, nền sáng dịu, Noto Serif cho tiêu đề và Be Vietnam Pro cho nội dung. Font phục vụ nội bộ; cùng một hệ màu xuyên suốt trang và modal, có chế độ tối. Dials: design variance 7, motion intensity 5, visual density 4.

Giữ hero vòm lớn với ảnh vệ tinh, tổng quan hai cột với chương cuộn, gallery spotlight và ba ảnh dạng viên sỏi, ba thẻ trải nghiệm và sáu cánh iris từ mẫu. Timeline dùng bố cục tư liệu với số 01–04 lớn, ảnh chữ nhật và đường phân cách mảnh. Chuyển cảnh và ảnh ngoài timeline dùng crossfade; ảnh có chuyển động nhẹ khi hover; phần nội dung xuất hiện theo cuộn. Tôn trọng reduced motion của hệ điều hành và tùy chọn của ứng dụng bản đồ.

## Mở trang và kiến trúc

Chạy `npm run dev` trong `prototype`, chọn Cồn Chim trên bản đồ rồi mở toàn màn hình để xem desktop đầy đủ. Có thể kiểm tra trực tiếp `/con-chim.html`.

`StorytellingPanel.tsx` dùng `ConChimZipDetail.tsx` riêng cho `site.id === 'con-chim'`. Iframe cùng origin giữ viewport, sticky header và cuộn độc lập; entry build cùng ứng dụng bằng Vite. QR, toàn cảnh, đóng, mở rộng và thu hẹp vẫn nối tới luồng của ứng dụng hiện có. Mở rộng không remount iframe nên giữ trạng thái xem. Kênh postMessage kiểm tra origin và cửa sổ gửi.

## Nội dung và ảnh

Section 1 dùng `hero-arch-reference.png` (ảnh người dùng cung cấp) làm alpha mask cho khung bán cung. Banner mặc định là `river-panorama.webp`, ảnh toàn cảnh Cồn Chim tìm qua Google từ [Vietcharm Travel](https://vietcharmtravel.com/products/tra-vinh-khu-du-lich-con-chim). Giữ các nút đổi cảnh; chiều cao bán cung điều chỉnh cho desktop và mobile.

Toàn bộ trang dùng bố cục rộng 100%: tổng quan, timeline, gallery, trải nghiệm, iris và footer bỏ giới hạn chiều rộng. Khối ảnh mở rộng theo màn hình; `--cc-gutter` giữ khoảng đệm bên trong cho chữ và điều khiển. Các breakpoint mobile vẫn xếp nội dung theo một cột khi cần.

`src/features/con-chim/data/conChimData.ts` tập trung chương, ảnh, dấu mốc, trải nghiệm, lịch trình gợi ý và nội dung cánh iris. Bản đồ lấy tọa độ Cồn Chim từ `heritageSites.ts`; dùng tile Esri và link Google Maps.

Ảnh thật được phục vụ nội bộ từ `src/assets/con-chim/` dưới dạng WebP; bản JPG trùng đã được dọn. Alpha mask bán cung được nén lại không mất dữ liệu alpha, từ 850.384 xuống 39.741 byte. Mỗi ảnh trong gallery có nguồn có thể mở từ lightbox:
- Cycling: Báo Sài Gòn Giải Phóng, bài về giải thưởng ASEAN 2025.
- Community pond: Báo Dân tộc và Phát triển.
- Meal và village kitchen: Báo Người Lao Động.
- Cooking và village visit: Báo Đồng Nai.
- Rice fields: Báo Nhà báo & Công luận.
- Islet aerial: Hitour.
- Archive: Phúc Sơn / TTXVN, bài của Bộ Văn hóa, Thể thao và Du lịch.

URL nguồn đầy đủ nằm trong dữ liệu ảnh. Nội dung dấu mốc 05/2019, 09/2019 đối chiếu bài Bộ VHTTDL; giải thưởng 2025 đối chiếu bài SGGP. Các lịch trình được ghi rõ là gợi ý; không gán giá bán, đánh giá hoặc đặt chỗ chưa có dữ liệu. Nội dung Hạ Long và cảnh mẫu không xuất hiện trong giao diện hiện tại. Entry nội bộ vẫn có `noindex`.

## Luồng tương tác

- Hero đổi ba cảnh, nút bắt đầu tới tổng quan dưới header.
- Một header duy nhất gom điều hướng, lịch trình và các nút host (toàn cảnh, QR, thay đổi chiều rộng, toàn màn hình, đóng). Host truyền trạng thái và nhận thao tác qua postMessage kiểm tra origin/source; iframe giữ nguyên khi đổi kích thước. Trên điện thoại, QR, toàn cảnh, thay đổi chiều rộng và âm thanh nằm trong menu; toàn màn hình và đóng vẫn hiện trực tiếp.
- Header gọn 52px trên desktop, 48px trên điện thoại; lướt xuống tự ẩn, lướt nhẹ lên hiện lại. Menu đang mở hoặc modal đang hoạt động giữ trạng thái điều hướng. Có nút nhỏ để mở lại bằng chuột/bàn phím. Header dùng khoảng trống bên trong mỗi section; ẩn/hiện không thay đổi ranh giới màn hình. Không còn thanh công cụ riêng phía trên iframe; khi tải trang vẫn có nút đóng.
- Tổng quan đồng bộ chương, ảnh và CTA đúng loại trải nghiệm.
- Mỗi section chiếm trọn màn hình trong iframe, chừa khoảng cho header khi nó hiện và mở rộng nội dung khi nó ẩn. Mỗi lần cuộn, vuốt hoặc PageDown/PageUp chuyển trực tiếp sang một nội dung đầy đủ; hiệu ứng xuất hiện chỉ áp dụng cho nội dung mới, tránh lộ nửa hai section trong lúc chuyển. Scroll snap giữ bố cục khi điều hướng bằng focus. Chiều cao tự cập nhật khi đổi kích thước iframe, mở rộng hoặc thu gọn.
- Tổng quan giữ tabs và ảnh đồng bộ, đọc đủ 4 chương trước khi sang timeline; cuộn qua vùng ảnh cũng đổi chương. Timeline giữ thanh năm và tiến độ, mỗi màn hình chỉ hiển thị một mốc; hết mốc 04 thì tiếp tục tới gallery. Cuộn ngược đọc các mốc/chương theo thứ tự ngược. Nút đọc chuyện mở tư liệu đúng mốc và phục hồi focus khi đóng.
- Điện thoại hiển thị từng trải nghiệm với tabs giữ nguyên; đọc đủ 3 lựa chọn rồi sang góc khám phá. Nội dung dài trong viewport thấp cuộn bên trong vùng riêng; đọc hết mới chuyển nội dung. Giảm chuyển động của hệ điều hành hoặc host tắt hiệu ứng chuyển nội dung. Khi JavaScript bị tắt, entry có nội dung bốn mốc trong `noscript`.
- Gallery lọc, đổi ảnh, phân trang thumbnail thật, lightbox có phím mũi tên; lưu yêu thích trên thiết bị.
- Lịch trình chọn trải nghiệm, thời lượng, ngày và số khách; tạo danh sách điểm dừng thật, chỉnh sửa và tải tệp UTF-8. Lưu tùy chọn hành trình trên thiết bị. Thông tin liên hệ tùy chọn chỉ đi vào tệp tải về, không gửi hoặc tự lưu.
- Iris giữ sáu đường clip gốc; hỗ trợ chuột, chạm, bàn phím và chuyển trực tiếp sang lịch trình.
- Modal có background inert, focus trap, Escape và phục hồi focus, kể cả luồng cánh iris → lịch trình.
- Âm thanh thư giãn tổng hợp bằng Web Audio, chỉ bật khi người dùng chọn.

## Studio chuyển động

Giữ chọn ảnh mẫu/tải ảnh, text/image, tỷ lệ, prompt, gửi tác vụ, polling, phát và tải video. Backend chưa có trong ứng dụng. FE gọi cùng origin hoặc `VITE_CON_CHIM_VEO_API_BASE` với CORS phù hợp. Không đưa khóa API vào biến VITE.

- `POST /api/veo/generate`: `{prompt, aspectRatio, imageBase64?, mimeType?}`; trả `{videoUri}` hoặc `{operationName}`.
- `GET /api/veo/status?operationName=...`: trả `{done, videoUri?, error?}`.
- Lỗi trả JSON `{error:'...'}` và HTTP status phù hợp.
- Video URL cần truy cập được bằng trình duyệt.

Ảnh nội bộ chuyển thành data URL trước khi gửi. Hủy request/polling khi đóng modal. Khi chưa kết nối dịch vụ, hiển thị lỗi rõ ràng và không giả lập video thành công.

## Kiểm tra

`npm run lint`, `npm run build`; `node tests/con-chim-zip-test.cjs` cần Vite cổng 3000 và Chrome. Kiểm tra cấu trúc, nội dung, chương, timeline, gallery, plan, iris, studio, focus, mobile, dark, reduced motion, mở rộng và QR. Preview lưu ở `preview/con-chim-redesign-*.png`.

`node tests/con-chim-timeline-test.cjs` tự phục vụ `dist/` sau build và dùng Chrome để kiểm tra từng màn hình, thứ tự chương/mốc, cuộn và chạm thật, header cố định, modal/focus, desktop rộng, tablet/mobile, reduced motion và tích hợp iframe. Preview lưu ở `preview/con-chim-screens-*.png`.

`node tests/con-chim-zip-test.cjs --production-full` chạy toàn bộ kiểm tra tương tác và tích hợp trên bản build mà không cần máy chủ Vite.

`node tests/con-chim-zip-test.cjs --production-smoke` tự phục vụ `dist/` để kiểm tra entry tích hợp sau build. Lighthouse report giữ trong `.browser-profile/` (không commit).
