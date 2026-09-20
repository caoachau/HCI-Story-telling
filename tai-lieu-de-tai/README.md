# Bộ tài liệu bắt đầu dựng Figma

Ngày soạn: 19/09/2026. Ba tài liệu đã có nội dung hoàn chỉnh để bắt đầu wireframe, dựa trên yêu cầu màn hình cảm ứng lớn đặt nằm nghiêng.

**Cập nhật 20/09/2026:** Đã dựng [prototype web](../prototype/index.html) theo bộ tài liệu này. Xem [hướng dẫn chạy và phạm vi đã thực hiện](../prototype/README.md). Trạng thái tư liệu ghi trong các tài liệu ngày 19/09 là trạng thái tại thời điểm lập kịch bản; nguồn ảnh và các giới hạn hiện tại được cập nhật trong thư mục prototype.

1. [Bản mô tả đề tài](01-mo-ta-de-tai.docx) — bản Word bố cục A4 gọn; [bản Markdown](01-mo-ta-de-tai.md).
2. [Phạm vi và tính năng](02-pham-vi-va-tinh-nang.docx) — tính năng bắt buộc, phần mở rộng, quy tắc phiên và tiêu chí kiểm tra; [bản Markdown](02-pham-vi-va-tinh-nang.md).
3. [Kịch bản Ao Bà Om](03-kich-ban-ao-ba-om.docx) — nội dung hai nhánh, lời đọc, hình cần có, hotspot, quiz, nút chuyển và nguồn; [bản Markdown](03-kich-ban-ao-ba-om.md).

Đọc theo thứ tự 1 → 2 → 3. Dùng mã frame và sơ đồ ở tài liệu 3 để dựng Figma. Bộ tài liệu chưa bao gồm prototype, ảnh được cấp quyền, bản thu âm hoặc panorama; danh sách tư liệu cần chuẩn bị đã nằm trong kịch bản.

Phạm vi bản đầu: Ao Bà Om hoàn chỉnh; Chùa Âng là điểm chuyển tiếp có thẻ giới thiệu. Sáu marker không có nghĩa sáu câu chuyện hoàn chỉnh. Nếu sau này làm đầy đủ Chùa Âng, cần thêm kịch bản tương tự tài liệu 3.

Quy tắc 5 phút là thời gian hiển thị một nội dung, không phải thời gian không hoạt động. Trở về chờ sẽ đặt lại phiên. Không thêm màn gia hạn trái với quy tắc đã thống nhất.

Các file Word được tạo từ Markdown bằng `tao_file_word.py`; chạy bằng Python có gói `python-docx` nếu cần đồng bộ lại sau khi sửa Markdown. Đừng sửa cả hai bản song song mà không cập nhật lại.
