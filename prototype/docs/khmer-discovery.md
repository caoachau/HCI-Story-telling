# Điểm khám phá bảo tàng Khmer

Chế độ popup mốc Khuôn viên: khung ảnh 360° thường chỉ xoay đến mốc 1–2–3, giữ mức zoom và đồng bộ thẻ bên phải/dải ảnh; không tự mở popup che ảnh. Khi mở rộng panorama, mốc đã chọn có popup trong ảnh; có thể đóng rồi chạm lại để mở. Thu nhỏ bỏ popup và giữ lựa chọn. Kiểm tra bằng `node tests/khmer-panorama-popup-modes-test.cjs`.

Ảnh hiện vật và mô hình 3D có nút mở rộng ở góc phải dưới. Khung mở rộng nằm phía trên thanh điều hướng chính, giữ viền đồng và hiển thị toàn bộ ảnh. Mô hình dùng lại chính canvas đang xem, giữ nguyên góc xoay và mức zoom, không tải lại GLB. Nút thu nhỏ hoặc Escape đưa về đúng vị trí và trả focus về nút mở; khi mở ảnh từ popup chi tiết, Escape chỉ thu ảnh lại và giữ popup đang đọc.

Giữ khung hai cột, ảnh lớn trái, giới thiệu phải, dải thẻ ảnh và năm mục điều hướng đáy. Tiêu đề dùng Be Vietnam Pro có sẵn trong dự án, nhãn nhỏ màu đồng và khoảng cách mép trên 18–28 px ở kiosk. Ảnh chính giữ nguyên độ sáng, không phủ tối hoặc làm mờ toàn ảnh; ảnh tư liệu thông thường dùng `object-fit: contain`. Nhãn và nút có nền tối riêng. Nút tab và điều hướng ảnh ở kiosk có vùng chạm ít nhất 48 px.

Ảnh flycam Quần thể hiển thị kín chiều ngang trên khung kiosk, giữ mép trên và cắt bớt cây phía dưới thay vì để hai dải đen hai bên. Ảnh gốc không đổi; mốc vẫn đặt theo tọa độ tỷ lệ của toàn ảnh. Khung dọc giữ toàn cảnh ở giữa theo chiều cao. Khung quá thấp dùng toàn ảnh để tránh cắt mất các điểm. Khi zoom vào mốc, tâm zoom lấy cả vị trí dịch của mặt ảnh trong khung, vì vậy vẫn tiến thẳng vào mốc và quay lại cùng vị trí. `tests/khmer-complex-focus-test.cjs` kiểm tra phần cắt, khoảng cách tiêu đề và quỹ đạo của ba mốc.

Bốn tab nằm ở góc trái của dải dưới, xếp thành hai cột × hai hàng theo thứ tự đọc Quần thể, Khuôn viên, Tầng trệt, Tầng lầu. Các thẻ ảnh bắt đầu bên phải cụm tab; vùng ảnh chính được mở rộng xuống phần hàng tab cũ. Lưới tab và dải ảnh giữ hai cột riêng ở khung hẹp. Phím trái/phải chuyển tab theo thứ tự, lên/xuống chuyển giữa hai hàng.

Dải dưới được chỉnh theo mẫu người dùng: nền nâu đồng, hàng tiêu đề “Khám phá không gian di sản”, biểu tượng cho bốn tab, thẻ ảnh có biểu tượng/chú thích và mũi tên tròn, lựa chọn có viền đồng sáng. Ba cột là tab / dải ảnh / vùng danh sách. Dải ảnh lấy chiều rộng theo nội dung đến giới hạn còn lại; vùng chứa nút “Tất cả … điểm” nhận khoảng trống khi ít thẻ và thu về kích thước tối thiểu khi nhiều thẻ. Dải dài cuộn bên trong, không đẩy nút danh sách ra khỏi khung. Trường hợp thiếu tư liệu giữ thông báo thay vì sinh thẻ giả. Số trong nút vẫn lấy toàn bộ `khmerPlaces.length`, không phải số ảnh của gian; `data-card-count` phản ánh số thẻ đang mở. Màn hình hẹp/chiều cao thấp dùng bố cục gọn và chừa thanh công cụ bên phải. `tests/khmer-discovery-strip-test.cjs` kiểm tra 0/1/3/6 thẻ, thay đổi chiều rộng thật của vùng danh sách, chọn hiện vật, mở danh mục và năm kích thước từ điện thoại đến kiosk 4K.

## Dữ liệu

`src/features/museo-detail/khmerDiscovery.ts` định nghĩa `Tab → DiscoveryEntry → photos / objects`. Các mục tham chiếu nội dung và ảnh có sẵn trong `khmerPlaces.ts`, không lấy toàn bộ gallery cũ làm ảnh của một gian. Số trên tab lấy từ `entries.length`.

| Tab | Tư liệu sử dụng |
| --- | --- |
| Quần thể | Ảnh flycam 1695 × 928 do người dùng cung cấp trên Desktop. Ba mốc: bảo tàng, chùa Âng, Ao Bà Om; thẻ ảnh và giới thiệu đồng bộ. Không dùng ảnh Đền thờ Bác Hồ. |
| Khuôn viên | Panorama 360° sân trước từ liên kết Google Maps người dùng cung cấp. Dải dưới chỉ có ba thẻ mốc; bỏ bốn thẻ góc nhìn cũ. Ảnh mặt tiền, mái và tháp vẫn nằm trong gallery chi tiết tương ứng. Số trên tab là số mốc. |
| Tầng trệt | Hai khu đã có nội dung: đón tiếp, cầu thang/hồ bán nguyệt. Chưa có ảnh riêng xác nhận bên trong; không dùng mặt tiền hoặc ảnh tầng lầu thay thế. |
| Tầng lầu | Sáu khu theo chủ đề đã có dữ liệu. Ghế thuyết pháp là hiện vật của chủ đề tín ngưỡng, không phải một gian riêng. Các tên là chủ đề trưng bày hiện có, không phải tên phòng hay sơ đồ đo đạc mới. |

Ảnh đại diện có thể là ảnh hiện vật; chỉ `photos` mới được dùng khi mở ảnh bên trong khu. Khảo cổ, nghề truyền thống và chữ viết chưa có ảnh toàn khu được định danh riêng, nên để `photos` rỗng. Ảnh cận, chú thích, tác giả và nguồn của hiện vật dùng dữ liệu dự án. Khi chưa có bài riêng cho hiện vật, phần văn bản được ghi rõ là “Câu chuyện khu trưng bày”.

Danh bạ vẫn giữ các nội dung cũ. Điểm liên kết và chủ đề chưa có vị trí trong cấu trúc khám phá mở bài giới thiệu có sẵn, không tự gán vào một tầng.

`aerial` dùng đúng ảnh quần thể do người dùng cung cấp. Mỗi mốc chứa `entryId`, `number`, `x`, `y`, `confirmed: true`; `x/y` nằm trong `[0,1]` của ảnh gốc. `AerialScene` đo kích thước ảnh và khung bằng `ResizeObserver`, đặt mốc trong đúng vùng ảnh sau khi thu vừa khung, kể cả phần viền trống. Ba mốc đã đối chiếu trên ảnh: 1 · Bảo tàng `(0.709, 0.607)`; 2 · Chùa Âng `(0.350, 0.644)`; 3 · Ao Bà Om `(0.517, 0.185)`. Đây là tọa độ ảnh, không phải tọa độ bản đồ địa lý.

Chạm mốc hoặc thẻ ảnh chọn địa điểm, làm nổi mốc, chuyển tới cảnh 360° và cập nhật ảnh, nhóm nội dung, giới thiệu, gợi ý quan sát ở cột phải. Nút “Xem chi tiết” mở ảnh và bài giới thiệu tương ứng. Bảo tàng có hai lối vào tầng; chùa và ao không có lối tầng của bảo tàng. Gallery chùa giữ ảnh chùa Âng, gallery ao giữ mặt nước và cổ thụ; không lấy ảnh mô hình trong bảo tàng làm ảnh của hai địa điểm này. Đóng chi tiết giữ cảnh và góc nhìn; từ một tầng quay về Quần thể sẽ hiện lại ảnh flycam và lựa chọn. Bộ kiểm tra `tests/khmer-aerial-test.cjs` kiểm tra chạm thật, đồng bộ ba vùng, gallery, lối vào tầng và tọa độ mốc qua năm kích thước màn hình.

Từ ngày 14/11/2026, **tab Quần thể** có tour 360° ba điểm: bảo tàng Khmer, chùa Âng, Ao Bà Om. Chọn mốc/thẻ tiến camera trên ảnh flycam về đúng tọa độ đã xác nhận, rồi hòa sang panorama trong khoảng 1,9 giây. Trong mỗi cảnh, hai nút “Đi đến” là liên kết tham quan, không phải mốc vị trí đoán trên ảnh. Chuyển giữa các panorama dùng hai render target để hòa ảnh cùng chuyển động FOV; cảnh cũ vẫn hiện trong lúc tải cảnh mới. Mỗi điểm nhớ yaw/pitch/FOV, có lối quay về tổng quan và mở rộng trong viền vàng, phía trên footer. Dải thẻ và cột giới thiệu vẫn đồng bộ; mở/đóng chi tiết giữ cảnh và góc nhìn.

Khi vào từ flycam, tâm phóng đặt tại mốc đã chọn, tính cả khoảng trống do ảnh hiển thị nguyên tỷ lệ. Phóng và đưa mốc vào giữa dùng chung một tiến độ; mốc đi thẳng về tâm ngay từ đầu, không trôi ra ngoài rồi đảo hướng. Quay về tổng quan đi ngược đúng đường đó. `tests/khmer-complex-focus-test.cjs` đo vị trí thật của ba mốc qua từng khung hình, gồm ảnh có khoảng trống trên điện thoại, để kiểm tra hướng đi, không vượt tâm và đường quay về.

`KhmerComplexTourViewer.tsx` quản lý render theo thao tác và chuyển cảnh hữu hạn, hủy tài nguyên khi rời tab; `khmerComplexScenes.ts` tách dữ liệu cảnh. Bảo tàng dùng panorama Google Maps đã có. Chùa và ao dùng các ô ảnh gốc từ tour công khai người dùng chỉ định tại `https://chuaang.tinhdoanvinhlong.vn/`: `scene_12_CONG_CHINH_DIEN` và `scene_6_1_AO_BA_OM`. Mỗi cảnh có sáu mặt cube 1024 px, mỗi mặt gồm 2×2 ô 512 px; ghép đúng hàng/cột khi render, không kéo ảnh chụp thường thành 360°. `sources.json` ghi URL, dung lượng, SHA256 từng ô; giao diện giữ nguồn và liên kết tour gốc. Không nhúng menu, hướng dẫn hoặc âm thanh tự phát của trang nguồn. Lỗi tải giữ ảnh tổng quan và phần giới thiệu, có thử lại. Giảm chuyển động bỏ hiệu ứng tiến và hòa ảnh. Kiểm tra bằng `node tests/khmer-complex-tour-test.cjs`.

## Trạng thái và quay lại

Dải thẻ dùng thống nhất luồng **chọn thẻ → xem ảnh/mô hình bên trái và giới thiệu bên phải → bấm “Xem chi tiết”**. Thẻ hiện vật không tự mở cửa sổ. Tên, mô tả và nguồn ảnh bên phải theo đúng ảnh/hiện vật đã chọn, thay vì giữ tên gian. Ảnh xuất hiện trong cả `photos` và `objects` chỉ có một thẻ; nút chi tiết vẫn mở đúng hiện vật tương ứng. Chọn hiện vật ngoài bộ ảnh của gian ẩn bộ đếm ảnh không tương ứng. Đóng chi tiết giữ nguyên ảnh, lựa chọn và góc mô hình đang xem. Kiểm tra riêng bằng `tests/khmer-card-selection-test.cjs`.

Khung ảnh phẳng bên trái không còn nhãn tên gian/tên ảnh hay cụm trước–sau và số ảnh. Chọn ảnh bằng dải thẻ phía dưới; tiêu đề và giới thiệu nằm ở cột phải.

Chọn mốc, thẻ hoặc mũi tên dùng chung trạng thái chọn. Bấm tab Tầng trệt hoặc Tầng lầu (kể cả lối vào từ thẻ tòa bảo tàng) mở ngay `panoramaEntry` của tầng. Tầng lầu tạm dùng chung file ảnh thử 360° của Tầng trệt theo yêu cầu người dùng, có tiêu đề và chú thích dùng tạm riêng; không tạo thêm gian hay gán hiện vật vào ảnh thử. Hai tầng lưu góc xoay và mức zoom độc lập. Dải dưới vẫn hiển thị các khu của tầng; chọn khu mở ảnh/hiện vật đúng khu. Nút “Về danh sách gian” giữ đúng tầng. Chỉ số ảnh được lưu theo tab và khu; đóng chi tiết hiện vật giữ nguyên khu, ảnh, cột giới thiệu và trả focus về thẻ vừa chọn. Kiểm tra luồng hai tầng bằng `node tests/khmer-ground-trial-test.cjs`.

## Kiểm tra

### Mô hình 3D hiện vật sa thạch

Nhóm **Tầng lầu → Nghệ thuật trình diễn** có thêm “Mão vua – mão hoàng hậu”, dùng GLB được cung cấp và ảnh xem trước render từ chính mô hình. `DiscoveryObject.story` cho phép nội dung hiện vật riêng thay cho việc mượn bài giới thiệu chung của gian; bốn phần về vai diễn, Ream Kê, chế tác và truyền nghề lưu trong `khmerHeaddresses.ts`, kèm bốn nguồn tham khảo. `modelPreview` đổi nhãn chế độ ảnh thành “Ảnh mô hình”, tránh trình bày ảnh dựng 3D như ảnh hiện vật được bảo tàng xác nhận. Không thêm gian mới hoặc tọa độ hiện vật; đây là cách nhóm nội dung theo chủ đề nghệ thuật.

Kiểm tra mão: `node tests/khmer-headdresses-model-test.cjs`. Trình xem dùng chung với hiện vật sa thạch, nhận tên hiện vật riêng cho nhãn hỗ trợ đọc màn hình; mỗi hiện vật vẫn giữ bộ mô hình, ảnh, nội dung và nguồn tương ứng.

Mục **Tầng lầu → Dấu tích khảo cổ → Hiện vật sa thạch** dùng GLB người dùng cung cấp, tham chiếu bằng `DiscoveryObject.model`. Mở hiện vật vào chế độ 3D; nút “Ảnh tư liệu” chuyển về ảnh và nguồn đã có. Chú thích mô hình ghi rõ tư liệu do người dùng cung cấp, không mượn tác giả/niên đại của ảnh làm nguồn xác minh mô hình.

Mô hình hiện ngay trong khung lớn của màn hình khám phá. Gian chưa có ảnh bên trong nhưng có mô hình (như Dấu tích khảo cổ) tự chọn mô hình đầu tiên. Chọn thẻ hiện vật có GLB đổi mô hình và cột giới thiệu; hiện vật chưa có GLB hiển thị ảnh cận trong cùng khung. Nút “Xem chi tiết” của mô hình mở bài riêng với ảnh mặc định, tránh tạo thêm renderer không cần thiết; đóng bài giữ nguyên camera và mức phóng của mô hình bên trái. Trở về danh sách gian/rời màn hình giải phóng renderer.

Trình xem hỗ trợ kéo xoay, hai ngón tay/con lăn và nút cộng trừ để phóng, nút đặt lại; bàn phím dùng mũi tên, `+/-`, `Home`. Giữ vật liệu và texture nhúng trong GLB. Camera tự căn theo kích thước mô hình; không tạo hình khối thay thế hoặc thêm bệ giả. Chỉ render khi có thao tác/đổi kích thước, dọn tài nguyên khi đóng hoặc chuyển sang ảnh. Lỗi tải/WebGL cho phép thử lại hoặc chọn ảnh tư liệu.

Kiểm tra riêng: `node tests/khmer-artifact-model-test.cjs`, có thể đặt `KHMER_DISCOVERY_BASE` để kiểm tra Vite. Bộ kiểm tra mở đúng GLB, thao tác xoay/phóng/đặt lại, chuyển ảnh, khung hẹp, focus và gian khi đóng, cùng ảnh dự phòng khi tải mô hình lỗi.

Chạy Vite rồi dùng:

```powershell
$env:KHMER_DISCOVERY_BASE='http://127.0.0.1:3000'
node tests/khmer-discovery-test.cjs
node tests/khmer-panorama-test.cjs
node tests/khmer-grounds-points-test.cjs
node tests/museo-detail-test.cjs --places-only
node tests/museo-detail-test.cjs --places-motion-only
npm run lint
npm run build
```

Kiểm tra Chrome bao gồm bốn tab, đồng bộ ảnh/thẻ/giới thiệu, ảnh thiếu, nút ảnh qua thao tác trỏ thật, đi vào khu/hiện vật và quay lại đúng ảnh, bàn phím/focus và bảy kích thước từ 320 px đến 3840 px. Bộ kiểm tra bài giới thiệu cũ đã đổi lối mở qua nút ở cột phải. Vị trí thực tế của mốc flycam còn cần được đối chiếu khi bổ sung ảnh và tọa độ.

## Panorama Khuôn viên

Tầng trệt có thêm một mục độc lập “Ảnh thử 360°”, dùng ảnh 1280 × 640 do người dùng cung cấp từ Raya 360. Mục này mở cùng trình xem hình cầu, không gán hiện vật hoặc thay ảnh tư liệu của khu đón tiếp/cầu thang. `panorama.preview` chọn đúng ảnh và nguồn cho mỗi panorama; `trial` phân biệt ảnh thử và lối mở toàn màn hình. Kiểm tra riêng bằng `node tests/khmer-ground-trial-test.cjs` (hoặc đặt `KHMER_DISCOVERY_BASE` để kiểm tra Vite).

Ảnh `khmer-grounds-360.jpg` là panorama cầu 8000 × 4000, lấy từ nguồn ảnh công khai trong đúng liên kết người dùng cung cấp, không phải ảnh chụp màn hình Google Maps. Ảnh xem trước `khmer-grounds-360-preview.jpg` là góc nhìn phẳng của cùng panorama. Ghi nguồn và đường dẫn ảnh tại `src/assets/museo/README.md`.

`KhmerGroundsPanorama.tsx` dùng Three.js có sẵn trong dự án, ánh xạ ảnh 2:1 lên mặt trong hình cầu. Không tải hay nhúng giao diện Google Maps. Theo yêu cầu người dùng, khung 360° Khuôn viên không còn nhãn “Sân trước bảo tàng · 360°”, cụm trước/sau kèm số ảnh và liên kết Google Maps nổi trên ảnh. Giữ nút phóng/thu, đặt lại, toàn màn hình và mốc/popup; đổi góc nhìn qua dải thẻ bên dưới. Nguồn ảnh vẫn lưu trong dữ liệu và phần chi tiết. Ảnh phẳng giữ điều hướng trước/sau; ảnh thử Tầng trệt giữ nhãn và nguồn riêng.

Kéo bằng chuột/ngón tay để xoay ngang và dọc; hai ngón tay hoặc con lăn để phóng to. Phím mũi tên điều khiển góc nhìn, `+/-` điều khiển góc rộng, `Home` đặt lại. Góc xoay trong mã là tọa độ trên ảnh, không được trình bày như hướng địa lý đã kiểm chứng. Chuyển thẻ rồi quay lại giữ góc nhìn và mức phóng. Trình xem chỉ render khi có thao tác hoặc đổi kích thước; rời tab/màn hình giải phóng canvas, texture và renderer. Không WebGL hoặc lỗi tải giữ ảnh xem trước cùng nguồn và nút thử lại.

Phóng lớn ảnh 360° bằng portal vào chính khung `.kd-frame`, giữ viền vàng và footer bên ngoài. Không mở toàn màn hình trình duyệt hoặc dialog che footer. Cột thông tin và dải thẻ phía sau được đặt inert trong lúc ảnh phóng lớn. Nút thu nhỏ hoặc `Escape` trở về bố cục cũ, giữ góc xoay và mức phóng; nếu popup mốc đang mở, Escape đóng popup trước.

Khi ảnh 360° đang mở, nút mở rộng ở góc trên cũng chuyển đến cùng thao tác phóng lớn trong khung của panorama. Footer luôn nhìn thấy và dùng được. Các màn hình khác vẫn dùng thao tác mở rộng trang hiện có.

### Ba mốc trong panorama Khuôn viên

`khmerGroundsPoints.ts` lưu ba vật thể đã đối chiếu trực tiếp với panorama và ảnh người dùng gửi ngày 13/11/2026. Tọa độ `u/v` là tỷ lệ trên ảnh cầu gốc (trái → phải, trên → dưới), không phải hướng la bàn. `yaw = u × 360`, `pitch = 90 − v × 180`. Trình xem chiếu hướng cố định qua camera sau mỗi lần xoay, phóng hoặc đổi kích thước; mốc sau lưng và ngoài khung được ẩn. Không áp các tọa độ này lên ảnh phẳng khác.

| Mốc | u | v | Ảnh và nội dung |
| --- | --- | --- | --- |
| 01 · Tòa bảo tàng | 0.495 | 0.435 | Ảnh gốc 4.608 × 3.456 px của Bùi Thụy Đào Nguyên (2013, CC BY-SA 3.0); giữ thêm ảnh mặt tiền và mái năm 2023. Giới thiệu kiến trúc và lối vào hai tầng. |
| 02 · Tháp Maha Sơn Thông | 0.687 | 0.468 | Hai ảnh người dùng cung cấp ngày 14/11/2026: chính diện 800 × 1094 px và góc vườn 516 × 387 px; sau đó là hai ảnh văn bia Khmer và Việt. Ảnh chính diện dùng chung cho thẻ, popup và cột phải. |
| 03 · Nhạc cụ dạng thuyền | 0.739 | 0.581 | Ảnh cận mới 2048 × 1153 px do người dùng cung cấp, thay ảnh cắt từ panorama. Mô tả dựa trên thanh gõ, dùi và dòng chữ kỷ niệm trên bệ; bỏ liên hệ Rô-néat trước đây. Không suy diễn tên người chế tác hoặc ngày chế tác từ dòng chữ. |

Chạm mốc hoặc thẻ ảnh dùng cùng trạng thái chọn và xoay camera về đúng vật thể, giữ nguyên góc rộng (FOV) hiện tại, không tự zoom theo mốc. Cột phải cập nhật ảnh, tên, giới thiệu và gợi ý quan sát. Dải bên dưới chỉ có ba thẻ mốc; số mốc lấy từ dữ liệu. Mốc không được thêm vào ảnh thử Tầng trệt.

Camera xoay theo cung ngắn nhất trong khoảng 1,5–2,5 giây, tăng và giảm tốc bằng đường cong bậc năm; chọn liên tiếp bắt đầu từ góc đang hiển thị và ưu tiên mốc vừa chọn. Thời gian chỉ tiến qua các khung thực sự được vẽ, giới hạn mỗi bước 40 ms để không nhảy góc khi trình duyệt chậm. Popup ẩn trong lúc xoay rồi hiện nhẹ trong 220 ms; ảnh và giới thiệu bên phải hiện dần trong 240 ms. Kéo tay, phóng/thu, phím điều hướng hoặc đặt lại ngắt chuyển động ngay. `prefers-reduced-motion` bỏ xoay tự động có hoạt ảnh và hiệu ứng hiện dần. Vòng render chỉ tiếp tục trong thời gian chuyển động, dừng khi tới đích hoặc rời màn hình. Kiểm tra chuyển động bằng `node tests/khmer-grounds-motion-test.cjs`.

Chọn mốc hoặc thẻ mốc mở popup ngay trong ảnh 360°, gồm ảnh đúng vật thể, số mốc, nhóm nội dung, tên, giới thiệu ngắn, số ảnh và nút “Ảnh cận & câu chuyện”. Popup nền đen, viền đồng, chữ ngà; giữ nguyên độ sáng ảnh nền. Nút đóng và nút mở chi tiết có vùng chạm ít nhất 48 px. Đóng popup giữ mốc/thẻ/cột phải đang chọn; chạm lại cùng mốc mở lại popup.

Popup dùng cùng phép chiếu camera với mốc, tự đổi bên và giới hạn trong khung, ẩn khi mốc ra ngoài tầm nhìn. `ResizeObserver` và mỗi lần render ảnh cập nhật tọa độ trực tiếp; không render liên tục hoặc đẩy tọa độ con trỏ vào React state. Khung nhỏ dùng thẻ ngang; toàn màn hình có cùng popup. `Escape` khi focus ở mốc/popup đóng popup trước khi rời toàn màn hình.

Nút trong popup hoặc cột phải mở gallery riêng có chú thích, tác giả, giấy phép đúng phiên bản, nguồn và phần thông tin biên tập. Khi đóng, giữ nguyên popup, mốc, góc xoay, mức phóng và trả focus về đúng nút đã mở. Chi tiết mở phía trên panorama toàn màn hình. Từ chi tiết tòa bảo tàng có thể vào đúng danh sách Tầng trệt hoặc Tầng lầu.

`khmer-grounds-points-test.cjs` kiểm tra ba đường chọn mốc/thẻ/cột phải, popup trong khung và nút dễ chạm, mở/đóng/mở lại popup, nguồn ảnh gốc và giấy phép, loại ảnh khác vật thể, phép chiếu sau xoay và đổi kích thước, gallery và focus khi quay lại, màn hình nhỏ/toàn màn hình và lối đi vào tầng.
