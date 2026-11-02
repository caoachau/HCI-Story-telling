# Kết quả triển khai các yêu cầu đang đáp ứng một phần

Ngày: 28/10/2026. Phạm vi: 24 mục đánh dấu “Đáp ứng một phần” trong danh mục 71 yêu cầu. Những thay đổi trước đó của bản đồ/cache được giữ nguyên.

**Rà soát phạm vi 29/10/2026:** xem [mục tiêu và phạm vi MVP](storytelling-scope.md). Mức triển khai dưới đây không có nghĩa tất cả chức năng đều bắt buộc trên màn hình kể chuyện. Chỉ yêu cầu dữ liệu/đường thao tác phù hợp với câu chuyện, người dùng và bối cảnh được chọn để thử nghiệm.

15 mục đã có đường thao tác hoàn chỉnh trong phạm vi ghi ở bảng yêu cầu: **A02, A04, A06, B04, C04, C06, D01, D02, D03, D08, F01, F03, F04, G04, I02**. D03 được rà soát lại ngày 29/10: bản chữ tương đương cho nội dung/TTS hiện dùng đã đáp ứng; không cần tạo thêm video để có phụ đề. 9 mục còn lại đã bổ sung giao diện, cấu trúc dữ liệu và xử lý trường hợp thiếu dữ liệu; vẫn cần hồ sơ thật khi chọn nội dung tương ứng. Không tính việc hiển thị “Chưa xác nhận” là đã đáp ứng nhu cầu nội dung.

## Các đường thao tác mới

- Thanh công cụ ở bản đồ và từng entry: Hướng dẫn, Câu chuyện và nguồn, Nghe và bản chữ, Đã lưu, QR/link, ngôn ngữ/trợ năng. Hướng dẫn có thể mở lại bằng F1. Dialog trả tiêu điểm khi đóng.
- Câu chuyện có câu hỏi, tóm tắt, thông điệp, thời lượng, nghe ý chính và phần đọc mở rộng. Nguồn/người kể, hiện vật và ghé thăm là các phần riêng trong cùng công cụ.
- Bản đọc Anh của 6 chuyện Cồn Chim và 37 chuyện Đền thờ giữ định danh truyện, câu hỏi và điểm quan sát của bản Việt. Bố cục đọc Anh riêng hỗ trợ các đường đọc, nghe, hỏi, quan sát, xem trước và mang theo; không sao chép mọi hiệu ứng của trang Việt.
- Tùy chọn VI/EN, cỡ chữ, tương phản và giảm chuyển động được lưu, áp dụng trên entry độc lập và truyền giữa parent/iframe qua cùng origin. Giọng đọc dùng một bộ phát có pause/resume/stop/restart/chọn câu, tránh chồng tiếng và dừng khi rời nội dung.
- Marker, dải thẻ và tìm kiếm dùng chung điều kiện lọc chủ đề.
- Mỗi điểm nhớ ngữ cảnh trong phiên. URL mang theo giữ các trường có nghĩa: view, entry, phần/truyện/chương, câu hỏi/điểm/bước, reader/ảnh và câu đang nghe. URL rõ ràng được ưu tiên khi mở lại. Vị trí cuộn nội bộ được nhớ theo reader; không hứa khôi phục đúng pixel trên một màn hình có kích thước khác.
- Thư viện Đã lưu: lưu phần hiện tại, mở lại, bỏ lưu, lấy QR/link của từng mục. Dữ liệu nằm trên thiết bị, tối đa 100 mục, không cần tài khoản. Bookmark Ao cũ được đưa vào thư viện chung.
- QR là ảnh mã hóa URL thật bằng thư viện cục bộ; có copy, mở link, retry và trạng thái chưa sẵn sàng. Không gửi nội dung sang dịch vụ tạo QR bên thứ ba.
- 3D: sửa tự xoay, dựng lại canvas khi trở từ ảnh, dọn tài nguyên WebGL/listener và căn camera theo bounding sphere. Mô hình tiếp tục được ghi là hình học minh họa.
- Mọi entry có màn phục hồi khi lỗi render: thử lại, tải lại ở URL hiện tại, về bản đồ. Lỗi ảnh/giọng/QR/video/phụ đề có nội dung thay thế hoặc đường thử lại phù hợp.

## 9 mục chờ hồ sơ nội dung

Điền dữ liệu vào [content.ts](../src/experience/content.ts), trong `CONTENT_EVIDENCE[siteId]`. Các `siteId` có trong [state.ts](../src/experience/state.ts). Giữ giá trị `null` hoặc mảng rỗng khi chưa có hồ sơ. Không điền tên/ngày/quyền dùng giả chỉ để vượt điều kiện hiển thị.

| Mục | Trường/cấu trúc cần bổ sung | Điều kiện hoàn tất |
| --- | --- | --- |
| C08 | `objects: Record<string, ObjectRecord>` | Từng hiện vật có tên, ai dùng, cách dùng, lý do trưng bày bằng VI/EN; nguồn riêng và người/ngày rà soát. |
| C10 | `people: PersonRecord[]` và `community` | Bản kể đúng người, vai trò, nguồn, quyền sử dụng hình/lời kể và người/ngày rà soát; ảnh chân dung chỉ dùng khi có quyền. |
| C11 | Kiểm kê các file nội dung/ảnh hiện có và `kind` | Xác nhận ảnh hiện tại/lịch sử/mô hình/minh họa, truyền thuyết/ký ức/lịch sử cho từng mục. Nhãn cảnh báo ở giao diện không thay thế kiểm kê này. |
| C12 | `sources`, `community` và hồ sơ từng đối tượng | Đủ nguồn, người kể, ngày ghi nhận, quyền dùng và người rà soát đúng nội dung; ngày biên soạn không phải ngày ghi âm. |
| D07 | `historicalPairs: HistoricalPair[]` | Hai ảnh khác nhau của cùng địa điểm; niên đại ảnh cũ, chú thích VI/EN, nguồn/quyền dùng cả hai ảnh, người/ngày rà soát. |
| D10 | `media: ApprovedMedia[]` | Bản ghi thật, tựa đề, người kể, ngày ghi, nguồn, quyền dùng, người/ngày rà soát, bản chữ và VTT VI/EN; video xem trước nên theo nhu cầu 30–60 giây. |
| E01 | `access` | Lối vào, điểm nghỉ, lối không bậc có xác nhận thực địa, nguồn và người/ngày kiểm tra. Không suy từ tọa độ hoặc sơ đồ chủ đề. |
| E03 | `activity: ActivityRecord` | Người hướng dẫn/đầu mối, lịch và điều kiện hiện hành, VI/EN, nguồn và người/ngày rà soát. |
| E04 | `localRules: LocalRule[]` | Hành động, lý do và phạm vi áp dụng VI/EN, nguồn, đơn vị/người phê duyệt và ngày. |

Các kiểu TypeScript trong file nguồn là hợp đồng dữ liệu. `SourceRecord` yêu cầu nhãn và URL HTTP(S); các ngày ghi nhận/rà soát dùng `YYYY-MM-DD` hợp lệ. Media và VTT có thể dùng đường dẫn cùng origin (ví dụ tài nguyên trong `public`) hoặc HTTP(S); máy chủ ngoài phải hỗ trợ truy cập video/phụ đề từ origin ứng dụng. Video chỉ được đưa ra khi có đủ hồ sơ; người dùng vẫn phải chủ động bấm phát.

`EvidencePanels.tsx` hiển thị hồ sơ hiện vật/người kể, hoạt động, nội quy và cặp ảnh đã đủ trường. `MediaReader.tsx` hỗ trợ chọn nhiều bản ghi, phụ đề theo ngôn ngữ, bản chữ, báo lỗi và thử lại. Bộ lọc dữ liệu chỉ kiểm tra tính đầy đủ/hợp lệ của trường, **không tự xác minh tính xác thực hoặc hiệu lực pháp lý của hồ sơ**. Việc rà soát phải được thực hiện trước khi điền dữ liệu.

## Địa chỉ để QR dùng được từ điện thoại

Trong môi trường vận hành, đặt `VITE_PUBLIC_URL` thành URL đầy đủ của entry gốc, gồm thư mục con và `index.html` nếu có, rồi build lại. Xem [.env.example](../.env.example). Các trang `con-chim.html`, `den-tho-bac.html`, `bao-tang-khmer.html`, `ao-ba-om.html` phải được phục vụ cùng thư mục với entry gốc.

Nếu URL hiện tại là localhost/loopback và chưa có cấu hình, giao diện báo link chưa sẵn sàng, cho phép tiếp tục đọc tại chỗ. Workspace hiện chưa được công bố lên Internet. Kiểm thử dùng tên miền `.test` ánh xạ loopback trong tiến trình Chrome thử nghiệm; tên đó không phải địa chỉ để phát cho khách. Sau triển khai cần quét bằng điện thoại thật ở mạng sử dụng, kiểm tra đúng nội dung, cỡ chữ và thao tác quay lại.

## Kiểm thử và giới hạn

Chạy từ thư mục `prototype` với Node và Python có OpenCV/numpy:

```powershell
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vite/bin/vite.js build
node scripts/export-locale-content.mjs
node --experimental-strip-types tests/experience-content-test.mjs
# Khi có server cục bộ đang chạy:
$env:TEST_BASE_URL = 'http://127.0.0.1:4178'
node tests/experience-requirements-test.cjs
```

`experience-content-test.mjs` dùng fixture trong bộ nhớ, không ghi dữ liệu mẫu được duyệt vào ứng dụng; kiểm tra từ chối thiếu quyền dùng, ngày không hợp lệ, URL sai, thiếu bản dịch hoặc ảnh so sánh trùng. Độ phủ bản Anh được đối chiếu với dữ liệu nguồn xuất bằng `node scripts/export-locale-content.mjs`.

`experience-requirements-test.cjs` chạy Chrome/CDP, giải mã QR độc lập bằng OpenCV, kiểm tra URL mở lại, thư viện, bộ lọc, giao tiếp iframe, cỡ chữ thực, lệnh pause/resume và ảnh canvas khi tắt tự xoay. Engine giọng nói được giả lập để kiểm tra điều khiển; cần nghe thử giọng thật của thiết bị triển khai. Ảnh và báo cáo kiểm tra nằm trong `preview/requirements-*`.

Kiểm chứng cho bản rà soát 29/10: TypeScript và production build đã qua; 32 kiểm tra xuyên entry không có exception trình duyệt; bộ hồi quy Cồn Chim và gallery/reader Đền thờ đã qua, gồm nhiều kích thước màn hình, chạm/bàn phím, ảnh chậm/lỗi/retry và đóng reader trả tiêu điểm. Kiểm tra hồ sơ nội dung và độ phủ bản Anh cũng đã qua. Build còn cảnh báo kích thước chunk lớn ở các thư viện bản đồ/3D; đây không phải kết quả kiểm thử sử dụng với khách.

Các mục trước đây “Chưa đáp ứng” và panorama “Chỉ mô phỏng” giữ nguyên phạm vi. Chưa bổ sung CMS, reset phiên kiosk đầy đủ, gói truyện offline, tiếng Khmer, đầu mối hỗ trợ thật, gửi góp ý hoặc khung chụp ảnh trong đợt này.
