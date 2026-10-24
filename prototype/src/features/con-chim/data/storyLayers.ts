import type { StorySource } from './kt01Stories';

export interface StoryQuestion { id: string; title: string; answer: string; kind: 'Tư liệu đối chiếu' | 'Gợi ý hỏi trực tiếp'; source?: StorySource; }
export interface PhotoPoint { id: string; x: number; y: number; title: string; explanation: string; }
export interface ActivityPreview {
  title: string; introduction: string; host: string; materials: { title: string; explanation: string }[];
  steps: { title: string; explanation: string }[]; result: string; ask: string; source: StorySource;
}
export interface StoryLayers {
  questions: StoryQuestion[]; points: PhotoPoint[]; observe: string; reflection: string;
  manners: { action: string; reason: string }[];
  caseStudy?: { title: string; body: string; source: StorySource };
  activity?: ActivityPreview;
}

export const ACTIVITY_SOURCE: StorySource = {
  title: 'Điểm du lịch cộng đồng Cồn Chim', publisher: 'Đoàn UBND tỉnh Vĩnh Long',
  url: 'https://doanubndvinhlong.vn/diem-du-lich-cong-dong-con-chim/', published: 'Nguồn không ghi ngày đăng',
};
const FOOD_SOURCE: StorySource = {
  title: 'Trà Vinh: Ẩm thực cồn Chim', publisher: 'Cục Du lịch Quốc gia Việt Nam / Báo Cần Thơ',
  url: 'https://vietnamtourism.vn/index.php/news/items/26137', published: 'Cập nhật 28/02/2023',
};
const HOUSE_SOURCE: StorySource = {
  title: 'Trải nghiệm miền Tây hoang sơ ở cồn Chim', publisher: 'Bài và ảnh: Ca Linh / Báo Người Lao Động',
  url: 'https://nld.com.vn/du-lich-xanh/trai-nghiem-mien-tay-hoang-so-o-con-chim-20220218214201686.htm', published: '19/02/2022',
};
const OPENING_SOURCE: StorySource = {
  title: 'Ra mắt điểm du lịch cộng đồng đầu tiên tại Trà Vinh', publisher: 'Bộ Văn hóa, Thể thao và Du lịch',
  url: 'https://bvhttdl.gov.vn/ra-mat-diem-du-lich-cong-dong-dau-tien-tai-tra-vinh-20190910165212562.htm', published: '10/09/2019',
};
const NATURE_SOURCE: StorySource = {
  title: 'Du lịch Trà Vinh: Thuận thiên để phát triển bền vững', publisher: 'Bộ Văn hóa, Thể thao và Du lịch',
  url: 'https://bvhttdl.gov.vn/du-lich-tra-vinh-thuan-thien-de-phat-trien-ben-vung-20220610085916221.htm', published: '13/06/2022',
};
const askHost = 'Hỏi người phụ trách đón khách về hộ đang hướng dẫn, giờ phù hợp và thời gian tham gia. Chỉ bắt đầu khi chủ nhà đồng ý.';
const kitchenActivity: ActivityPreview = {
  title: 'Lần đầu ghé một gian bếp quê',
  introduction: 'Bạn có thể bắt đầu bằng việc quan sát, hỏi chuyện rồi thử một thao tác được chủ nhà hướng dẫn.',
  host: 'Người dân tại hộ đón khách; người hướng dẫn cụ thể cần được hẹn tại điểm đón.',
  materials: [
    { title:'Nguyên liệu theo buổi', explanation:'Hỏi chủ nhà hôm nay dùng nguyên liệu gì, món nào sẵn có và bạn có thể phụ phần nào.' },
    { title:'Chảo và dụng cụ bếp', explanation:'Quan sát vị trí tay, dụng cụ và khoảng đứng trước khi được mời thử. Phần bếp nóng cần chủ nhà hướng dẫn.' },
    { title:'Một câu hỏi mang theo', explanation:'“Nguyên liệu hoặc thao tác nào là điều cô, chú muốn khách hiểu nhất?”' },
  ],
  steps: [
    { title:'Gặp chủ nhà, nói mình mới thử', explanation:'Bạn có thể nói: “Tôi chưa làm món này bao giờ, cô/chú chỉ giúp một thao tác dễ bắt đầu được không?”' },
    { title:'Quan sát trước, hỏi điều mình tò mò', explanation:'Nhìn cách cầm dụng cụ. Bạn được quyền hỏi lại hoặc chỉ quan sát; không cần làm giống ngay.' },
    { title:'Thử phần được hướng dẫn', explanation:'Làm theo nhịp của chủ nhà và nhờ hỗ trợ khi cần. Đây là một cuộc gặp, không có chấm điểm hay so sánh sản phẩm.' },
  ],
  result:'Bạn hiểu thêm một công việc trong bếp và có thể thử một thao tác phù hợp với buổi đón khách.',
  ask:askHost, source:ACTIVITY_SOURCE,
};

export const STORY_LAYERS: Record<string, StoryLayers> = {
  'banh-xeo': {
    questions:[
      {id:'nguyen-lieu',title:'Nguyên liệu nối món ăn với đời sống ra sao?',answer:'Tư liệu về Cồn Chim giới thiệu hoạt động làm bánh gắn với nguyên liệu tại chỗ. Hãy hỏi chủ nhà về nguyên liệu của buổi hôm nay.',kind:'Tư liệu đối chiếu',source:ACTIVITY_SOURCE},
      {id:'cach-lam',title:'Vì sao chủ nhà làm theo cách này?',answer:'Cách pha bột và thao tác cụ thể cần hỏi người đang hướng dẫn. Ảnh không đủ để kết luận công thức riêng của một gia đình.',kind:'Gợi ý hỏi trực tiếp'},
      {id:'lan-dau',title:'Tôi chưa từng làm, có thể bắt đầu thế nào?',answer:'Xin quan sát một lượt rồi nhờ chủ nhà chọn một thao tác phù hợp. Bạn có thể dừng lại, hỏi lại hoặc chỉ quan sát.',kind:'Gợi ý hỏi trực tiếp'},
    ],
    points:[
      {id:'chao',x:63,y:79,title:'Chảo bánh',explanation:'Chiếc chảo ở phía trước cho thấy thao tác đang diễn ra. Thử quan sát tay cầm dụng cụ trước khi hỏi cách làm.'},
      {id:'banh',x:45,y:56,title:'Một lượt bánh khác',explanation:'Hãy nhìn chiếc chảo phía sau rồi so sánh với chảo phía trước. Bạn muốn nhờ chủ nhà giải thích thao tác nào?'},
      {id:'mon-an',x:16,y:27,title:'Món ăn bên cạnh',explanation:'Phần ảnh bên trái giới thiệu những món quê khác. Một món quen mắt có thể là cách mở đầu cuộc hỏi chuyện về nguyên liệu.'},
    ],
    observe:'Hãy tìm bàn tay cầm dụng cụ và chiếc chảo được nhắc đến. Bạn muốn hỏi điều gì về thao tác đó?',
    reflection:'Một nguyên liệu hay thao tác nào khiến bạn muốn hỏi chủ nhà thêm?',
    manners:[{action:'Xin phép trước khi vào bếp hoặc quay phim.',reason:'Gian bếp là nơi làm việc và sinh hoạt của gia đình.'},{action:'Chờ người hướng dẫn mời thử.',reason:'Chủ nhà biết phần việc nào phù hợp với buổi đón khách.'}],
    activity:kitchenActivity,
  },
  'mam-com': {
    questions:[
      {id:'moi-nha',title:'Mỗi nhà có giới thiệu cùng một món không?',answer:'Bài giới thiệu ẩm thực năm 2023 ghi nhận mỗi điểm vườn có món hoặc thức uống đặc trưng riêng. Mâm cơm là một phần của hành trình ấy.',kind:'Tư liệu đối chiếu',source:FOOD_SOURCE},
      {id:'ba-sua',title:'Có ví dụ cụ thể về người làm món quê không?',answer:'Tư liệu nhắc đến cô Ba Sữa với món bánh lá mơ. Đây là ghi nhận từ bài viết, không phải lời kể hay lịch đón khách hiện tại.',kind:'Tư liệu đối chiếu',source:FOOD_SOURCE},
      {id:'thuc-don',title:'Muốn dùng bữa hoặc thử làm món, tôi hỏi ai?',answer:askHost+' Nếu có yêu cầu ăn uống, trao đổi trước khi thống nhất món.',kind:'Gợi ý hỏi trực tiếp'},
    ],
    points:[
      {id:'ban',x:51,y:73,title:'Chiếc bàn chung',explanation:'Mọi người ngồi quanh một bàn. Từ chi tiết này, bạn có thể nghĩ về cách một bữa ăn tạo cơ hội trò chuyện.'},
      {id:'mai',x:51,y:16,title:'Không gian dùng bữa',explanation:'Nhìn mái, cột và cách đặt bàn trong cùng một khung cảnh. Không gian dùng bữa cũng góp phần tạo nên cuộc gặp với chủ nhà.'},
    ],
    observe:'Nhìn cách mọi người ngồi quanh bàn. Bạn sẽ mở đầu cuộc trò chuyện với chủ nhà bằng câu hỏi nào?',
    reflection:'Ngoài tên món ăn, bạn muốn nhớ điều gì về bữa cơm này?',
    manners:[{action:'Hỏi trước khi chụp người đang dùng bữa.',reason:'Một bữa ăn còn là khoảng sinh hoạt riêng của mỗi người.'},{action:'Trao đổi món và giờ ghé trước.',reason:'Chủ nhà có thể chuẩn bị phù hợp với buổi đón khách.'}],
    activity:kitchenActivity,
  },
  'ruong-ao': {
    questions:[
      {id:'thuan-thien',title:'“Thuận thiên” có nghĩa gì ở đây?',answer:'Tư liệu mô tả việc sống và sản xuất hài hòa với điều kiện tự nhiên. Trồng lúa và nuôi thủy sản là một phần sinh kế trên cồn.',kind:'Tư liệu đối chiếu',source:NATURE_SOURCE},
      {id:'mua',title:'Ảnh này được chụp vào mùa nào?',answer:'Nguồn ảnh đang có chưa ghi ngày chụp. Không thể xác định mùa vụ chỉ bằng màu xanh trong ảnh; bạn có thể hỏi người đang canh tác.',kind:'Gợi ý hỏi trực tiếp'},
      {id:'quan-sat',title:'Tôi nên quan sát từ đâu?',answer:'Đứng trên lối đi được cho phép và hỏi chủ nhà trước khi vào khu sản xuất. Mỗi khu vực có cách sử dụng riêng.',kind:'Gợi ý hỏi trực tiếp'},
    ],
    points:[{id:'lua',x:76,y:66,title:'Khoảng ruộng xanh',explanation:'Đây là chi tiết nhìn thấy trong ảnh. Hãy hỏi người dân về công việc đang làm, thay vì đoán mùa chỉ từ màu ruộng.'},{id:'hang-cay',x:61,y:31,title:'Hàng cây phía xa',explanation:'Cảnh quan gồm cả ruộng, cây và nơi sinh sống. Một bức ảnh đẹp có thể mở đầu câu hỏi về đời sống phía sau.'}],
    observe:'Tìm ranh giới giữa lối đi và phần ruộng. Điều đó gợi cho bạn cách tham quan nào?',
    reflection:'Bạn nhìn cảnh ruộng khác đi thế nào sau khi biết nó gắn với sinh kế?',
    manners:[{action:'Giữ lối đi, hỏi trước khi bước vào ruộng.',reason:'Ruộng và ao là nơi người dân đang sản xuất.'},{action:'Không tự lấy cây hoặc sản vật.',reason:'Những gì nhìn thấy có thể thuộc công việc và tài sản của hộ dân.'}],
  },
  'duong-lang': {
    questions:[
      {id:'duong',title:'Đường tham quan có còn là đường sinh hoạt không?',answer:'Đường trong ảnh đi qua nhà và ruộng. Hãy coi đây là lối đi chung, chú ý người đang qua lại khi dừng chụp ảnh.',kind:'Gợi ý hỏi trực tiếp'},
      {id:'nha',title:'Ngôi nhà nối đời sống với chuyến tham quan thế nào?',answer:'Nhà, ruộng và lối đi cùng hiện trong một khung cảnh. Khi ghé thăm, bạn đang đi qua nơi có người sinh sống; việc nhường lối và xin phép giúp cuộc gặp thoải mái hơn.',kind:'Gợi ý hỏi trực tiếp'},
      {id:'gap',title:'Muốn gặp người dân để hỏi thêm thì làm sao?',answer:'Nhờ người phụ trách đón khách giới thiệu một hộ phù hợp. Xin phép trước và hỏi xem lúc đó gia đình có thuận tiện trò chuyện không.',kind:'Gợi ý hỏi trực tiếp'},
    ],
    points:[{id:'loi-di',x:40,y:67,title:'Lối đi chung',explanation:'Nhóm xe di chuyển trên một lối nhỏ. Khi dừng lại, nên để khoảng trống cho người khác đi qua.'},{id:'mai-nha',x:39,y:45,title:'Mái nhà',explanation:'Thử nhìn mái nhà cùng hàng cây và lối đi. Bạn muốn hỏi chủ nhà điều gì về không gian sinh hoạt ở đây?'},{id:'ao',x:51,y:85,title:'Mặt nước gần đường',explanation:'Mặt nước nằm sát tuyến đi trong ảnh. Đó cũng là một phần của cảnh quan gắn với sinh kế trên cồn.'}],
    observe:'Tìm lối đi nối ngôi nhà với phần ruộng. Bạn có thể ngắm cảnh mà vẫn nhường lối thế nào?',
    reflection:'Chi tiết đời thường nào trong ảnh khiến bạn muốn dừng lại lâu hơn?',
    manners:[{action:'Nhường đường khi dừng chụp ảnh.',reason:'Lối tham quan cũng phục vụ sinh hoạt hằng ngày.'},{action:'Xin phép trước khi vào sân nhà.',reason:'Một điểm đẹp trên ảnh vẫn có thể là không gian riêng của gia đình.'}],
  },
  'nguoi-dan': {
    questions:[
      {id:'vai-tro',title:'Người dân tham gia làm du lịch bằng cách nào?',answer:'Tư liệu năm 2019 ghi nhận việc tập huấn và xây dựng sản phẩm dựa vào điều kiện, tập quán và đời sống địa phương.',kind:'Tư liệu đối chiếu',source:OPENING_SOURCE},
      {id:'nha-tre',title:'Có một trường hợp cụ thể để hình dung không?',answer:'Bài viết năm 2022 giới thiệu ông Võ Văn Bé dựng nhà bằng tre, lá và nền đất, cùng đồ dùng gợi nếp sinh hoạt miền Tây. Ảnh ở đây là ảnh đoàn khách, không phải chân dung ông Bé.',kind:'Tư liệu đối chiếu',source:HOUSE_SOURCE},
      {id:'loi-ke',title:'Tôi đang nghe lời kể của ai?',answer:'Nút nghe đọc bản tóm tắt bằng giọng tổng hợp của thiết bị. Hiện chưa có bản thu lời kể trực tiếp của người dân trong câu chuyện này.',kind:'Tư liệu đối chiếu'},
    ],
    points:[{id:'cong',x:51,y:29,title:'Biển tên Cồn Chim',explanation:'Tên địa điểm hiện trên cổng chào. Hãy bắt đầu từ mốc nhận biết này rồi nghĩ về người sẽ đón mình ở phía trong.'},{id:'doan-khach',x:49,y:66,title:'Cuộc gặp trong ảnh',explanation:'Một đoàn khách đứng cùng nhau trong ảnh. Nếu có dịp tham gia, bạn muốn nghe chủ nhà kể về điều gì của cồn?'}],
    observe:'Hãy nhìn mốc tên địa điểm rồi chọn một câu hỏi bạn muốn dành cho người đón khách.',
    reflection:'Bạn muốn nghe người dân kể về một công việc hay một kỷ niệm nào?',
    manners:[{action:'Giới thiệu ngắn về mình và xin phép hỏi chuyện.',reason:'Chủ nhà có thể đang làm việc hoặc có lịch sinh hoạt riêng.'},{action:'Hỏi trước khi thu âm hoặc đăng ảnh.',reason:'Người được ghi hình cần biết và đồng ý với cách bạn sử dụng câu chuyện của họ.'}],
    caseStudy:{title:'Một ngôi nhà được báo chí ghi nhận',body:'Ông Võ Văn Bé được giới thiệu trong bài và ảnh của Ca Linh năm 2022. Đó là một ví dụ cụ thể để hỏi về cách không gian gia đình trở thành nơi đón khách.',source:HOUSE_SOURCE},
  },
  'ngay-dau': {
    questions:[
      {id:'thu-nghiem',title:'Trước ngày ra mắt đã có hoạt động gì?',answer:'Bài công bố năm 2019 ghi nhận thử nghiệm tour từ tháng 5/2019, trước khi điểm du lịch cộng đồng chính thức ra mắt.',kind:'Tư liệu đối chiếu',source:OPENING_SOURCE},
      {id:'ra-mat',title:'Mốc ra mắt được ghi nhận khi nào?',answer:'Ngày 9/9/2019 là ngày ra mắt được bài đăng 10/9/2019 của Bộ VHTTDL ghi nhận. Ngày đăng bài và ngày sự kiện là hai mốc khác nhau.',kind:'Tư liệu đối chiếu',source:OPENING_SOURCE},
      {id:'hom-nay',title:'Tư liệu cũ có cho biết lịch hoạt động hôm nay không?',answer:'Không. Tư liệu lịch sử giải thích một dấu mốc; giờ đón khách, người hướng dẫn và hoạt động hiện tại cần hỏi người phụ trách.',kind:'Gợi ý hỏi trực tiếp'},
    ],
    points:[{id:'bo-ruong',x:50,y:68,title:'Bờ ruộng',explanation:'Bờ đất phân cách lối đi và phần ruộng trong ảnh tư liệu. Hãy quan sát ranh giới này trước khi nghĩ về cách đi tham quan.'},{id:'tham-quan',x:28,y:44,title:'Nhóm người tham quan',explanation:'Chú thích nguồn ghi nhận khách tìm hiểu mô hình canh tác. Công việc vốn thường ngày trở thành một điều để chia sẻ với khách.'}],
    observe:'Nhìn nhóm người tham quan trong ảnh rồi liên hệ: sinh kế nào đang được giới thiệu?',
    reflection:'Bạn muốn hỏi người sống trên cồn điều gì đã thay đổi từ những ngày đầu?',
    manners:[{action:'Phân biệt mốc lịch sử với tình trạng hiện tại.',reason:'Một bài viết cũ không xác nhận dịch vụ đang mở hôm nay.'}],
  },
};
