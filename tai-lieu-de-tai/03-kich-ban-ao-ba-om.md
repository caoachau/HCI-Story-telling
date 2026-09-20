# KỊCH BẢN TƯƠNG TÁC: AO BÀ OM

Phiên bản 1.0 · 19/09/2026 · Bản nội dung để dựng wireframe và prototype.

## 1. Ý tưởng và mục tiêu

Tên trải nghiệm: **Ao Bà Om — Mặt nước và những câu chuyện**.

Hai nhánh: **Truyền thuyết** và **Văn hóa – lễ hội**. Người dùng chọn một nhánh trước, có thể quay lại khám phá nhánh còn lại. Mỗi nhánh có ba cảnh ngắn; dùng chung phần mở đầu, panorama và khuôn tổng kết.

Mục tiêu học tập: nhận ra đặc điểm cảnh quan, phân biệt câu chuyện dân gian với sự kiện có tư liệu, và liên hệ địa điểm với sinh hoạt văn hóa Khmer. Dự kiến 3–5 phút mỗi lượt khám phá một nhánh, tùy thời gian xem panorama; đây là ước lượng thiết kế, cần đo khi thử nghiệm. Giới hạn 5 phút áp dụng cho từng nội dung giữ nguyên, không cho cả câu chuyện.

Các đoạn “Nội dung hiển thị” dưới đây là bản biên soạn mới từ nguồn đã dẫn, không phải trích nguyên văn. Audio đọc chính đoạn đó, nên transcript dùng chung để tránh lệch nội dung. Tiêu đề, lời mời thao tác và lời kết là nội dung thiết kế của nhóm.

## 2. Sơ đồ nối frame

```text
K01 Chờ → K02 Bản đồ → K03 Thẻ Ao Bà Om → C01 Mở đầu → C02 Chọn nhánh
                                                     ├→ A01 → A02 → A03 → QA → E01
                                                     └→ B01 → B02 → B03 → QB → E01

K03 / C01 / A03 / B03 → P01 Panorama → quay về đúng màn đã mở
P01 → H01 hoặc H02 → đóng về P01
E01 → C02 (nhánh khác) / K03 Chùa Âng / K02 Bản đồ / kết thúc → K01
```

QA và QB đều cho phép bỏ qua để đến E01. Nút “Chọn chủ đề” ở A/B quay về C02. Nút “Trước” của A01/B01 về C02; các cảnh sau về cảnh liền trước cùng nhánh. Mở nhánh khác bắt đầu ở cảnh đầu nhánh đó. Cờ nhánh đã xem chỉ tồn tại trong phiên.

## 3. Phần mở đầu chung

### K01 — Màn hình chờ

**Chữ hiển thị:** “TRÀ VINH DIGITAL HERITAGE” / “Chạm để mở những câu chuyện di sản”.

**Hình:** Chuỗi cảnh ngắn về mặt nước, cây và điểm văn hóa; chỉ sử dụng tư liệu có nguồn, không gán hình nơi khác cho Ao Bà Om. Mặc định tắt tiếng.

**Thao tác:** “Chạm để khám phá” → K02. Đây là điểm bắt đầu phiên mới.

### K02 — Bản đồ khám phá

**Chữ hiển thị:** “Bạn muốn khám phá nơi nào?”; marker “Ao Bà Om”; danh sách địa điểm ở vùng gần người dùng.

**Thao tác:** Chọn marker hoặc thẻ “Ao Bà Om” → K03. Focus nhẹ, giữ bản đồ phía sau. Giảm chuyển động: chuyển trạng thái trực tiếp.

### K03 — Thẻ địa điểm

**Tiêu đề:** “AO BÀ OM”.

**Nội dung hiển thị:** “Chọn một câu chuyện và khám phá theo cách của bạn.”

**Thông tin phụ:** “Hai chủ đề · Khoảng 3–5 phút mỗi chủ đề”.

**Nút:** “Khám phá câu chuyện” → C01; “Xem toàn cảnh” → P01; “Đóng” → K02.

**Hình:** Một ảnh thật toàn cảnh được cấp phép. Chưa cần ghi địa chỉ hành chính hoặc diện tích trong demo.

### C01 — Một khoảng dừng bên mặt nước

**Nội dung hiển thị / lời đọc:** “Ao Bà Om còn được gọi là Ao Vuông. Quanh mặt nước là những cây sao, dầu lâu năm, có bộ rễ nổi tạo nên dáng vẻ đặc biệt.”

**Nguồn:** [S01 — Cục Du lịch Quốc gia Việt Nam](https://vietnamtourism.vn/en/index.php/tourism/items/1395).

**Hình:** Ảnh mặt ao và một ảnh chi tiết rễ, dùng chuyển ảnh nhẹ. Không đặt chữ đè lên vùng rễ cần quan sát.

**Tương tác:** “Chọn câu chuyện” → C02; “Quan sát toàn cảnh” → P01; “Quay lại” → K03. Audio chỉ phát khi nhấn “Nghe”; phụ đề mặc định hiện.

### C02 — Bạn muốn tìm hiểu điều gì?

**Thẻ A:** “Truyền thuyết” / “Theo dấu câu chuyện dân gian về tên gọi.”

**Thẻ B:** “Văn hóa – lễ hội” / “Khám phá sự gắn kết với đời sống Khmer.”

**Tương tác:** Thẻ A → A01; thẻ B → B01. Hai thẻ đặt cạnh nhau ở vùng chạm gần, có biểu tượng và chữ. Quay lại → C01.

## 4. Nhánh A — Truyền thuyết

Nhãn **“Truyền thuyết dân gian — một cách kể”** luôn xuất hiện trong các cảnh A. Hình dựng phải có chú thích “Minh họa truyền thuyết”. Không ghi niên đại cụ thể hoặc gọi đây là sự kiện lịch sử đã được xác nhận.

### A01 — Cuộc thi được kể lại

**Nội dung hiển thị / lời đọc:** “Một truyền thuyết kể về cuộc thi đào ao giữa nam và nữ. Nhóm phụ nữ do bà Om dẫn dắt. Hai bên hẹn kết thúc khi sao mai xuất hiện.”

**Nguồn:** [S02 — Trung tâm Xúc tiến Du lịch Vĩnh Long](https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay).

**Hình:** Minh họa hai nhóm làm việc cạnh vùng đất đào, không tạo cảm giác ảnh tư liệu. Chưa cần vẽ chi tiết trang phục nếu chưa có tham chiếu phù hợp.

**Nút:** “Tiếp: một chi tiết bất ngờ” → A02; “Trước” → C02.

### A02 — Ánh đèn trong đêm

**Chữ ban đầu:** “Chạm vào ánh đèn để mở tiếp câu chuyện.”

**Hình:** Minh họa ngọn đèn trên cành cây; có nút “Khám phá ánh đèn” ở vùng gần làm cách chọn tương đương.

**Nội dung sau khi chạm / lời đọc:** “Trong cách kể này, bà Om treo đèn lên cây. Nhóm nam tưởng đó là sao mai và dừng cuộc thi; nhóm nữ tiếp tục công việc và giành phần thắng.”

**Nguồn:** [S02 — Bài kể truyền thuyết](https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay).

**Hành vi:** Trạng thái mở chi tiết vẫn thuộc A02, không làm mới bộ đếm. “Tiếp” → A03; “Trước” → A01. Không phát tiếng bất ngờ khi chạm.

### A03 — Câu chuyện và tên gọi

**Nội dung hiển thị / lời đọc:** “Theo truyền thuyết vừa nghe, tên ao gắn với người phụ nữ dẫn dắt cuộc thi. Hãy tiếp nhận đây như một câu chuyện dân gian, không phải bằng chứng xác định lịch sử hình thành ao.”

**Nguồn cho mối liên hệ tên gọi:** [S02 — Bài kể truyền thuyết](https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay). Câu hướng dẫn phân biệt loại thông tin là lựa chọn biên tập.

**Hình:** Trở về ảnh ao hiện tại; nhãn loại nội dung vẫn rõ.

**Nút:** “Một câu hỏi ngắn” → QA; “Quan sát toàn cảnh” → P01; “Trước” → A02; “Chọn chủ đề” → C02.

### QA — Nhận biết loại thông tin

**Câu hỏi:** “Câu chuyện cuộc thi đào ao vừa xem được giới thiệu dưới dạng nào?”

- A. Truyền thuyết dân gian. **Đáp án đúng.**
- B. Biên bản ghi chép cuộc thi.
- C. Kết quả khai quật khảo cổ.

**Phản hồi đúng:** “Đúng. Đây là một cách kể dân gian về tên gọi Ao Bà Om.”

**Phản hồi sai:** “Chưa đúng. Nhánh vừa xem được gắn nhãn truyền thuyết dân gian. Bạn có thể xem lại hoặc tiếp tục.”

**Nút:** “Xem lại” → A03; “Tiếp tục” → E01; “Bỏ qua câu hỏi” → E01. Không cộng điểm, không xếp hạng và không dùng màu đơn thuần để báo đáp án.

## 5. Nhánh B — Văn hóa và lễ hội

### B01 — Gặp nhau trong lễ hội

**Nội dung hiển thị / lời đọc:** “Không gian Ao Bà Om gắn với sinh hoạt văn hóa Khmer. Lễ hội Ok Om Bok năm 2024 được tổ chức tại đây; lễ hội còn được gọi là lễ cúng trăng.”

**Nguồn:** [S03 — Tin lễ hội năm 2024, Cục Du lịch Quốc gia Việt Nam đăng từ Cổng thông tin Trà Vinh](https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/).

**Hình:** Ảnh lễ hội đúng địa điểm và sự kiện; caption ghi năm 2024. Nếu chưa có quyền dùng ảnh, wireframe để khung ảnh có mô tả.

**Nút:** “Khám phá hoạt động” → B02; “Trước” → C02.

### B02 — Những hoạt động bên ao

**Nội dung hiển thị / lời đọc:** “Tư liệu về đêm hội năm 2024 ghi nhận biểu diễn nghệ thuật, tái hiện nghi lễ cúng trăng, diễu hành quanh ao và thả hoa đăng, đèn nước.”

**Nguồn:** [S03 — Tin lễ hội năm 2024](https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/).

**Tương tác:** Hai thẻ ảnh “Không gian biểu diễn” và “Ánh sáng trên mặt nước”. Chạm thẻ đổi ảnh và caption, không làm mới bộ đếm của B02. Audio đọc đoạn chung; không mô phỏng nghi lễ bằng âm thanh không có nguồn.

**Nút:** “Tiếp” → B03; “Trước” → B01.

### B03 — Một nơi để cùng gặp gỡ

**Nội dung hiển thị / lời đọc:** “Các hoạt động lễ hội tạo dịp gặp gỡ và giao lưu trong cộng đồng. Bạn muốn quan sát không gian quanh ao hay thử một câu hỏi về nội dung vừa xem?”

**Nguồn cho vai trò gặp gỡ, giao lưu:** [S03 — Tin lễ hội năm 2024](https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/). Câu mời tương tác do nhóm biên soạn.

**Hình:** Ảnh không gian có người tham gia, giữ nội dung dễ đọc khi đứng xem chung.

**Nút:** “Quan sát toàn cảnh” → P01; “Một câu hỏi ngắn” → QB; “Trước” → B02; “Chọn chủ đề” → C02.

### QB — Nhớ một tên gọi

**Câu hỏi:** “Lễ hội Ok Om Bok vừa được giới thiệu còn có tên gọi nào?”

- A. Lễ cúng trăng. **Đáp án đúng.**
- B. Lễ cầu ngư.
- C. Lễ khai bút.

**Phản hồi đúng:** “Đúng. Ok Om Bok còn được gọi là lễ cúng trăng.”

**Phản hồi sai:** “Tên gọi được giới thiệu là lễ cúng trăng. Bạn có thể xem lại cảnh mở đầu của nhánh.”

**Nút:** “Xem lại” → B01; “Tiếp tục” hoặc “Bỏ qua câu hỏi” → E01.

## 6. Panorama và hotspot dùng chung

### P01 — Quan sát không gian

**Chữ hiển thị:** “Kéo nhẹ hoặc dùng nút mũi tên để quan sát. Chạm một điểm đánh dấu để xem chi tiết.”

**Tư liệu:** Panorama thật của Ao Bà Om nếu có quyền sử dụng. Khi chỉ có ảnh rộng, ghi “Toàn cảnh mô phỏng” và không gọi đó là dữ liệu 360° hoàn chỉnh. Chưa đặt hotspot tại vị trí không nhìn thấy trong tư liệu.

**H01 — Mặt nước.** Nội dung: “Quan sát mặt ao và bóng cây trong ảnh. Chi tiết nào khiến bạn chú ý trước tiên?” Đây là lời gợi quan sát, không cần suy diễn sự kiện lịch sử.

**H02 — Rễ cây.** Nội dung: “Những bộ rễ nổi quanh ao là một nét đặc trưng của cảnh quan nơi đây.” Nguồn: [S01 — Giới thiệu cảnh quan Ao Bà Om](https://vietnamtourism.vn/en/index.php/tourism/items/1395).

**Điều khiển:** Nút trái/phải, hai nút tên hotspot ở vùng gần, “Đóng chi tiết”, “Trở về”. Không bắt buộc dùng nhiều ngón. Hai hotspot có nút tương đương cho người không chạm tới vị trí trên ảnh.

**Quy tắc trở về:** Ghi nhớ nơi mở là K03, C01, A03 hoặc B03. Đóng panorama về đúng nơi đó; không tự nhảy đến quiz. Với Figma có thể dùng các đường về riêng cho từng điểm vào để thể hiện cùng hành vi. H01/H02 là lớp phủ, không làm mới thời gian P01.

## 7. Tổng kết, hướng dẫn và kết thúc

### E01 — Bạn vừa khám phá một chủ đề

**Tiêu đề:** “Bạn vừa khám phá: [Truyền thuyết / Văn hóa – lễ hội]”.

**Thông tin:** “Đã xem 1/2 chủ đề” hoặc “Đã xem 2/2 chủ đề” theo phiên. Đánh dấu một nhánh đã xem khi đi từ cảnh cuối tới quiz; không phụ thuộc đáp án đúng và không yêu cầu xem panorama. Nếu bỏ qua quiz, ghi “Đã bỏ qua câu hỏi”; không gán điểm đúng.

**Nút:** “Khám phá chủ đề còn lại” → C02; “Đến Chùa Âng” → thẻ Chùa Âng; “Về bản đồ” → K02; “Kết thúc” → hộp xác nhận.

**Thẻ Chùa Âng trong bản đầu:** Tên, ảnh đã được phép dùng và lời mời quay về bản đồ. Chú thích “Câu chuyện đầy đủ sẽ được bổ sung”; không dẫn vào một chuỗi cảnh chưa có. Nguồn tham khảo cho điểm đến gần Ao Bà Om: [S01 — Giới thiệu Ao Bà Om và Chùa Âng](https://vietnamtourism.vn/en/index.php/tourism/items/1395).

### Hướng dẫn chung

**Nội dung:** “1. Chọn địa điểm trên bản đồ hoặc danh sách. 2. Chọn chủ đề, dùng nút trước/sau để khám phá. 3. Về bản đồ để chọn nơi khác hoặc bấm Kết thúc.”

**Ghi chú ngắn:** “Mỗi nội dung giữ trên màn hình quá 5 phút sẽ trở về màn hình chờ.”

Nút “Đã hiểu” đóng hướng dẫn về đúng ngữ cảnh. Có thể nhờ người trực tại chỗ hỗ trợ. Không bắt khách phải đọc hướng dẫn trước khi bắt đầu.

### Kết thúc

**Hộp xác nhận:** “Kết thúc lượt khám phá này?” / “Tiếp tục khám phá” / “Kết thúc”. Xác nhận kết thúc hoặc quá hạn nội dung đều về K01 và đặt lại dữ liệu tạm. Không có gia hạn tự động trong đặc tả hiện tại.

## 8. Danh sách tư liệu cần sản xuất

| Mã | Tư liệu | Dùng tại | Trạng thái hiện tại |
| --- | --- | --- | --- |
| AS01 | Bản đồ minh họa sáu địa điểm | K02 | Cần thiết kế; kiểm tra vị trí tương đối |
| AS02 | Ảnh Ao Bà Om và rễ cây | K03, C01, A03, H02 | Đã có nguồn tham khảo; chưa chọn và cấp quyền ảnh |
| AS03 | Hai minh họa truyền thuyết, có ngọn đèn | A01, A02 | Cần vẽ; ghi rõ minh họa |
| AS04 | Ảnh lễ hội đúng sự kiện năm 2024 | B01–B03 | Đã có bài nguồn; cần kiểm tra quyền dùng |
| AS05 | Panorama hoặc ảnh rộng đúng địa điểm | P01 | Chưa có asset; dùng placeholder trong wireframe |
| AS06 | Thu âm bảy đoạn C01, A01–A03, B01–B03 | Các cảnh truyện | Lời đọc dùng đúng nội dung hiển thị; chưa có file âm thanh |
| AS07 | Ảnh Chùa Âng | Thẻ điểm tiếp theo | Cần chọn ảnh có nguồn và quyền dùng |

Một bài viết có ảnh không đồng nghĩa ảnh được tự do tái sử dụng. Tư liệu nào chưa có thì ghi placeholder rõ trong file thiết kế; không dùng ảnh địa điểm khác làm ảnh thật. Bộ tài liệu hiện tại hoàn thành phần nội dung và đặc tả, chưa sản xuất ảnh, âm thanh hoặc prototype.

## 9. Nguồn, giới hạn và việc kiểm tra nội dung

Tra cứu ngày 19/09/2026. Trong giao diện, dùng nút “Nguồn” mở thông tin ngắn; URL đầy đủ lưu tại đây. Các nguồn này hỗ trợ nội dung văn hóa, không được dùng để suy ra địa chỉ hành chính hiện hành, số đo ao hoặc tuổi chính xác của cây.

- **S01 — Cục Du lịch Quốc gia Việt Nam, “Ba Om Pond”:** [Mở nguồn](https://vietnamtourism.vn/en/index.php/tourism/items/1395). Dùng cho tên gọi Ao Vuông, cây sao/dầu, rễ nổi và liên hệ với Chùa Âng. Trang có thông tin vị trí cũ và số đo không được đưa vào kịch bản.
- **S02 — Trung tâm Xúc tiến Du lịch Vĩnh Long, 18/09/2025:** [“Về Vĩnh Long đến tham quan Ao Bà Om thắng cảnh miền Tây”](https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay). Dùng cho một dị bản cuộc thi đào ao và ngọn đèn. Không coi câu chuyện là niên sử hoặc nguồn gốc duy nhất.
- **S03 — Chuyên trang du lịch của Cục Du lịch Quốc gia Việt Nam, đăng tin từ Cổng thông tin Trà Vinh:** [“Trà Vinh: Đêm Lễ hội Ok Om Bok năm 2024”](https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/). Dùng cho sự kiện năm 2024 và các hoạt động được ghi nhận; không trình bày như lịch lễ hội hiện tại.

Trước khi công bố ngoài lớp học: nhờ người am hiểu văn hóa địa phương rà soát cách kể, phát âm tên riêng và cách dùng hình ảnh; kiểm tra bản quyền asset đã chọn. Chưa có bước thẩm định đó trong bộ tài liệu này.

## 10. Điều kiện sẵn sàng dựng wireframe

- Kịch bản có điểm vào, hai nhánh, đường quay lại và điểm kết thúc.
- Các cảnh có lời hiển thị, audio dùng chung lời, mô tả hình và nút cụ thể.
- Các câu quiz có đáp án và phản hồi, không buộc phải trả lời đúng mới được tiếp tục.
- Panorama không làm mất vị trí câu chuyện; các lớp phủ không đặt lại bộ đếm.
- Trạng thái cần vẽ thêm: chưa phát/đang phát audio, chữ lớn, tương phản cao, mở transcript, hotspot, quiz đúng/sai, kết thúc và đặt lại.

Thứ tự dựng: K01 → K02 → K03 → C01 → C02 → A01–A03 → QA → E01; sau đó B01–B03 → QB; cuối cùng nối panorama và trạng thái trợ năng. Dùng khung xám trước, rồi kiểm thử luồng mới hoàn thiện hình ảnh.
