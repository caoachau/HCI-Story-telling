# Nguồn ảnh và nội dung

Ảnh tải về ngày 20/09/2026 để tham khảo trong prototype học tập cục bộ. Bản quyền thuộc chủ sở hữu tương ứng; chưa xác nhận giấy phép tái xuất bản hoặc sử dụng thương mại. Giữ nguyên watermark của ảnh Chùa Âng. Cần xin phép hoặc thay ảnh tự chụp/có giấy phép trước khi phát hành công khai.

| Tệp | Nội dung | Nguồn |
| --- | --- | --- |
| `../src/assets/ao-ba-om/pond.webp` | Một góc Ao Bà Om, chuyển từ `ao-ba-om.jpg` | Bài của Huỳnh Biển, Trung tâm Xúc tiến Du lịch Vĩnh Long, 18/09/2025 |
| `../src/assets/ao-ba-om/roots.webp` | Gốc cây và rễ quanh ao, chuyển từ `re-cay.jpg` | Cùng bài của Huỳnh Biển |
| `../src/assets/ao-ba-om/ang-pagoda.webp` | Chùa Âng, chuyển từ `chua-ang.jpg`, giữ watermark TITC | Cục Du lịch Quốc gia Việt Nam |

- [Bài giới thiệu Ao Bà Om, nguồn ảnh ao và rễ cây](https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay)
- [Giới thiệu Ao Bà Om và điểm đến liên quan, Cục Du lịch Quốc gia Việt Nam](https://vietnamtourism.vn/en/index.php/tourism/items/1395)
- [Tư liệu lễ hội Ok Om Bok năm 2024](https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/)

Các URL ảnh gốc:

- https://dltm-cdn.vnptit3.vn/resources/portal/Images/VLG/adminportal_vlg/yem/t9/18_9/16374ff97445ff1ba654_340286383.jpg
- https://dltm-cdn.vnptit3.vn/resources/portal/Images/VLG/adminportal_vlg/yem/t9/18_9/f4a5229a1a269178c837_584507930.jpg
- https://vietnamtourism.vn/imguploads/tourist/Diemden/TraVinh/AngPagoda/ChuaAng03.jpg

Các ảnh JPG gốc và hình vector của prototype tĩnh đã được dọn khi không còn được ứng dụng sử dụng. Thông tin nguồn vẫn được giữ cho các bản WebP đang hiển thị.

## Ảnh bản đồ bổ sung cho Fly-to

Người dùng cung cấp `New folder.zip`, gồm ảnh chụp giao diện bản đồ và video tham khảo. Không có giấy phép tái xuất bản kèm theo. Thư mục tham khảo `.reference-assets` đã được dọn theo yêu cầu; ứng dụng chỉ giữ ảnh đã xử lý còn đang dùng.

| Tệp | Nguồn / xử lý |
| --- | --- |
| `ao-ba-om-aerial.webp` | Từ `AO BÀ ÔM GÓC TỪ TRÊN XUỐNG.png`; công cụ imagegen tích hợp xử lý ghim và nút điều khiển, giữ hình ao và cây xung quanh. Chuyển từ PNG kết quả sang WebP lossless; đã kiểm tra toàn bộ pixel RGB giống nhau. |

Đây là ảnh tham khảo đã chỉnh sửa bằng AI, không phải bộ dữ liệu bản đồ được khảo sát. Các ảnh tổng thể và cận cảnh được chuyển tiếp phục vụ kể chuyện, chưa đăng ký tọa độ GIS với nhau. Không thêm tọa độ, đường hoặc công trình chi tiết từ suy đoán. Xem [phân tích tư liệu](../REFERENCE-ANALYSIS.md) và [prompt xử lý ảnh](IMAGE-PROMPTS.md).

Lời nội dung được biên soạn từ kịch bản trong `tai-lieu-de-tai/03-kich-ban-ao-ba-om.md`, không phải lời trích nguyên văn từ nguồn. Không suy ra lịch sử xác thực từ dị bản truyền thuyết hoặc dùng sự kiện năm 2024 làm lịch lễ hội hiện tại.

## Ảnh section Tổng quan Bảo tàng Văn hóa Khmer

Ảnh thực tế được lưu tại `src/assets/museo/`, giữ nguyên dữ liệu ảnh nguồn. Các ảnh tư liệu được ghi rõ nguồn trong cửa sổ đọc thêm. Không có thông tin giấy phép mở kèm theo các trang nguồn.

| Tệp | Nguồn |
| --- | --- |
| `khmer-facade.jpg` | Ảnh mặt tiền, trích nguyên JPEG từ [tài liệu bảo tàng của Cổng thông tin tỉnh Vĩnh Long](https://vinhlong.gov.vn/Portals/0/Documents/DiaDanh/PDF/B%E1%BA%A3o%20t%C3%A0ng%20v%C4%83n%20h%C3%B3a%20d%C3%A2n%20t%E1%BB%99c%20Khmer.pdf?ver=Hm5_GnD7N35VYzuvIQrc0Q%3D%3D); tài liệu ghi nguồn ảnh dulichtravinh.com.vn. |
| `khmer-tools.jpg` | Dụng cụ đánh bắt thủy sản, ảnh số 2 trong [bài giới thiệu của Bảo tàng Lịch sử Quốc gia, 13/05/2014](https://baotanglichsu.vn/VI/Articles/3096/16337/bao-tang-van-hoa-dan-toc-khmer-tinh-tra-vinh.html). |
| `khmer-temple-model.jpg` | Khách nghe thuyết minh bên mô hình chùa Khmer, ảnh số 3 trong cùng bài. |
| `khmer-pinpeat.jpg` | Dàn nhạc Ngũ âm, ảnh số 4 trong cùng bài. |
| `khmer-visitors.jpg` | Khách tham quan các mô hình và hiện vật, ảnh số 5 trong cùng bài. |

Nội dung section dựa trên tài liệu `btvhkm.docx` do người dùng cung cấp; các liên kết nguồn đối chiếu, chú thích và bản dịch được lưu trong `src/features/museo-detail/khmerOverview.ts`. Bản đồ thu nhỏ tái sử dụng các tile Esri đã có trong dự án, đặt ghim theo tọa độ bảo tàng trong danh sách địa điểm.

## Ảnh section Không gian di sản Bảo tàng Văn hóa Khmer

Các ảnh mới giữ nguyên byte và watermark nguồn, lưu trong `src/assets/museo/`. Chú thích, tên tác giả và liên kết bài nguồn nằm trong `khmerPlaces.ts`, hiển thị bên dưới từng ảnh trong cửa sổ chi tiết. Các trang không cung cấp giấy phép mở.

| Tệp | Nội dung / tác giả / nguồn |
| --- | --- |
| `khmer-facade-2023.jpg`, `khmer-roof.jpg`, `khmer-exhibition.jpg` | Mặt tiền, mái và không gian tín ngưỡng. Hoàng Giám, [VietNamNet, 18/10/2023](https://vietnamnet.vn/800-hien-vat-tu-lieu-co-truyen-cua-dong-bao-khmer-o-tra-vinh-2203450.html), ảnh 1–3. |
| `khmer-hall.jpg`, `khmer-village.jpg`, `khmer-clothing.jpg` | Mô hình Chhay-dăm (tên tệp hall là tên kỹ thuật), phum sóc và trang phục. Cùng bài, ảnh 4–6. |
| `khmer-preaching-chair.jpg`, `khmer-duke.jpg`, `khmer-ngo-model.jpg` | Ghế thuyết pháp, sân khấu Dù kê và mô hình Ghe Ngo trong nhà. Cùng bài, ảnh 7–9. |
| `khmer-farm-tools.jpg`, `khmer-kitchen.jpg`, `khmer-fishing.jpg` | Nông cụ, gian bếp và ngư cụ. Cùng bài, ảnh 10–12. |
| `khmer-sandstone.jpg`, `khmer-buddha.jpg`, `khmer-mask.jpg`, `khmer-ensemble.jpg` | Hiện vật sa thạch Lưu Nghiệp Anh, tượng Phật, mặt nạ và dàn ngũ âm. Cùng bài, ảnh 13–16. |
| `khmer-memorial.png`, `khmer-memorial-khmer.png`, `khmer-memorial-vietnamese.png` | Tháp Maha Sơn Thông và hai mặt văn bia. Huỳnh Như, [Bảo tàng Vĩnh Long, 22/12/2025](https://baotangvinhlong.vn/su-kien-noi-bat/thap-tuong-niem-cu-maha-son-thong-vi-lao-thanh-cach-mang-nguoi-khmer-587169), ảnh `mst2.png`, `mst3.png`, `mst4.png` từ storage-vnportal.vnpt.vn. |

Ảnh `khmer-temple-model.jpg` tái sử dụng từ tư liệu 2014 đã ghi nguồn ở trên. Ảnh `ao-ba-om/pond.webp`, `roots.webp` và `ang-pagoda.webp` tái sử dụng theo mục Ao Bà Om. Không dùng ảnh mô hình chùa làm ảnh kinh lá buông, ảnh Ghe Ngo thu nhỏ làm ảnh ghe thật, hoặc ảnh cây bên ao làm ảnh sân bảo tàng.

Nội dung được biên soạn từ bản tổng hợp người dùng gửi ngày 04/10/2026 và đối chiếu các bài nguồn. Bản đồ quần thể dùng tọa độ có sẵn của ba địa điểm; các sơ đồ còn lại là sơ đồ chủ đề, không suy ra mặt bằng khảo sát từ tư liệu văn bản.

## Ảnh section Lịch sử hình thành & phát triển bảo tàng

Năm ảnh mới giữ nguyên byte nguồn tại `src/assets/museo/`. Hai tệp được máy chủ nguồn đặt đuôi GIF nhưng dữ liệu thực tế là BMP; tên lưu cục bộ phản ánh đúng định dạng, không chuyển đổi hay chỉnh sửa ảnh. Các ảnh tái sử dụng giữ nguồn và chú thích ở các mục trên. Metadata nằm trong `khmerHistory.ts`; từng ảnh trong cửa sổ đọc có chú thích và liên kết nguồn.

| Tệp | Nội dung / tác giả / nguồn |
| --- | --- |
| `khmer-history-music-2008.bmp` | Dàn ngũ âm trong [bài giới thiệu bảo tàng ngày 31/08/2008 của Bảo tàng Lịch sử Quốc gia](https://baotanglichsu.vn/vi/Articles/1508/49946/tham-bao-tang-van-hoa-khmer-tai-tra-vinh.html). Ảnh gốc `https://baotanglichsu.vn/DataFiles/Uploads/image/tintuc/tintrongnuoc_288.gif`. Bài không ghi tên người chụp. |
| `khmer-history-tools-2008.bmp` | Nông ngư cụ trong cùng bài năm 2008. Ảnh gốc `https://baotanglichsu.vn/DataFiles/Uploads/image/tintuc/tintrongnuoc_289.gif`. |
| `khmer-history-opening-2024.jpg` | Cắt băng khai mạc triển lãm tại bảo tàng ngày 11/11/2024. Trúc Phương, [Báo Văn Hóa](https://baovanhoa.vn/van-hoa-du-lich-dan-toc-thieu-so/van-hoa-dan-toc-khmer-tra-vinh-khoe-sac-111304.html). Ảnh gốc `https://media.baovanhoa.vn/zoom/1000/uploaded/daothingocnhien/2024_11_11/disan5_gxhz.jpg`. |
| `khmer-history-exhibition-2024.jpg` | Đại biểu tham quan triển lãm cùng ngày. Trúc Phương, cùng bài. Ảnh gốc `https://media.baovanhoa.vn/zoom/1000/uploaded/daothingocnhien/2024_11_11/disan_moss.jpg`. |
| `khmer-history-donors-2024.jpg` | Ghi nhận hai tập thể hiến tặng hiện vật cho ngành văn hóa, cùng sự kiện. Trúc Phương, cùng bài. Ảnh gốc `https://media.baovanhoa.vn/zoom/1000/uploaded/daothingocnhien/2024_11_11/disan3_bzlw.jpg`. |

Các nguồn không kèm giấy phép mở. Nội dung biên soạn từ bản tổng hợp lịch sử người dùng gửi ngày 05/10/2026, đối chiếu với nguồn có ngày và phạm vi cụ thể. Ảnh kiến trúc năm 2023 minh họa công trình về sau; ảnh tháp năm 2025 minh họa công trình xây năm 2012; ảnh Ao Bà Om năm 2025 minh họa bối cảnh cảnh quan, không ghi là ảnh lễ hội 2022.

## Ảnh section Văn hóa – Hoạt động – Con người

Tám ảnh mới lưu nguyên byte nguồn tại `src/assets/museo/`; không bỏ watermark, không chỉnh sửa hoặc chuyển định dạng. AVIF là định dạng nguồn của TTXVN. Các ảnh tái sử dụng từ section không gian/lịch sử và lễ hội Ao Bà Om giữ nguồn riêng. Metadata Việt/Anh, ngày tư liệu, chú thích và đường dẫn nằm trong `khmerCulture.ts`, hiển thị cùng ảnh ở cửa sổ đọc.

| Tệp | Nội dung và nguồn |
| --- | --- |
| `khmer-culture-lam-phen.jpg` | Lâm Phên chế tác nhạc cụ, [bài SCOV ngày 12/05/2010](https://scov.gov.vn/dat-nuoc-con-nguoi/con-nguoi-viet-nam/nghe-nhan-lam-phen-nguoi-giu-hon-van-hoa-khmer.html). Nguồn không ghi tên người chụp. URL ảnh: `https://scov.gov.vn/upload/2005660/20210923/6711e0163143ff222e89f7db155fd205nghe_nhan.jpg`. Ngày trong đường dẫn tải lại không được dùng làm ngày chụp. |
| `khmer-culture-thach-sang.jpg` | Thạch Sang hướng dẫn chế tác mão, mặt nạ. Thịnh Phúc, [Báo Văn Hóa ngày 13/12/2023](https://baovanhoa.vn/doi-song-van-hoa/nghe-thuat-che-tac-mao-mat-na-cua-nguoi-khmer-o-tra-vinh-64038.html), được VOV đăng lại. URL ảnh: `https://media.vov.vn/sites/default/files/styles/large/public/2023-12/nghe-nhan-tra-vinh_3.jpg`. |
| `khmer-culture-training-2023.jpg` | Học viên lớp truyền dạy, cùng bài và tác giả. URL ảnh: `https://media.vov.vn/sites/default/files/styles/large/public/2023-12/nghe-nhan-tra-vinh_2.jpg`. Đây là ảnh tập thể của lớp, không gán là cán bộ bảo tàng. |
| `khmer-culture-thuone-2021.avif` | Thạch Huỳnh Thươne cùng sản phẩm do anh chế tác. An Hiếu, [TTXVN ngày 05/06/2021](https://dantocmiennui.baotintuc.vn/nghe-nhan-tre-khat-khao-bao-ton-van-hoa-khmer-post304563.html). URL ảnh: `https://media3.baotintuc.vn/images/XtMI2cTUOu7JtJPwFuYGlOhAp_5WaApFvOtSitpj84hmng3mCdJrBXZlus3fnxJp-nBhCqpi8WMLTNxElLLtHhhZ232BLUyrEz4q4jsWaKc/nghe_nha_thach_huynh_thuone_1A.jpg.avif`. |
| `khmer-culture-chapey.jpg` | Ảnh trình diễn trong [hồ sơ Cục Di sản văn hóa](https://dsvh.gov.vn/nghe-thuat-cham-rieng-cha-pay-cua-nguoi-khmer-tinh-tra-vinh-3153). Nguồn không ghi tên người trong ảnh, tên người chụp hoặc ngày chụp; không gán là chân dung Thạch Mâu. URL ảnh: `https://dsvh.gov.vn/ckfinder/userfiles/images/Thong%20tin%20ds/Phi%20v%E1%BA%ADt%20th%E1%BB%83%20QG/DSVHPVTQG_Nghe%20thuat%20Cham%20Rieng%20Cha%20Pay.jpg`. |
| `khmer-culture-gongs-2025.jpg` | Đại biểu khai mạc triển lãm cồng chiêng, [Bộ VHTTDL đăng lại Báo Trà Vinh ngày 24/04/2025](https://bvhttdl.gov.vn/Pages/chi-tiet.aspx?url=%2Ftra-vinh-khai-mac-trien-lam-van-hoa-cong-chieng-tay-nguyen-xua-va-nay-20250424160636406.htm). URL ảnh: `https://bvhttdl.gov.vn/uploads/oldscontents/20250424160636406/115633hbt0568-1745485128727-1745485134862577787393.jpg`. |
| `khmer-culture-highlands-performance-2025.jpg` | Đoàn Nghệ thuật tỉnh Đắk Lắk giao lưu trước sảnh bảo tàng, cùng bài. URL ảnh: `https://bvhttdl.gov.vn/uploads/oldscontents/20250424160636406/115928hbt0580-1745485162357-17454851624671379487311.jpg`. |
| `khmer-culture-khmer-dance-2025.jpg` | Đoàn Nghệ thuật Khmer Ánh Bình Minh biểu diễn tại cùng sự kiện. URL ảnh: `https://bvhttdl.gov.vn/uploads/oldscontents/20250424160636406/115951hbt0642-1745485169295-1745485169411576253123.jpg`. |

Nội dung được biên soạn từ hai bản tổng hợp văn hóa và con người người dùng gửi ngày 05/10/2026, phân biệt trưng bày tại bảo tàng, thực hành cộng đồng và tư liệu sự kiện đã diễn ra. Những nhận định về số nghệ nhân Chà pây trong hồ sơ cũ không được dùng như số liệu hiện nay. Các ảnh không có giấy phép mở kèm theo; phạm vi sử dụng vẫn là prototype học tập cục bộ như đầu tài liệu.

## Tư liệu section Dấu ấn & Giá trị di sản

Section 6 tái sử dụng ảnh đã ghi nguồn ở các mục trên, giữ nguyên ảnh và metadata. Ba ảnh mỗi nhóm: ký ức (`farm`, `tools2008`, `memorial`); kiến trúc (`roof`, `facade`, `exhibition`); tri thức và bản sắc (`chair`, `buddha`, `village`); nghệ thuật (`mask`, `ensemble`, `sang`); quần thể (`pond`, `pagoda`, `opening2024`); tiếp nối (`sang`, `donors2024`, `khmerDance`). Ảnh lớp truyền nghề được chú thích là thực hành cộng đồng; ảnh năm 2024–2025 giữ đúng sự kiện và thời điểm. Ảnh bối cảnh tôn giáo không được gán là ảnh cận cảnh Satra.

Nội dung Việt/Anh biên soạn từ hai tài liệu người dùng gửi ngày 05/10/2026. Cấu trúc sáu nhóm giá trị và 24 mục đọc là cách tổ chức nội dung trên trang, không phải danh hiệu di sản hoặc sơ đồ phòng trưng bày. Nguồn nằm trong `khmerLegacySources` và hiện trong từng cửa sổ đọc. Đối chiếu bổ sung: [Cục Di sản văn hóa, công nhận bảo vật quốc gia đợt 5 năm 2016](https://dsvh.gov.vn/thu-tuong-chinh-phu-quyet-dinh-cong-nhan-bao-vat-quoc-gia-dot-5-nam-2016-1279), xác định Linga–Yoni thế kỷ V–VI do Bảo tàng Tổng hợp Trà Vinh lưu giữ; [Bộ VHTTDL, 06/11/2024](https://bvhttdl.gov.vn/Pages/chi-tiet.aspx?url=%2Ftra-vinh-lay-van-hoa-khmer-lam-don-bay-cho-du-lich-20241106084309683.htm), ghi số hiện vật theo thời điểm bài công bố. Các đề xuất số hóa trong tài liệu được diễn giải là hướng phát triển.

## Ảnh section Giới thiệu bảo tàng

Section 1 tái sử dụng `facade`, `exhibition`, `drum` và `sang` từ `khmerCulturePhotos`; không tải thêm hay chỉnh sửa byte ảnh. Ba ảnh bảo tàng từ tư liệu VietNamNet năm 2023; ảnh `sang` là Thịnh Phúc / Báo Văn Hóa, tháng 12/2023, ghi hoạt động truyền nghề trong cộng đồng. Ảnh múa Chhay-dăm thể hiện mô hình trong trưng bày, không được gán là ảnh diễn trực tiếp. Thuộc tính mô tả ảnh Việt/Anh giữ đúng bối cảnh. Ba chủ đề bổ trợ dùng ảnh Ao Bà Om, mặt nạ và Thạch Sang, giữ các nguồn đã ghi ở trên. Copy giới thiệu biên soạn từ nội dung bảo tàng đã được đối chiếu trong các section trước.
## Cồn Chim: ảnh mở đầu độ phân giải lớn

`src/assets/con-chim/cycling-2025-original.jpg`: ảnh Hữu Phúc / Báo Sài Gòn Giải Phóng, trong [bài ngày 03/02/2025](https://www.sggp.org.vn/tra-vinh-du-lich-cong-dong-con-chim-duoc-nhan-giai-thuong-du-lich-asean-2025-post780369.html). Lưu nguyên byte JPEG 2441×1373 từ [ảnh gốc](https://image.sggp.org.vn/Uploaded/2026/zotnae/2025_02_03/du-lich-con-chim-3593-6471.jpg), thay bản rộng 1000 px ở các khung ảnh lớn. Bản WebP nhỏ vẫn dùng cho thumbnail. Không chỉnh màu, làm nét hoặc tạo chi tiết. Nguồn không cung cấp giấy phép mở.

