# Nguồn ảnh và nội dung

Ảnh tải về ngày 20/09/2026 để tham khảo trong prototype học tập cục bộ. Bản quyền thuộc chủ sở hữu tương ứng; chưa xác nhận giấy phép tái xuất bản hoặc sử dụng thương mại. Giữ nguyên watermark của ảnh Chùa Âng. Cần xin phép hoặc thay ảnh tự chụp/có giấy phép trước khi phát hành công khai.

| Tệp | Nội dung | Nguồn |
| --- | --- | --- |
| `ao-ba-om.jpg` | Một góc Ao Bà Om | Bài của Huỳnh Biển, Trung tâm Xúc tiến Du lịch Vĩnh Long, 18/09/2025 |
| `re-cay.jpg` | Gốc cây và rễ quanh ao | Cùng bài của Huỳnh Biển |
| `chua-ang.jpg` | Chùa Âng, watermark TITC | Cục Du lịch Quốc gia Việt Nam |

- [Bài giới thiệu Ao Bà Om, nguồn ảnh ao và rễ cây](https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay)
- [Giới thiệu Ao Bà Om và điểm đến liên quan, Cục Du lịch Quốc gia Việt Nam](https://vietnamtourism.vn/en/index.php/tourism/items/1395)
- [Tư liệu lễ hội Ok Om Bok năm 2024](https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/)

Các URL ảnh gốc:

- https://dltm-cdn.vnptit3.vn/resources/portal/Images/VLG/adminportal_vlg/yem/t9/18_9/16374ff97445ff1ba654_340286383.jpg
- https://dltm-cdn.vnptit3.vn/resources/portal/Images/VLG/adminportal_vlg/yem/t9/18_9/f4a5229a1a269178c837_584507930.jpg
- https://vietnamtourism.vn/imguploads/tourist/Diemden/TraVinh/AngPagoda/ChuaAng03.jpg

`brand.svg` và các hình vector trong `art.js` được vẽ bằng mã cho dự án này. Bản đồ có bố cục ước lệ; các hình chùa là biểu tượng minh họa, không phải bản vẽ kiến trúc khảo sát. Các cảnh truyền thuyết và lễ hội là hình minh họa, được gắn nhãn trong giao diện.

## Ảnh bản đồ bổ sung cho Fly-to

Người dùng cung cấp `New folder.zip`, gồm ảnh chụp giao diện bản đồ và video tham khảo. Không có giấy phép tái xuất bản kèm theo. Bản gốc được giữ ở `.reference-assets/New folder` trong workspace.

| Tệp | Nguồn / xử lý |
| --- | --- |
| `tra-vinh-aerial.png` | Từ `ẢNH GỐC 2D.png`; công cụ imagegen tích hợp xử lý ghim, chữ địa điểm và nút điều khiển dính trong ảnh, theo yêu cầu giữ nguyên cảnh quan. |
| `ao-ba-om-aerial.png` | Từ `AO BÀ ÔM GÓC TỪ TRÊN XUỐNG.png`; xử lý tương tự, giữ hình ao và cây xung quanh. |
| `ao-ba-om-aerial-reference.png` | Bản sao nguyên ảnh Ao người dùng gửi, để đối chiếu, không hiển thị trong giao diện. |

Đây là ảnh tham khảo đã chỉnh sửa bằng AI, không phải bộ dữ liệu bản đồ được khảo sát. Các ảnh tổng thể và cận cảnh được chuyển tiếp phục vụ kể chuyện, chưa đăng ký tọa độ GIS với nhau. Không thêm tọa độ, đường hoặc công trình chi tiết từ suy đoán. Xem [phân tích tư liệu](../REFERENCE-ANALYSIS.md) và [prompt xử lý ảnh](IMAGE-PROMPTS.md).

Lời nội dung được biên soạn từ kịch bản trong `tai-lieu-de-tai/03-kich-ban-ao-ba-om.md`, không phải lời trích nguyên văn từ nguồn. Không suy ra lịch sử xác thực từ dị bản truyền thuyết hoặc dùng sự kiện năm 2024 làm lịch lễ hội hiện tại.
