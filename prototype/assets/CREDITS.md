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
