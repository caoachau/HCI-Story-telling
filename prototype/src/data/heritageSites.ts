export interface Artisan {
  name: string;
  age: number;
  role: string;
  village: string;
  quote: string;
  contribution: string;
  badge: string;
  avatarUrl: string;
}

export interface Artifact {
  id: string;
  name: string;
  englishName: string;
  era: string;
  material: string;
  dimension: string;
  accessionNo: string;
  description: string;
  culturalSignificance: string;
  geometryType: 'gong' | 'pottery' | 'loom' | 'drum' | 'boat';
  realImageUrl: string;
  realImageCaption: string;
}

export interface TourStop {
  order: number;
  title: string;
  timeMinutes: number;
  activity: string;
  ethicalGuideline: string;
  photoUrl: string;
}

export interface SiteChapter {
  id?: string;
  title: string;
  englishTitle: string;
  summary: string;
  englishSummary: string;
  details: string;
  englishDetails: string;
  quoteOrProverb?: string;
  photoUrl?: string;
  photoCaption?: string;
  camera?: {
    lng: number;
    lat: number;
    zoom: number;
    pitch: number;
    bearing: number;
  };
}

export interface TimelineEvent {
  year: string;
  label: string;
  description: string;
  imageUrl?: string;
}

export interface HeritageRoute {
  id: string;
  name: string;
  englishName: string;
  description: string;
  siteIds: string[];
  color: string;
}

export interface HeritageSite {
  id: string;
  name: string;
  englishName: string;
  category: 'Làng nghề truyền thống' | 'Di sản kiến trúc' | 'Danh thắng & Sinh thái' | 'Không gian diễn xướng';
  region: 'Bắc Bộ' | 'Tây Bắc' | 'Đông Bắc' | 'Miền Trung' | 'Tây Nguyên' | 'Đồng bằng Sông Cửu Long' | 'Nam Bộ';
  province: string;
  lat: number;
  lng: number;
  elevationMeters: number;
  establishedCentury: string;
  tagline: string;
  soundscapeType: 'temple_bell' | 'wooden_loom' | 'mountain_stream' | 'pottery_wheel' | 'bronze_gong';
  heroImage: string;
  heroImageCaption: string;
  panoramaUrl?: string;
  boundary?: [number, number][]; // GeoJSON polygon coordinates in [lng, lat]
  gallery: {
    url: string;
    caption: string;
    credit: string;
  }[];
  chapters: SiteChapter[];
  artisans: Artisan[];
  artifact: Artifact;
  tourStops: TourStop[];
  timeline?: TimelineEvent[];
  historicalComparison: {
    pastLabel: string;
    pastYear: string;
    pastDescription: string;
    pastImage: string;
    pastImageCaption: string;
    presentLabel: string;
    presentDescription: string;
    presentImage: string;
    presentImageCaption: string;
  };
  communityImpact: {
    householdsEngaged: number;
    youthApprentices: number;
    forestCoverOrPreservationRate: string;
    sustainablePledge: string;
  };
}

// WGS 84 positions match the Google Maps place pins. See
// docs/heritage-locations.md for place IDs, source links and the review date.
// Markers, flight/orbit targets, nearby stories and tile packs use these values.
export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'ao-ba-om',
    name: 'Danh thắng Ao Bà Om',
    englishName: 'Ba Om Pond Scenic Complex',
    category: 'Danh thắng & Sinh thái',
    region: 'Đồng bằng Sông Cửu Long',
    province: 'Khóm 4, Phường 8, TP. Trà Vinh',
    lat: 9.9176081,
    lng: 106.3040916,
    elevationMeters: 3,
    establishedCentury: 'Thế kỷ X – XII',
    tagline: 'Hồ thiêng phẳng lặng ngàn năm soi bóng đại ngàn sao dầu và huyền tích Ok Om Bok',
    soundscapeType: 'temple_bell',
    heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om,%20Tr%C3%A0%20Vinh.jpg',
    heroImageCaption: 'Mặt nước hồ Ao Bà Om trong xanh bao quanh bởi hàng trăm cây sao, dầu cổ thụ với bộ rễ trồi lên mặt đất kỳ vĩ',
    gallery: [
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om,%20Tr%C3%A0%20Vinh.jpg',
        caption: 'Hồ nước hình chữ nhật phẳng lặng với rặng cây dầu sao hàng trăm năm tuổi',
        credit: 'Wikimedia Commons / Ao Bà Om Trà Vinh'
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om.jpg',
        caption: 'Gốc cây cổ thụ rễ trồi tạo hình tự nhiên độc nhất vô nhị',
        credit: 'Wikimedia Commons / Cây Cổ Thụ Ao Bà Om'
      },
      {
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        caption: 'Không gian tĩnh mịch linh thiêng nơi đồng bào Khmer tụ hội trong đêm rằm Ok Om Bok',
        credit: 'Tư liệu Di sản Văn hóa Nam Bộ'
      }
    ],
    chapters: [
      {
        title: 'Huyền thoại cuộc thi đào ao của bà Om',
        englishTitle: 'The Legend of Lady Om Water Reservoir',
        summary: 'Truyền thuyết dân gian Khmer giải thích nguồn gốc hồ nước hình vuông kỳ vĩ giữa lòng thành phố Trà Vinh.',
        englishSummary: 'A Khmer folk legend explains the origin of the remarkable square pond at the heart of Trà Vinh.',
        details: 'Tương truyền ngày xưa, giữa phái nam và phái nữ trong vùng xảy ra tranh chấp về quyền cưới xin và chế độ hôn nhân. Để phân định công bằng, hai bên mở cuộc thi đào hồ chứa nước ngọt chống hạn: bên nào hoàn thành trước khi sao Mai mọc sẽ chiến thắng. Người phụ nữ tài trí tên Om (bà Om) đã dùng mưu khéo thắp đèn lồng lên ngọn cây cao khiến bên nam tưởng sao Mai đã mọc nên ngừng đào, trong khi phái nữ kiên trì đào xong một hồ nước hình chữ nhật vuông vức, giữ lại nguồn nước ngọt quý giá cho muôn đời.',
        englishDetails: 'Long ago, according to local legend, women and men in the area disagreed over marriage customs. To settle the dispute, they competed to dig a reservoir for fresh water during the dry season. The first side to finish before the Morning Star appeared would win. A clever woman named Om hung lanterns high in a tree, leading the men to believe dawn had arrived and stop digging. The women kept working and completed the square reservoir, preserving a precious source of fresh water for generations.',
        quoteOrProverb: 'Nước Ao Bà Om trong veo mát ngọt, soi lòng người thảo dạ kiên trung.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om,%20Tr%C3%A0%20Vinh.jpg',
        photoCaption: 'Mặt nước phẳng lặng như gương của hồ Ao Vuông Trà Vinh'
      },
      {
        title: 'Quần thể sao dầu cổ thụ rễ trồi kỳ thú',
        englishTitle: 'Centuries-old Dipterocarpus Sacred Forest',
        summary: 'Khu rừng nguyên sinh thu nhỏ với gần 500 cây sao, dầu cổ thụ từ 100 đến 300 năm tuổi.',
        englishSummary: 'A pocket of old-growth forest with nearly 500 dipterocarp trees, many between 100 and 300 years old.',
        details: 'Bao quanh hồ rộng hơn 300 mét, dài 500 mét là những đụn cát cổ được che phủ bởi tán cây dầu, cây sao đại thụ sum sê. Qua hàng trăm năm xói mòn tự nhiên của mưa gió, bộ rễ khổng lồ cuồn cuộn trồi lên khỏi mặt đất, uốn lượn tạo thành những hang hốc, ghế ngồi, vòm cổng thiên nhiên kỳ thú mà không bàn tay con người nào tạc nên được.',
        englishDetails: 'Ancient sand mounds surround the pond, which is over 300 metres wide and 500 metres long. Their dense canopy of dipterocarp trees has grown for generations. Centuries of rain and wind have exposed the trees’ enormous roots, which twist above the ground into hollows, natural seats and archways—forms no human hand could carve.',
        quoteOrProverb: 'Cội rễ đan xen như tình đoàn kết Kinh - Khmer gắn bó keo sơn.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om.jpg',
        photoCaption: 'Bộ rễ cây dầu đại thụ trồi lên mặt đất cao hơn đầu người'
      },
      {
        title: 'Trọng tâm lễ hội Ok Om Bok và cúng Trăng',
        englishTitle: 'Epicenter of Ok Om Bok Moon Worship Festival',
        summary: 'Di sản văn hóa phi vật thể quốc gia, nơi hội tụ hàng vạn đồng bào Khmer khắp Nam Bộ vào rằm tháng 10 âm lịch.',
        englishSummary: 'A national intangible cultural heritage gathering Khmer communities from across southern Vietnam for the October full moon.',
        details: 'Cứ vào đêm rằm tháng 10 âm lịch hàng năm, mặt nước Ao Bà Om lại rực sáng bởi hàng ngàn chiếc đèn hoa đăng và đèn gió bay bổng lên trời cao. Đồng bào Khmer tề tựu thực hiện nghi lễ Cúng Trăng tạ ơn thần linh đã ban mùa màng tốt tươi, đút cốm dẹp cho trẻ em cầu chúc tương lai no ấm, cùng các điệu múa Lâm-thôn rộn rã trong tiếng dàn ngũ âm du dương.',
        englishDetails: 'Each year on the full moon of the tenth lunar month, thousands of floating lanterns and sky lanterns illuminate the pond. Khmer families gather for the Moon Worship ceremony, giving thanks for a good harvest. They share cốm dẹp with children as a wish for a prosperous future, while Lam-thon dances and the melodies of the pinpeat ensemble fill the night.',
        quoteOrProverb: 'Trăng rằm soi bóng ao thiêng, cốm dẹp thơm nồng tình nghĩa bản địa.'
      }
    ],
    artisans: [
      {
        name: 'Thạch Ken',
        age: 72,
        role: 'Nghệ nhân kể sử thi & Người giữ rừng sao dầu cổ thụ',
        village: 'Khóm 4, Phường 8, TP. Trà Vinh',
        quote: 'Mỗi gốc cây quanh bờ ao đều có linh hồn và ký ức của tiền nhân gìn giữ nguồn nước ngọt cho hậu thế.',
        contribution: 'Hơn 40 năm gìn giữ bảo vệ rừng cây di sản quanh Ao Bà Om và truyền dạy truyện cổ Khmer cho thanh niên.',
        badge: 'Người Gác Ký Ức Ao Vuông',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
      }
    ],
    artifact: {
      id: 'thuyen-ngo-ao-ba-om',
      name: 'Thuyền Ngo Truyền Thống Đua Lễ Ok Om Bok',
      englishName: 'Sacred Ooc Om Bok Racing Ngo Boat',
      era: 'Di sản thế kỷ XIX – XX',
      material: 'Gỗ sao nguyên thân, sơn son thếp họa tiết rồng rắn Naga',
      dimension: 'Dài 28m · Rộng 1.2m · 50 tay chèo',
      accessionNo: 'TV-AOB-2024-001',
      description: 'Chiếc thuyền độc mộc truyền thống của người Khmer Nam Bộ được đóng từ một thân cây sao cổ thụ, chạm khắc hoa văn rồng biển Neak và lượn sóng tinh xảo.',
      culturalSignificance: 'Thuyền Ngo được coi là bảo vật thiêng liêng của phum sóc, tượng trưng cho sức mạnh tập thể và lòng tôn kính thần nước.',
      geometryType: 'boat',
      realImageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      realImageCaption: 'Mũi thuyền Ngo chạm trổ thần thú bảo hộ phum sóc trong hội đua Ok Om Bok'
    },
    tourStops: [
      {
        order: 1,
        title: 'Chiêm bái ngắm bình minh trên mặt hồ Ao Vuông',
        timeMinutes: 40,
        activity: 'Tản bộ tĩnh lặng dưới vòm đại ngàn sao dầu, lắng nghe tiếng chuông chùa sớm ngân vang từ Chùa Âng.',
        ethicalGuideline: 'Giữ yên lặng nơi chốn linh nghiêm, không khắc chữ lên thân và rễ cây cổ thụ.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om,%20Tr%C3%A0%20Vinh.jpg'
      },
      {
        order: 2,
        title: 'Khám phá kiến trúc rễ trồi cổ thụ',
        timeMinutes: 35,
        activity: 'Tìm hiểu hệ sinh thái đất cát giồng duyên hải cổ và chụp ảnh tư liệu kiến trúc thiên nhiên rễ trồi.',
        ethicalGuideline: 'Không trèo leo làm tổn hại các nhánh rễ non của cây đại thụ.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om.jpg'
      }
    ],
    historicalComparison: {
      pastLabel: 'Ảnh tư liệu thời Pháp thuộc (1920)',
      pastYear: '1920',
      pastDescription: 'Khu vực Ao Vuông còn là vùng đầm cát hoang sơ bao bọc bởi rừng rậm, nơi các sư tăng và đồng bào Khmer dựng chòi tu thiền.',
      pastImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om.jpg',
      pastImageCaption: 'Ao Bà Om đầu thế kỷ XX với dòng nước tự nhiên trong vắt',
      presentLabel: 'Di tích danh thắng cấp quốc gia (Hiện nay)',
      presentDescription: 'Công viên di sản văn hóa sinh thái xanh sạch đẹp được bảo tồn nghiêm ngặt, trung tâm kết nối cộng đồng văn hóa Kinh - Khmer - Hoa.',
      presentImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om,%20Tr%C3%A0%20Vinh.jpg',
      presentImageCaption: 'Không gian văn hóa cộng đồng đón tiếp hàng chục ngàn du khách trong các dịp lễ hội lớn'
    },
    communityImpact: {
      householdsEngaged: 140,
      youthApprentices: 35,
      forestCoverOrPreservationRate: '100% diện tích rừng cổ thụ được kiểm kê số hóa',
      sustainablePledge: 'Bảo vệ nguồn nước ngầm, cấm hoàn toàn rác thải nhựa một lần trong toàn bộ vành đai bảo vệ danh thắng Ao Bà Om.'
    }
  },
  {
    id: 'chua-ang',
    name: 'Chùa Âng (Wat Angkor Rajaborey)',
    englishName: 'Wat Angkor Rajaborey (Ang Pagoda)',
    category: 'Di sản kiến trúc',
    region: 'Đồng bằng Sông Cửu Long',
    province: 'Đối diện Ao Bà Om, Phường 8, TP. Trà Vinh',
    lat: 9.9157942,
    lng: 106.3036199,
    elevationMeters: 4,
    establishedCentury: 'Năm 990 (Thế kỷ X)',
    tagline: 'Cổ tự ngàn năm Nam tông Khmer rực rỡ tượng thần rắn Naga và chim thần Krud',
    soundscapeType: 'temple_bell',
    heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20%C3%82ng.jpg',
    heroImageCaption: 'Chính điện uy nghiêm lộng lẫy của Chùa Âng - ngôi chùa Khmer cổ kính bậc nhất vùng đồng bằng sông Cửu Long',
    gallery: [
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20%C3%82ng.jpg',
        caption: 'Mái chùa nhiều tầng vút cong với tượng rồng đao phong cách Angkor cổ truyền',
        credit: 'Wikimedia Commons / Chùa Âng Trà Vinh'
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%B9a%20%C3%82ng.jpg',
        caption: 'Tượng chim thần Krud nâng đỡ diềm mái chính điện bằng vẻ uy dũng',
        credit: 'Wikimedia Commons / Kiến trúc Chùa Âng'
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/C%E1%BB%95ng%20ch%C3%B9a%20%C3%82ng.jpg',
        caption: 'Cổng chùa đắp nổi hình rắn thần Naga chín đầu bảo hộ cõi Phật',
        credit: 'Wikimedia Commons / Cổng Chùa Âng'
      }
    ],
    chapters: [
      {
        title: 'Ngôi cổ tự Phật giáo Nam tông hơn một thiên niên kỷ',
        englishTitle: 'A Millennial Theravada Buddhist Citadel',
        summary: 'Được khai sơn từ năm 990, Chùa Âng là trung tâm tu học và thực hành Phật pháp cổ xưa nhất Trà Vinh.',
        englishSummary: 'Founded around 990, Ang Pagoda is one of Trà Vinh’s oldest centres for Theravada Buddhist learning and practice.',
        details: 'Tên gốc tiếng Phạn - Khmer là Wat Angkor Rajaborey (nghĩa là Chùa Kinh Đô Cổ Tháp Hoàng Gia), được xây dựng từ cuối thế kỷ X trên một giồng cát cao ráo ngay cạnh danh thắng Ao Bà Om. Ngôi chùa trải qua nhiều lần trùng tu lớn nhưng vẫn gìn giữ vẹn nguyên cấu trúc kiến trúc đền tháp Phật giáo Nam tông truyền thống, là trung tâm sinh hoạt tôn giáo, giáo dục luân lý và bảo tồn chữ viết Khmer cho nhiều thế hệ con em phum sóc.',
        englishDetails: 'Its Sanskrit-Khmer name, Wat Angkor Rajaborey, means “Royal City of the Ancient Stupa.” The pagoda was built in the late tenth century on a raised sand ridge beside scenic Ao Bà Om. Although it has been restored several times, it retains the traditional architecture of southern Theravada Buddhism. For generations, it has served as a place of worship, moral education and preservation of Khmer writing for local communities.',
        quoteOrProverb: 'Chuông Chùa Âng gióng hồi thanh thoát, xua tan muộn phiền cõi nhân sinh.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20%C3%82ng.jpg',
        photoCaption: 'Mái ngói ba tầng cong vút rực sắc vàng son đặc trưng kiến trúc Khmer'
      },
      {
        title: 'Mỹ thuật điêu khắc thần thoại Krud và rắn Naga',
        englishTitle: 'Mythological Sculptures of Krud and Naga',
        summary: 'Hệ thống hoa văn chạm trổ, phù điêu thần thoại Ấn Độ hóa hòa quyện cùng giáo lý từ bi của Đức Thích Ca.',
        englishSummary: 'Intricate carvings blend Indian-influenced mythology with the teachings of compassion associated with the Buddha.',
        details: 'Điểm đặc sắc tột bậc của Chùa Âng nằm ở các hàng cột gỗ lim chạm trổ tượng chim thần Krud (Garuda) dang cánh nâng đỡ mái vòm hiên chùa, tượng đầu tiên nữ Kinnari kiều diễm, và diềm mái cong vút hóa thân thành đuôi rắn thần Naga rực rỡ. Bên trong chính điện bài trí một pho tượng Phật Thích Ca lớn ngự trên tòa sen uy nghiêm, xung quanh là hơn 50 bức bích họa vẽ bằng màu tự nhiên mô tả cuộc đời Đức Phật từ lúc đản sinh đến khi nhập Niết bàn.',
        englishDetails: 'The pagoda is known for dark hardwood columns carved with Krud (Garuda) birds whose outstretched wings appear to support the veranda, graceful Kinnari figures, and roof edges that rise like the tails of the Naga serpent. Inside the main hall, a large statue of Shakyamuni Buddha sits on a lotus throne. More than 50 murals, painted with natural pigments, depict the Buddha’s life from birth to nirvana.',
        quoteOrProverb: 'Từng nét chạm, mũi đục đều gửi gắm ước vọng quốc thái dân an.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%B9a%20%C3%82ng.jpg',
        photoCaption: 'Tượng chim thần Krud nửa người nửa chim trên các đầu cột mái'
      }
    ],
    artisans: [
      {
        name: 'Đại đức Thạch Sa Vane',
        age: 64,
        role: 'Sư cả trụ trì & Nhà nghiên cứu cổ thư kinh lá buông',
        village: 'Khóm 4, Phường 8, TP. Trà Vinh',
        quote: 'Ngôi chùa không chỉ là chốn thờ phụng, mà là trường học dạy đạo làm người, giữ gìn tiếng nói, chữ viết và đức hạnh của dân tộc.',
        contribution: 'Chủ trì việc bảo tồn hàng trăm bản kinh lá buông cổ và truyền dạy tiếng Pali - Khmer cho hàng ngàn tăng sinh.',
        badge: 'Bậc Thầy Trí Huệ Cổ Tự',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
      }
    ],
    artifact: {
      id: 'cong-dong-chua-ang',
      name: 'Dàn Cồng Đồng Ngũ Âm (Kong Vong Toch)',
      englishName: 'Khmer Classical Bronze Gong Circle',
      era: 'Đầu thế kỷ XX',
      material: 'Đồng thau nguyên chất gò tay, giá đỡ gỗ mun khảm ốc xà cừ',
      dimension: 'Đường kính khung tròn 1.4m · 16 núm chiêng đồng',
      accessionNo: 'TV-ANG-2024-002',
      description: 'Dàn cồng 16 quả xếp theo hình bán nguyệt phát ra âm thanh linh diệu trong các nghi thức đại lễ Chôl Chnăm Thmây và Sêne Đôlta.',
      culturalSignificance: 'Âm sắc trầm bổng của cồng chiêng ngũ âm kết nối con người với cõi chư thiên và trời đất.',
      geometryType: 'gong',
      realImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20%C3%82ng.jpg',
      realImageCaption: 'Dàn cồng ngũ âm cổ đặt tại tiền đường chính điện Chùa Âng'
    },
    tourStops: [
      {
        order: 1,
        title: 'Chiêm ngưỡng cổng chùa và điêu khắc phù điêu Naga',
        timeMinutes: 25,
        activity: 'Tìm hiểu triết lý mỹ thuật hộ pháp trong Phật giáo Nam tông Khmer.',
        ethicalGuideline: 'Ăn mặc trang nghiêm, cởi mũ nón và giày dép trước khi bước vào chính điện.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/C%E1%BB%95ng%20ch%C3%B9a%20%C3%82ng.jpg'
      },
      {
        order: 2,
        title: 'Học thiền định và đàm đạo triết lý sống thiện lành',
        timeMinutes: 45,
        activity: 'Gặp gỡ sư tăng, lắng nghe thuyết giảng về lòng từ bi và thực hành tĩnh tâm dưới bóng bồ đề.',
        ethicalGuideline: 'Không chạm tay vào hiện vật thờ tự và giữ thái độ cung kính.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20%C3%82ng.jpg'
      }
    ],
    historicalComparison: {
      pastLabel: 'Bản vẽ khảo cứu Viện Viễn Đông Bác Cổ (1938)',
      pastYear: '1938',
      pastDescription: 'Chùa Âng được xếp hạng là công trình mỹ thuật kiến trúc tiêu biểu của vùng đồng bằng Mekong cổ xưa.',
      pastImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%B9a%20%C3%82ng.jpg',
      pastImageCaption: 'Bản ghi hình tư liệu đầu thế kỷ XX của di tích quốc gia Chùa Âng',
      presentLabel: 'Di tích Lịch sử - Văn hóa cấp Quốc gia (Hiện nay)',
      presentDescription: 'Ngôi chùa được trùng tu khoa học, hệ thống bích họa được bảo tồn nguyên trạng bằng công nghệ bảo tàng hiện đại.',
      presentImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20%C3%82ng.jpg',
      presentImageCaption: 'Chùa Âng rực sáng uy nghi chào đón khách hành hương bốn phương'
    },
    communityImpact: {
      householdsEngaged: 180,
      youthApprentices: 60,
      forestCoverOrPreservationRate: '100% cổ tự và cây bồ đề quý được bảo tồn',
      sustainablePledge: 'Duy trì các lớp học chữ Khmer và nhạc ngũ âm miễn phí cho thiếu nhi các phum sóc lân cận.'
    }
  },
  {
    id: 'bao-tang-khmer',
    name: 'Bảo tàng Văn hóa Khmer Trà Vinh',
    englishName: 'Khmer Cultural Heritage Museum',
    category: 'Di sản kiến trúc',
    region: 'Đồng bằng Sông Cửu Long',
    province: 'Khóm 4, Phường 8, TP. Trà Vinh',
    lat: 9.9161668,
    lng: 106.3049936,
    elevationMeters: 4,
    establishedCentury: 'Năm 1995',
    tagline: 'Kho báu di sản sống bảo tồn hơn 800 hiện vật tâm linh, văn hóa và nghệ thuật Khmer',
    soundscapeType: 'temple_bell',
    heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20Khmer%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
    heroImageCaption: 'Kiến trúc bảo tàng mang phong cách cung đình đền tháp Khmer truyền thống rực rỡ bên hàng sao xanh',
    gallery: [
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20Khmer%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
        caption: 'Mặt tiền tòa nhà Bảo tàng Văn hóa Khmer Trà Vinh uy nghi trong quần thể di tích Phường 8',
        credit: 'Wikimedia Commons / Bảo tàng Khmer Trà Vinh'
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20v%C4%83n%20h%C3%B3a%20d%C3%A2n%20t%E1%BB%99c%20Khmer%20t%E1%BB%89nh%20Tr%C3%A0%20Vinh.jpg',
        caption: 'Không gian trưng bày trang phục truyền thống và hiện vật đời sống cư dân Khmer',
        credit: 'Wikimedia Commons / Hiện vật Bảo tàng Khmer'
      },
      {
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        caption: 'Bộ sưu tập nhạc cụ ngũ âm và mặt nạ tuồng cổ Ro-bam',
        credit: 'Tư liệu Sở VHTTDL Trà Vinh'
      }
    ],
    chapters: [
      {
        title: 'Trung tâm nghiên cứu văn hóa dân tộc Khmer Nam Bộ',
        englishTitle: 'Epicenter of Southern Khmer Anthropological Research',
        summary: 'Một trong hai bảo tàng văn hóa dân tộc Khmer quy mô và toàn diện nhất tại Việt Nam.',
        englishSummary: 'One of Vietnam’s largest and most comprehensive museums dedicated to Khmer culture.',
        details: 'Khánh thành năm 1995, bảo tàng tọa lạc trên khuôn viên rợp bóng cây xanh đối diện Chùa Âng và Ao Bà Om. Tòa nhà hai tầng được thiết kế theo mô thức kiến trúc truyền thống Khmer kết hợp với công năng bảo tàng quốc tế hiện đại. Nơi đây hiện lưu giữ, bảo quản và diễn giải hơn 800 hiện vật, hình ảnh và tài liệu quý giá phản ánh toàn diện đời sống tâm linh, lao động sản xuất, phong tục tập quán và nghệ thuật biểu diễn của hơn 300.000 đồng bào Khmer Trà Vinh.',
        englishDetails: 'Opened in 1995, the museum stands in a leafy compound opposite Ang Pagoda and Ao Bà Om. Its two-storey building combines traditional Khmer architectural forms with the functions of a modern museum. More than 800 objects, photographs and documents are preserved here, documenting the spiritual life, livelihoods, customs and performing arts of Trà Vinh’s Khmer community, which numbers over 300,000 people.',
        quoteOrProverb: 'Giữ hiện vật là giữ căn cốt, trao ký ức cho thế hệ mai sau.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20Khmer%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
        photoCaption: 'Toàn cảnh tòa nhà bảo tàng với các tầng mái vuốt cao trang nhã'
      },
      {
        title: 'Bộ sưu tập kinh lá buông và nhạc cụ ngũ âm',
        englishTitle: 'Sacred Traing Palm-Leaf Manuscripts & Pinpeat Orchestra',
        summary: 'Kho báu quốc gia lưu giữ những bản kinh Traing cổ khắc tay và dàn nhạc lễ cung đình.',
        englishSummary: 'A national collection of hand-inscribed Traing manuscripts and ceremonial Pinpeat instruments.',
        details: 'Tại tầng hai của bảo tàng, du khách được tận mắt chứng kiến những bộ kinh lá buông (Satra Traing) hàng trăm năm tuổi được khắc chữ viết Khmer cổ bằng kim nhọn và xát mực than chống mối mọt. Bên cạnh đó là phòng trưng bày trọn vẹn dàn nhạc ngũ âm (Pinpeat), trống Chhay-dăm, các bộ trang phục cô dâu chú rể lộng lẫy kết cườm sa-tanh vàng rực và mặt nạ thần Chằn (Yeak) trong kịch múa dân gian.',
        englishDetails: 'On the museum’s second floor, visitors can see centuries-old Satra Traing palm-leaf manuscripts, inscribed in ancient Khmer with a sharp stylus and rubbed with charcoal to deter insects. Nearby, a gallery presents the Pinpeat ensemble, Chhay-dam drums, richly beaded wedding costumes and Yeak ogre masks used in folk dance theatre.',
        quoteOrProverb: 'Nét chữ trên lá buông dẫu trăm năm phong trần vẫn vẹn nguyên chân lý.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20v%C4%83n%20h%C3%B3a%20d%C3%A2n%20t%E1%BB%99c%20Khmer%20t%E1%BB%89nh%20Tr%C3%A0%20Vinh.jpg',
        photoCaption: 'Tủ kính bảo tồn các hiện vật trang phục và công cụ lao động cổ'
      }
    ],
    artisans: [
      {
        name: 'Sơn Ngọc Ánh',
        age: 58,
        role: 'Chuyên gia giám tuyển & Nghệ nhân phục chế mặt nạ Yeak',
        village: 'Phường 8, TP. Trà Vinh',
        quote: 'Mỗi hiện vật ở bảo tàng đều mang hơi thở của một kiếp người, một phum sóc và một trang sử hào hùng.',
        contribution: 'Hơn 30 năm nghiên cứu, sưu tầm và thuyết minh diễn giải di sản văn hóa dân tộc Khmer cho du khách trong và ngoài nước.',
        badge: 'Người Thổi Hồn Di Sản',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
      }
    ],
    artifact: {
      id: 'trong-chhay-dam',
      name: 'Trống Chhay-dăm Lễ Hội Truyền Thống',
      englishName: 'Sacred Chhay-dam Festival Drum',
      era: 'Thế kỷ XX',
      material: 'Gỗ mít già khoét rỗng, bịt da trăn và da trâu thuộc thảo mộc',
      dimension: 'Cao 1.1m · Đường kính mặt 0.35m',
      accessionNo: 'TV-BTM-2024-003',
      description: 'Chiếc trống có dây đeo chéo qua vai dùng trong điệu múa trống Chhay-dăm dân gian hào hùng, tượng trưng cho tinh thần thượng võ và niềm vui mùa vụ.',
      culturalSignificance: 'Múa trống Chhay-dăm được công nhận là Di sản văn hóa phi vật thể quốc gia.',
      geometryType: 'drum',
      realImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20Khmer%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
      realImageCaption: 'Trống Chhay-dăm múa hội rộn ràng sắc màu phum sóc'
    },
    tourStops: [
      {
        order: 1,
        title: 'Xem phim tư liệu và nghe thuyết minh tổng quan văn hóa Khmer',
        timeMinutes: 30,
        activity: 'Tìm hiểu nguồn gốc tộc người, phong tục vòng đời từ sinh đẻ, cưới xin đến tang lễ.',
        ethicalGuideline: 'Không chạm tay vào hiện vật trong tủ kính bảo tồn.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20Khmer%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg'
      },
      {
        order: 2,
        title: 'Trải nghiệm đánh thử nhạc cụ ngũ âm và mặc trang phục truyền thống',
        timeMinutes: 40,
        activity: 'Thực hành gõ trống Chhay-dăm và chụp ảnh lưu niệm cùng nghệ nhân bản địa.',
        ethicalGuideline: 'Thao tác nhẹ nhàng theo hướng dẫn của chuyên gia bảo tàng.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20v%C4%83n%20h%C3%B3a%20d%C3%A2n%20t%E1%BB%99c%20Khmer%20t%E1%BB%89nh%20Tr%C3%A0%20Vinh.jpg'
      }
    ],
    historicalComparison: {
      pastLabel: 'Kho tài liệu ban đầu (1995)',
      pastYear: '1995',
      pastDescription: 'Bộ sưu tập khởi đầu với 200 hiện vật do các chùa và nhân dân tự nguyện hiến tặng.',
      pastImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20Khmer%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
      pastImageCaption: 'Bảo tàng Khmer trong những ngày đầu khánh thành',
      presentLabel: 'Bảo tàng số hóa hiện đại (Hiện nay)',
      presentDescription: '100% hiện vật được số hóa 3D, thuyết minh đa ngôn ngữ qua mã QR và tương tác màn hình cảm ứng.',
      presentImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/B%E1%BA%A3o%20t%C3%A0ng%20Khmer%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
      presentImageCaption: 'Không gian trưng bày số kết nối bảo tàng học quốc tế'
    },
    communityImpact: {
      householdsEngaged: 95,
      youthApprentices: 45,
      forestCoverOrPreservationRate: '100% hiện vật được số hóa định danh bảo tàng',
      sustainablePledge: 'Hợp tác với các trường học địa phương tổ chức miễn phí tour giáo dục di sản cho học sinh mỗi tuần.'
    }
  },
  {
    id: 'chua-hang',
    name: 'Chùa Hang (Wat Kompongnicrôth)',
    englishName: 'Hang Pagoda (Wat Kompongnicrôth)',
    category: 'Làng nghề truyền thống',
    region: 'Đồng bằng Sông Cửu Long',
    province: 'Khóm 4, TT. Châu Thành, Huyện Châu Thành, Trà Vinh',
    lat: 9.8870578,
    lng: 106.3450222,
    elevationMeters: 3,
    establishedCentury: 'Năm 1637 (Thế kỷ XVII)',
    tagline: 'Cổng vòm hang cổ tịch, rặng cây cổ thụ trú ngụ đàn chim và xưởng điêu khắc rễ gỗ',
    soundscapeType: 'temple_bell',
    heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20Hang%20(Tr%C3%A0%20Vinh).jpg',
    heroImageCaption: 'Chính điện rực rỡ và cổng vòm hình hang động độc nhất vô nhị của Chùa Hang giữa rừng cây xanh ngút ngàn',
    gallery: [
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20Hang%20(Tr%C3%A0%20Vinh).jpg',
        caption: 'Chính điện uy nghi tráng lệ soi bóng trong khuôn viên tĩnh mịch',
        credit: 'Wikimedia Commons / Chùa Hang Trà Vinh'
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om.jpg',
        caption: 'Khuôn viên rừng cây cổ thụ nguyên sinh nơi hàng vạn cánh chim về làm tổ',
        credit: 'Tư liệu Du lịch Trà Vinh'
      },
      {
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        caption: 'Nghệ nhân khéo léo biến những gốc rễ cây khô cằn thành tác phẩm điêu khắc nghệ thuật sống động',
        credit: 'Tư liệu Làng Nghề Trà Vinh'
      }
    ],
    chapters: [
      {
        title: 'Cổng chùa hình vòm hang độc đáo và vườn chim tự nhiên',
        englishTitle: 'The Cave-like Gateway and Sanctuaries of Birds',
        summary: 'Cổng tam quan xây dựng như một hang đá dài sâu hun hút dẫn lối vào cõi thiền thanh tịnh.',
        englishSummary: 'A long, cave-like triple gateway leads visitors into the pagoda’s quiet grounds and bird sanctuary.',
        details: 'Wat Kompongnicrôth có tên dân gian là Chùa Hang do cổng phụ của chùa được thiết kế vòm tròn xây bằng gạch kiên cố với bề dày lên đến 12 mét, trông từ xa như một hang động tự nhiên ăn sâu vào lòng rừng rậm. Bước qua cổng hang, du khách như lạc vào một thế giới hoàn toàn khác: khuôn viên rộng hơn 2 héc-ta được bao bọc bởi hàng ngàn cây sao, dầu, tre cổ thụ. Đây là nơi trú ngụ an toàn của hàng vạn con chim, cò, vạc hoang dã ríu rít suốt ngày đêm.',
        englishDetails: 'Wat Kompongnicrôth is popularly known as Hang Pagoda because its massive brick side gate forms a rounded passage, up to 12 metres thick, resembling a natural cave deep in the forest. Beyond it, the atmosphere changes: more than two hectares of grounds are shaded by dipterocarp trees and old bamboo. The sanctuary provides a safe home for tens of thousands of wild birds, including egrets and herons.',
        quoteOrProverb: 'Đất lành chim đậu, cổng hang dẫn lối thiện tâm.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20Hang%20(Tr%C3%A0%20Vinh).jpg',
        photoCaption: 'Kiến trúc tháp chùa vươn lên giữa vòm cây xanh đại thụ'
      },
      {
        title: 'Xưởng điêu khắc gỗ nghệ nhân truyền đời',
        englishTitle: 'Master Woodcarving Workshop from Living Roots',
        summary: 'Nơi khai sinh dòng tranh tượng điêu khắc từ rễ cây cổ thụ nổi tiếng khắp cả nước.',
        englishSummary: 'A renowned workshop where artisans transform fallen tree roots into sculptural works.',
        details: 'Điểm đặc biệt có một không hai của Chùa Hang là xưởng điêu khắc gỗ mỹ nghệ do cố sư cả Thạch Suông sáng lập từ năm 1980. Tận dụng những gốc rễ cây sao dầu bị đổ ngã sau bão gió, các sư tăng và thanh niên Khmer trong làng đã tỉ mẩn đục đẽo, biến những khúc gỗ xù xì thành các tác phẩm điêu khắc 12 con giáp, chim muông, muông thú và tượng danh nhân với đường nét biểu cảm xuất thần, tạo việc làm và nguồn sống bền vững cho hàng trăm nghệ nhân trẻ.',
        englishDetails: 'A distinctive feature of Hang Pagoda is its woodcraft workshop, founded in 1980 by the late head monk Thạch Suông. Monks and Khmer youth make use of dipterocarp roots brought down by storms, carefully carving rough wood into expressive works depicting the twelve zodiac animals, birds, wildlife and notable figures. The craft has created a sustainable livelihood for hundreds of young artisans.',
        quoteOrProverb: 'Rễ cây mục hóa thành rồng phượng, bàn tay tài hoa đắp nặn tương lai.'
      }
    ],
    artisans: [
      {
        name: 'Sư cả Thạch Suông',
        age: 68,
        role: 'Nghệ nhân bàn tay vàng & Sư trụ trì khai sáng nghề điêu khắc rễ cây',
        village: 'Khóm 4, TT. Châu Thành, Trà Vinh',
        quote: 'Mỗi khúc gỗ mục đều có hình hài sẵn của trời đất, người thợ điêu khắc chỉ cần lắng nghe và gạt bỏ phần thừa để vẻ đẹp hiện ra.',
        contribution: 'Đào tạo nghề điêu khắc gỗ nghệ thuật miễn phí cho hơn 300 thanh niên nghèo trong tỉnh Trà Vinh.',
        badge: 'Bàn Tay Vàng Điêu Khắc Rễ Cây',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
      }
    ],
    artifact: {
      id: 'tuong-go-chua-hang',
      name: 'Tượng Chim Muông Điêu Khắc Rễ Cây Sao Cổ',
      englishName: 'Masterpiece Wood Carving from Ancient Dipterocarpus Root',
      era: 'Năm 1992',
      material: 'Rễ cây sao dầu tự nhiên trên 150 năm tuổi đánh bóng mộc',
      dimension: 'Cao 1.8m · Rộng 0.9m',
      accessionNo: 'TV-CH-2024-004',
      description: 'Tác phẩm đại bàng và bầy muông thú được tạo hình nương theo từng đường thớ và hốc rễ cây tự nhiên, không chắp vá ghép nối.',
      culturalSignificance: 'Biểu tượng cho tinh thần lao động sáng tạo và sự hài hòa giữa tôn giáo với nghệ thuật dân gian.',
      geometryType: 'pottery',
      realImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20Hang%20(Tr%C3%A0%20Vinh).jpg',
      realImageCaption: 'Tác phẩm điêu khắc rễ gỗ tinh xảo trưng bày tại tiền đường Chùa Hang'
    },
    tourStops: [
      {
        order: 1,
        title: 'Băng qua cổng hang cổ tích ngắm đàn chim về tổ',
        timeMinutes: 30,
        activity: 'Đi dạo trong đường vòm hang mát rượi, ngắm đàn chim vạc bay rợp trời lúc hoàng hôn buông xuống.',
        ethicalGuideline: 'Tuyệt đối không gây ồn ào làm hoảng sợ chim muông đang ấp trứng.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20Hang%20(Tr%C3%A0%20Vinh).jpg'
      },
      {
        order: 2,
        title: 'Tham quan xưởng điêu khắc rễ cây và học chạm khắc cơ bản',
        timeMinutes: 45,
        activity: 'Tận mắt xem các nghệ nhân Khmer cầm đục trổ hoa văn trên sớ gỗ và tự tay gọt một món quà lưu niệm nhỏ.',
        ethicalGuideline: 'Tuân thủ các quy tắc an toàn lao động khi sử dụng dụng cụ đục đẽo.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20Hang%20(Tr%C3%A0%20Vinh).jpg'
      }
    ],
    historicalComparison: {
      pastLabel: 'Cổng chùa thời kỳ kháng chiến (1965)',
      pastYear: '1965',
      pastDescription: 'Cổng vòm hang kiên cố từng là nơi che chở, nuôi giấu cán bộ cách mạng và người dân khỏi bom đạn chiến tranh.',
      pastImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20Hang%20(Tr%C3%A0%20Vinh).jpg',
      pastImageCaption: 'Cổng hang trầm mặc giữa tán cây rừng cổ thụ bom đạn không suy chuyển',
      presentLabel: 'Điểm du lịch văn hóa & Làng nghề tiêu biểu (Hiện nay)',
      presentDescription: 'Ngôi chùa được công nhận là di tích văn hóa lịch sử, trung tâm đào tạo nghề mộc mỹ nghệ truyền thống.',
      presentImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%ADnh%20%C4%91i%E1%BB%87n%20ch%C3%B9a%20Hang%20(Tr%C3%A0%20Vinh).jpg',
      presentImageCaption: 'Khuôn viên chùa thanh bình ngập tràn tiếng chim và tiếng đục gỗ reo vui'
    },
    communityImpact: {
      householdsEngaged: 110,
      youthApprentices: 50,
      forestCoverOrPreservationRate: 'Bảo vệ nghiêm ngặt 100% diện tích rừng chim sinh thái',
      sustainablePledge: 'Chỉ sử dụng gốc rễ cây chết tự nhiên hoặc cây gãy đổ, kiên quyết không chặt phá cây xanh sống.'
    }
  },
  {
    id: 'den-tho-bac',
    name: 'Đền thờ Bác Hồ tại Trà Vinh',
    englishName: 'President Ho Chi Minh Temple in Tra Vinh',
    category: 'Di sản kiến trúc',
    region: 'Đồng bằng Sông Cửu Long',
    province: 'Ấp Vĩnh Hội, Xã Long Đức, TP. Trà Vinh',
    lat: 9.9837403,
    lng: 106.3301340,
    elevationMeters: 3,
    establishedCentury: 'Năm 1970',
    tagline: 'Biểu tượng son sắt kiên cường của nhân dân miền Nam hướng về vị cha già dân tộc',
    soundscapeType: 'temple_bell',
    heroImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C4%90%E1%BB%81n%20th%E1%BB%9D%20B%C3%A1c%20H%E1%BB%93%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
    heroImageCaption: 'Ngôi đền mái ngói trang nghiêm bên hồ sen ngát hương tại xã Long Đức, thành phố Trà Vinh',
    gallery: [
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C4%90%E1%BB%81n%20th%E1%BB%9D%20B%C3%A1c%20H%E1%BB%93%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
        caption: 'Mặt tiền Đền thờ Bác Hồ với kiến trúc nhà rường truyền thống Nam Bộ',
        credit: 'Wikimedia Commons / Đền thờ Bác Trà Vinh'
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20c%C3%A1%20trong%20Khu%20di%20t%C3%ADch%20%C4%90%E1%BB%81n%20th%E1%BB%9D%20Ch%E1%BB%A7%20t%E1%BB%8Bch%20H%E1%BB%93%20Ch%C3%AD%20Minh.jpg',
        caption: 'Ao cá Bác Hồ và rặng tre xanh ngắt gợi nhớ hình bóng Phủ Chủ tịch tại Hà Nội',
        credit: 'Wikimedia Commons / Ao Cá Khu Di Tích Long Đức'
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Khuôn viên công viên lịch sử rợp bóng dừa và hàng hoa đại trang trọng',
        credit: 'Tư liệu Khu Di Tích Long Đức'
      }
    ],
    chapters: [
      {
        title: 'Kỳ tích xây đền trong tầm hỏa lực pháo địch',
        englishTitle: 'The Feat of Constructing the Temple under Enemy Fire',
        summary: 'Nhân dân Long Đức kiên trung xây dựng đền thờ Bác ngay giữa lòng vùng giải phóng bị bao vây năm 1970.',
        englishSummary: 'In 1970, Long Đức residents built a temple to President Hồ Chí Minh in a liberated area under siege.',
        details: 'Sau khi Chủ tịch Hồ Chí Minh qua đời vào tháng 9/1969, Đảng bộ và quân dân xã Long Đức đã biến nỗi đau thương thành hành động cách mạng, quyết tâm dựng đền thờ Người. Chỉ cách đồn bốt quân đội đối phương chưa đầy 4km, quân dân Long Đức bí mật đốn gỗ, vận chuyển từng viên gạch, bao xi măng dưới làn đạn pháo kích để hoàn thành ngôi đền vào ngày 26/01/1971. Quân địch đã nhiều lần ném bom, càn quét hòng hủy diệt ngôi đền nhưng đều bị lực lượng du kích kiên cường đánh lui, bảo vệ trọn vẹn di tích thiêng liêng.',
        englishDetails: 'After President Hồ Chí Minh died in September 1969, the Long Đức Party Committee and local residents resolved to build a temple in his memory. Less than four kilometres from opposing military posts, villagers secretly cut timber and carried bricks and cement through artillery fire. They completed the temple on 26 January 1971. Repeated bombing and raids failed to destroy it; local guerrilla forces defended the site.',
        quoteOrProverb: 'Đền Bác đứng vững giữa đạn bom, tấc lòng son sắt trọn niềm tin yêu.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C4%90%E1%BB%81n%20th%E1%BB%9D%20B%C3%A1c%20H%E1%BB%93%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
        photoCaption: 'Ngôi đền lịch sử uy nghi giữa tán cây xanh xã Long Đức'
      },
      {
        title: 'Mô hình nhà sàn và ao cá Bác Hồ',
        englishTitle: 'The Replicated Stilt House and Lotus Fish Pond',
        summary: 'Không gian văn hóa tưởng niệm mang đậm phong cách giản dị, thanh cao của Bác Hồ giữa lòng đồng bằng Mekong.',
        englishSummary: 'A memorial landscape reflects President Hồ Chí Minh’s simplicity amid the Mekong Delta.',
        details: 'Trong khuôn viên di tích rộng hơn 5 héc-ta, ngoài ngôi đền chính còn có ngôi nhà sàn được phục dựng theo đúng tỷ lệ 1:1 so với Nhà sàn Bác Hồ ở thủ đô Hà Nội, bên cạnh là hồ sen ngát hương thả cá tung tăng bơi lội và những rặng râm bụt đỏ rực. Đây là địa chỉ đỏ giáo dục truyền thống cách mạng cho hàng triệu lượt người dân và học sinh, sinh viên các tỉnh miền Tây Nam Bộ.',
        englishDetails: 'The five-hectare memorial grounds include the main temple and a full-scale replica of President Hồ Chí Minh’s stilt house in Hà Nội. A fragrant lotus pond, fish and bright hibiscus hedges complete the tranquil setting. The site is an important place for teaching revolutionary history to residents, schoolchildren and university students from across the Mekong Delta.',
        quoteOrProverb: 'Bác Hồ sống mãi trong lòng nhân dân miền Nam kiên cường.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20c%C3%A1%20trong%20Khu%20di%20t%C3%ADch%20%C4%90%E1%BB%81n%20th%E1%BB%9D%20Ch%E1%BB%A7%20t%E1%BB%8Bch%20H%E1%BB%93%20Ch%C3%AD%20Minh.jpg',
        photoCaption: 'Cầu tre và bờ ao cá thanh bình trong khuôn viên di tích'
      }
    ],
    artisans: [
      {
        name: 'Trần Văn Kiên',
        age: 79,
        role: 'Cựu chiến binh Đội bảo vệ Đền Bác & Thuyết minh viên nhân chứng sống',
        village: 'Ấp Vĩnh Hội, Xã Long Đức, Trà Vinh',
        quote: 'Chúng tôi lấy máu và tuổi xuân để giữ từng tấc đất quanh đền, bởi có Bác là có niềm tin vào ngày non sông thống nhất.',
        contribution: 'Trực tiếp chiến đấu bảo vệ Đền thờ Bác trong những năm 1970 - 1975 và kể lại câu chuyện lịch sử cho các đoàn khách viếng.',
        badge: 'Người Canh Giữ Đền Bác',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
      }
    ],
    artifact: {
      id: 'trong-dong-long-duc',
      name: 'Trống Đồng Kỷ Niệm Kháng Chiến Long Đức',
      englishName: 'Long Duc Commemorative Bronze Drum',
      era: 'Năm 1971',
      material: 'Vỏ bom pháo tái chế đúc thủ công bằng đồng đỏ',
      dimension: 'Đường kính mặt 0.65m · Chiều cao 0.52m',
      accessionNo: 'TV-DTB-2024-005',
      description: 'Chiếc trống được các thợ rèn Long Đức đúc từ chính mảnh pháo kích của kẻ thù thu gom quanh đền, dùng để báo động và dóng trống chào mừng ngày giải phóng.',
      culturalSignificance: 'Vật chứng sống thể hiện tinh thần "biến căm thù thành sức mạnh" bất khuất.',
      geometryType: 'drum',
      realImageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C4%90%E1%BB%81n%20th%E1%BB%9D%20B%C3%A1c%20H%E1%BB%93%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
      realImageCaption: 'Trống đồng thiêng trưng bày tại phòng lưu niệm Đền thờ Bác Hồ'
    },
    tourStops: [
      {
        order: 1,
        title: 'Dâng hương tưởng niệm Chủ tịch Hồ Chí Minh',
        timeMinutes: 20,
        activity: 'Thực hiện nghi thức chào cờ, dâng hoa và thắp hương trước tượng Bác trong chính điện.',
        ethicalGuideline: 'Giữ trang phục lịch sự, chỉnh tề, tắt chuông điện thoại trong không gian tưởng niệm.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C4%90%E1%BB%81n%20th%E1%BB%9D%20B%C3%A1c%20H%E1%BB%93%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg'
      },
      {
        order: 2,
        title: 'Tham quan hầm bí mật và lắng nghe nhân chứng lịch sử',
        timeMinutes: 40,
        activity: 'Tìm hiểu hệ thống công sự, chiến hào du kích và nhà trưng bày hình ảnh kháng chiến.',
        ethicalGuideline: 'Lắng nghe trân trọng và không tự ý dịch chuyển hiện vật trưng bày.',
        photoUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20c%C3%A1%20trong%20Khu%20di%20t%C3%ADch%20%C4%90%E1%BB%81n%20th%E1%BB%9D%20Ch%E1%BB%A7%20t%E1%BB%8Bch%20H%E1%BB%93%20Ch%C3%AD%20Minh.jpg'
      }
    ],
    historicalComparison: {
      pastLabel: 'Ngôi đền tre lá ban đầu (1970)',
      pastYear: '1970',
      pastDescription: 'Đền Bác được dựng bằng gỗ đước, mái lá dừa nước đơn sơ giữa rặng dừa Long Đức bom đạn xới xới.',
      pastImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C4%90%E1%BB%81n%20th%E1%BB%9D%20B%C3%A1c%20H%E1%BB%93%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
      pastImageCaption: 'Ngôi đền mái ngói đầu tiên được phục dựng kiên cố sau ngày đất nước thống nhất',
      presentLabel: 'Di tích Lịch sử cấp Quốc gia (Hiện nay)',
      presentDescription: 'Khuôn viên khang trang rợp bóng cây xanh, điểm đến văn hóa du lịch thiêng liêng của toàn tỉnh Trà Vinh.',
      presentImage: 'https://commons.wikimedia.org/wiki/Special:FilePath/%C4%90%E1%BB%81n%20th%E1%BB%9D%20B%C3%A1c%20H%E1%BB%93%20%E1%BB%9F%20Tr%C3%A0%20Vinh.jpg',
      presentImageCaption: 'Đền thờ Bác Hồ ngập tràn sắc hoa sen và nắng ấm phương Nam'
    },
    communityImpact: {
      householdsEngaged: 130,
      youthApprentices: 40,
      forestCoverOrPreservationRate: '100% diện tích khuôn viên xanh được duy trì không hóa chất độc hại',
      sustainablePledge: 'Trở thành trung tâm phát triển du lịch về nguồn và giáo dục di sản lịch sử không rác thải nhựa.'
    }
  },
  {
    id: 'con-chim',
    name: 'Điểm Du lịch Cộng đồng Cồn Chim',
    englishName: 'Con Chim Community Ecotourism Islet',
    category: 'Danh thắng & Sinh thái',
    region: 'Đồng bằng Sông Cửu Long',
    province: 'Xã Hòa Minh, Huyện Châu Thành, Trà Vinh',
    lat: 9.9202712,
    lng: 106.4232557,
    elevationMeters: 2,
    establishedCentury: 'Thế kỷ XIX – Mô hình 2019',
    tagline: 'Ốc đảo thuận thiên giữa sông Cổ Chiên, giải thưởng du lịch cộng đồng ASEAN 2025',
    soundscapeType: 'mountain_stream',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: 'Cù lao xanh Cồn Chim bồng bềnh giữa dòng sông Cổ Chiên với triết lý sống "thuận thiên" độc đáo',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        caption: 'Đường làng Cồn Chim rợp bóng dừa xanh ngát và những khóm hoa mười giờ rực rỡ',
        credit: 'Tư liệu Du lịch Cộng đồng Cồn Chim'
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cảnh quan sông nước Cổ Chiên hữu tình nơi đón những chuyến phà đưa khách trải nghiệm',
        credit: 'Tư liệu Châu Thành Trà Vinh'
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om.jpg',
        caption: 'Bếp quê Nam Bộ với các loại bánh dân gian làm bằng cối đá thủ công',
        credit: 'Du lịch Thuận Thiên Cồn Chim'
      }
    ],
    chapters: [
      {
        title: 'Mô hình du lịch "Thuận thiên - Con tôm ôm cây lúa"',
        englishTitle: 'Harmonious "Shrimp Embracing Rice" Ecological Model',
        summary: 'Khởi xướng từ năm 2019, Cồn Chim là biểu tượng sống cho sự thích ứng biến đổi khí hậu bền vững.',
        englishSummary: 'Since 2019, Cồn Chim has become a living example of sustainable adaptation to climate change.',
        details: 'Nằm lẻ loi giữa dòng sông Cổ Chiên rộng lớn, cù lao Cồn Chim có diện tích tự nhiên 60 héc-ta với khoảng 200 nhân khẩu. Cư dân nơi đây sống theo nhịp điệu của con nước tự nhiên: sáu tháng nước ngọt thì trồng lúa hữu cơ không thuốc trừ sâu, sáu tháng nước mặn thì nuôi tôm sú, cua biển tự nhiên (mô hình "con tôm ôm cây lúa"). Triết lý "thuận thiên" bảo vệ môi trường đã biến nơi đây thành điểm du lịch cộng đồng kiểu mẫu giành giải thưởng Du lịch Cộng đồng ASEAN 2025.',
        englishDetails: 'Cồn Chim is a 60-hectare island in the Cổ Chiên River, home to around 200 residents. People follow the natural water cycle: during six months of fresh water they grow organic rice without pesticides; during six months of salt water they raise tiger prawns and crabs. This “shrimp embracing rice” model and the principle of living in harmony with nature have made the island a model for community tourism and climate resilience, recognised by an ASEAN Community Tourism award in 2025.',
        quoteOrProverb: 'Về Cồn Chim người quê chỉ có tấm lòng, ăn con tôm hạt gạo thuận đất trời.',
        photoUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        photoCaption: 'Ốc đảo yên bình không khói bụi xe cộ giữa bốn bề sông nước'
      },
      {
        title: 'Văn hóa bếp quê và nụ cười hiếu khách Nam Bộ',
        englishTitle: 'Southern Culinary Soul and Traditional Stone Mill Cooking',
        summary: 'Trải nghiệm làm bánh lá dừa, xay bột cối đá, uống nước dừa tươi bằng ống hút cỏ bàng.',
        englishSummary: 'Visitors can make coconut-leaf cakes, grind rice by stone mill and drink fresh coconut water through a reed straw.',
        details: 'Đến Cồn Chim, du khách đi bộ hoặc đạp xe trên những con đường không rác thải nhựa, uống nước mát pha hoa đậu biếc và dùng ống hút sậy tự nhiên. Mỗi hộ dân trên cồn đảm nhận một dịch vụ đặc sắc: nhà cô Ba làm bánh lá dừa, nhà chú Năm có trò chơi dân gian câu cua, nhà cô Chín đổ bánh xèo với rau rừng organic hái quanh vườn. Tất cả tạo nên bầu không khí gia đình ấm áp, đưa du khách trở về ký ức tuổi thơ thanh bình.',
        englishDetails: 'Visitors explore Cồn Chim on foot or by bicycle along plastic-free paths, sip cool drinks coloured with butterfly-pea flowers and use natural reed straws. Each household offers a different experience: coconut-leaf cakes at Aunt Ba’s, a traditional crab-catching game at Uncle Năm’s, or sizzling bánh xèo pancakes made with organic garden greens at Aunt Chín’s. Together, these activities create a welcoming, family-like atmosphere and evoke memories of a peaceful childhood.',
        quoteOrProverb: 'Đến đây như về lại nhà mình, ấm tình chòm xóm ngọt lành câu ca.'
      }
    ],
    artisans: [
      {
        name: 'Nguyễn Thị Bích Vân (Cô Ba Vân)',
        age: 54,
        role: 'Trưởng ban Du lịch cộng đồng Cồn Chim & Nghệ nhân bánh dân gian',
        village: 'Ấp Cồn Chim, Xã Hòa Minh, Trà Vinh',
        quote: 'Chúng tôi làm du lịch không phải để giàu nhanh, mà để con cháu biết quý mảnh đất cù lao và giữ gìn môi trường sạch sẽ.',
        contribution: 'Tiên phong vận động bà con chuyển đổi sang mô hình du lịch sinh thái không rác thải nhựa và bảo tồn nghề làm bánh cổ truyền.',
        badge: 'Người Thổi Hồn Cồn Chim',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
      }
    ],
    artifact: {
      id: 'coi-da-con-chim',
      name: 'Cối Đá Xay Bột Gạo Dân Gian Nam Bộ',
      englishName: 'Traditional Granite Stone Grain Mill',
      era: 'Đầu thế kỷ XX',
      material: 'Đá hoa cương khối đục tay, ngõng nghiền gỗ nghiến',
      dimension: 'Đường kính thớt cối 0.42m · Nặng 35kg',
      accessionNo: 'TV-CC-2024-006',
      description: 'Chiếc cối đá xay bột nước truyền thống dùng để xay gạo ngâm làm bánh xèo, bánh khọt, bánh canh bột xắt phục vụ khách phương xa.',
      culturalSignificance: 'Biểu tượng của đức tính cần cù, khéo léo của người phụ nữ miệt vườn sông nước Cửu Long.',
      geometryType: 'pottery',
      realImageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
      realImageCaption: 'Thớt cối đá xay bột gạo truyền thống tại gian bếp quê Cồn Chim'
    },
    tourStops: [
      {
        order: 1,
        title: 'Đi phà ngắm sông Cổ Chiên và đạp xe ngắm hoa mười giờ',
        timeMinutes: 45,
        activity: 'Thong dong đạp xe trên bờ bao kênh rạch, hít thở không khí trong lành không khói xe máy.',
        ethicalGuideline: 'Không vứt rác, mang theo bình nước cá nhân để tiếp nước tại các trạm dân cư.',
        photoUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
      },
      {
        order: 2,
        title: 'Tự tay xay bột cối đá và đổ bánh xèo miền Tây',
        timeMinutes: 60,
        activity: 'Học cách cầm ngõng cối đá, đổ bột, tráng chảo gang lửa củi và thưởng thức bánh xèo giòn rụm cùng 15 loại rau vườn.',
        ethicalGuideline: 'Ăn hết phần ăn của mình, trân trọng giọt mồ hôi của người nông dân.',
        photoUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    historicalComparison: {
      pastLabel: 'Cù lao cô lập nghèo khó (2015)',
      pastYear: '2015',
      pastDescription: 'Đảo không có điện lưới quốc gia, thanh niên bỏ xứ đi làm ăn xa, sinh kế bấp bênh theo mùa mặn ngọt.',
      pastImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      pastImageCaption: 'Bến đò sang cù lao thời kỳ khó khăn thiếu thốn cơ sở hạ tầng',
      presentLabel: 'Giải thưởng Du lịch Cộng đồng ASEAN (Hiện nay)',
      presentDescription: 'Ốc đảo trù phú kiểu mẫu, thanh niên quay về quê lập nghiệp, du khách quốc tế ngợi ca tinh thần bảo vệ thiên nhiên.',
      presentImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
      presentImageCaption: 'Cồn Chim rạng rỡ đón tiếp các đoàn chuyên gia du lịch quốc tế'
    },
    communityImpact: {
      householdsEngaged: 100,
      youthApprentices: 55,
      forestCoverOrPreservationRate: '100% diện tích không sử dụng thuốc trừ sâu hóa học',
      sustainablePledge: 'Nói không hoàn toàn với túi ni-lông và chai nhựa dùng một lần trên toàn cồn.'
    }
  },
  {
    id: 'bien-ba-dong',
    name: 'Khu Di tích & Thắng cảnh Biển Ba Động',
    englishName: 'Ba Dong Beach & Coastal Eco-zone',
    category: 'Danh thắng & Sinh thái',
    region: 'Đồng bằng Sông Cửu Long',
    province: 'Xã Trường Long Hòa, TX. Duyên Hải, Trà Vinh',
    lat: 9.6339810,
    lng: 106.5650840,
    elevationMeters: 2,
    establishedCentury: 'Khai phá thế kỷ XX',
    tagline: 'Bãi biển cát bồi ba đụn hoang sơ, rừng phi lao bạt ngàn và cánh đồng điện gió vươn khơi',
    soundscapeType: 'mountain_stream',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    heroImageCaption: 'Bãi biển Ba Động trải dài thoai thoải với rừng phi lao chắn sóng ngút ngàn và những tuabin điện gió hiện đại',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        caption: 'Bờ cát mịn phù sa thoai thoải hướng ra biển Đông mênh mông',
        credit: 'Tư liệu Biển Ba Động Duyên Hải'
      },
      {
        url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ao%20B%C3%A0%20Om.jpg',
        caption: 'Rừng phi lao rì rào trong gió biển sớm tạo nên bản hòa âm thiên nhiên hoang sơ',
        credit: 'Tư liệu Du lịch Trà Vinh'
      },
      {
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
        caption: 'Cánh đồng phong điện Duyên Hải với những cánh quạt trắng khổng lồ quay đều trên mặt biển',
        credit: 'Tư liệu Năng Lượng Tái Tạo Trà Vinh'
      }
    ],
    chapters: [
      {
        title: 'Huyền thoại ba đụn cát nhấp nhô ven biển Đông',
        englishTitle: 'The Legend of Three Coastal Sand Dunes',
        summary: 'Tên gọi "Ba Động" xuất phát từ ba đụn cát thiên nhiên độc đáo do sóng và gió biển bồi đắp hàng trăm năm.',
        englishSummary: 'The name Ba Động refers to three distinctive sand dunes shaped by waves and coastal winds over centuries.',
        details: 'Nằm cách trung tâm thành phố Trà Vinh khoảng 55km về hướng Đông Nam, bãi biển Ba Động thuộc địa phận xã Trường Long Hòa, thị xã Duyên Hải. Địa danh "Ba Động" bắt nguồn từ hiện tượng địa mạo độc đáo: mỗi khi thủy triều rút xuống, bờ biển lại để lộ ra ba động (đụn) cát nhấp nhô: hai động nhỏ và một động lớn chạy dài tít tắp. Từ đầu thế kỷ XX, người Pháp đã phát hiện ra vẻ đẹp hoang sơ này và xây dựng khu nghỉ dưỡng tắm biển cho các quan chức thuộc địa.',
        englishDetails: 'Ba Động Beach lies about 55 kilometres southeast of Trà Vinh city, in Trường Long Hòa commune, Duyên Hải. Its name describes a distinctive coastal landform: at low tide, three rolling sand dunes emerge—two smaller dunes and one larger ridge stretching along the shore. French colonial officials recognised the area’s scenic appeal in the early twentieth century and built a seaside resort there.',
        quoteOrProverb: 'Gió đưa phi lao reo bờ cát, sóng vỗ Ba Động hát khúc trường ca.',
        photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        photoCaption: 'Bờ cát phẳng lặng mênh mông đón gió trùng khơi'
      },
      {
        title: 'Bến tiếp nhận vũ khí tàu Không Số và cánh đồng điện gió',
        englishTitle: 'The Unnumbered Vessels Secret Pier & Offshore Wind Turbines',
        summary: 'Di tích lịch sử đường mòn Hồ Chí Minh trên biển và bước chuyển mình thành trung tâm năng lượng xanh.',
        englishSummary: 'A historic landing point on the Ho Chi Minh maritime trail now sits beside a growing clean-energy landscape.',
        details: 'Vùng biển Duyên Hải - Ba Động từng là một trong những bến đỗ lịch sử tiếp nhận vũ khí chi viện từ miền Bắc của những con "tàu Không Số" huyền thoại trong cuộc kháng chiến chống Mỹ. Ngày nay, bên cạnh rừng phi lao chắn gió giữ đất, bờ biển Ba Động sừng sững những trụ tuabin điện gió hiện đại vươn mình ra khơi xa, minh chứng cho sự kết hợp hài hòa giữa di tích anh hùng, bảo tồn thiên nhiên và năng lượng tái tạo tương lai.',
        englishDetails: 'During the resistance war against the United States, the Duyên Hải–Ba Động coast was one of the historic landing points where “Unnumbered Ships” brought supplies from the north along the Ho Chi Minh maritime trail. Today, coastal casuarina forests protect the land while modern wind turbines rise offshore, bringing together a historic landscape, nature conservation and renewable energy.',
        quoteOrProverb: 'Sóng biển ghi dấu đoàn tàu thép, cánh quạt vươn cao đón tương lai xanh.'
      }
    ],
    artisans: [
      {
        name: 'Đặng Văn Hùng (Bác Sáu Hùng)',
        age: 71,
        role: 'Cựu thủy thủ Bến tàu Không Số Cồn Tàu & Người giữ rừng phi lao',
        village: 'Khóm Cồn Tàu, TX. Duyên Hải, Trà Vinh',
        quote: 'Biển Ba Động đã chở che cho những chuyến tàu không số ngày xưa, nay rừng phi lao lại chắn gió mặn để bà con trồng dưa hấu và nuôi nghêu.',
        contribution: 'Hơn 30 năm tình nguyện trồng dặm rừng phi lao phòng hộ ven biển và bảo tồn di tích Bến Cồn Tàu.',
        badge: 'Người Gác Sóng Ba Động',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
      }
    ],
    artifact: {
      id: 'thuyen-buom-ba-dong',
      name: 'Mô Hình Thuyền Đánh Cá Duyên Hải Ba Động',
      englishName: 'Traditional Duyen Hai Fishing Sailboat',
      era: 'Thế kỷ XX',
      material: 'Gỗ sao chịu mặn, nan tre đan quét dầu rái chống thấm',
      dimension: 'Dài 1.2m · Cao 0.95m',
      accessionNo: 'TV-BD-2024-007',
      description: 'Mô hình thuyền buồm lướt sóng đặc trưng của ngư dân miền hạ Trà Vinh chuyên đánh bắt nghêu, tôm tít và cá khoai ven bờ.',
      culturalSignificance: 'Di sản của kinh nghiệm đi biển, quan sát thiên văn và con nước của ngư dân ven biển Nam Bộ.',
      geometryType: 'boat',
      realImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      realImageCaption: 'Mô hình thuyền buồm nan tre truyền thống của ngư dân Trà Vinh'
    },
    tourStops: [
      {
        order: 1,
        title: 'Đón bình minh trên bãi biển cát bồi và ngắm cánh đồng điện gió',
        timeMinutes: 40,
        activity: 'Dạo bước trên bờ cát mịn ngắm mặt trời mọc đỏ ối từ biển Đông soi bóng các trụ điện gió khổng lồ.',
        ethicalGuideline: 'Không xả rác ra bãi biển, bảo vệ các tổ trứng rùa và chim biển.',
        photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
      },
      {
        order: 2,
        title: 'Thăm di tích Bến tàu Không Số và thưởng thức dưa hấu Ba Động',
        timeMinutes: 50,
        activity: 'Nghe kể chuyện vượt biển chi viện vũ khí và nếm vị dưa hấu trồng trên giồng cát biển ngọt thanh nức tiếng.',
        ethicalGuideline: 'Tôn trọng di tích lịch sử và ủng hộ nông sản hữu cơ của bà con diêm dân.',
        photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    historicalComparison: {
      pastLabel: 'Bến Cồn Tàu bí mật thời chiến (1968)',
      pastYear: '1968',
      pastDescription: 'Bờ biển hoang vu với rừng ngập mặn rậm rạp, nơi các chiến sĩ ngụy trang tàu chở vũ khí từ miền Bắc cập bến an toàn.',
      pastImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      pastImageCaption: 'Rừng phi lao phòng hộ kiên cường vượt qua bão táp chiến tranh',
      presentLabel: 'Khu du lịch sinh thái & Trung tâm Năng lượng sạch (Hiện nay)',
      presentDescription: 'Bờ biển Ba Động chuyển mình mạnh mẽ với đường nhựa thênh thang, các cụm điện gió và khu nghỉ dưỡng sinh thái đón du khách.',
      presentImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      presentImageCaption: 'Bãi biển Ba Động đón ánh bình minh rạng ngời thời đại mới'
    },
    communityImpact: {
      householdsEngaged: 150,
      youthApprentices: 40,
      forestCoverOrPreservationRate: 'Bảo vệ hơn 80km bờ biển rừng phòng hộ chắn gió mặn',
      sustainablePledge: 'Phát triển du lịch biển kết hợp giáo dục năng lượng tái tạo và bảo vệ rùa biển.'
    }
  }
];

// Legacy illustrative extents, not surveyed GIS footprints or landmark pins.
// These approximate polygons are not rendered on the map; use site.lat/lng.
export const HERITAGE_BOUNDARIES: Record<string, [number, number][]> = {
  'ao-ba-om': [
    [106.3015, 9.9200],
    [106.3065, 9.9200],
    [106.3065, 9.9150],
    [106.3015, 9.9150],
    [106.3015, 9.9200],
  ],
  'chua-ang': [
    [106.3020, 9.9175],
    [106.3055, 9.9175],
    [106.3055, 9.9140],
    [106.3020, 9.9140],
    [106.3020, 9.9175],
  ],
  'bao-tang-khmer': [
    [106.3045, 9.9185],
    [106.3075, 9.9185],
    [106.3075, 9.9150],
    [106.3045, 9.9150],
    [106.3045, 9.9185],
  ],
  'chua-hang': [
    [106.2970, 9.8740],
    [106.3020, 9.8740],
    [106.3020, 9.8700],
    [106.2970, 9.8700],
    [106.2970, 9.8740],
  ],
  'den-tho-bac': [
    [106.3270, 9.9885],
    [106.3350, 9.9885],
    [106.3350, 9.9825],
    [106.3270, 9.9825],
    [106.3270, 9.9885],
  ],
  'con-chim': [
    [106.4050, 9.9750],
    [106.4250, 9.9780],
    [106.4280, 9.9550],
    [106.4100, 9.9520],
    [106.4050, 9.9750],
  ],
  'bien-ba-dong': [
    [106.5650, 9.6250],
    [106.5950, 9.6200],
    [106.5850, 9.5950],
    [106.5600, 9.6000],
    [106.5650, 9.6250],
  ],
};

// Cultural Heritage Tour Routes across Trà Vinh Province
export const HERITAGE_ROUTES: HeritageRoute[] = [
  {
    id: 'route-khmer-culture',
    name: 'Hành Lang Văn Hóa Khmer Cổ Truyền',
    englishName: 'Ancient Khmer Cultural Corridor',
    description: 'Kết nối hồ thiêng Ao Bà Om, ngôi cổ tự Angkorajaborey ngàn năm, Bảo tàng Dân tộc và Chùa Hang.',
    siteIds: ['ao-ba-om', 'chua-ang', 'bao-tang-khmer', 'chua-hang'],
    color: '#f59e0b',
  },
  {
    id: 'route-river-ecology',
    name: 'Hành Trình Sinh Thái Miệt Vườn Ven Sông Cổ Chiên',
    englishName: 'Co Chien River Eco-Heritage Trail',
    description: 'Xuất phát từ Đền thờ Bác Hồ Long Đức xuôi dòng Cổ Chiên trải nghiệm du lịch thuận thiên Cồn Chim.',
    siteIds: ['ao-ba-om', 'den-tho-bac', 'con-chim'],
    color: '#10b981',
  },
  {
    id: 'route-coastal-mangrove',
    name: 'Con Đường Duyên Hải & Bến Tàu Không Số',
    englishName: 'Southern Coastal & Heroic Maritime Route',
    description: 'Từ các phum sóc cổ kính vươn ra rừng đước ngập mặn Duyên Hải và bãi biển phù sa Ba Động.',
    siteIds: ['chua-hang', 'den-tho-bac', 'bien-ba-dong'],
    color: '#0284c7',
  },
];

