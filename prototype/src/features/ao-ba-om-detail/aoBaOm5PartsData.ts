import {
  SiteZone,
  TimelineEpoch,
  CulturalPerson,
  CulturalActivity,
  UntoldStory,
  SacredArtifact,
  HeritageLegacyData,
} from './types';

// Asset references
import pondImg from '../../assets/ao-ba-om/pond.webp';
import rootsImg from '../../assets/ao-ba-om/roots.webp';
import pagodaImg from '../../assets/ao-ba-om/ang-pagoda.webp';
import festivalImg from '../../assets/ao-ba-om/festival-2024.webp';
import lanternsImg from '../../assets/ao-ba-om/floating-lanterns-2024.webp';
import legendImg from '../../assets/ao-ba-om/lantern-legend.webp';

// Historical past image reference
import aerialImg from '../../../assets/ao-ba-om-aerial.webp';
import oldRootsImg from '../../assets/ao-ba-om/roots.webp';
import oldPagodaImg from '../../assets/ao-ba-om/ang-pagoda.webp';

/* =========================================================================
   PHẦN 1: THÔNG TIN TỔNG QUAN DI TÍCH (EDITORIAL HERO OVERVIEW)
   ========================================================================= */
export const AO_BA_OM_OVERVIEW = {
  name: {
    vi: 'Quần Thể Di Tích Danh Thắng Ao Bà Om',
    en: 'Ao Ba Om Cultural & Landscape Heritage Complex',
  },
  folkNames: {
    vi: 'Ao Vuông · Tên tiếng Khmer: Srah Ku (ស្រះគូ)',
    en: 'Square Pond · Khmer designation: Srah Ku',
  },
  rankTag: {
    vi: 'Di tích Lịch sử – Văn hóa Cấp Quốc gia (Xếp hạng 1994)',
    en: 'National Historic & Cultural Relic (Ranked 1994)',
  },
  location: {
    vi: 'Khóm 4, Phường 8, Thành phố Trà Vinh, Tỉnh Trà Vinh',
    en: 'Ward 8, Tra Vinh City, Tra Vinh Province, Mekong Delta, Vietnam',
  },
  coordinates: '9°55\'03"B · 106°18\'15"Đ (9.9176° N, 106.3041° E)',
  specs: [
    { label: { vi: 'Diện tích mặt nước', en: 'Water Surface Area' }, value: '150.000 m² (15 ha)' },
    { label: { vi: 'Kích thước ao', en: 'Pond Dimensions' }, value: '300m x 500m (Hình chữ nhật vuông)' },
    { label: { vi: 'Rừng cây đại thụ', en: 'Ancient Forest Canopy' }, value: 'Gần 500 cây sao, dầu (100–300 năm)' },
    { label: { vi: 'Niên đại khởi dựng', en: 'Estimated Origin' }, value: 'Thế kỷ X – XI (Gắn liền Chùa Âng)' },
  ],
  leadParagraph: {
    vi: 'Nằm giữa lòng đồng bằng duyên hải Trà Vinh, Ao Bà Om không chỉ là một công trình cảnh quan thủy nông nhân tạo kỳ vĩ mà còn là trái tim tâm linh, nơi hội tụ ngàn năm ký ức văn hóa của ba dân tộc Kinh – Khmer – Hoa. Bao bọc quanh mặt hồ phẳng lặng như gương là vành đai đụn cát cổ rợp bóng đại ngàn sao dầu hàng trăm năm tuổi với những bộ rễ trồi kỳ dị, tạo nên một không gian thiêng liêng và thanh bình bậc nhất phương Nam.',
    en: 'Nestled in the coastal plain of Tra Vinh, Ao Ba Om is not only an ingenious ancient water conservation reservoir but also the spiritual heart preserving millennia of shared Khmer-Viet-Chinese heritage. Encircling the mirror-smooth square pond is an ancient sand dune forest shaded by hundreds of centuries-old dipterocarp trees with surreal exposed root arches, forming one of the most sacred landscapes in Southern Vietnam.',
  },
  audioNarration: {
    transcriptVi: 'Chào mừng quý khách đến với Quần thể Thắng cảnh Ao Bà Om – di tích lịch sử văn hóa cấp quốc gia tiêu biểu của tỉnh Trà Vinh. Hãy cùng chúng tôi chạm vào từng lát cắt lịch sử, bước đi dưới bóng đại ngàn sao dầu và lắng nghe những thanh âm linh thiêng từ lễ cúng trăng Ok Om Bok.',
    transcriptEn: 'Welcome to Ao Ba Om Heritage Complex, a premier national cultural relic of Tra Vinh province. Join us to experience timeless history, walk beneath centuries-old forest canopies, and listen to the sacred rhythms of the Ok Om Bok Moon Worship Festival.',
  },
  heroImage: pondImg,
  aerialImage: aerialImg,
};

/* =========================================================================
   PHẦN 2: MAP CHI TIẾT & CÁC PHÂN KHU (ZONED SITEMAP & HOTSPOTS)
   ========================================================================= */
export const SITE_ZONES: SiteZone[] = [
  {
    id: 'zone-water',
    code: 'KHU-A',
    name: { vi: 'Lòng hồ Ao Vuông (Srah Ku)', en: 'Square Water Reservoir (Srah Ku)' },
    category: 'water',
    summary: {
      vi: 'Mặt nước hồ nước ngọt hình chữ nhật rộng gần 15 ha phẳng lặng, điểm xuyết hoa sen hoa súng và cá nước ngọt tự nhiên.',
      en: 'A serene rectangular fresh water mirror covering nearly 15 hectares, dotted with lotus and water lilies.',
    },
    functionHistory: {
      vi: 'Nơi này là gì: Hồ trữ nước ngọt nhân tạo cổ của cư dân duyên hải. Từng được dùng để: Cung cấp nguồn nước ngọt sinh hoạt và tưới tiêu nông nghiệp qua các mùa hạn mặn khắc nghiệt thời tiền nhân khai hoang; ngày nay là nơi diễn ra nghi lễ thả hoa đăng và đèn nước Lôi Protip trong đêm rằm Ok Om Bok.',
      en: 'What it is: An ancient artificial freshwater reservoir on coastal dunes. Historically used for: Storing vital fresh water for agriculture and living through severe saline intrusion seasons; today it serves as the ritual water mirror for floating lanterns during Ok Om Bok full moon night.',
    },
    architecture: {
      vi: 'Bờ ao đắp cao hình bậc thang đất cát nén chặt dài 500m, rộng 300m, độ sâu trung bình 1.5m – 2m, đáy ao lót lớp sét phù sa tự nhiên giữ nước quanh năm.',
      en: 'Compacted earthen dykes 500m long and 300m wide, average depth 1.5m to 2m, with natural alluvial clay bed retaining water year-round.',
    },
    eventsAndStories: {
      vi: 'Nơi tổ chức cuộc thi đào ao lịch sử giữa phái nam và phái nữ; trung tâm lễ hội thả đèn hoa đăng và ghe Cà-hâu.',
      en: 'Epicenter of the legendary pond digging contest between men and women; stage for floating lantern processions.',
    },
    artifacts: {
      vi: 'Đèn gió khổng lồ, thuyền hoa đăng nghi lễ (Protip), hệ thống sen súng bản địa.',
      en: 'Sky paper lanterns, ceremonial floating offerings (Protip), sacred lotus varieties.',
    },
    coordinates: { x: 50, y: 50 },
    polygonPoints: '260,180 740,180 740,420 260,420',
    highlightColor: '#38bdf8',
    image: pondImg,
    pastImage: aerialImg,
    pastYear: '1920',
    pastDescription: {
      vi: 'Ao Vuông thời kỳ Pháp thuộc còn nguyên vẻ hoang sơ, xung quanh là đầm lầy và rừng rậm nhiệt đới.',
      en: 'The square pond during early 20th century, surrounded by dense untouched wetlands and groves.',
    },
    has3DModel: true,
    modelType: 'boat',
    has360View: true,
    hotspots: [
      {
        id: 'hs-center-water',
        label: { vi: 'Tâm hồ ngắm trăng', en: 'Moon Reflection Core' },
        x: 50,
        y: 48,
        description: {
          vi: 'Vị trí trăng rằm tháng 10 âm lịch soi rọi vuông vức xuống làn nước trong veo.',
          en: 'Where the 10th lunar month full moon reflects squarely onto the calm water.',
        },
      },
      {
        id: 'hs-lotus-bed',
        label: { vi: 'Thảm sen súng mùa hội', en: 'Seasonal Water Lily Beds' },
        x: 35,
        y: 56,
        description: {
          vi: 'Những đóa hoa sen hồng nở rộ vào dịp tết Chôl Chnăm Thmây và lễ Ok Om Bok.',
          en: 'Pink lotus flowers blooming during Chol Chnam Thmay and Ok Om Bok ceremonies.',
        },
      },
    ],
  },
  {
    id: 'zone-forest',
    code: 'KHU-B',
    name: { vi: 'Vành đai Cây Sao Dầu Rễ Trồi', en: 'Exposed Dipterocarp Root Forest' },
    category: 'forest',
    summary: {
      vi: 'Quần thể gần 500 cây sao đen và cây dầu rái cổ thụ từ 100 đến hơn 300 năm tuổi với bộ rễ trồi kỳ vĩ độc nhất vô nhị.',
      en: 'A sanctuary of nearly 500 giant dipterocarp trees aged 100 to 300+ years with surreal exposed root arches.',
    },
    functionHistory: {
      vi: 'Nơi này là gì: Rừng cây chắn gió, giữ đất trên đụn cát giồng duyên hải. Từng được dùng để: Giữ nước ngầm cho ao, bảo vệ phum sóc khỏi bão cát ven biển; trong kháng chiến là nơi che chở bộ đội và điểm dừng chân tĩnh tâm cho các vị sư sãi tu thiền.',
      en: 'What it is: Ancient coastal windbreak sand forest. Historically used for: Retaining groundwater for the pond, shielding coastal villages against sea gales; serving as revolutionary shelter during resistance eras.',
    },
    architecture: {
      vi: 'Rừng cây mọc trên gò cát cao hơn mặt ao 2-3m. Qua hàng trăm năm xói mòn tự nhiên, các khối rễ cuồn cuộn trồi lên mặt đất cao từ 1m đến 2m, tạo thành các vòm cổng, hang hốc, ghế ngồi thiên tạo.',
      en: 'Trees perched on coastal dunes 2-3m above the water. Centuries of natural erosion exposed massive roots up to 2m high, creating arches, caves, and natural stone-like seats.',
    },
    eventsAndStories: {
      vi: 'Gắn liền câu chuyện bà Om treo đèn lên cành sao cao để đánh lừa phái nam tưởng sao mai đã mọc; chuyện các chiến sĩ cách mạng ẩn nấp an toàn trong hốc rễ cây.',
      en: 'Home of the folk story where Madam Om hung a lantern high on a branch to outwit the men; legends of sheltered freedom fighters.',
    },
    artifacts: {
      vi: 'Cây sao cổ thụ di sản hơn 300 năm tuổi, gỗ sao nguyên khối dùng đóng thuyền Ngo.',
      en: '300-year-old heritage dipterocarp mother trees, sacred logs used for racing canoes.',
    },
    coordinates: { x: 30, y: 28 },
    polygonPoints: '120,80 880,80 880,180 740,180 260,180 120,180',
    highlightColor: '#22c55e',
    image: rootsImg,
    pastImage: oldRootsImg,
    pastYear: '1952',
    pastDescription: {
      vi: 'Bức ảnh chụp bộ rễ cây sao sau trận bão năm 1952, người dân địa phương đắp đất bảo tồn rễ.',
      en: 'Historic photo of roots after the 1952 storm, when villagers reinforced soil around the trees.',
    },
    has3DModel: true,
    modelType: 'roots',
    has360View: true,
    hotspots: [
      {
        id: 'hs-giant-arch-root',
        label: { vi: 'Vòm Rễ Phượng Hoàng', en: 'Phoenix Root Archway' },
        x: 32,
        y: 22,
        description: {
          vi: 'Bộ rễ uốn cong tựa cánh chim đại bàng vươn lên che chở du khách nghỉ chân.',
          en: 'Curving root structures resembling phoenix wings stretching across the ground.',
        },
      },
      {
        id: 'hs-cave-root',
        label: { vi: 'Hốc Cây Kỷ Niệm', en: 'Sanctuary Root Hollow' },
        x: 68,
        y: 20,
        description: {
          vi: 'Hốc rễ rộng đủ 3-4 người ngồi bên trong, từng là điểm che chở bộ đội thời chiến tranh.',
          en: 'A natural root cavity fitting 3-4 people, historically used as a shelter during wartime.',
        },
      },
    ],
  },
  {
    id: 'zone-temple',
    code: 'KHU-C',
    name: { vi: 'Quần Thể Chùa Âng (Wat Angkor Rajaborey)', en: 'Ang Pagoda Complex (Wat Angkor Rajaborey)' },
    category: 'architecture',
    summary: {
      vi: 'Ngôi chùa cổ nhất của người Khmer tại Trà Vinh với niên đại khởi dựng từ năm 990, tuyệt tác kiến trúc Angkor rực rỡ.',
      en: 'The oldest Khmer Buddhist monastery in Tra Vinh founded in 990 AD, an architectural jewel of Angkor heritage.',
    },
    functionHistory: {
      vi: 'Nơi này là gì: Trung tâm Phật giáo Nam tông Khmer lớn nhất vùng. Từng được dùng để: Trường học chữ Phạn/Pali cho con em phum sóc, nơi tu học báo hiếu của nam thanh niên Khmer, nơi lưu giữ kinh sách lá buông (Satra Traeng) và tiến hành các đại lễ tôn giáo.',
      en: 'What it is: The premier Theravada Buddhist monastery in Tra Vinh. Historically used for: Teaching Pali and Khmer scripts, monk ordination rites, preserving sacred palm-leaf manuscripts, and hosting solemn Buddhist ceremonies.',
    },
    architecture: {
      vi: 'Chánh điện hướng Đông theo Phật giáo Nguyên thủy, mái ngói 3 tầng uốn cong đuôi rồng Naga, các đầu cột đắp tượng thần chim Krud và tiên nữ Kinnari nâng đỡ mái chùa uy nghi.',
      en: 'East-facing sanctuary according to Theravada tradition, multi-tiered curved roofs with Naga serpents, pillars supported by sculpted Krud bird deities and Kinnari celestial nymphs.',
    },
    eventsAndStories: {
      vi: 'Đại hội trùng tu năm 1842; các khóa tu báo hiếu truyền thống; lễ dâng y Kathina.',
      en: 'Great reconstruction in 1842; sacred Kathina robe-offering rituals; ordination rites.',
    },
    artifacts: {
      vi: 'Pho tượng Phật Thích Ca cổ cao 2.1m ngự trên tòa sen, bộ kinh Phật lá buông thế kỷ XVII, dàn nhạc ngũ âm cổ.',
      en: 'Ancient 2.1m Buddha seated on a lotus plinth, 17th-century palm-leaf scripture, antique Pinpeat orchestra.',
    },
    coordinates: { x: 82, y: 72 },
    polygonPoints: '760,280 940,280 940,540 760,540',
    highlightColor: '#eab308',
    image: pagodaImg,
    pastImage: oldPagodaImg,
    pastYear: '1930',
    pastDescription: {
      vi: 'Chùa Âng thập niên 1930 với hàng cột gỗ dầu thếp vàng và cổng chánh điện nguyên bản.',
      en: 'Ang Pagoda in the 1930s with teakwood lacquered pillars and original sanctuary gate.',
    },
    has3DModel: true,
    modelType: 'temple',
    has360View: true,
    hotspots: [
      {
        id: 'hs-chanh-dien',
        label: { vi: 'Chánh Điện Ngũ Cột', en: 'Pillared Main Sanctuary' },
        x: 82,
        y: 68,
        description: {
          vi: 'Nơi an vị Đức Phật Thích Ca với 12 bức bích họa miêu tả cuộc đời Đức Phật trên tường.',
          en: 'Houses the sacred Buddha statue and 12 vivid murals depicting the life of the Buddha.',
        },
      },
      {
        id: 'hs-tower-krud',
        label: { vi: 'Tượng Thần Chim Krud', en: 'Krud Celestial Pillar' },
        x: 88,
        y: 78,
        description: {
          vi: 'Biểu tượng sức mạnh thần thánh bảo vệ ngôi chùa khỏi tà ma u ám.',
          en: 'Garuda-inspired guardian deity bearing the weight of the temple roof.',
        },
      },
    ],
  },
  {
    id: 'zone-museum',
    code: 'KHU-D',
    name: { vi: 'Bảo Tàng Văn Hóa Dân Tộc Khmer', en: 'Khmer Ethnic Cultural Museum' },
    category: 'museum',
    summary: {
      vi: 'Nơi lưu giữ, nghiên cứu và trưng bày hơn 800 hiện vật quý giá về đời sống văn hóa, nông nghiệp và tôn giáo của người Khmer.',
      en: 'Exhibits over 800 precious artifacts documenting Khmer agricultural, religious, and artistic life.',
    },
    functionHistory: {
      vi: 'Nơi này là gì: Trung tâm bảo tồn và giáo dục di sản vật thể và phi vật thể Khmer Nam Bộ. Từng được dùng để: Tập hợp các hiện vật cổ từ các ngôi chùa và phum sóc trong toàn tỉnh để nghiên cứu, bảo tồn và giới thiệu cho công chúng trong và ngoài nước.',
      en: 'What it is: Provincial research & exhibition center for Southern Khmer cultural heritage. Used for: Conserving rare antiques from 143 pagodas and educating the public.',
    },
    architecture: {
      vi: 'Kiến trúc kết hợp hài hòa giữa đường nét truyền thống Khmer (mái vút cong, hoa văn chạm lộng) và công năng bảo tàng hiện đại.',
      en: 'Blends traditional Khmer decorative motifs and sloping roofs with modern museum display vitrines.',
    },
    eventsAndStories: {
      vi: 'Các chuyên đề trưng bày nghệ thuật dệt thổ cẩm, chế tác dàn nhạc ngũ âm và nhạc cụ truyền thống.',
      en: 'Exhibits on traditional brocade weaving, musical instruments, and agricultural implements.',
    },
    artifacts: {
      vi: 'Mô hình thuyền Ngo nguyên bản, mặt nạ múa Rô-băm, trang phục cưới truyền thống, nông cụ cổ.',
      en: 'Authentic Ngo racing boat model, Ro-bam dance masks, traditional wedding garb, ancient plows.',
    },
    coordinates: { x: 18, y: 70 },
    polygonPoints: '60,300 240,300 240,540 60,540',
    highlightColor: '#a855f7',
    image: festivalImg,
    has3DModel: true,
    modelType: 'pottery',
    has360View: false,
    hotspots: [
      {
        id: 'hs-ngo-boat-room',
        label: { vi: 'Không gian Thuyền Ngo', en: 'Ngo Boat Gallery' },
        x: 18,
        y: 65,
        description: {
          vi: 'Trưng bày chiếc thuyền Ngo dài 28m được đẽo từ thân cây sao độc mộc.',
          en: 'Features a 28-meter long racing canoe carved from a single dipterocarp trunk.',
        },
      },
    ],
  },
  {
    id: 'zone-plaza',
    code: 'KHU-E',
    name: { vi: 'Quảng Trường Lễ Hội & Sân Khấu Cúng Trăng', en: 'Ok Om Bok Festival Plaza & Moon Ritual Arena' },
    category: 'festival',
    summary: {
      vi: 'Khu vực quảng trường rộng lớn sát bờ ao, nơi quy tụ hàng chục ngàn đồng bào và du khách trong ngày hội Ok Om Bok.',
      en: 'Spacious ceremonial esplanade along the southern bank hosting tens of thousands during Ok Om Bok.',
    },
    functionHistory: {
      vi: 'Nơi này là gì: Sân khấu văn hóa ngoài trời của cộng đồng. Từng được dùng để: Tổ chức nghi thức đút Cốm Dẹp cho trẻ em cầu may mắn, múa Lâm-thôn quanh đống lửa, thi đấu các trò chơi dân gian (đập nồi niêu, kéo co, đi cà kheo).',
      en: 'What it is: Open-air communal ceremonial ground. Used for: Feeding green flattened rice flakes (Com Dep) to children, community Lam-thon circle dances, and traditional folk sports.',
    },
    architecture: {
      vi: 'Khán đài bậc thoải hướng ra mặt hồ, lối dạo lát đá bazan tự nhiên hòa quyện bóng râm đại ngàn.',
      en: 'Terraced stone seating oriented toward the water mirror under the sheltering ancient canopy.',
    },
    eventsAndStories: {
      vi: 'Đêm hội cúng trăng Ok Om Bok rằm tháng 10 âm lịch hàng năm; các hội thi trang phục dân tộc.',
      en: 'Annual 10th lunar month full moon festival and regional Khmer ethnic costume contests.',
    },
    artifacts: {
      vi: 'Cối đá giã cốm dẹp xưa, trống Chhay-dăm, mâm cúng hoa quả trăng rằm.',
      en: 'Ancient stone pestle & mortar for Com Dep, Chhay-dam drum, ceremonial fruit offering trays.',
    },
    coordinates: { x: 50, y: 80 },
    polygonPoints: '260,420 740,420 740,560 260,560',
    highlightColor: '#f97316',
    image: lanternsImg,
    has3DModel: false,
    has360View: true,
    hotspots: [
      {
        id: 'hs-com-dep-stage',
        label: { vi: 'Khu vực Đút Cốm Dẹp', en: 'Com Dep Ritual Dais' },
        x: 52,
        y: 82,
        description: {
          vi: 'Các vị bô lão thực hiện nghi thức đút 3 nắm cốm dẹp cho con trẻ kèm lời chúc phước lành.',
          en: 'Elders feed three handfuls of sweet rice to children while whispering wishes of prosperity.',
        },
      },
    ],
  },
  {
    id: 'zone-gate',
    code: 'KHU-F',
    name: { vi: 'Cổng Di Tích & Không Gian Đón Khách', en: 'Monument Gateway & Welcome Pavilion' },
    category: 'entrance',
    summary: {
      vi: 'Cổng chào tam quan kiến trúc Khmer dẫn lối từ đường Nguyễn Du vào không gian di sản thanh tịnh.',
      en: 'Traditional triple-arched Khmer gate welcoming visitors from Nguyen Du street into the sanctuary.',
    },
    functionHistory: {
      vi: 'Nơi này là gì: Không gian tiếp đón, điều hướng và giới thiệu thông tin di tích cho khách hành hương và khách du lịch trong nước, quốc tế.',
      en: 'What it is: Interpretive welcome pavilion providing orientation, maps, and ethics guidelines to pilgrims and tourists.',
    },
    architecture: {
      vi: 'Cổng 3 vòm mái chạm khắc biểu tượng tháp thần Brahma 4 mặt và phù điêu rồng Naga uy nghi.',
      en: 'Triple-gate topped with four-faced Brahma towers and fierce carved Naga motifs.',
    },
    eventsAndStories: {
      vi: 'Điểm khởi hành của các đoàn rước lễ trang trọng tiến vào Chùa Âng và Ao Vuông.',
      en: 'Starting point for ceremonial processions advancing toward Ang Pagoda and the pond.',
    },
    artifacts: {
      vi: 'Bia đá khắc Quyết định công nhận Di tích cấp Quốc gia năm 1994 của Bộ Văn hóa – Thông tin.',
      en: 'Stone stele inscribed with the 1994 National Heritage Designation by the Ministry of Culture.',
    },
    coordinates: { x: 50, y: 10 },
    polygonPoints: '400,20 600,20 600,100 400,100',
    highlightColor: '#ec4899',
    image: pondImg,
    has3DModel: false,
    has360View: false,
  },
];

/* =========================================================================
   PHẦN 3: TIMELINE HÌNH THÀNH DI TÍCH (PROGRESSIVE LINEAR TIMELINE)
   ========================================================================= */
export const TIMELINE_EPOCHS: TimelineEpoch[] = [
  {
    id: 'epoch-origin',
    epochName: { vi: 'Khởi Nguồn Huyền Sử & Giồng Cát Cổ', en: 'Origins, Legends & Ancient Dunes' },
    timeSpan: 'Thế kỷ X – XI',
    tag: 'origin',
    tagLabel: { vi: '1. Khởi nguồn', en: '1. Origins' },
    headline: {
      vi: 'Truyền thuyết cuộc thi đào ao tranh quyền cưới chồng và sự hình thành đụn cát cổ',
      en: 'The legendary pond contest and geological formation on ancient coastal sand dunes',
    },
    description: {
      vi: 'Trước thế kỷ X, vùng đất Trà Vinh còn là những giồng cát biển thoái hoang sơ. Để giải quyết hạn mặn và phân định tập quán hôn nhân gia đình, một cuộc thi đào ao giữa nam và nữ được tổ chức. Nhờ trí tuệ mưu lược của bà Om – người chỉ huy phái nữ treo đèn lên ngọn cây sao giả làm sao mai – phái nữ đã hoàn thành chiếc ao vuông vức trước bình minh, khai sinh ra địa danh Ao Bà Om.',
      en: 'Before the 10th century, Tra Vinh was dominated by coastal sand banks. To harvest fresh water and settle marriage custom disputes, a digging competition between men and women took place. Led by Madam Om, who hung a lantern atop a dipterocarp tree to mimic the morning star, the women triumphed before dawn, bequeathing the name Ao Ba Om to posterity.',
    },
    historicalContext: {
      vi: 'Về mặt địa chất thủy văn, ao là công trình tích trữ nước ngọt nhân tạo thông minh của cư dân trên đụn cát giồng, phục vụ sinh hoạt suốt mùa khô kiệt.',
      en: 'Hydro-geologically, it represents an ingenious freshwater harvesting tank constructed on sandy ridges to combat severe dry seasons.',
    },
    cards: [
      {
        id: 'c-origin-1',
        title: { vi: 'Cuộc thi đào ao huyền thoại', en: 'The Legendary Digging Contest' },
        timeTag: 'TK X · Ước định',
        position: 'top',
        offsetPercent: 12,
        image: legendImg,
        caption: { vi: 'Minh họa cuộc thi đào ao của bà Om', en: 'Illustration of Madam Om leading the contest' },
        summary: {
          vi: 'Bà Om cùng chị em phụ nữ ngày đêm xẻ đất đào hồ trên vùng đụn cát cằn cỗi.',
          en: 'Madam Om and local women labor day and night digging into the arid sand dunes.',
        },
        details: {
          vi: 'Theo truyền thuyết dân gian, phái nam cậy sức mạnh nhưng chủ quan, vừa làm vừa uống rượu ca hát; trong khi phái nữ đoàn kết, cần cù chia ca làm việc bền bỉ dưới ánh trăng.',
          en: 'Folk legend recounts that the men relied on physical strength but grew careless, while the women worked in organized shifts beneath the moonlight.',
        },
        categoryTag: 'origin',
      },
      {
        id: 'c-origin-2',
        title: { vi: 'Mẹo treo đèn trên ngọn sao', en: 'The Lantern on the High Branch' },
        timeTag: 'TK X · Đêm phán quyết',
        position: 'bottom',
        offsetPercent: 24,
        image: legendImg,
        caption: { vi: 'Ánh đèn trong đêm đánh lừa phái nam', en: 'Lantern hung high mimicking the morning star' },
        summary: {
          vi: 'Khi nửa đêm gần qua, bà Om cho treo ngọn đèn lồng lên nhánh sao cao nhất hướng Đông.',
          en: 'Near midnight, Madam Om instructed a lantern to be raised high on an eastern branch.',
        },
        details: {
          vi: 'Phái nam ngỡ sao mai đã mọc, vội vàng buông cuốc đi ngủ. Nhóm nữ tiếp tục đào cho đến khi nước ngọt ứa ra đầy đặn, giành phần thắng tuyệt đối về quyền chủ động hôn nhân.',
          en: 'Mistaking the lantern for the morning star, the men laid down their shovels. The women kept digging until freshwater welled up, securing a decisive cultural victory.',
        },
        categoryTag: 'origin',
      },
    ],
  },
  {
    id: 'epoch-milestones',
    epochName: { vi: 'Các Cột Mốc Chính: Định Hình Quần Thể', en: 'Key Milestones: Temple & Sanctuary' },
    timeSpan: 'Năm 990 – 1842',
    tag: 'milestone',
    tagLabel: { vi: '2. Cột mốc chính', en: '2. Key Milestones' },
    headline: {
      vi: 'Khởi dựng Chùa Âng năm 990 và các cuộc đại trùng tu kiến trúc Angkor',
      en: 'Founding of Ang Pagoda in 990 AD and monumental Angkor architectural restorations',
    },
    description: {
      vi: 'Năm 990, ngôi chùa Wat Angkor Rajaborey (Chùa Âng) đầu tiên được dựng lên bằng tre lá bên bờ ao. Đến năm 1842, chùa được đại trùng tu bằng gỗ quý và ngói nung theo quy chuẩn kiến trúc Angkor rực rỡ. Ao Bà Om chính thức trở thành không gian thiêng liêng gắn bó khăng khít với ngôi chùa cổ nhất Trà Vinh.',
      en: 'In 990 AD, Wat Angkor Rajaborey (Ang Pagoda) was established along the pond bank. By 1842, a grand reconstruction rebuilt the sanctuary in precious hardwood and ornate tiles following classical Angkor styles, turning the site into an integrated spiritual hub.',
    },
    historicalContext: {
      vi: 'Sự kết hợp giữa hồ nước (Baray theo phong cách Angkor) và ngôi chùa tạo thành mô hình vũ trụ luận Phật giáo thu nhỏ.',
      en: 'The juxtaposition of the water reservoir (Baray in Angkorian tradition) and the temple symbolizes Mount Meru surrounded by cosmic oceans.',
    },
    cards: [
      {
        id: 'c-milestone-990',
        title: { vi: 'Khởi dựng Chùa Âng (Năm 990)', en: 'Ang Pagoda Founded (990 AD)' },
        timeTag: 'Năm 990',
        position: 'top',
        offsetPercent: 35,
        image: pagodaImg,
        caption: { vi: 'Chùa Âng bên bờ cát cổ Ao Bà Om', en: 'Ang Pagoda nestled beside Ao Ba Om dunes' },
        summary: {
          vi: 'Cộng đồng Khmer khởi lập ngôi chùa đầu tiên để hoằng hóa Phật pháp Nam tông.',
          en: 'The Khmer community erected the first monastic sanctuary for Theravada teachings.',
        },
        details: {
          vi: 'Chùa được xây dựng dưới thời vua Angkor Jayavarman V, là trung tâm giáo dục chữ viết và đạo đức cho con em phum sóc quanh vùng.',
          en: 'Constructed during the era of Angkor, it served as an educational sanctuary teaching literacy and Dharma to regional villages.',
        },
        categoryTag: 'milestone',
      },
      {
        id: 'c-milestone-1842',
        title: { vi: 'Đại trùng tu Chùa Âng (Năm 1842)', en: 'Grand Reconstruction of 1842' },
        timeTag: 'Năm 1842',
        position: 'bottom',
        offsetPercent: 46,
        image: oldPagodaImg,
        caption: { vi: 'Chánh điện Chùa Âng với hàng cột gỗ dầu', en: 'Main sanctuary rebuilt in 1842' },
        summary: {
          vi: 'Hòa thượng trụ trì cùng phật tử quyên góp gỗ quý trùng tu chánh điện nguy nga.',
          en: 'Abbots and villagers rallied precious timber to erect the magnificent pillared hall.',
        },
        details: {
          vi: 'Công trình sử dụng gỗ sao dầu nguyên thân đẽo gọt làm cột cái, mái ngói vút cong chạm rồng Neak, lưu giữ nguyên vẹn vẻ đẹp mỹ thuật cho đến ngày nay.',
          en: 'Features monumental dipterocarp timber columns, three-tiered sweeping tiled eaves, and handcrafted relief sculptures of Naga and Garuda.',
        },
        categoryTag: 'milestone',
      },
    ],
  },
  {
    id: 'epoch-events',
    epochName: { vi: 'Sự Kiện Lịch Sử Nổi Bật & Biến Cố', en: 'Historical Events & Wartime Resilience' },
    timeSpan: 'Thế kỷ XIX – XX',
    tag: 'historical_event',
    tagLabel: { vi: '3. Sự kiện nổi bật', en: '3. Historical Events' },
    headline: {
      vi: 'Căn cứ kháng chiến, chở che đồng bào và gìn giữ rừng cổ thụ qua bom đạn',
      en: 'Revolutionary sanctuary, sheltering communities and protecting heritage forests through wars',
    },
    description: {
      vi: 'Trong hai cuộc kháng chiến chống thực dân Pháp và đế quốc Mỹ, khu rừng cổ thụ quanh Ao Bà Om và Chùa Âng trở thành căn cứ bí mật nuôi giấu cán bộ cách mạng. Bất chấp bom đạn và thiên tai bão tố tàn phá, các sư sãi và đồng bào các dân tộc đã kiên cường bảo bọc từng gốc cây, không để di tích bị hủy hoại.',
      en: 'During the wars of independence, the dense forest around Ao Ba Om and Ang Pagoda served as a discreet stronghold sheltering freedom fighters. Monks and locals banded together to safeguard every ancient tree against air raids and artillery, keeping the sanctuary alive.',
    },
    historicalContext: {
      vi: 'Địa hình đụn cát cao và những hốc rễ cây sao dầu khổng lồ là công sự che chở tự nhiên lý tưởng cho nhân dân.',
      en: 'The elevated sandy terrain and subterranean root hollows formed an impenetrable natural protective canopy.',
    },
    cards: [
      {
        id: 'c-event-1945',
        title: { vi: 'Thành lũy che chở kháng chiến', en: 'Shelter of the Resistance' },
        timeTag: '1945 – 1975',
        position: 'top',
        offsetPercent: 58,
        image: rootsImg,
        caption: { vi: 'Hốc rễ cây sao dầu từng là nơi ẩn nấp', en: 'Ancient root cavities used as hideouts' },
        summary: {
          vi: 'Các hốc rễ cây đại thụ trở thành nơi cất giấu tài liệu và bảo vệ cán bộ cách mạng.',
          en: 'Cavernous root formations served as document depots and safe havens for local partisans.',
        },
        details: {
          vi: 'Các vị hòa thượng tại Chùa Âng dũng cảm đứng ra điều đình với binh lính ngoại bang, bảo vệ an toàn cho hàng ngàn người dân vào chùa lánh nạn bom rơi.',
          en: 'Brave abbots negotiated with invading troops, turning the monastic compound into a designated safe haven for thousands of displaced families.',
        },
        categoryTag: 'historical_event',
      },
      {
        id: 'c-event-1952',
        title: { vi: 'Trận bão lịch sử năm 1952', en: 'The Great Typhoon of 1952' },
        timeTag: 'Năm 1952',
        position: 'bottom',
        offsetPercent: 67,
        image: oldRootsImg,
        caption: { vi: 'Rễ cây trồi lộ sau những đợt xói mòn lớn', en: 'Exposed roots following massive erosion' },
        summary: {
          vi: 'Trận bão cát lốc xoáy làm xói mòn lớp đất mặt, làm lộ ra các bộ rễ trồi kỳ thú.',
          en: 'Catastrophic storms stripped topsoil away, unveiling the majestic subterranean root architecture.',
        },
        details: {
          vi: 'Thay vì để cây ngã đổ, người dân khắp phum sóc đã cùng nhau gánh đất đắp bờ, tỉa cành và cứu sống toàn bộ vành đai sao dầu đại thụ quý giá.',
          en: 'Rather than allowing trees to perish, villagers hauled clay and loam to reinforce root anchors, saving every single dipterocarp specimen.',
        },
        categoryTag: 'historical_event',
      },
    ],
  },
  {
    id: 'epoch-transformation',
    epochName: { vi: 'Sự Thay Đổi Qua Thời Gian', en: 'Transformation Across Centuries' },
    timeSpan: 'Thế kỷ XX – XXI',
    tag: 'transformation',
    tagLabel: { vi: '4. Thay đổi qua thời gian', en: '4. Transformations' },
    headline: {
      vi: 'Từ công trình thủy nông cổ trở thành trung tâm danh thắng văn hóa tâm linh',
      en: 'From an agricultural irrigation lake to the premier cultural-spiritual landscape of the South',
    },
    description: {
      vi: 'Qua các thời kỳ lịch sử, Ao Bà Om đã chuyển dịch công năng một cách kỳ diệu: từ một hồ chứa nước ngọt nông nghiệp thuần túy giữa đụn cát, nơi đây đã phát triển thành trung tâm tín ngưỡng, không gian sinh hoạt văn hóa lễ hội lớn nhất của đồng bào Khmer Trà Vinh, đồng thời là lá phổi xanh điều hòa khí hậu cho toàn đô thị.',
      en: 'Across historical epochs, Ao Ba Om underwent a remarkable evolution: originating as a rustic rainwater reservoir on sand dunes, it blossomed into the premier spiritual sanctuary, festival hub for the Khmer community, and the green lung regulating the microclimate of Tra Vinh City.',
    },
    historicalContext: {
      vi: 'Hệ thống rễ trồi phát triển theo thời gian do hiện tượng xói mòn tự nhiên và nước mưa rửa trôi đất cát, tạo thành cảnh quan độc nhất vô nhị ở Việt Nam.',
      en: 'Continuous wind and rainwater erosion over centuries molded the root systems into an architectural wonder unmatched in Vietnam.',
    },
    cards: [
      {
        id: 'c-trans-1',
        title: { vi: 'Quy hoạch công viên di sản', en: 'Heritage Park Spatial Planning' },
        timeTag: 'Thập niên 1980',
        position: 'top',
        offsetPercent: 78,
        image: pondImg,
        caption: { vi: 'Mặt hồ Ao Vuông được tôn tạo bờ kè sinh thái', en: 'Eco-embankments protecting the lake' },
        summary: {
          vi: 'Tỉnh Trà Vinh tiến hành nạo vét bùn lắng, trồng hoa sen súng và kè đất bảo vệ bờ ao.',
          en: 'Sediment dredging and indigenous lotus planting restored pristine water purity.',
        },
        details: {
          vi: 'Hàng rào bảo vệ sinh thái được thiết lập, cấm các hoạt động chặt phá cây rừng và san lấp đụn cát, giữ vững cấu trúc nguyên bản của hồ.',
          en: 'Strict environmental protection zones prohibited logging and sand leveling, safeguarding the historical integrity of the reservoir.',
        },
        categoryTag: 'transformation',
      },
    ],
  },
  {
    id: 'epoch-preservation',
    epochName: { vi: 'Bảo Tồn & Phát Huy Giá Trị Di Sản', en: 'Preservation & Living Heritage Valorization' },
    timeSpan: '1994 – Nay',
    tag: 'preservation',
    tagLabel: { vi: '5. Bảo tồn & Phát huy', en: '5. Preservation Today' },
    headline: {
      vi: 'Xếp hạng Di tích Quốc gia 1994, Di sản phi vật thể Ok Om Bok và kỷ nguyên số hóa',
      en: '1994 National Relic Ranking, Ok Om Bok Intangible Heritage & Digital Era',
    },
    description: {
      vi: 'Ngày 16/11/1994, Bộ Văn hóa – Thông tin chính thức công nhận Ao Bà Om là Di tích Lịch sử – Văn hóa cấp Quốc gia. Năm 2014, Lễ hội Ok Om Bok tại đây được vinh danh Di sản văn hóa phi vật thể Quốc gia. Ngày nay, di tích đang bước vào kỷ nguyên số hóa 3D, mở cửa đón hàng triệu lượt du khách khám phá di sản bền vững.',
      en: 'On November 16, 1994, the Ministry of Culture designated Ao Ba Om as a National Historic-Cultural Relic. In 2014, Ok Om Bok Festival was inscribed on the National Intangible Heritage List. Today, the monument enters an era of digital twins, 3D interaction, and sustainable eco-cultural tourism.',
    },
    historicalContext: {
      vi: 'Sự tiếp nối giữa giá trị cổ truyền và công nghệ số tương tác giúp thế hệ trẻ chạm vào di sản một cách trực quan, sống động.',
      en: 'Fusing ancestral traditions with interactive digital storytelling empowers younger generations to connect deeply with living heritage.',
    },
    cards: [
      {
        id: 'c-pres-1994',
        title: { vi: 'Xếp hạng Di tích Quốc gia (1994)', en: 'National Heritage Relic (1994)' },
        timeTag: '16/11/1994',
        position: 'top',
        offsetPercent: 88,
        image: pagodaImg,
        caption: { vi: 'Bằng xếp hạng Di tích Lịch sử Văn hóa Quốc gia', en: 'National Monument Certificate in 1994' },
        summary: {
          vi: 'Khẳng định giá trị lịch sử, kiến trúc và cảnh quan đặc biệt của quần thể.',
          en: 'Affirms the exceptional historic, architectural, and landscape significance of the site.',
        },
        details: {
          vi: 'Quyết định số 1288-VH/QĐ xác lập vành đai bảo vệ nghiêm ngặt khu vực I và II cho cả ao, rừng cây và Chùa Âng.',
          en: 'Official decree 1288-VH/QD enforced strict core protection zones for the lake, forest canopy, and Ang Pagoda.',
        },
        categoryTag: 'preservation',
      },
      {
        id: 'c-pres-2024',
        title: { vi: 'Số hóa Kiosk & Bảo tồn thông minh', en: 'Digital Kiosk & Smart Heritage' },
        timeTag: '2024 – Nay',
        position: 'bottom',
        offsetPercent: 96,
        image: festivalImg,
        caption: { vi: 'Bàn tương tác số hóa di sản bảo tàng', en: 'Interactive museum touchscreen kiosk' },
        summary: {
          vi: 'Ứng dụng công nghệ kể chuyện số (Digital Storytelling) cho du khách tại chỗ.',
          en: 'Deploying digital storytelling touchscreen technology for on-site visitors.',
        },
        details: {
          vi: 'Khách tham quan được tương tác với bản đồ 2.5D, mô hình 3D cổ vật, so sánh ảnh xưa - nay và lắng nghe thuyết minh đa ngữ chân thực.',
          en: 'Visitors interact with 2.5D maps, 3D artifact models, historical sliders, and authentic multilingual audio narrations.',
        },
        categoryTag: 'preservation',
      },
    ],
  },
];

/* =========================================================================
   PHẦN 4: CON NGƯỜI & ĐỜI SỐNG VĂN HÓA (PEOPLE & LIVING COMMUNITY)
   ========================================================================= */
export const CULTURAL_PEOPLE: CulturalPerson[] = [
  {
    id: 'person-ba-om',
    name: 'Bà Om (Nang Om)',
    role: { vi: 'Thủ lĩnh huyền thoại phái nữ thời lập ấp', en: 'Legendary Leader of Women' },
    community: { vi: 'Cư dân Khmer duyên hải cổ', en: 'Ancient Khmer Coastal Community' },
    story: {
      vi: 'Người phụ nữ mưu trí, quả cảm đã hiệu triệu phụ nữ trong vùng tham gia cuộc thi đào ao, dùng mẹo treo đèn trên ngọn cây sao để giành phần thắng, giải phóng phụ nữ khỏi hủ tục hôn nhân nặng nề thời xưa.',
      en: 'A legendary matriarch who mobilized regional women to compete in the pond contest, using the ingenious lantern stratagem to secure gender equality in marriage customs.',
    },
    quote: {
      vi: 'Sức mạnh của phụ nữ không nằm ở gân cốt, mà ở sự kiên định, lòng đoàn kết và ngọn đèn trí tuệ dẫn lối trong đêm tối.',
      en: 'The strength of women lies not in brute force, but in resilience, solidarity, and the guiding lantern of wisdom.',
    },
    image: legendImg,
    badge: { vi: 'Biểu tượng Trí tuệ Phụ nữ', en: 'Icon of Female Wisdom' },
  },
  {
    id: 'person-thach-ken',
    name: 'Nghệ nhân Ưu tú Thạch Ken (72 tuổi)',
    role: { vi: 'Người giữ rừng sao dầu cổ thụ & Kể sử thi Chành-đa', en: 'Master Storyteller & Ancient Forest Guardian' },
    community: { vi: 'Khóm 4, Phường 8, TP. Trà Vinh', en: 'Ward 8, Tra Vinh City' },
    story: {
      vi: 'Hơn 45 năm gắn bó gìn giữ từng gốc cây quanh bờ ao, ghi chép và thuộc lòng hàng chục bản truyện thơ, sử thi Khmer cổ để truyền dạy cho thanh thiếu niên địa phương.',
      en: 'For over 45 years, he has tended to each ancient tree trunk while memorizing and teaching classical Khmer epic poetry to local youth.',
    },
    quote: {
      vi: 'Mỗi gốc cây sao dầu quanh Ao Bà Om đều mang hơi thở của tổ tiên. Cây còn đứng vững thì phum sóc mới an lành.',
      en: 'Every dipterocarp root around Ao Ba Om breathes with the soul of our ancestors. While the trees stand tall, our people flourish.',
    },
    image: rootsImg,
    badge: { vi: 'Người Gác Ký Ức Ao Vuông', en: 'Guardian of Sacred Memories' },
  },
  {
    id: 'person-son-suol',
    name: 'Nghệ nhân Sơn Sươl (65 tuổi)',
    role: { vi: 'Nghệ nhân đóng thuyền Ngo truyền thống', en: 'Master Racing Boat Craftsman' },
    community: { vi: 'Làng đóng thuyền cổ Chùa Âng', en: 'Traditional Boatbuilders Guild' },
    story: {
      vi: 'Bậc thầy về kỹ thuật đẽo thuyền Ngo từ thân cây sao độc mộc, chạm khắc hoa văn rồng biển Neak và thần chim Krud dũng mãnh.',
      en: 'Master craftsman shaping 30-meter Ngo racing boats from single dipterocarp logs, carving intricate Naga and Garuda motifs.',
    },
    quote: {
      vi: 'Đóng một chiếc thuyền Ngo là gửi gắm linh hồn của cả phum sóc xuống dòng nước lễ hội.',
      en: 'Carving a sacred boat is entrusting the communal soul of our village to the festival currents.',
    },
    image: festivalImg,
    badge: { vi: 'Bàn tay vàng Thuyền Ngo', en: 'Golden Hands of Ngo Boat' },
  },
];

export const CULTURAL_ACTIVITIES: CulturalActivity[] = [
  {
    id: 'act-ok-om-bok',
    title: { vi: 'Lễ Hội Ok Om Bok (Lễ Cúng Trăng)', en: 'Ok Om Bok Moon Worship Festival' },
    timeOccurrence: { vi: 'Rằm tháng 10 Âm lịch hàng năm', en: '15th day of the 10th lunar month' },
    type: 'festival',
    description: {
      vi: 'Di sản văn hóa phi vật thể Quốc gia. Đồng bào Khmer tề tựu bên bờ Ao Bà Om làm lễ tạ ơn Thần Mặt Trăng đã ban mưa thuận gió hòa, bảo vệ mùa màng tốt tươi.',
      en: 'National Intangible Cultural Heritage. Khmer families gather around the pond to give thanks to the Moon Deity for fruitful harvests.',
    },
    culturalMeaning: {
      vi: 'Biểu hiện lòng biết ơn mẹ thiên nhiên, tinh thần đoàn kết keo sơn của cộng đồng sau một năm lao động vất vả.',
      en: 'Expresses profound reverence toward nature and solidifies communal bonds at the conclusion of the harvest season.',
    },
    image: festivalImg,
  },
  {
    id: 'act-loi-protip',
    title: { vi: 'Lễ Thả Đèn Nước (Lôi Protip) & Đèn Gió', en: 'Floating Lantern (Loi Protip) & Sky Lanterns' },
    timeOccurrence: { vi: 'Đêm hội Ok Om Bok bên bờ hồ', en: 'During the Ok Om Bok sacred night' },
    type: 'ritual',
    description: {
      vi: 'Hàng ngàn chiếc đèn kết từ bẹ chuối, hoa tươi và nến lung linh được thả trôi trên mặt nước Ao Vuông, hòa cùng những chiếc đèn gió khổng lồ bay cao lên bầu trời đêm.',
      en: 'Thousands of candlelit floral lanterns crafted from banana trunks drift across the pond, while giant sky lanterns soar into the starlit sky.',
    },
    culturalMeaning: {
      vi: 'Xua tan mọi tai ương, xui rủi trong năm cũ và gửi gắm những lời nguyện ước may mắn, bình an cho gia đình và phum sóc.',
      en: 'Washes away past misfortunes and carries heartfelt prayers for health and peace toward the cosmos.',
    },
    image: lanternsImg,
  },
  {
    id: 'act-pinpeat',
    title: { vi: 'Diễn Xướng Dàn Nhạc Ngũ Âm (Pinpeat)', en: 'Pinpeat Classical Orchestra Performance' },
    timeOccurrence: { vi: 'Trong mọi nghi lễ chùa và ngày hội lớn', en: 'During monastery festivals and sacred rites' },
    type: 'music',
    description: {
      vi: 'Dàn nhạc truyền thống gồm các nhạc cụ: đàn roneat (phiến đồng/gỗ), trống sampho, trống skor-thom, kèn sralai tạo nên âm hưởng thiêng liêng rộn rã.',
      en: 'Traditional sacred orchestra featuring xylophones, double-headed drums, barrel drums, and reed oboes producing hypnotic melodies.',
    },
    culturalMeaning: {
      vi: 'Âm nhạc kết nối giữa con người và thế giới thần linh, là linh hồn trong đời sống tinh thần của người Khmer.',
      en: 'Bridges humanity and the sacred divine realm, embodying the cultural soul of Khmer spirituality.',
    },
    image: pagodaImg,
  },
];

export const UNTOLD_STORIES: UntoldStory[] = [
  {
    id: 'story-lantern',
    title: { vi: 'Giai thoại Ngọn Đèn Sao Mai trên Cành Sao Dầu', en: 'The Morning Star Lantern Legend' },
    narrator: { vi: 'Truyền khẩu dân gian qua nhiều thế hệ bô lão', en: 'Folk oral account passed down through elders' },
    oralHistory: {
      vi: 'Ít ai biết rằng theo lời kể của các cụ già, ngọn đèn mà bà Om treo không phải đèn dầu thông thường, mà được bọc bởi vải lụa tơ tằm màu vàng óng ánh, treo lắt lay ở độ cao hơn 20 mét khiến phái nam nhìn từ xa lầm tưởng là chòm sao Thất Nữ và sao Mai đang mọc giữa trời.',
      en: 'Folk elders recount that the lantern hung by Madam Om was veiled in golden silk and suspended over 20 meters high, perfectly mimicking the radiant dawn star to unsuspecting eyes.',
    },
    significance: {
      vi: 'Tôn vinh trí tuệ ứng biến, sự khéo léo và quyền bình đẳng của phụ nữ Nam Bộ từ thuở mở cõi.',
      en: 'Celebrates female intellect, ingenuity, and gender equality since the frontier era.',
    },
    image: legendImg,
  },
  {
    id: 'story-sacred-fish',
    title: { vi: 'Ký ức Kỳ Bí Về Đàn Cá Thiêng Dưới Đáy Ao', en: 'Legend of the Sacred Fish of the Deep' },
    narrator: { vi: 'Sư cả Chùa Âng kể lại', en: 'Recounted by Senior Abbot of Ang Pagoda' },
    oralHistory: {
      vi: 'Người dân quanh ao truyền tai nhau câu chuyện dưới đáy ao có những chú cá trê khổng lồ sống qua nhiều thập kỷ. Mỗi khi có điềm lành hoặc chuẩn bị đến mùa lễ cúng trăng, đàn cá lại ngoi lên quẫy nước tạo nên những vòng sóng lấp lánh như gương.',
      en: 'Locals whisper tales of giant ancient catfish dwelling in the deep mud. Before auspicious festivals, they emerge to brush the surface, generating concentric ripples of light.',
    },
    significance: {
      vi: 'Nhắc nhở cộng đồng luôn giữ gìn nguồn nước thiêng, tuyệt đối không đánh bắt cá hay xả thải làm ô uế lòng ao.',
      en: 'A folklore reminder teaching villagers to treat the water as sacred, banning pollution and poaching.',
    },
    image: pondImg,
  },
  {
    id: 'story-roots-hollow',
    title: { vi: 'Hốc Cây Sao Dầu Che Chở Bộ Đội Kháng Chiến', en: 'The Protective Root Hollow in War Years' },
    narrator: { vi: 'Cựu chiến binh Thạch Sa Vát (81 tuổi)', en: 'Veteran Thach Sa Vat (81 years old)' },
    oralHistory: {
      vi: 'Trong trận càn năm 1968, một tiểu đội du kích đã ẩn mình trong hốc rễ cây sao dầu khổng lồ phía Tây bờ ao. Tán lá rậm rạp và mạng rễ chằng chịt đã che mắt hoàn toàn trực thăng địch tuần tiễu, bảo toàn nguyên vẹn tính mạng các chiến sĩ.',
      en: 'During a 1968 raid, a guerrilla unit hid inside the vast root cavern on the western shore. The dense canopy and intertwined roots completely concealed them from enemy scouts.',
    },
    significance: {
      vi: 'Minh chứng cho sự gắn kết keo sơn giữa thiên nhiên di sản và lịch sử đấu tranh bảo vệ quê hương.',
      en: 'A living testament to the symbiosis between natural heritage and heroic national defense.',
    },
    image: rootsImg,
  },
];

export const SACRED_ARTIFACTS: SacredArtifact[] = [
  {
    id: 'art-boat',
    name: { vi: 'Thuyền Ngo Độc Mộc Đua Ok Om Bok', en: 'Sacred Ooc Om Bok Racing Ngo Boat' },
    originEra: 'Thế kỷ XIX – XX',
    material: { vi: 'Gỗ sao nguyên thân, sơn son thếp vàng hoa văn Rồng Naga', en: 'Solid dipterocarp log, lacquered Naga dragon motifs' },
    specialStory: {
      vi: 'Chiếc thuyền dài 28 mét, chứa 50 tay chèo. Mỗi nhịp chèo tượng trưng cho sức mạnh đoàn kết của cả phum sóc, được làm lễ "mở mắt" (Chrút Preah) thiêng liêng trước khi hạ thủy thi đấu.',
      en: '28-meter dugout boat crewed by 50 rowers. Blessed in a sacred eye-opening ceremony (Chrut Preah) prior to launching into tournament waters.',
    },
    todayContinuity: {
      vi: 'Được thế hệ thanh niên Khmer tiếp tục tập luyện hàng năm, đại diện Trà Vinh tham gia giải vô địch đua thuyền Ngo toàn quốc.',
      en: 'Actively crewed by younger generations competing in national championships, preserving athletic heritage.',
    },
    image: festivalImg,
  },
  {
    id: 'art-mortar',
    name: { vi: 'Cối Đá & Chày Gỗ Giã Cốm Dẹp Trăm Tuổi', en: 'Centuries-old Stone Mortar & Pestle for Com Dep' },
    originEra: 'Đầu thế kỷ XX',
    material: { vi: 'Đá sa thạch tự nhiên & gỗ căm xe đực', en: 'Natural sandstone & ironwood' },
    specialStory: {
      vi: 'Chiếc cối đá đã cùng các mẹ, các chị giã hàng vạn mẻ cốm dẹp nếp non thơm phức để dâng cúng lên Thần Mặt Trăng qua hàng chục mùa hội rực rỡ.',
      en: 'Pounded millions of fragrant green sticky rice flakes offered to the Moon Deity across decades of celebrations.',
    },
    todayContinuity: {
      vi: 'Được lưu giữ trang trọng tại Bảo tàng Văn hóa Dân tộc Khmer và mang ra trình diễn nghề truyền thống cho du khách trải nghiệm giã cốm thực tế.',
      en: 'Preserved in the museum and operated live during cultural workshops for visiting tourists.',
    },
    image: lanternsImg,
  },
];

/* =========================================================================
   PHẦN 5: DẤU ẤN & GIÁ TRỊ DI SẢN (ENDURING LEGACY & FUTURE CONTINUANCE)
   "NGÀY NAY NƠI NÀY CÒN ĐỂ LẠI ĐIỀU GÌ?"
   ========================================================================= */
export const HERITAGE_LEGACY: HeritageLegacyData = {
  historicalValue: {
    title: { vi: 'Giá Trị Lịch Sử – Nhân Văn', en: 'Historical & Humanist Values' },
    content: {
      vi: 'Ao Bà Om là chứng nhân sống động cho quá trình cộng cư, khai hoang lập ấp bền bỉ của ba dân tộc Kinh – Khmer – Hoa suốt nhiều thế kỷ trên vùng đất cát duyên hải Tây Nam Bộ.',
      en: 'Ao Ba Om stands as a living witness to centuries of peaceful coexistence, land reclamation, and solidarity among Kinh, Khmer, and Chinese communities.',
    },
    bullets: [
      { vi: 'Minh chứng cho công trình thủy lợi cổ đại thích ứng với biến đổi khí hậu và hạn mặn.', en: 'Evidence of ancient climate-adaptive hydraulic engineering combating drought and salinity.' },
      { vi: 'Địa chỉ đỏ căn cứ bí mật che chở phong trào cách mạng giải phóng dân tộc.', en: 'A revolutionary sanctuary sheltering independence movements through both wars.' },
      { vi: 'Tượng đài bất tử về quyền bình đẳng và trí tuệ mưu lược của phụ nữ Nam Bộ.', en: 'An enduring monument celebrating female empowerment, wisdom, and leadership.' },
    ],
  },
  architecturalArtisticValue: {
    title: { vi: 'Giá Trị Kiến Trúc & Cảnh Quan Tự Nhiên', en: 'Architectural & Landscape Splendor' },
    content: {
      vi: 'Sự giao thoa tuyệt mỹ giữa bàn tay kiến tạo của con người và sức sống mãnh liệt của thiên nhiên, tạo nên một cảnh quan độc nhất vô nhị trên toàn cõi Việt Nam.',
      en: 'A seamless symphony between human ingenuity and nature’s sculptural majesty, resulting in a unique biocultural landmark.',
    },
    bullets: [
      { vi: 'Mặt nước hồ vuông vức 300m x 500m phản chiếu bầu trời như một Baray thu nhỏ.', en: 'Rectangular water mirror (300m x 500m) functioning like an Angkorian Baray reservoir.' },
      { vi: 'Quần thể gần 500 cây sao dầu cổ thụ với mạng lưới rễ trồi cao 1-2m tạo hình vòm hang kỳ thú.', en: 'Nearly 500 giant dipterocarps with sculptural exposed root arches reaching 2m high.' },
      { vi: 'Ngôi chùa Chùa Âng hơn 1000 năm tuổi giữ nguyên nét chạm trổ Angkor kinh điển.', en: 'The millennium-old Ang Pagoda embodying classical Angkor architectural excellence.' },
    ],
  },
  culturalSpiritualValue: {
    title: { vi: 'Giá Trị Văn Hóa & Tâm Linh', en: 'Cultural & Spiritual Identity' },
    content: {
      vi: 'Trái tim tinh thần của hơn 300.000 đồng bào Khmer Trà Vinh, nơi hội tụ các giá trị thẩm mỹ, tín ngưỡng và phong tục tập quán thiêng liêng.',
      en: 'The spiritual heartbeat for over 300,000 Khmer residents, uniting religious devotion and living ancestral customs.',
    },
    bullets: [
      { vi: 'Cái nôi tổ chức đại lễ cúng trăng Ok Om Bok – Di sản phi vật thể Quốc gia.', en: 'The epicenter of Ok Om Bok Moon Worship, recognized as a National Intangible Heritage.' },
      { vi: 'Không gian nuôi dưỡng nghệ thuật dân gian: múa Rô-băm, dàn nhạc ngũ âm Pinpeat.', en: 'The living incubator of Ro-bam dance and sacred Pinpeat orchestral traditions.' },
      { vi: 'Biểu tượng của tình làng nghĩa xóm, lòng hiếu thảo và sự tri ân mẹ thiên nhiên.', en: 'A beacon of communal harmony, filial piety, and gratitude toward mother earth.' },
    ],
  },
  todayPresence: {
    title: { vi: 'Dấu Ấn Còn Lại Đến Hôm Nay: Nơi Này Còn Lại Điều Gì?', en: 'What Remains Today: Living Imprints' },
    content: {
      vi: 'Không phải là một di tích hóa thạch trong bảo tàng, Ao Bà Om hôm nay vẫn đang căng tràn sức sống trong từng nhịp thở của người dân Trà Vinh.',
      en: 'Far from a static museum relic, Ao Ba Om pulses with vibrant everyday life and living rituals.',
    },
    bullets: [
      { vi: 'Hồ nước ngọt mát lành vẫn tưới tắm tâm hồn và điều hòa khí hậu trong lành cho thành phố.', en: 'A cool freshwater reservoir still regulating city microclimate and soothing minds.' },
      { vi: 'Hàng ngàn người dân và du khách tản bộ, tập thể dục và tìm lại sự bình yên mỗi sáng sớm.', en: 'A beloved green sanctuary where thousands walk, exercise, and find peace at dawn.' },
      { vi: 'Đêm rằm tháng 10 hàng năm vẫn sáng rực hoa đăng và ngân vang tiếng reo hò đua ghe Ngo.', en: 'Still ignited annually by floating lanterns and exhilarating cheers of racing boats.' },
    ],
  },
  conservationAndContinuity: {
    title: { vi: 'Bảo Tồn & Tiếp Nối Thế Hệ Trẻ', en: 'Conservation & Youth Engagement' },
    content: {
      vi: 'Các dự án số hóa di sản, bảo tồn nguồn gen cây sao dầu cổ thụ và chương trình giáo dục di sản học đường đang được triển khai mạnh mẽ.',
      en: 'Cutting-edge digital preservation, genetic tree protection, and school heritage programs ensure perpetuity.',
    },
    achievements: [
      { vi: '100% cây cổ thụ quanh ao được gắn mã số theo dõi sức khỏe và gắn thẻ số hóa.', en: '100% of ancient trees cataloged and digitally monitored for botanical health.' },
      { vi: 'Quy chế bảo vệ nghiêm ngặt: Không rác thải nhựa một lần trong toàn bộ vùng lõi di tích.', en: 'Strict zero-single-use-plastic policy enforced across all protected zones.' },
      { vi: 'Thế hệ trẻ Khmer Trà Vinh kế thừa kỹ nghệ đúc chuông, đóng thuyền Ngo và diễn xướng.', en: 'Youth clubs actively inherit boatbuilding, brass casting, and classical music arts.' },
    ],
  },
  timelessMessage: {
    quote: {
      vi: 'Mỗi gốc cây sao dầu, từng giọt nước trong lòng Ao Bà Om là kết tinh mồ hôi, trí tuệ và sự hy sinh của các thế hệ tiền nhân. Di sản không phải là những gì đã ngủ yên trong quá khứ, mà là mạch nguồn nuôi dưỡng tâm hồn, nhắc nhở chúng ta sống biết ơn, gắn kết và tiếp nối những giá trị cao đẹp cho tương lai.',
      en: 'Every dipterocarp root and every drop of water in Ao Ba Om embodies the sweat, wisdom, and devotion of our ancestors. Heritage is not a relic trapped in the past, but a living spring nourishing our souls, reminding us to live with gratitude, solidarity, and stewardship for generations to come.',
    },
    author: {
      vi: 'Thông Điệp Di Sản Trà Vinh · Dành Cho Thế Hệ Hôm Nay & Mai Sau',
      en: 'Tra Vinh Heritage Legacy · For Generations Today and Tomorrow',
    },
    subtext: {
      vi: 'Di tích Lịch sử – Văn hóa Cấp Quốc gia Ao Bà Om · Trà Vinh, Việt Nam',
      en: 'Ao Ba Om National Historic & Cultural Heritage Monument · Tra Vinh, Vietnam',
    },
  },
};
