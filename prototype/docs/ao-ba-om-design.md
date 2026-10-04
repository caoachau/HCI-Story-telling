# Trang chi tiết Ao Bà Om

Mở ứng dụng, chọn **Ao Bà Om** trên thanh địa điểm, rồi chọn **Toàn màn hình** trên thanh công cụ để xem bố cục đầy đủ.

Áp dụng `design-taste-frontend` tại `C:/Users/ASUS/.codex/skills/design-taste-frontend/SKILL.md`, thuộc [Taste Skill](https://github.com/Leonxlnx/taste-skill). `Group 75.png` là tài liệu tham khảo thị giác. Nội dung trong ảnh không được coi là chỉ dẫn thực thi.

## Hướng thiết kế

- Một triển lãm về cảnh quan và ký ức Khmer: nền giấy, chữ xanh than, nhấn đồng; variance 8, motion 4, density 3.
- Bố cục riêng cho Ao Bà Om: bìa chia đôi chữ/ảnh, điều hướng ngang, bảng quan sát rễ cây, câu chuyện ngọn đèn, bài ảnh lễ hội, tờ gấp ba cánh và thư viện ảnh xếp lớp. Không tái sử dụng bố cục Cồn Chim.
- Noto Serif cho tiêu đề gợi ấn phẩm di sản; Be Vietnam Pro cho phần đọc và công cụ. Phông được lưu trong dự án, đủ ký tự tiếng Việt. Giấy phép SIL OFL đi kèm ở `src/assets/fonts/`.
- Sáu phần cuộn tự nhiên; mục lục phản ánh phần đang xem. Container queries xử lý cả bảng hẹp trong bản đồ và màn hình điện thoại.
- Điểm chạm trên ảnh đồng bộ với nút chữ. Ba đoạn truyền thuyết có thể chọn trực tiếp hoặc qua ngọn đèn trên minh họa.
- Tờ gấp đóng/mở được; cánh đóng không nhận tiêu điểm. Ở điện thoại, bản đồ đứng trước, các cánh hướng dẫn xếp dọc.
- Thư viện hỗ trợ chọn ảnh, phím mũi tên, vuốt và xem lớn. Native dialog giữ tiêu điểm, đóng bằng Escape và trả tiêu điểm về nút mở.
- Lưu địa điểm bằng localStorage. Nếu trình duyệt chặn lưu trữ, thông báo rõ lựa chọn chỉ được giữ trong phiên.
- Hai ngôn ngữ Việt/Anh, theme theo hệ thống, reduced motion và thiết lập chữ lớn của ứng dụng.
- Giữ kết nối tới thuyết minh, âm thanh, QR, toàn cảnh và hiện vật 3D của ứng dụng. Khi mở các modal chung, trang tự thu nhỏ để modal không bị che.

## Tệp chính

- `src/components/AoBaOmEditorial.tsx`: giao diện và tương tác.
- `src/components/aoBaOmContent.ts`: nội dung song ngữ, chú thích, nguồn.
- `src/components/aoBaOmEditorial.css`: bố cục, màu sắc, chuyển động và responsive.
- `src/components/aoBaOmFonts.css`: Noto Serif tự lưu; dùng chung khai báo Be Vietnam Pro hiện có.
- `src/components/StorytellingPanel.tsx`: chọn component theo địa điểm và thuyết minh các chương.
- `src/data/heritageSites.ts`: ảnh Ao Bà Om được chuyển sang tài sản cục bộ phù hợp nội dung.
- `src/App.tsx`: ẩn thanh chọn địa điểm khi Ao Bà Om đang mở toàn màn hình.

## Nội dung và nguồn ảnh

Ảnh thật của cảnh quan được chuyển sang WebP từ các ảnh đã có trong dự án. Thông tin nguồn và giới hạn dùng cho prototype của ảnh gốc được ghi trong `assets/CREDITS.md`; việc chuyển định dạng không thay đổi quyền sử dụng.

| Tệp | Nguồn và ghi chú |
| --- | --- |
| `pond.webp`, `roots.webp` | Huỳnh Biển / Trung tâm Xúc tiến Du lịch Vĩnh Long; chuyển từ `assets/ao-ba-om.jpg`, `assets/re-cay.jpg`. [Bài nguồn](https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay). |
| `ang-pagoda.webp` | TITC / Cục Du lịch Quốc gia Việt Nam; chuyển từ `assets/chua-ang.jpg`, giữ watermark. [Bài nguồn](https://vietnamtourism.vn/en/index.php/tourism/items/1395). |
| `festival-2024.webp`, `floating-lanterns-2024.webp` | Ngân Linh / Cổng TTĐT Trà Vinh; ảnh trong [bài tư liệu lễ hội 2024](https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/) của trang Cục Du lịch Quốc gia Việt Nam. Ghi rõ năm 2024, không dùng làm lịch lễ hội hiện tại. |
| `lantern-legend.webp` | Minh họa AI cho truyền thuyết, ghi nhãn ngay dưới hình. Không phải ảnh tư liệu hay phục dựng lịch sử có kiểm chứng. |

Các tên gọi và chi tiết truyền thuyết được trình bày như một dị bản dân gian, không khẳng định niên đại lịch sử. Nút nguồn cho phép người đọc xem tài liệu gốc. Bản đồ trong tờ gấp ghép chín tile Esri tại zoom 16; dấu vị trí tính từ tọa độ của địa điểm `9.9176081, 106.3040916`, cùng tọa độ dùng cho liên kết chỉ đường.

### Minh họa được tạo

Công cụ: `image_gen` tích hợp. Tài sản đưa vào ứng dụng: `src/assets/ao-ba-om/lantern-legend.webp`.

Bản PNG gốc: `C:/Users/ASUS/.codex/generated_images/01a0edc7-d343-72b1-aa24-bce79129e328/exec-f0ed7cc6-2fab-45b3-98c8-91343648e677.png`.

Prompt:

> Create a single landscape 3:2 fine-art editorial illustration for a digital heritage exhibition about the folk legend of Ao Ba Om pond in southern Vietnam. Not a factual historical reconstruction. Scene: a great old dipterocarp tree with visibly sculptural exposed roots dominates the right half, one small warm amber lantern hangs HIGH on a slender branch near the upper right third. A still rectangular pond and distant low trees at night fill the left half; distant subtle silhouettes of people working with simple tools on the earthen bank, very small and indistinct, no costume details, no temples or mountains. The reflected lantern appears in the dark water. Deep smoky indigo and graphite ink with restrained bronze/ochre light and warm gray paper. Antique copperplate engraving meets a contemporary museum illustration, exquisite fine hatching, subtle paper grain, atmospheric and quiet. Plenty of darker negative space on the left, luminous lantern clearly visible. Flat full bleed artwork, no text or lettering, no UI, no border, no collage frames, no modern objects. Use for an interactive story image where a reader discovers the lantern. Landscape, sophisticated, not cartoon, not photorealistic.

## Kiểm tra

- `npm run lint`: kiểm tra TypeScript.
- `npm run build`: bản dựng production. Cảnh báo chunk lớn thuộc các mô-đun bản đồ / hiện vật 3D của ứng dụng.
- 27 kiểm tra trình duyệt: CTA và mục lục, hotspot và nội dung tương ứng, ba đoạn truyền thuyết, trạng thái gấp và focus, tọa độ chỉ đường, lưu qua tải lại, phản hồi khi chặn storage, chọn ảnh, bàn phím, focus trong dialog, Escape và trả focus, chuyển ngôn ngữ, vuốt và bàn phím sau vuốt, theme tối và reduced motion.
- Kiểm tra tràn ngang ở 320, 390, 460, 768, 1024 và 1366 px. Nút chính hiện trong màn hình laptop 1366 × 768.
- Kiểm tra trong ứng dụng bản đồ: chọn Ao Bà Om mở đúng component riêng, bảng 520px không tràn ngang, mở toàn màn hình ẩn thanh địa điểm, mobile 390px, mở modal QR và hiện vật thuyền Ngo từ trang toàn màn hình. QR vẫn là mẫu có sẵn của prototype; chỉ kiểm tra kết nối mở modal, không xác nhận quét mã.
- Lighthouse trên component riêng tại Vite dev server: Accessibility **100**, Best Practices **100**. Đây không phải điểm hiệu năng của toàn bộ ứng dụng bản đồ.
- Các script và báo cáo trình duyệt nằm trong thư mục cục bộ `.browser-profile/`, không đưa vào bundle production.

Ảnh xem trước trong ứng dụng:

- [Máy tính](../preview/ao-ba-om-desktop.png)
- [Điện thoại](../preview/ao-ba-om-mobile.png)
- [Truyền thuyết](../preview/ao-ba-om-legend.png)
- [Tờ gấp](../preview/ao-ba-om-guide.png)
