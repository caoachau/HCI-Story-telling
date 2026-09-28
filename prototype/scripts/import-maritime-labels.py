"""Import selected geographic facts from the official Vietnamese gazetteer.

Requires pypdf and pyproj for regeneration; neither is a browser dependency.
Usage: python scripts/import-maritime-labels.py path/to/gazetteer.pdf
"""
from pathlib import Path
import json
import re
import sys
import unicodedata

from pypdf import PdfReader
from pyproj import Transformer

SOURCE_URL = 'https://mae.gov.vn/noidung/Lists/VBQPPL/Attachments/514/1_DanhMuc_TT_DiaDanh_BanHanh.pdf'
COASTAL_NAMES = {
    'Đảo Phú Quốc': 30, 'Đảo Côn Sơn': 13, 'Đảo Lý Sơn': 5,
    'Đảo Phú Quý': 5, 'Đảo Cát Bà': 20, 'Đảo Cô Tô': 6,
    'Đảo Bạch Long Vĩ': 3, 'Đảo Cồn Cỏ': 3, 'Cù lao Chàm': 6,
    'Đảo Nam Du': 5, 'Đảo Thổ Chu': 5, 'Đảo Hòn Khoai': 4,
}


def romanize(name):
    return ''.join(c for c in unicodedata.normalize('NFD', name.replace('Đ', 'D').replace('đ', 'd'))
                   if not unicodedata.combining(c))


def english_name(name):
    if name.startswith('Quần đảo '):
        return romanize(name[9:]) + ' Archipelago'
    if name.startswith('Đảo '):
        return romanize(name[4:]) + ' Island'
    if name == 'Cù lao Chàm':
        return 'Cu Lao Cham Islands'
    return romanize(name)


# The PDF's geographic coordinates are VN-2000, not WGS 84. Use the EPSG
# VN-2000 to WGS 84 (2) operation, including its seven-parameter datum shift.
transformer = Transformer.from_crs(4756, 4326, always_xy=True, allow_ballpark=False)
places = []
found_coastal = set()
coordinates_pattern = re.compile(r"(\d+)°\s*(\d+)'\s*(\d+)''\s+(\d+)°\s*(\d+)'\s*(\d+)''")

reader = PdfReader(sys.argv[1])
for page_number, page in enumerate(reader.pages, 1):
    text = unicodedata.normalize('NFC', page.extract_text(extraction_mode='layout'))
    for line in text.splitlines():
        coordinates = coordinates_pattern.search(line)
        if not coordinates:
            continue
        columns = re.split(r'\s{2,}', line[:coordinates.start()].strip())
        if len(columns) < 3 or not columns[0].isdigit():
            continue
        name, province = columns[1:3]
        values = list(map(int, coordinates.groups()))
        lat = values[0] + values[1] / 60 + values[2] / 3600
        lng = values[3] + values[4] / 60 + values[5] / 3600
        region = None
        if province == 'Đà Nẵng' and 110.5 < lng < 113.5:
            region = 'hoang-sa'
        elif province == 'Khánh Hòa' and 111.3 < lng < 117.5 and lat < 12.5:
            region = 'truong-sa'
        is_group = name.startswith('Quần đảo ')
        if region:
            if not name.startswith('Đảo ') and not is_group:
                continue
        elif name not in COASTAL_NAMES:
            continue
        else:
            found_coastal.add(name)
        point = transformer.transform(lng, lat, errcheck=True)
        identifier = re.sub(r'[^a-z0-9]+', '-', romanize(name).lower()).strip('-')
        display_vi = 'Đảo Côn Sơn (Côn Đảo)' if name == 'Đảo Côn Sơn' else name
        display_en = 'Con Son Island (Con Dao)' if name == 'Đảo Côn Sơn' else english_name(name)
        places.append({
            'id': identifier, 'nameVi': display_vi, 'nameEn': display_en,
            'coordinates': [round(point[0], 7), round(point[1], 7)],
            'kind': 'archipelago' if is_group else 'island', 'region': region,
            'contextRadiusKm': COASTAL_NAMES.get(name, 3), 'sourcePage': page_number,
            'sourceCoordinatesVN2000': [lng, lat],
        })

missing = set(COASTAL_NAMES) - found_coastal
if missing:
    raise ValueError(f'Gazetteer rows not found: {sorted(missing)}')
if not any(p['kind'] == 'archipelago' and p['region'] == 'hoang-sa' for p in places):
    raise ValueError('Hoang Sa archipelago row not found')
if not any(p['kind'] == 'archipelago' and p['region'] == 'truong-sa' for p in places):
    raise ValueError('Truong Sa archipelago row not found')

output = Path(__file__).resolve().parents[1] / 'src/data/maritimePlaces.generated.ts'
output.write_text(
    '// Geographic facts imported by scripts/import-maritime-labels.py.\n'
    '// Source: Circular 33/2024/TT-BTNMT, geographic coordinates converted to WGS 84.\n'
    f'export const MARITIME_GAZETTEER_URL = {json.dumps(SOURCE_URL)};\n'
    f'export const MARITIME_PLACES = {json.dumps(places, ensure_ascii=False, indent=2)} as const;\n',
    encoding='utf-8',
)
print(json.dumps({'places': len(places), 'islands': sum(p['kind'] == 'island' for p in places),
                  'coordinateOperation': transformer.get_last_used_operation().description}))
