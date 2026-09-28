# Vị trí bảy cột mốc

Ngày đối chiếu: **27/09/2026**. Hệ tọa độ: **WGS 84**, dạng thập phân, thứ tự bảng là **vĩ độ, kinh độ**. MapLibre nhận thứ tự `[kinh độ, vĩ độ]`.

Các điểm dưới đây lấy từ điểm địa danh trong dữ liệu bản đồ nhúng công khai của Google Maps, đối chiếu thêm với ảnh vệ tinh tại vị trí đó. Dùng điểm địa danh, không lấy tọa độ tâm khung nhìn hoặc điểm trung tâm xã/huyện. Độ dài số thập phân bảo toàn giá trị nguồn; không thể hiện độ chính xác đo đạc thực địa.

| Mốc | Vĩ độ | Kinh độ | Địa danh trên Google Maps |
| --- | --- | --- | --- |
| Ao Bà Om | 9.9176081 | 106.3040916 | [Ao Bà Om](https://www.google.com/maps/search/?api=1&query=Ao+Ba+Om&query_place_id=ChIJy5e8IB8XoDERDfF5DR0QQmw) |
| Chùa Âng | 9.9157942 | 106.3036199 | [Chùa Âng](https://www.google.com/maps/search/?api=1&query=Chua+Ang&query_place_id=ChIJSRzSlh4XoDERa9-fBq9B1m0) |
| Bảo tàng Khmer | 9.9161668 | 106.3049936 | [Bảo Tàng Văn Hóa Dân Tộc Khmer](https://www.google.com/maps/search/?api=1&query=Bao+Tang+Van+Hoa+Dan+Toc+Khmer&query_place_id=ChIJK5tkTBkXoDERL-EuDJHlwCw) |
| Chùa Hang | 9.8870578 | 106.3450222 | [Chùa Hang, Trà Vinh](https://www.google.com/maps/search/?api=1&query=Chua+Hang+Tra+Vinh&query_place_id=ChIJS3Wd64cXoDERt2H3NC_Otp8) |
| Đền thờ Bác | 9.9837403 | 106.3301340 | [Đền thờ Bác, Long Đức](https://www.google.com/maps/search/?api=1&query=Den+tho+Bac+Long+Duc&query_place_id=ChIJLTUTdGIQoDERZHQ7GAL-V9M) |
| Cồn Chim | 9.9202712 | 106.4232557 | [Khu Du Lịch Cộng Đồng Cồn Chim, Hòa Minh](https://www.google.com/maps/search/?api=1&query=Khu+Du+Lich+Cong+Dong+Con+Chim&query_place_id=ChIJwWToVPUZoDERv1kHSoR04HE) |
| Biển Ba Động | 9.6339810 | 106.5650840 | [Biển ba động Xã Trường Long Hòa H. Duyên Hải Tỉnh Trà Vinh Việt Nam](https://www.google.com/maps/search/?api=1&query=Bien+Ba+Dong+Truong+Long+Hoa&query_place_id=ChIJI4KPEqSHnzERVG1YVZvilfI) |

Các thay đổi lớn so với dữ liệu trước: Cồn Chim khoảng **2,48 km**, Ba Động khoảng **2,53 km**, Đền thờ Bác khoảng **380 m**. Cồn Chim được chọn là điểm du lịch thuộc Hòa Minh trên sông Cổ Chiên, tránh địa danh Cồn Chim trùng tên ở địa phương khác. Ba Động dùng điểm địa danh bãi biển tại Trường Long Hòa; bãi biển và khu điện gió là khu vực rộng, có nhiều địa điểm riêng trên bản đồ.

## Đồng bộ trong ứng dụng

`src/data/heritageSites.ts` là nguồn tọa độ khi chạy. Marker, bay đến, đưa mốc về giữa màn hình, xoay 360°, tìm mốc gần và tải trước ảnh đều đọc cùng hai trường `lat/lng`; không lưu tọa độ riêng cho mỗi nền. Chấm và chân marker nằm đúng tọa độ; hình minh họa phía trên chân mốc chỉ biểu diễn địa điểm.

`npm run cache:map` đọc cùng dữ liệu, bổ sung ảnh quanh tọa độ mới và giữ ảnh đã có quanh vùng cũ. Hai nền Google/Esri và hai bộ nhãn Việt/Anh dùng cùng phạm vi tải sẵn. Sau khi cập nhật tọa độ, cần tạo lại bộ ảnh và mã phiên bản cache để bản triển khai chứa đủ ảnh tại điểm đến.
