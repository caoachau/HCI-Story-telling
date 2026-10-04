# Landmark marker images

Place transparent landmark images in this folder. File basenames identify
the landmark; PNG, WebP, AVIF and JPEG are supported. Vite bundles the files for
development and production without a remote image dependency.

| Filename | Landmark |
| --- | --- |
| `con-chim.webp` | Cồn Chim, long island with ponds |
| `bien-ba-dong.webp` | Biển Ba Động, beach and wind turbines |
| `bao-tang-khmer.webp` | Bảo tàng Khmer, triangular facade |
| `den-tho-bac.webp` | Đền thờ Bác, red flags and entrance garden |
| `chua-ang.webp` | Chùa Âng, orange roof |
| `chua-hang.webp` | Chùa Hang, colorful roof and front gate |
| `ao-ba-om.webp` | Ao Bà Om, square pond |

The marker keeps the site's existing documentary photograph as a fallback if
the corresponding local icon is unavailable. Replace it with the supplied
icon to display the cutout diorama design. Current assets are 640 × 640 WebP,
resampled from the supplied 1254 × 1254 PNG with Lanczos, then encoded losslessly.
The alpha channel is preserved after resampling. At the 128px display width this
provides five image pixels per CSS pixel without decoding the oversized originals.
