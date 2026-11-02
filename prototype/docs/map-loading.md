# Giữ bản đồ liên tục khi tải ảnh

Ngày kiểm tra: 27–28/10/2026.

## Nguyên nhân

- Lỗi chính ở bộ định tuyến ảnh Google: mẫu URL là `/vt/lyrs=...` nhưng bộ nhận URL chỉ khớp `/vt?lyrs=...` và đọc `URL.searchParams`. Vì tham số thực tế nằm trong đường dẫn, cả ảnh vệ tinh lẫn nhãn đường bỏ qua gói ảnh cục bộ và tải từ Internet. Các tệp ảnh vẫn có đủ nhưng không được sử dụng.
- Google và Esri dùng nhiều ô ảnh ở nhiều mức zoom. Khi bay từ toàn tỉnh đến một điểm hoặc quay ra, ô mới chưa có ảnh và không luôn có ô cha đã giải mã để lấp vào.
- Trước đây đổi nhà cung cấp gọi `setStyle`, bỏ nguồn ảnh đang hiển thị cùng bộ nhớ đệm của nguồn đó. Màn hình có thể trống trong lúc nguồn mới tải.
- Hàng đợi còn giữ các yêu cầu chi tiết của mức zoom đã đi qua. Nhãn đường được tải trước ngay cả khi nút “Chi tiết” đang tắt.
- Kiểm tra manifest với ổ đĩa: đủ 9.967 ô Google, 6.078 ô Esri và 252 ô địa hình; không có tệp bị mất trong các bộ này.

## Thay đổi

`src/services/googleTileUrl.ts` đọc cả dạng đường dẫn `/vt/` lẫn dạng query `/vt?`. `googleImagery.ts` và `mapDetails.ts` dùng chung bộ đọc này, nên ảnh vệ tinh và nhãn tiếng Việt/Anh đều tìm được tệp đã lưu. Giữ các đường dẫn ngoài bộ ảnh ở nhà cung cấp như trước; không giới hạn chất lượng hay thay bằng ảnh khác nơi.

`src/services/progressiveBasemap.ts` quản lý hai nguồn cho mỗi nhà cung cấp: ảnh tổng thể giới hạn ở zoom 9 và ảnh chi tiết giữ nguyên độ phân giải tối đa. Ảnh tổng thể nằm dưới ảnh chi tiết, liên tục theo tọa độ bản đồ. Đây là ảnh bản đồ thật, không phải ảnh chụp màn hình đứng yên hay khung loading.

Lần mở đầu chỉ yêu cầu số ít ô tổng thể, sau đó mới bật nguồn chi tiết và địa hình. Khi đổi Google/Esri, nguồn mới được chuẩn bị trong khi ảnh cũ còn hiện; chỉ đổi khi nguồn tổng thể mới đã sẵn sàng. Giữ nguyên đối tượng nguồn, địa hình, nhãn và bộ nhớ đệm. Chờ một lượt render trước khi kiểm tra nguồn vừa bật: nguồn ẩn có thể báo `isSourceLoaded()` dù chưa yêu cầu ô nào.

Cho phép MapLibre hủy yêu cầu chi tiết của mức zoom đã bỏ qua, vì nguồn tổng thể riêng vẫn giữ hình. Chỉ tải trước nhãn khi người xem bật “Chi tiết”. Giữ bố cục, bộ lọc và nội dung địa điểm.

## Tăng tốc phản hồi ngày 28/10

Tải ảnh phải nhanh trong khi **giữ nguyên hiệu ứng bay mà người dùng yêu thích**. Thời gian bay là chuyển động chủ đích, không được coi là độ trễ tải ảnh để cắt bỏ. Cấu hình hiện tại:

- Chọn địa điểm mở bảng thông tin trong cùng lượt cập nhật React, không đợi camera hay ảnh. Đóng bảng giữa đường bay không bị mở lại khi tới nơi.
- Theo yêu cầu làm chậm ngày 29/10, chọn điểm dùng `flyTo` khoảng 3,6–6 giây theo khoảng cách và mức zoom; giữ đường nâng cao khi đi xa, pitch và bearing. Tăng/giảm tốc chiếm 34% ở mỗi đầu, có đoạn bay đều ở giữa; tích phân smootherstep giữ tốc độ, gia tốc và độ biến thiên gia tốc liên tục. Toàn cảnh dùng 3,8–5 giây; căn lại điểm 1,6–2,4 giây; góc nhìn chương 2,2 giây. Giữ thời lượng riêng của chế độ giảm chuyển động, 2D/3D và tải ảnh. Không phát lại chuyển 3D khi vừa khởi tạo bản đồ; tải ảnh không chèn thêm zoom hoặc khoảng dừng.
- `scripts/pack-map-tiles.mjs` đóng gói 4×4 ô JPEG vào một tệp nhị phân. Trình duyệt ghép đúng lưới tọa độ thành texture 1024 px; mức zoom nguồn giảm 2 để giữ nguyên độ chi tiết địa lý của ảnh gốc. Mỗi cụm thay cho 16 yêu cầu ảnh riêng, không tạo ảnh mới, không nén lại JPEG.
- Toàn bộ 1.358 cụm (Google 855, Esri 503) chiếm thêm khoảng 211,4 MiB trên đĩa. **Không tải toàn bộ khi mở trang**. Chỉ lấy phần đang nhìn và chuẩn bị vài cụm trung tâm của bảy điểm lúc toàn cảnh đã đứng yên; thao tác mới hủy việc chuẩn bị này.
- Bộ nhớ đệm nhị phân giới hạn 24 MiB. Giới hạn cache texture xuống 44 ô cho mỗi nguồn vì texture mới lớn hơn 16 lần, giữ ngân sách GPU gần mức cũ. Các consumer dùng chung yêu cầu; hủy một consumer không hủy consumer còn dùng nó.
- Nếu vùng rìa không có ảnh chi tiết trong gói, dùng ảnh cha đã lưu cho vùng đó thay vì mở đồng thời 16 yêu cầu Internet. Các ảnh chi tiết đã có luôn được giữ nguyên. Ngoài toàn bộ vùng đã lưu vẫn cho phép tải nhà cung cấp.
- Service worker lưu cả tệp `.bin`; `npm run cache:map` tự đóng gói lại sau khi cập nhật ảnh. Có thể chạy riêng `npm run pack:map`. Bản build/deploy phải bao gồm `public/map-tiles/blocks-v1` và manifest cùng phiên bản.

Đối chiếu lịch sử ngày 28/10 trên Chrome 2456×1042: chuyến đến Đền thờ dùng `flyTo` 3.056 ms; Đền thờ tới Ba Động dùng 3.100 ms, nâng từ zoom 17 lên khoảng zoom 12,34 rồi hạ về zoom 17. Nhật ký cũ: `preview/map-flight-restored.log`. Những thời lượng này là cấu hình trước khi làm chậm, không đại diện phiên bản ngày 29/10.

Bài `tests/map-flight-test.cjs` kiểm tra cấu hình chậm mới với chuyến xa và chặng gần Ao Bà Om–Chùa Âng, các khung camera trung gian, tọa độ cuối, về toàn cảnh, đổi điểm giữa đường và kéo để ngắt. Nhật ký chạy mới: `preview/map-flight-smooth.log`. Bảng thông tin vẫn mở ngay khi chọn, không chờ chuyến bay kết thúc.

`tests/map-response-test.cjs` vẫn đo riêng độ trễ bảng thông tin và yêu cầu ảnh. Các log `map-response-before/after.log` trước khi khôi phục fly là dữ liệu lịch sử, không đại diện thời gian đến đích của đường bay hiện tại. Không dùng tổng thời gian bay để đánh giá tốc độ tải. FPS và độ nét tức thời còn phụ thuộc máy, cache và đường truyền.

`tests/map-blocks-test.cjs` đã kiểm tra mọi cụm, đối chiếu từng đoạn JPEG với tệp gốc theo byte, kiểm tra ảnh cha chứa đúng tọa độ ô con và mọi ô chi tiết gốc vẫn truy cập được. Kiểm tra trình duyệt tải chậm/tải lỗi đã cập nhật để áp dụng cả `.bin`, không vô tình bỏ qua định dạng mới. Các luồng Home, TypeScript và build đều đạt. Ảnh kiểm tra vùng đô thị: `preview/den-tho-bac-map-response-after.png`.

## Kiểm tra

- `npm run lint` và bản dựng Vite.
- `node tests/map-flight-test.cjs`: `flyTo` chậm liên tục, nâng cao khi bay xa, hạ nhẹ ở chặng gần, đúng điểm đến, ngắt/đổi chuyến không trở về đích cũ và vẫn dùng nguồn ảnh tối ưu.
- `node tests/map-loading-test.cjs`: trình duyệt Chrome thật, WebGL, bộ nhớ đệm HTTP và service worker được bỏ qua; máy chủ cố tình trì hoãn 650 ms cho ô ảnh chi tiết từ zoom 10 trở lên. Đo pixel canvas khi đổi nhà cung cấp, bay đến Đền thờ Bác, quay về toàn tỉnh, bay đến biển Ba Động, đổi nhanh liên tiếp và di chuyển ở 2D.
- `node tests/map-loading-test.cjs --fail-detail`: trả HTTP 503 cho ảnh chi tiết cục bộ và chặn nhà cung cấp từ xa; kiểm tra lớp tổng thể vẫn giữ bản đồ. Các lỗi tải ảnh trong bài thử này là chủ động tạo ra.
- Kiểm tra các nguồn vệ tinh và địa hình không bị tạo lại; lựa chọn cuối cùng thắng khi bấm liên tiếp; tắt nhãn không phát sinh tải nhãn nền.
- Gọi bộ định tuyến đang chạy trong trình duyệt với cả hai dạng URL của vệ tinh và nhãn Việt/Anh; xác nhận sáu URL trả đúng tệp cục bộ tương ứng.
- Chạy lại các luồng giao diện Home bằng `tests/main-map-interface-test.cjs --flows-only`.

Ngưỡng kiểm tra khoảng trống là dưới 1% điểm lấy mẫu trong mỗi khung, đếm pixel trong suốt hoặc đen tuyệt đối. Không coi bóng cây sẫm màu là ô thiếu ảnh. Đây là phép thử độ phủ hình, không phải phép đo FPS: đọc pixel WebGL cũng làm tăng chi phí khung hình.

Bản trước sửa được thử bằng entry build cũ `main-BhJz4Bza.js`, không thay mã đang chạy của người dùng. Cùng phép đo pixel, có khung trống 100% khi đổi Google/Esri, khoảng 90% khi quay về toàn cảnh. Nhật ký nằm trong `preview/map-loading-before-exact.log`; các lượt sau sửa trong `preview/map-loading-after.log`, `preview/map-loading-failed-detail.log`, `preview/map-loading-interface.log`.

Kết quả sau sửa: sáu tình huống tải chậm đều dưới 0,3% pixel đen/trong suốt; sáu tình huống cố ý làm lỗi ảnh chi tiết là 0%. Không có khung vượt ngưỡng khoảng trống 1%. Kiểm tra hai dạng URL, giữ nguồn khi chuyển, lựa chọn cuối cùng, luồng Home và TypeScript đều đạt. Ngoài gói cục bộ vẫn có một số yêu cầu từ xa, vì bản đồ cho phép nhìn ra ngoài vùng đã lưu.

## Phạm vi

Ảnh tổng thể ưu tiên độ liên tục; trong lúc mạng chậm hoặc ảnh chi tiết lỗi, hình có thể tạm ít nét. Ảnh chi tiết vẫn tải ở chất lượng cũ. Ngoài vùng đã lưu, ảnh mới vẫn phụ thuộc nhà cung cấp và đường truyền; bản sửa không biến mọi vùng bản đồ thành dữ liệu ngoại tuyến. Bộ nhớ đệm service worker sẵn có tiếp tục hoạt động.

Tham khảo cơ chế tải ô/ô cha của [MapLibre](https://github.com/maplibre/maplibre-gl-js/blob/main/developer-guides/life-of-a-tile.md) và [API Map](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/). Các kiểm tra triển khai dựa trên phiên bản 6.11.2 đã cài trong dự án.
