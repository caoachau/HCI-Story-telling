# Xử lý ảnh nền Fly-to

Công cụ: **imagegen tích hợp**, chế độ chỉnh sửa ảnh; không dùng CLI/API riêng. Giữ nguyên các tệp tham khảo gốc. Ảnh kết quả được sao chép vào thư mục `prototype/assets` để prototype hoạt động offline.

## `tra-vinh-aerial.png`

Đầu vào: `ẢNH GỐC 2D.png` trong ZIP người dùng cung cấp.

```text
Use case: precise-object-edit. Edit target: the supplied top-down satellite screenshot of Tra Vinh, Vietnam. Asset type: background image for a local cultural heritage interactive map. Remove ONLY the tiny yellow location pins, their text labels, and the round black UI controls at bottom right. Fill those tiny UI-covered patches with immediately adjacent terrain/water. Preserve exact geographic composition and all geographic features, land shapes, coastline, river channels, urban and field textures, colors, top-down perspective, framing and relative positions. Do not rearrange, add, remove or embellish any real geographic feature. Do NOT invent roads, buildings, towns or terrain, do NOT restyle as illustration. Preserve any existing faint image-source attribution. Output clean photographic map background same very wide landscape aspect ratio approximately 1.94:1, high resolution. No new labels, markers, controls, logos, borders or typography.
```

## `ao-ba-om-aerial.png`

Đầu vào: `AO BÀ ÔM GÓC TỪ TRÊN XUỐNG.png` trong ZIP người dùng cung cấp.

```text
Use case: precise-object-edit. Edit target: supplied aerial screenshot of Ao Ba Om, Vietnam. For a cultural heritage prototype remove ONLY small yellow pin and text 'Ao Bà Om' near center plus black round UI controls at bottom right, seamlessly fill just those covered tiny patches with adjacent water/foliage/grass. Preserve original photograph otherwise, EXACT square pond boundaries, surrounding tree canopy, vegetation on water, footpaths and roads, buildings, framing, overhead angle, proportions, colors, all positions. No new roads, no new buildings, no invented terrain, no water redesign, no stylization, no crop, no added text or pins. Preserve any faint image-source attributions. Wide image same approximately1.97:1 aspect ratio, high resolution.
```
