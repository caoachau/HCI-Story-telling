# Ký Ức Bản Địa · Diễn Giải Di Sản Trà Vinh

Giao diện chính dùng React, Vite, MapLibre và Three.js. Dữ liệu hiện bao gồm bảy điểm di sản Trà Vinh, các tuyến tham quan, nội dung diễn giải, hiện vật 3D, panorama, tìm kiếm, QR, âm thanh và chế độ trình chiếu kiosk.

## Chạy ứng dụng

```powershell
npm install
npm start
```

Mở http://127.0.0.1:3000. Tạo bản dựng bằng `npm run build`; xem trước bằng `npm run preview`.

Bản đồ và ảnh từ các dịch vụ bên ngoài cần kết nối Internet. Không cần khóa API để chạy ứng dụng. ZIP có metadata nhắc đến Gemini nhưng không chứa màn hình AI hoặc endpoint gọi Gemini, vì vậy tính năng đó chưa có trong bản tích hợp.

Chế độ Esri dùng [World Imagery Wayback, bản phát hành 2025-12-18](https://www.arcgis.com/home/item.html?id=929ed51e5c11448c8ff82ef637bf42d6) để tránh dải mây và mép ghép lớn quanh Cồn Chim trong nguồn World Imagery hiện hành. Ngày này là ngày phát hành bản đồ, không phải ngày chụp ảnh. Nguồn hiển thị và tải trước tile dùng chung cấu hình trong `src/services/esriImagery.ts`; zoom Esri giới hạn ở mức 17. Khi chọn phiên bản khác, cần đối chiếu ảnh tại các cột mốc và nhiều mức zoom trước khi cập nhật.

Ứng dụng kèm 36.551 tile (khoảng 244 MB) trong `public/map-tiles`:

- Esri: 6.078 ảnh, zoom 6–17.
- Google vệ tinh: 9.967 ảnh, zoom 6–20.
- Cao độ: 252 ảnh, zoom 6–12.
- Thông tin Google: 10.127 ảnh trong suốt tiếng Việt và 10.127 ảnh tiếng Anh, zoom 6–20 (tổng khoảng 47 MB).

Bộ ảnh phủ vùng toàn cảnh Trà Vinh và hành lang bay ở zoom 6–14; ảnh chi tiết phủ vùng rộng quanh bảy mốc, đủ cho xoay góc nhìn và zoom gần. Nguồn Google trả 404 cho 160 ô; các ô này dùng phần ảnh tương ứng từ tile Google ở mức zoom thấp hơn đã lưu sẵn, không gửi lại yêu cầu bị lỗi. Map và tải trước ảnh dùng chung bộ định tuyến file nội bộ; vùng ngoài bộ ảnh vẫn lấy từ nhà cung cấp.

Service worker `public/map-cache-sw.js` lưu những ảnh đã xem vào bộ nhớ đệm của trình duyệt để dùng lại sau khi mở trang hoặc đổi chế độ. Việc này chạy khi trình duyệt cho phép service worker (localhost hoặc HTTPS); ảnh trong ứng dụng vẫn dùng được nếu service worker không hoạt động. Không tải toàn bộ bộ ảnh lúc mở màn hình.

Vite tự chép bộ ảnh và service worker vào bản build. Chạy `npm run cache:map` để bổ sung file bị thiếu và tạo lại các danh sách `*Cache.generated.ts`, mã phiên bản cache và báo cáo `public/map-tiles/cache-summary.json`. Script dùng lại file đã có, giữ phạm vi đã tải khi thay đổi tọa độ mốc, giới hạn tải đồng thời và ghi file hoàn chỉnh trước khi đưa vào danh sách. Vùng ngoài bộ ảnh và nội dung ảnh từ dịch vụ bên ngoài vẫn cần Internet.

## Tọa độ cột mốc

Bảy mốc dùng điểm địa danh Google Maps đã đối chiếu ngày 27/09/2026, ở hệ WGS 84. Tọa độ, tên địa danh và liên kết theo place ID nằm trong [bảng nguồn vị trí](docs/heritage-locations.md). Dữ liệu dùng chung ở `src/data/heritageSites.ts` đồng bộ marker, bay đến, đưa mốc về giữa, xoay 360°, chọn diễn giải theo vị trí gần và tải trước ảnh trên cả hai nền. Bộ ảnh đã bổ sung vùng quanh vị trí mới, gồm nhãn tiếng Việt và tiếng Anh.

## Chế độ Chi tiết

Nút **Chi tiết** phủ lớp thông tin Google trong suốt lên cả Google vệ tinh và Esri: đường, tên địa điểm, khu dân cư và các tiện ích như bệnh viện, trường học, nhà hàng, cửa hàng. Cách ghép ảnh vệ tinh với nhãn tương ứng với [kiểu hybrid của Google Maps](https://developers.google.com/maps/documentation/javascript/maptypes). Số địa điểm hiển thị phụ thuộc dữ liệu Google và mức zoom; đây là lớp hiển thị, chưa gồm trang đánh giá hoặc thông tin kinh doanh khi nhấn vào từng tiện ích.

Cấu hình và định tuyến tile nằm trong `src/services/mapDetails.ts`. File PNG được phục vụ ngay từ ứng dụng trong vùng cache, dùng chung giữa hai nền; bật/tắt chỉ đổi trạng thái hiển thị và giữ nguồn cùng cache. Chuyển ngôn ngữ chọn bộ nhãn tương ứng mà không đổi camera. Ứng dụng tải trước một vùng nhỏ quanh góc nhìn và điểm đến với độ ưu tiên thấp, không đợi tải xong mới cho người dùng tương tác. Chỉ dùng một mức chi tiết nhãn trong cùng khung hình để tránh lặp tên khi nghiêng camera.

## Nhãn biển đảo

Lớp địa danh trong ứng dụng bổ sung Hoàng Sa, Trường Sa và 47 đảo thuộc hai quần đảo cùng các đảo ven bờ chính. Nhãn có tên, cờ và dòng Việt Nam/Viet Nam, thể hiện theo nguồn Việt Nam; nguồn được liên kết ngay ở phần ghi nguồn bản đồ. Dữ liệu tên và điểm nhãn lấy từ [danh mục kèm Thông tư 33/2024/TT-BTNMT](https://mae.gov.vn/noidung/Lists/VBQPPL/Attachments/514/1_DanhMuc_TT_DiaDanh_BanHanh.pdf), có số trang và tọa độ gốc trong `src/data/maritimePlaces.generated.ts`. Thông tin chủ quyền theo [lập trường được Bộ Ngoại giao Việt Nam công bố](https://mofa.gov.vn/vi/tin-chi-tiet/chi-tiet/viet-nam-co-day-du-bang-chung-khang-dinh-chu-quyen-cua-minh-doi-voi-hai-quan-dao-hoang-sa-va-truong-sa-589.html).

Tọa độ địa lý VN-2000 của danh mục được chuyển sang WGS 84 bằng phép chuyển EPSG VN-2000 to WGS 84 (2), thay vì coi hai hệ giống nhau. Tái tạo dữ liệu bằng `scripts/import-maritime-labels.py` với file PDF nguồn và các thư viện Python `pypdf`, `pyproj`; ứng dụng không phụ thuộc hai thư viện này khi chạy.

Nhãn được vẽ bằng canvas với phông hệ thống có dấu tiếng Việt rồi hiển thị qua lớp symbol GeoJSON, luôn hướng về màn hình khi nghiêng hoặc xoay. Dữ liệu và nhãn nằm trong ứng dụng, không cần tải tile hay phông từ dịch vụ khác. Các tên vẫn hoạt động khi tắt **Chi tiết**, đổi nền vệ tinh hoặc chuyển ngôn ngữ. Khi zoom gần, tên từng đảo không bị ẩn bởi giới hạn zoom hay va chạm nhãn. Tên khu vực vẫn hiện ở đầu khung nhìn khi điểm nhãn quần đảo hoặc đảo lớn nằm ngoài màn hình. Các khoảng chọn ngữ cảnh chỉ phục vụ tiêu đề; không phải đường biên giới hay phạm vi chủ quyền trên biển.

Worker MapLibre 6 được đóng gói qua truy vấn Vite `?worker&url` trước khi tạo map, để các lớp cao độ và GeoJSON tải đúng trong cả chế độ phát triển và bản build.

## Tương tác kiosk

- Chọn điểm trên bản đồ, danh sách hoặc ô điểm đến để bay tới; mở bảng diễn giải để xem chương, nghệ nhân, tuyến và tư liệu.
- Dùng nút trợ năng ở góc phải bản đồ để tăng cỡ chữ, tăng tương phản hoặc giảm chuyển động.
- Phiên nội dung tự kết thúc sau năm phút khi bảng diễn giải đang mở. Thời gian không được gia hạn bởi di chuyển chuột hay chạm liên tục.
- Sau 75 giây không hoạt động, bản đồ vào chế độ thu hút khách.

## Ghi chú biên tập

Nội dung và số liệu trong dữ liệu dự án chưa được xác minh độc lập trong lần tích hợp này. Hãy đối chiếu hồ sơ hiện vật, tiểu sử, số liệu cộng đồng, ảnh và trích dẫn với cộng đồng và nguồn địa phương trước khi coi là dữ kiện đã kiểm chứng hoặc phát hành chính thức. Nguồn ảnh prototype trước đây được ghi tại `assets/CREDITS.md`.
