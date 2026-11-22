# QR và MP3 trong hệ thống Ký Ức Bản Địa

## Bố trí QR và bản thử trong mạng nội bộ

QR trên đầu trang bảo tàng là QR tổng, luôn mở danh sách toàn bộ audio theo thứ tự. Các nút **Nghe / QR phần này** được đặt cạnh thông tin hiện vật và trong bài đọc tổng quan, lịch sử, văn hóa, giá trị di sản. Mỗi nút chia sẻ ID riêng của nội dung đang đọc, kể cả khi đổi chủ đề bên trong popup.

Trang từ QR tổng hiển thị danh sách audio trực tiếp, không bắt người dùng đi qua nhiều tầng danh mục. Trang QR chi tiết có ảnh, bài giới thiệu và danh sách audio của phần chứa nội dung đó. Người dùng bấm phát bài muốn nghe, hoặc nghe toàn bộ liên tiếp. Popup QR cũng có ảnh nhận diện nội dung.

Bản thử LAN hiện tại chạy tại **http://192.168.1.5:3001/**. `.env.local` đặt `VITE_PUBLIC_URL` đến địa chỉ này; server thử riêng bind mạng nội bộ, giữ server cũ port 3000. Điện thoại cần cùng Wi-Fi và truy cập được máy. Đây là bản thử nội bộ, chưa phải tên miền công khai. Khi đổi mạng/IP hoặc triển khai thật, cập nhật URL và khởi động/build lại.

Ảnh dùng đúng tài nguyên hiện có: bìa nhóm thiếu ảnh lấy ảnh từ chính nội dung con; ảnh tải lỗi được reset khi đổi ảnh. Đã kiểm tra HTTP của toàn bộ đường dẫn ảnh bảo tàng và ảnh hiển thị thực tế trong popup QR/trang nghe. Các vùng chưa có tư liệu vẫn giữ trạng thái thiếu ảnh.

Component mới `src/audio/InlineAudioActions.tsx` dùng chung cho các nút cạnh nội dung. Các bài đọc `KhmerMuseumOverviewViewer`, `KhmerMuseumHistory`, `KhmerMuseumCulture`, `KhmerMuseumLegacy` truyền ID cụ thể để QR đi theo đúng chủ đề đang đọc. Kiểm tra phát MP3 và danh sách trên địa chỉ LAN đã đạt; bộ kiểm tra `qr-audio-test.cjs` cũng đạt sau thay đổi bố trí.

## Cách sử dụng

Khi người dùng chọn một nội dung/thẻ khác hoặc chuyển trang, phiên nghe cũ dừng và thanh nghe đóng, không chuyển thành thanh nổi còn bám ở nội dung mới. Muốn nghe nội dung mới cần bấm Nghe. Chuyển bài bằng điều khiển của player và tự chuyển bài trong playlist vẫn hoạt động; đổi góc xoay/phóng ảnh, tua audio và mở QR cùng nội dung không đóng phiên nghe. Quy tắc này thay thế hành vi giữ playlist khi chuyển trang trước đây.

Thanh inline đã bỏ nút tạm dừng/dừng trùng với nút Nghe ở phía trên và bỏ dòng Audio mẫu trên giao diện. Nút Nghe phía trên vẫn đổi thành Tạm dừng khi phát. Nút X có vùng chạm 52 × 52 px, nền/viền đồng tương phản, đóng thanh và dừng audio. Trên màn hình hẹp, chừa vùng cho thanh công cụ bên phải để không che X. Các trình phát độc lập trên điện thoại vẫn có nút phát/tạm dừng để điều khiển khi không có nút inline cạnh đó.

Trình phát trực tiếp dùng thanh ngang: điều khiển nghe/tạm dừng, dừng về đầu, ±10 giây và tốc độ ở trái; dạng sóng và thời gian ở phải. Dạng sóng được giải mã từ file đang nghe, không dùng cột ngẫu nhiên; nếu không đọc được dữ liệu sóng, vẫn tua bằng thanh tiến độ. Màn hình hẹp xếp hai hàng, nút chạm ít nhất 44 px.

Nút Nghe theo đúng phiên hiện tại: đang phát → Tạm dừng; bấm lần nữa tiếp tục; hết audio hoặc bấm dừng → Dừng, bấm lại nghe từ đầu. Thanh của hiện vật nằm trong vùng thao tác riêng dưới thẻ chi tiết, không bị phần mô tả cuộn che. Khi đã có thanh inline, không mở thêm thanh nổi trùng chức năng. Bổ sung `ListenButton.tsx`, `AudioWaveform.tsx`, `audio-transport.css`; `halt()` dừng nhưng giữ nội dung, còn `stop()` đóng phiên. Kiểm tra hành vi, sóng thật, thao tác và kích thước 320–1920 px đã đạt; build và bộ kiểm tra QR/MP3 đã đạt.

- Trên website, bấm biểu tượng **tai nghe** trong thanh công cụ. Chọn **Nghe nội dung** cho một hiện vật/câu chuyện, hoặc **Nghe toàn bộ** cho nhóm đang xem. Khi đang xem một hiện vật, có thêm lối nghe cả nhóm chứa hiện vật đó.
- Đóng cửa sổ nghe để tiếp tục xem website. Trình phát thu nhỏ vẫn hoạt động, nằm phía trên điều hướng chính của kiosk. Dừng/đóng trình phát bằng nút ×.
- Bấm **Mã QR** hoặc biểu tượng QR. Popup ghi đúng tên nội dung đang chọn, cho sao chép liên kết và tải mã PNG.
- Quét QR mở chế độ xem và nghe trên điện thoại. Audio chỉ bắt đầu sau thao tác bấm nghe. Chạm ảnh/tên để đọc chi tiết; nút phát riêng chỉ phát audio.
- Trong danh sách đang phát, chọn bài khác giữ chế độ playlist. Bấm **Nghe thuyết minh** trên trang chi tiết chuyển sang nghe riêng và dừng khi hết bài đó.
- **Xem website đầy đủ** quay về cùng nội dung trong giao diện hiện tại. Chuyển trang bằng nút trước/sau hoặc quay về nhóm giữ `view=audio`.

## Kết quả nghiên cứu source

Dự án dùng React 19, TypeScript và Vite, có năm entry HTML. Các màn hình dùng query string và `heritage:route`, một số trang mở qua iframe cùng origin. Không thay framework, router, CMS hoặc dữ liệu văn bản/ảnh.

Thư viện `qrcode` đã có. `ShareContent` đã tạo mã thật, nhưng chỉ dẫn về giao diện kiosk. Giọng đọc cũ là SpeechSynthesis, chưa có MP3 hoặc playlist. Phần mới dùng HTMLMediaElement và bổ sung cùng các entry hiện có, không tạo website khác.

Nguồn dữ liệu được tái sử dụng:

| Nhóm | Dữ liệu |
| --- | --- |
| Bảo tàng Khmer | Tổng quan, các điểm/gian/hiện vật, ba mốc Khuôn viên, lịch sử, 24 chủ đề văn hóa/hoạt động/con người, giá trị di sản |
| Ao Bà Om | Các phân khu, dòng thời gian, con người, hoạt động, câu chuyện, hiện vật và giá trị trong dữ liệu năm phần hiện có |
| Cồn Chim | Nhóm sở thích và các câu chuyện đã có; dùng bản dịch có sẵn khi chọn tiếng Anh |
| Đền thờ Bác | Các phần và câu chuyện/ảnh/đoạn đọc hiện có; dùng bản dịch có sẵn khi chọn tiếng Anh |
| Chùa Âng, chùa Hang, biển Ba Động | Chapters, ảnh và giới thiệu trong `heritageSites` và `locationQuickContent` |

Mỗi địa điểm có catalog và playlist riêng. ID của nhóm, nội dung và thứ tự được lấy từ dữ liệu hiện tại. Các câu chuyện bảo tàng chưa có vị trí xác nhận được giữ thành danh sách nội dung, không gán vào tầng hay tự thêm mốc trên ảnh.

## Khai báo MP3 chính thức

Nguồn override duy nhất: `src/audio/config.ts`.

```ts
export const AUDIO_CONFIG: Record<string, { audioUrl: string | null }> = {
  'bao-tang-khmer:object:archaeology:sandstone': {
    audioUrl: '/audio/sandstone.mp3',
  },
  'bao-tang-khmer:object:performing:royalHeaddresses': {
    audioUrl: 'https://cdn.your-domain.vn/audio/royal-headdresses.mp3',
  },
};
```

Các URL bên trên minh họa cấu hình, không phải file đã được cung cấp. File nội bộ đặt trong `public/audio/`; khi triển khai dưới thư mục con, dùng đường dẫn phù hợp với `BASE_URL`. Với website HTTPS, MP3 bên ngoài cũng cần HTTPS và máy chủ cho phép phát/tua file.

Có thể bổ sung `audioUrl` trực tiếp vào metadata `AudioContent` nếu cần một adapter riêng. `AUDIO_CONFIG` là nơi override tập trung; không khai báo trùng MP3 trong component. Một override `audioUrl: null` chủ động tắt audio của nội dung đó, kể cả khi đang bật demo.

ID có thể lấy từ tham số `listen` trong liên kết QR/trang nghe. Vài ví dụ:

| Nội dung | ID |
| --- | --- |
| Toàn bảo tàng | `bao-tang-khmer` |
| Quần thể ba điểm | `bao-tang-khmer:zone:landscape` |
| Nghệ thuật và sinh hoạt văn hóa | `bao-tang-khmer:group:culture` |
| Rôbăm | `bao-tang-khmer:culture:robam` |
| Hiện vật sa thạch | `bao-tang-khmer:object:archaeology:sandstone` |
| Mão vua – mão hoàng hậu | `bao-tang-khmer:object:performing:royalHeaddresses` |
| Câu chuyện bánh xèo | `con-chim:story:banh-xeo` |

Playlist đi theo `children` của catalog, duyệt đúng thứ tự. Không có URL audio thì bỏ qua. Nếu nhóm có một MP3 giới thiệu chính thức, thêm override cho chính ID nhóm; file đó được đưa vào đầu playlist. Các nhóm chưa có file giới thiệu bắt đầu trực tiếp từ nội dung con. Không ghép MP3 thành một file dài.

## Chế độ demo

`public/audio/demo.mp3` là **một đoạn nhạc gõ thử do dự án tạo, khoảng 24 giây**, không phải lời thuyết minh, bản ghi nghệ nhân hay tư liệu âm nhạc Khmer. Không dùng dịch vụ tạo giọng AI hoặc audio bên ngoài làm thuyết minh chính thức.

`DEMO_AUDIO_URL` chỉ được khai báo một lần trong `config.ts`. File được dùng chung cho các nội dung chưa có MP3 chính thức. Giao diện ghi **Audio mẫu · Nội dung thuyết minh đang được cập nhật**.

| Cấu hình | Hoạt động |
| --- | --- |
| Chạy dev, không đặt biến | Bật demo |
| Production build, không đặt biến | Tắt demo |
| `VITE_AUDIO_DEMO_ENABLED=true` | Bật demo rõ ràng, kể cả bản build trình diễn |
| `VITE_AUDIO_DEMO_ENABLED=false` | Không dùng audio mẫu ở bất kỳ trang nào |

MP3 chính thức luôn được ưu tiên. Sau khi tắt demo, trang chưa có file vẫn đọc và chia sẻ QR bình thường, không hiện nút phát không hoạt động. Thay MP3 không đổi ID, QR hoặc URL trang.

## Địa chỉ QR và truy cập điện thoại

Chẩn đoán `ERR_ADDRESS_UNREACHABLE` trên điện thoại: đây là lỗi chưa tới được máy chủ, xảy ra trước khi trang hoặc audio được tải. Ngày 14/11 đã xác nhận listener `0.0.0.0:3001`, IP Wi-Fi `192.168.1.5`, mạng máy tính `CAO NGOC`, và quy tắc Node.js hiện là Allow. Browser trên máy truy cập URL LAN và danh sách nghe thành công; điều này không chứng minh đường truyền từ điện thoại. Cần xác nhận Wi-Fi/IP của điện thoại; mạng khách có thể tách thiết bị, và URL LAN không dùng qua mạng di động/mạng khác. Không tắt firewall hoặc tự công khai website để xử lý lỗi này.

Popup QR hiện phân biệt địa chỉ nội bộ và hướng dẫn cùng Wi-Fi, có liên kết thử máy chủ. URL chia sẻ chỉ giữ ID nội dung, ngôn ngữ và các selector của nội dung đó; bỏ trạng thái desktop và tham số theo dõi cũ để mã ngắn hơn. Kiểm tra tại `preview/qr-network-test.log`.

Đặt trong `.env.local`, rồi khởi động lại Vite hoặc build lại:

```dotenv
VITE_PUBLIC_URL=https://your-domain.vn/index.html
VITE_AUDIO_DEMO_ENABLED=false
```

Để thử trong mạng nội bộ, đặt `VITE_PUBLIC_URL` thành IP LAN và port thật của máy, chạy Vite với `--host 0.0.0.0`, và dùng điện thoại cùng mạng có thể truy cập máy đó. Không dùng `localhost`/`127.0.0.1` làm QR cho điện thoại. Nếu chạy dưới thư mục con, cấu hình Vite `base` và URL công khai thống nhất.

Chưa có URL công khai thì hệ thống báo đúng trạng thái và cung cấp **Xem thử giao diện nghe trên điện thoại** trên máy hiện tại; không tạo QR localhost gây nhầm lẫn. Không có domain nào được tự động triển khai hoặc gán vào cấu hình của người dùng trong lần tích hợp này.

Ví dụ URL trên địa chỉ chạy dev hiện tại:

```text
http://127.0.0.1:3000/bao-tang-khmer.html?view=audio&listen=bao-tang-khmer&lang=vi
http://127.0.0.1:3000/bao-tang-khmer.html?view=audio&listen=bao-tang-khmer:zone:landscape&lang=vi
http://127.0.0.1:3000/bao-tang-khmer.html?view=audio&listen=bao-tang-khmer:object:archaeology:sandstone&lang=vi
```

`view=audio` chọn template nghe. `listen` là ID nội dung ổn định. Các selector hiện tại như `section`, `place`, `object`, `culture`, `topic` vẫn dùng để quay lại website đầy đủ. Khi điều hướng, các selector của nội dung mới thay cho selector cũ; query không thuộc nội dung vẫn được giữ. Các URL mở trực tiếp và refresh không cần state của trang trước.

## Trình phát và xử lý lỗi

Một audio element được tạo khi bấm nghe lần đầu, dùng lại cho toàn bộ phiên. Hỗ trợ phát/tạm dừng, tua bằng thanh tiến độ, ±10 giây, tốc độ 0.75/1/1.25/1.5/2×, bài trước/sau, chọn bài, báo hoàn thành, retry và bỏ qua file lỗi.

Khi chuyển ID, luôn reset về 0 và tải/phát đúng bài, ngay cả khi hai ID cùng dùng `demo.mp3`. Chỉ playlist mới tự chuyển bài; single dừng. Không bật loop. Promise phát có revision để kết quả của thao tác cũ không ghi đè thao tác mới. Không preload cả playlist.

Trình phát phối hợp với SpeechSynthesis, âm thanh nền và iframe qua bridge đang có. Bắt đầu nghe từ một cửa sổ/frame dừng hoặc tạm dừng âm thanh của cửa sổ/frame khác. Đóng popup nghe giữ phiên MP3; chuyển sang địa điểm khác dừng phiên ngoài ngữ cảnh.

Nếu trình duyệt chặn phát, giao diện chuyển sang tạm dừng và yêu cầu bấm phát, không báo sai đang nghe. Tài liệu nền tảng: [HTMLMediaElement.play](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play), [hướng dẫn autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).

Trang mobile có safe area và khoảng trống đo theo chiều cao thật của mini player, kể cả khi hiện thông báo lỗi. Popup QR dùng mã đen trên trắng, có lề để nhận diện, nút đóng/Escape, sao chép và tải PNG. Theme giữ nền tối, đồng và chữ ngà.

## File bổ sung và chỉnh sửa

File mới:

- `src/audio/types.ts`, `config.ts`, `catalog.ts`, `museumCatalog.ts`, `aoCatalog.ts`: metadata, adapter và playlist.
- `src/audio/player.ts`, `AudioPlayer.tsx`, `AudioPanel.tsx`: trạng thái và điều khiển MP3 dùng chung.
- `src/audio/AudioExperience.tsx`, `MobileAudioView.tsx`, `AudioImage.tsx`, `AudioQRDialog.tsx`, `audio.css`: tích hợp entry, template mobile, QR và mini player.
- `src/audio/useAudioContent.ts`, `context.ts`: tải metadata và đồng bộ nội dung đang xem.
- `public/audio/demo.mp3`, `public/audio/README.md`.
- `tests/qr-audio-test.cjs`, `tests/qr-audio-routing-test.cjs` và tài liệu này.

File sửa cho tính năng này:

- Năm entry: `src/main.tsx`, `src/features/{museo-detail,den-tho-bac,con-chim,ao-ba-om-detail}/main.tsx`.
- Công cụ dùng chung: `ExperienceTools.tsx`, `ShareContent.tsx`, `state.ts`, `narration.ts`, `components/QRCodeModal.tsx`, `services/soundscape.ts`.
- Bảo tàng: `MuseumDetailPage.tsx`, `MuseumChrome.tsx`, `KhmerMuseumPlaces.tsx`, `KhmerCultureLanding.tsx`.
- Ao Bà Om: `AoBaOmMuseumKiosk.tsx`, `Section2InteractiveSiteMap.tsx`, `Section3ProgressiveTimeline.tsx`.
- Cồn Chim: `utils/storyLinks.ts`; `.env.example`.

## Kiểm thử

```powershell
npm run lint
node tests/qr-audio-test.cjs
node tests/qr-audio-routing-test.cjs
node tests/qr-audio-routing-test.cjs --production
```

Các script browser dùng server dev hiện tại, mặc định `http://127.0.0.1:3000`; có thể đổi bằng `QR_AUDIO_BASE`. Chúng dùng Chrome headless và harness CDP sẵn có của dự án, không thêm thư viện player hoặc QR mới.

Phạm vi đã kiểm tra tự động: giải mã MP3 thật; single/playlist; reset bài cùng URL; tốc độ và tua; kết thúc bằng event `ended` thật; chặn phát; file lỗi và bỏ qua; độc quyền âm thanh với giọng đọc/iframe; đúng nội dung của bảy địa điểm; URL trực tiếp/refresh và quay về mô hình 3D; giao diện 320/390/768/1280 px; mini player trên footer; QR theo hiện vật và tải PNG. QR có cấu hình public được giải mã từ ảnh chụp bằng OpenCV để đối chiếu payload. Tên miền `heritage.example.test` chỉ dùng trong server kiểm thử riêng, không ghi vào cấu hình sản phẩm.

Kết quả ngày 14/11/2026:

| Kiểm tra | Kết quả |
| --- | --- |
| TypeScript (`npm run lint`) | Đạt |
| Vite build cho cả năm entry | Đạt; giữ cache bản đồ đang có, bổ sung file MP3 vào `dist/audio/` |
| MP3, single/playlist, lỗi và responsive | Đạt; log `preview/qr-audio-test.log` |
| URL trực tiếp, refresh, quay về website, độc quyền âm thanh giữa iframe/trang cha | Đạt; log `preview/qr-audio-routing-test.log` |
| Production không bật demo | Đạt; nội dung vẫn có, không phát file mẫu hoặc hiện nút nghe chưa có MP3 |
| QR có cấu hình public, tải PNG | Đạt; log `preview/qr-audio-public-test.log` |
| Giải mã file PNG đã tải bằng OpenCV | Payload khớp URL tuyệt đối; `preview/qr-audio-qr-decode.log` |
| MP3 Range Request | HTTP 206, `bytes 0-127/288392`, `audio/mpeg` |
| Hồi quy mô hình 3D, mở rộng/thu nhỏ, góc nhìn và zoom | Đạt; `preview/qr-audio-model-regression.log` |
| Hồi quy trang Văn hóa, popup, bộ lọc và responsive | Đạt; `preview/qr-audio-culture-regression.log` |

Chưa kiểm tra bằng camera điện thoại vật lý hoặc Safari iOS/Chrome Android trên thiết bị thật. Cần URL LAN/công khai truy cập được để nghiệm thu các bước đó. Bản đọc hiện có và audio mẫu không thay thế việc sản xuất, rà soát thuyết minh chính thức.

Không triển khai admin, upload, AI tạo giọng, database, tài khoản, thống kê lượt nghe/quét hoặc hosting. Sau này adapter có thể nhận `AudioContent`/`AudioTrack` từ API mà giữ nguyên player và URL ổn định.

## Thuyết minh Tổng quan từ bản thu người dùng (15/11/2026)

Kịch bản đầy đủ lấy từ `Kich_ban_thuyet_minh_Khmer_giong_ke_tu_nhien.xlsx`. Metadata và các chương nằm tại `src/features/museo-detail/khmerOverviewNarration.ts`; `museumCatalog.ts` dùng cùng ID cho nút nghe tại Tổng quan, popup chi tiết và trang nghe qua QR.

| Vị trí | File trong `public/audio/khmer-overview/` | Thời lượng |
| --- | --- | --- |
| Xem trưng bày — Nơi ký ức được gìn giữ và Những con số biết nói | `collections.mp3` | 3:10 |
| Ký ức Khmer Nam Bộ | `identity.mp3` | 1:23 |
| Kiến trúc mang hồn Khmer | `architecture.mp3` | 2:51 |
| Nghệ thuật còn tiếp nối | `performing.mp3` | 5:45 |
| Đời sống được tái hiện | `dailyLife.mp3` | 2:37 |
| Tâm linh qua từng hiện vật | `spiritual.mp3` | 2:17 |
| Vì sao nên khám phá — dùng chung cho ba thẻ | `visit.mp3` | 4:08 |

ND01 và ND02 được nối bằng FFmpeg thành **một file MP3**, chỉ có một thanh thời gian 3:10. Phát hoặc tua qua điểm nối khoảng 1:06,7 không đổi track và không reset thời gian. Sáu bản còn lại giữ nguyên MP3 gốc. Bảy bài này thay audio mẫu tại Tổng quan; các bài cũ vẫn nhận liên kết trực tiếp nhưng không lặp vào danh sách nghe. Không gán bản thu tiếng Việt cho chế độ tiếng Anh.

Trang nghe Tổng quan: `bao-tang-khmer.html?view=audio&listen=bao-tang-khmer:section:overview&lang=vi`. Xem trưng bày dùng ID `bao-tang-khmer:overview:collections`; ba lý do dùng `bao-tang-khmer:overview:visit`. Người dùng chủ động bấm nghe; mở popup hoặc QR không tự phát.

Kiểm tra: `node tests/khmer-overview-narration-test.cjs`; log `preview/overview-narration-check.log`. Bao gồm phát thật xuyên điểm nối, bản thu khớp từng bài, ba thẻ dùng chung audio, ảnh và nội dung đầy đủ, trang nghe QR, phát liên tiếp và responsive.

Bản dựng cũng đã được kiểm tra qua Vite preview, với HTTP Range phục vụ tua MP3; log `preview/overview-narration-production-check.log`. Để chạy lại, mở `npm run preview -- --host 127.0.0.1 --port 3014`, rồi đặt `$env:KHMER_DISCOVERY_BASE='http://127.0.0.1:3014'` và chạy `node tests/khmer-overview-narration-test.cjs --production`.

Album giữa Tổng quan dùng `khmerOverviewAlbum` từ cùng dữ liệu gallery chi tiết: ảnh không trùng, tiêu đề và chú thích theo tư liệu, chọn ảnh mở đúng câu chuyện tại đúng ảnh đó. Nút nghe trong popup dùng bài tương ứng. Kiểm tra toàn bộ thẻ, mở/đóng và khôi phục focus: `tests/khmer-overview-entry-test.cjs`; log `preview/overview-album-check.log`.

Phần “Vì sao nên khám phá” đứng riêng, gồm đúng ba thẻ theo các dòng ND06–ND08 trong Excel. Theo thứ tự hiển thị người dùng chọn: Hiểu một đời sống, Học từ những hiện vật, Kết nối ba điểm đến. Ba thẻ mở bài thuyết minh chung `visit`. Album giữa chỉ lấy ảnh của Xem trưng bày và năm bài Điều làm nên bản sắc; không lấy ảnh hoặc dẫn vào phần Vì sao nên khám phá.
