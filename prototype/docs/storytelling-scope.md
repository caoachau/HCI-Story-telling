# Phạm vi kể chuyện và User flow MVP

Rà soát: 29/10/2026. Danh mục 71 mục là inventory nhu cầu, thao tác, giải pháp và nghiệp vụ; không phải danh sách bắt buộc phải triển khai hết. Người dùng đã xác nhận dữ liệu bản ghi/quyền dùng/rá soát địa phương, tiếp cận và lịch đón còn thiếu: giữ chờ xác nhận.

Mục tiêu: khách chọn một chuyện/chi tiết, hiểu bối cảnh–con người–ý nghĩa, rồi tự chọn tìm hiểu thêm, hỏi hoặc kết thúc. Không dùng số tính năng, hiệu ứng hoặc số lượt mở làm bằng chứng khách đã hiểu.

Năm flow đề nghị: (1) bắt đầu/chọn chuyện, (2) hiểu một chuyện với nhánh đọc/nghe/quan sát phù hợp, (3) hỏi/liên hệ hoạt động tại điểm khi có xác nhận, (4) mang theo tùy chọn, (5) kết thúc/reset lượt kiosk. Trợ năng, nguồn, quay lại và phục hồi lỗi đi xuyên các flow. HDV có thể dùng cùng nội dung; biên tập/duyệt/sửa/rút là quy trình hậu trường.

## Phân loại 71 mục

- **Cốt lõi nội dung (7):** C01, C04, C08, C10, C11, C12, E04.
- **Cốt lõi thao tác/kiosk (17):** A01, A02, A03, A06, B02, B11, C03, C05, C06, D02, D03, D04, F08, G01, G02, G03, G04.
- **Hỗ trợ có điều kiện (32):** A04, A05, A08, B01, B03, B04, B05, B06, B10, B12, B13, C02, C07, C09, C13, C14, D01, D05, D06, D07, D10, E01, E02, E03, E05, F01, F02, F03, F06, H03, I01, I02.
- **Mở rộng tùy chọn (12):** A07, A09, B07, B08, B09, D08, D09, E06, F04, F05, H01, H02.
- **Nghiệp vụ/vận hành (3):** F07, I03, I04.

## Các giới hạn cần giữ khi phát triển tiếp

- Cốt lõi áp dụng theo loại chuyện: hiện vật cần giải thích ai dùng/cách dùng/lý do gìn giữ; cảnh quan không cần bị ép có hồ sơ hiện vật. Con người có thể được giới thiệu qua biên soạn có nguồn, không bắt mọi chuyện có bản ghi mới.
- Giữ kết thúc/reset (G02) trong MVP kiosk. Việc chức năng này còn thiếu đáng ưu tiên hơn thêm hiệu ứng.
- QR (F01–F03) là nhánh tùy chọn; F08 bảo đảm khách hoàn tất tại màn hình đang dùng.
- Thư viện/ghi chú (F04–F05) hướng tới thiết bị cá nhân; không mặc định giữ hồ sơ cá nhân cho lượt sau ở kiosk.
- 3D/360°/tự bay/quiz chỉ có ý nghĩa khi giúp trả lời câu hỏi diễn giải; không làm điều kiện đi tiếp.
- Tách E06: chuyện liên quan gộp C14; tuyến tham quan là tùy chọn có nguồn; thời tiết và lập lịch nằm ngoài MVP kể chuyện. H02 photobooth cũng ngoài MVP.
- Nguồn, quyền dùng và rà soát vẫn cần trước khi công bố; I03–I04 không tự tạo ra yêu cầu phải có CMS. F07 chuẩn bị offline là vận hành, không bắt khách quản lý gói tải trên kiosk.
- Chỉ đòi phụ đề khi dùng video và chỉ đòi hồ sơ hoạt động/ảnh xưa–nay khi thật sự chọn các tư liệu đó. Thiếu tư liệu chưa được chọn không phải lý do thêm media cho đủ tính năng.

Đây là đề xuất phạm vi từ báo cáo khảo sát §6–7 và bối cảnh sản phẩm, chưa phải phạm vi đã được khách/chủ thể xác nhận. Bảng 71 mục có lý do và ưu tiên từng mã nằm trong `Phan_tich_User_Flow/Ra_soat_pham_vi_va_User_Flow_MVP.md` ở workspace. [Báo cáo triển khai](requirements-completion.md) ghi trạng thái code và dữ liệu còn thiếu; hai đánh giá này là hai trục riêng.
