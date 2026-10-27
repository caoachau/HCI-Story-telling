# Ảnh tư liệu cho trang Đền thờ Bác Hồ

> C?p nh?t d?n repo 27/10/2026: c?c b?n ?nh/bi?n th? kh?ng c?n d?ng ?? ???c x?a. Ph?n d??i gi? l?ch s? ngu?n v? c?ch x? l?; t?n t?p c? kh?ng c? ngh?a t?p v?n n?m trong repo. Danh s?ch x?a v? hash n?m ? `prototype/docs/cleanup-2026-10-27.json`. C?c ?nh hi?n d?ng v? b?n ??i chi?u ???c gi? c? l? do trong `prototype/scripts/asset-retention.json`.

Năm ảnh JPEG gốc được lưu nguyên byte từ nguồn công khai, không chỉnh màu, tạo chi tiết hoặc xóa dấu nhận diện. Trang Lịch sử hiện dùng bộ bảy ảnh người dùng cung cấp trong `history-user/`. Trang Không gian hiện dùng bộ map mới nhất được mô tả bên dưới. Những PNG minh họa AI ở cuối tài liệu là lịch sử thiết kế, không còn dùng trên giao diện.

## Bản đồ mới: tám điểm tham quan · 25/10/2026

- `map-current-original.png`: giữ nguyên byte tệp `C:/Users/ASUS/OneDrive/Máy tính/map.png`, 1672×941, ảnh toàn cảnh sạch.
- `map-legend-original.png`: giữ nguyên byte tệp `map1.png` đi kèm, 1942×809, gồm tám ghim và chú giải.
- `map-current.webp`, `map-legend.webp`: chuyển định dạng WebP quality 94, không chỉnh màu, vẽ lại hay dùng AI. Ảnh sạch làm nền; bản chú giải chỉ mở khi chọn xem nguồn sơ đồ. SHA-256 và dung lượng: [map-current-manifest.json](map-current-manifest.json).
- Tên và thông tin công trình theo chú giải người dùng gửi; riêng điểm 02 ghi ba phòng trưng bày chuyên đề. Chú thích trên bản được cung cấp ghi nguồn ảnh VTV Times; không gán ảnh này sang nguồn CAND hoặc Nhân Dân.
- Tám vị trí được đối chiếu bằng đăng ký đặc trưng ảnh SIFT/RANSAC (806 điểm khớp hợp lệ), đưa đầu ghim trong bản đánh dấu về ảnh sạch. Tọa độ pixel và phần trăm: [map-current-coordinates.json](map-current-coordinates.json). Đây là vị trí trên ảnh, không phải GPS.
- Ghim số, nhãn tên và trạng thái chọn là HTML thật; cùng biến đổi với ảnh khi thu phóng/kéo. Bản đồ phủ kín vùng bên trái; bảng phải ban đầu chỉ hiện tám lựa chọn. Chọn một mốc thay danh sách bằng tóm tắt đầy đủ chiều cao; “Xem chi tiết” mở popup, “Tất cả 8 điểm” trở lại danh sách. Không gộp bản chú giải vào ảnh nền.
- Ảnh nhỏ của các vị trí chưa có tư liệu cận cảnh dùng phần phóng từ chính ảnh sạch, ghi “Vị trí trên ảnh toàn cảnh”. Điểm 01 và 06 giữ ảnh tư liệu công trình có nguồn riêng. Không giả ảnh bên trong phòng trưng bày hay ảnh mô hình dưới tán cây.

| Tệp | Kích thước | Nội dung, nguồn |
| --- | --- | --- |
| `temple.jpg` | 800×450 | Ngôi đền và đoàn học sinh. Bùi Anh Đức / Nhân Dân, đăng lại tại [Cục Du lịch Quốc gia Việt Nam, 05/09/2022](https://www.dulichvn.org.vn/index.php/item/chuyen-xay-giu-den-tho-bac-ho-trong-khang-chien-51088). [Ảnh](https://www.dulichvn.org.vn/nhaptin/uploads/images/2022/Thang9/59Chuyen-xay-giu-den-tho-Bac-Ho-trong-khang-chien-1.jpg). |
| `stilt-house.jpg` | 800×450 | Phiên bản nhà sàn trong khu di tích. Cùng bài và tác giả. [Ảnh](https://www.dulichvn.org.vn/nhaptin/uploads/images/2022/Thang9/59Chuyen-xay-giu-den-tho-Bac-Ho-trong-khang-chien-2.jpg). |
| `memorial.jpg` | 1200×806 | Ảnh từ trên cao về đền, ao nước và cây xanh. [Báo Công an nhân dân, 02/05/2023](https://cand.vn/Tieu-diem-van-hoa/den-tho-bac-ho-o-tra-vinh-tam-long-sat-son-cua-nhan-dan-nam-bo-i691437/). Chú thích nguồn không ghi riêng tên người chụp ảnh này. |
| `witness.jpg` | 1200×822 | Ông Mười Tiềm đứng giữa, kể chuyện xây và giữ đền. Cùng bài CAND, tư liệu năm 2023; không khẳng định lịch gặp hoặc tình trạng hiện nay của nhân chứng. |
| `ceremony.jpg` | 1200×722 | Đoàn Công an tỉnh Trà Vinh báo công tại đền. Hồ Giang / CAND, cùng bài; không gán thành ảnh một sự kiện mới. |
| `mark.svg` | 64×64 | Biểu tượng Landmark từ `lucide-react` có sẵn trong dự án; xuất SVG bằng bộ thư viện, dùng làm favicon. |

Ảnh CAND được tải từ biến thể JPEG của cùng các URL công khai trong bài:

- `https://cdn.cand.vn/images/YpUpQza0NAnvfADp60NQqbgFgxDc9a6oF7H7PsUG1j2c9PeJ3D-unhXX5xHUj_-eSozcTLHM-N9coZrCxTJSLgWhoWhC9k8924j_t6_PAoQ/Den_Tho_Bac_Ho_1-1682493482002.jpg`
- `https://cdn.cand.vn/images/YpUpQza0NAnvfADp60NQqbgFgxDc9a6oF7H7PsUG1j1KSTwRsdygB0wykxfgMBNipkWV99IgGGzira9CRRUcFQWhoWhC9k8924j_t6_PAoQ/Den_tho_Bac_Ho_2-1682493624542.jpg`
- `https://cdn.cand.vn/images/YpUpQza0NAnvfADp60NQqbgFgxDc9a6oF7H7PsUG1j1KSTwRsdygB0wykxfgMBNiut8ojImjQNZNOpaMydtmVgWhoWhC9k8924j_t6_PAoQ/Den_tho_Bac_Ho_4-1682493606143.jpg`

Ngày đăng bài không được trình bày thành ngày chụp. Các nguồn ảnh báo chí không kèm giấy phép mở; thông tin này được lưu để quản lý tư liệu khi chuyển từ demo sang triển khai. Kích thước ảnh gốc giới hạn mức chi tiết ở màn 4K; không dùng AI làm nét để tạo chi tiết lịch sử không có thật. Khung đọc mở đầy đủ ảnh, có chế độ phóng và chú thích nguồn.

## Lớp minh họa cho bố cục lịch sử mới

- `temple-cutout-v2.png`, 1672×941, PNG RGBA có alpha: minh họa ngôi đền và khách tham quan, dựng từ `temple.jpg`.
- `stilt-cutout-v2.png`, 1672×941, PNG RGBA có alpha: minh họa phiên bản nhà sàn, dựng từ `stilt-house.jpg`.

Tạo bằng công cụ **image_gen tích hợp**, đầu vào là hai ảnh đã có trong dự án; yêu cầu tách nền, giữ chủ thể và không dựng cảnh lịch sử. Kết quả là ảnh minh họa do AI tái dựng, có thể thay đổi chi tiết so với ảnh đầu vào, không phải phép tách nền giữ nguyên pixel. Chỉ dùng làm lớp thị giác trong section Lịch sử, ghi rõ “Minh họa từ ảnh tư liệu về sau” và dẫn nguồn tiền cảnh, nền chữ. Không dùng làm bằng chứng kiến trúc, nhân vật hoặc ảnh chụp sự kiện trong các năm 1970, 1971, 1989 hay 2012. Ảnh đọc chi tiết và ảnh không gian tiếp tục dùng JPEG gốc.

Hai tài sản được sao chép vào thư mục này; bản gốc công cụ được giữ lại tại `C:/Users/ASUS/.codex/generated_images/01a16b53-4323-73b1-8f25-783ba82d47b9/`. Prompt đầy đủ và cách dùng: [history-art-prompts.json](history-art-prompts.json).

## Ảnh thu nhỏ trên timeline

`temple-timeline.jpg`, `ceremony-timeline.jpg`, `memorial-timeline.jpg`, `stilt-timeline.jpg` được thu chiều rộng xuống 320 px từ các JPEG tương ứng, giữ tỷ lệ, không thay nội dung, không tạo chi tiết. Dùng System.Drawing, nội suy bicubic, JPEG quality 90; tổng khoảng 125 KB thay cho việc tải toàn bộ ảnh gốc ở bốn nút năm. Ảnh gốc tiếp tục dùng cho chữ số lớn và khung đọc.

## Lớp cắt ghép toàn cảnh theo ảnh tham chiếu 163355

- `history-temple-panorama-v4.png`, 1672×941, RGBA có alpha: cảnh cắt ghép ngôi đền, cây xanh, học sinh và nhóm tham quan. Đầu vào `temple.jpg`, `ceremony.jpg` và ảnh UI người dùng gửi chỉ để học bố cục.
- `history-stilt-panorama-v4.png`, 1672×941, RGBA có alpha: cảnh cắt ghép nhà sàn, ngôi đền, cây xanh và khách tham quan. Đầu vào `stilt-house.jpg`, `temple.jpg` và cùng ảnh tham chiếu bố cục.

Dùng **image_gen tích hợp** để dựng minh họa cắt ghép mới, thay lớp công trình đơn lẻ ở tiền cảnh Lịch sử. Đây là các cảnh minh họa do AI tái dựng, không phải ảnh chụp sự kiện, danh tính người cụ thể, cấu trúc/đo đạc kiến trúc hoặc bố trí mặt bằng có thể đối chiếu. UI ghi rõ minh họa từ tư liệu về sau, giữ đường dẫn bài gốc; toàn bộ phần đọc chi tiết và Không gian vẫn dùng ảnh JPEG gốc. Không sử dụng nội dung trận đánh, máy bay, vũ khí, câu trích hoặc năm 1920 từ ảnh tham chiếu.

CSS trình bày ảnh thành dải tiền cảnh chạy hết chiều ngang và cắt ở cạnh dưới để khớp bố cục mẫu; không phủ tối hoặc làm mờ ảnh. Bản PNG gốc giữ nguyên trong thư mục này. Prompt đầy đủ: [history-panorama-prompts.json](history-panorama-prompts.json). Hai kết quả gốc công cụ vẫn được giữ tại `C:/Users/ASUS/.codex/generated_images/01a16b53-4323-73b1-8f25-783ba82d47b9/exec-d98febc5-d926-438a-b532-6cf50d6d7051.png` và `exec-833e6ab5-ab53-4455-b23c-e7c4bced78fb.png`.

Bản dùng trên trang là `history-temple-panorama-v4.webp` (528.820 byte) và `history-stilt-panorama-v4.webp` (669.050 byte). Mã hóa bằng WebP của Chromium, chất lượng 0,94, giữ nguyên kích thước 1672×941 và alpha; chỉ tối ưu định dạng, không dựng thêm chi tiết hoặc đổi bố cục. PNG gốc lần lượt 2.090.809 và 2.490.009 byte được giữ để đối chiếu.

### Cập nhật 25/10/2026

Trang Lịch sử hiện dùng bảy ảnh người dùng gửi trong [history-user](history-user/README.md). Các ảnh AI/cutout ở trên được giữ lại làm lịch sử thiết kế, không còn import vào giao diện. Toàn bộ ảnh mới dùng đúng nội dung gốc, chỉ chuyển định dạng sang WebP và trình bày vùng minh họa bằng CSS. Xem manifest của bộ mới để đối chiếu tên file và SHA-256.
