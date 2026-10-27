# Điểm 05 · Thuyền độc mộc

Mở tại **Đền thờ Bác Hồ → Không gian → 05 → Xem chi tiết**, hoặc `/den-tho-bac.html?section=spaces&story=map-boat`.

## Nội dung và giới hạn tư liệu

- [Báo Cà Mau, Loan Phương, 13/09/2024 — Trọn lòng yêu kính Bác](https://baocamau.vn/tron-long-yeu-kinh-bac-a34420.html) có ảnh và chú thích xác nhận tiểu cảnh Bác Hồ trên thuyền độc mộc trong khuôn viên đền.
- [Báo Vĩnh Long, 09/05/2018 — Về thăm Ðền thờ Bác Hồ ở Trà Vinh](https://baovinhlong.com.vn/nhip-song-dong-bang/201805/ve-tham-en-tho-bac-ho-o-tra-vinh-2892694/index.htm) liệt kê mô hình này trong các hạng mục của khu di tích.
- [Bảo tàng Vĩnh Long, 19/03/2026 — Thuyền độc mộc](https://baotangvinhlong.vn/hien-vat-tieu-bieu/thuyen-doc-moc-587180) giải thích loại thuyền đục từ thân gỗ nguyên khối. Chỉ dùng phần kiến thức chung; chiếc thuyền bảo tàng giới thiệu là hiện vật khác.

Không gán tiểu cảnh với một chuyến đi, con sông, thời điểm hoặc người đồng hành cụ thể. Các nguồn trên chưa xác nhận tác giả, năm chế tác, chất liệu hoặc kích thước. Không giới thiệu đây là chiếc thuyền nguyên gốc từng được Bác sử dụng, cũng không suy ra Bác đã đến Trà Vinh từ tiểu cảnh.

Ba phần đọc liên tục: **Tiểu cảnh tại đền**, **Hiểu về độc mộc**, **Cùng quan sát**. Nhận xét về tư thế, lòng thuyền và cảnh quan được biên soạn theo ảnh; liên kết nguồn đặt cạnh nội dung liên quan và trong mục Nguồn tư liệu.

## Ảnh và tương tác

Ảnh đính kèm được tìm thấy tại `C:\Users\ASUS\Downloads\Bronze Canoe Memorial in the Park.png`, kích thước 1448 × 1086. Sao chép nguyên byte vào `src/assets/den-tho-bac/boat-user/boat-supplied.png`; mã SHA-256, dung lượng và đường dẫn nằm trong `den-tho-bac-boat-manifest.json`.

Ghi nguồn hiển thị: **Người dùng cung cấp**. Tên tệp tiếng Anh không được dùng làm bằng chứng chất liệu. Đây là bản minh họa người dùng cung cấp, không gán tác giả ảnh báo chí. Không sao chép thêm ảnh không sử dụng.

Ảnh toàn cảnh bên phải dùng `object-fit: contain`, giữ nguyên tỉ lệ. Cuộn phần chữ bên trái hoặc chọn mục lục dưới ảnh; chỉ có một ảnh nên không lặp thành ba thumbnail hoặc đếm ba ảnh. Ảnh giữ nguyên khi đổi mục chữ, kể cả trạng thái phóng 200% và vị trí kéo ảnh. Chú thích đặt dưới ảnh. Trên điện thoại, ảnh và mục lục ở phía trên phần chữ cuộn độc lập; màn hình ngang thấp giữ hai cột.

Giữ cửa sổ `dialog`, phím Escape và hoàn trả focus, Nghe tóm tắt, Nguồn tư liệu và chế độ giảm chuyển động sẵn có. Mục lục hỗ trợ phím mũi tên, Home và End.

## Kiểm tra

- `npm run lint`
- Build Vite và `node tests/den-tho-bac-boat-test.cjs`
- Hồi quy bộ đọc ảnh và Không gian bằng các bài kiểm tra tương ứng.

Kết quả 27/10/2026: TypeScript và build đạt; kiểm tra Thuyền độc mộc **46 PASS**, bộ đọc ảnh **71 PASS**, Không gian **100 PASS**. Kiểm tra từ 320 px đến 4K, gồm màn hình ngang thấp, cuộn chữ, mục lục, phóng/kéo ảnh, lỗi tải và thử lại, nguồn, giọng đọc, Escape và cảm ứng với giảm chuyển động. Rà soát tài nguyên: không có tệp thiếu hoặc tệp không dùng.

Ảnh kiểm tra: `preview/den-tho-bac-boat-1404x790.png`, `preview/den-tho-bac-boat-390x844.png`, `preview/den-tho-bac-boat-844x390.png`.

Đối chiếu nguồn: 27/10/2026.
