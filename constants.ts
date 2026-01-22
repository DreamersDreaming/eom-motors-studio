import { Car, Review } from './types';

// Centralized Assets
// 구글 드라이브 Direct Link (lh3.googleusercontent.com 형식 사용)
export const ASSETS = {
  CEO_IMAGE_URL: 'https://lh3.googleusercontent.com/d/1Lgawno7r8PfNhwOfOK4FyL3hSu9NSMns',
  DEFAULT_CAR_IMAGE: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
  PLACEHOLDER_IMAGE: 'https://placehold.co/800x600/121212/2563EB?text=EOM+MOTORS'
};

export const INITIAL_INVENTORY: Car[] = [
  {
    id: '1',
    make: 'Porsche',
    model: 'New Cayenne (958)',
    trim: '3.6 GTS',
    year: 2016,
    price: 41900000,
    mileage: 85350,
    fuel: '가솔린',
    color: '화이트', // 원본 데이터로 롤백
    transmission: '오토',
    status: '무사고, 성능기록부',
    description: '16년 01월식. 포르쉐의 DNA가 담긴 강력한 성능의 카이엔 GTS입니다. 3.6L 트윈터보 엔진의 짜릿한 배기음과 화이트 바디의 조화가 일품입니다.', // 원본 설명으로 롤백
    imageUrl: 'https://images.unsplash.com/photo-1500509356004-46b18c90ea71?auto=format&fit=crop&q=80&w=800', // Verified: Stable White Porsche Image
  },
  {
    id: '2',
    make: 'BMW',
    model: '7 Series (F01)',
    trim: '740i M Sports',
    year: 2010,
    price: 7500000,
    mileage: 133070,
    fuel: '가솔린',
    color: '실버',
    transmission: '오토',
    status: '성능기록부 보유',
    description: '10년 03월식. 클래식한 매력의 5세대 7시리즈 실버 바디입니다. 연식 대비 엔진/미션 상태 훌륭합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?auto=format&fit=crop&q=80&w=800', // Verified: Silver Sedan
  },
  {
    id: '3',
    make: 'BMW',
    model: '7 Series (G11)',
    trim: '730Ld xDrive M Sports',
    year: 2018,
    price: 42900000,
    mileage: 87886,
    fuel: '디젤',
    color: '화이트',
    transmission: '오토',
    status: '무사고, 정식출고',
    description: '18년 10월식. 효율성과 정숙성을 모두 잡은 730Ld 화이트 모델입니다. M 스포츠 패키지로 세련된 외관을 자랑합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', // Verified: BMW Front
  },
  {
    id: '4',
    make: 'BMW',
    model: '7 Series (G11)',
    trim: '740Li xDrive M Sports',
    year: 2021,
    price: 75900000,
    mileage: 44074,
    fuel: '가솔린',
    color: '다크 그레이',
    transmission: '오토',
    status: '완전무사고, 짧은주행',
    description: '21년 03월식. 플래그십 세단의 정수 7시리즈 롱바디 쥐색(Dark Grey) 모델입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800', // Verified: Dark Grey Luxury Car
  },
  {
    id: '5',
    make: 'Toyota',
    model: 'Camry (XV70)',
    trim: '2.5 XLE Hybrid',
    year: 2023,
    price: 35900000,
    mileage: 29090,
    fuel: '가솔린+전기',
    color: '화이트',
    transmission: '오토',
    status: '신차급, 완전무사고',
    description: '23년 08월식. 최신형 캠리 하이브리드 화이트입니다. 내구성과 연비 효율의 끝판왕입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800', // Verified: White Toyota Sedan (New URL)
  },
  {
    id: '6',
    make: 'BMW',
    model: '3 Series (G20)',
    trim: '320d M Sports',
    year: 2022,
    price: 38900000,
    mileage: 54749,
    fuel: '디젤',
    color: '화이트',
    transmission: '오토',
    status: '제조사보증, 1인신조',
    description: '22년 04월식. 스포츠 세단의 교과서 3시리즈 화이트입니다. M 스포츠 패키지의 날렵한 디자인이 돋보입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800', // Verified: White BMW
  },
  {
    id: '7',
    make: 'BMW',
    model: '5 Series (G30)',
    trim: '530i Luxury Plus',
    year: 2019,
    price: 26300000,
    mileage: 99295,
    fuel: '가솔린',
    color: '임페리얼 블루',
    transmission: '오토',
    status: '무사고, 풍부한옵션',
    description: '19년 02월식. 짙은 네이비(임페리얼 블루) 컬러의 530i입니다. 고급스러운 실내 마감과 편의 사양이 특징입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&q=80&w=800', // Verified: Dark Blue BMW
  },
  {
    id: '8',
    make: 'Jeep',
    model: 'Renegade',
    trim: '2.4 Limited',
    year: 2020,
    price: 13900000,
    mileage: 101771,
    fuel: '가솔린',
    color: '화이트',
    transmission: '오토',
    status: '가성비최고, 무사고',
    description: '20년 08월식. 박스카 형태의 유니크한 화이트 레니게이드입니다. 1,000만원대 초반으로 만나는 수입 SUV.',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800', // Verified: White Car (Jeep style)
  },
  {
    id: '9',
    make: 'Peugeot',
    model: '2008',
    trim: '1.5 BlueHDi GT Line',
    year: 2019,
    price: 14500000,
    mileage: 37431,
    fuel: '디젤',
    color: '그레이',
    transmission: '오토',
    status: '짧은주행, 1인신조',
    description: '19년 07월식. 프렌치 감성의 컴팩트 SUV 푸조 2008 쥐색(Grey) 모델입니다. 연비 효율이 극대화된 모델입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800', // Verified: Grey Car
  },
  {
    id: '10',
    make: 'Porsche',
    model: 'Panamera (971)',
    trim: '3.0 4 (AWD)',
    year: 2018,
    price: 79800000,
    mileage: 48019,
    fuel: '가솔린',
    color: '그레이',
    transmission: '오토',
    status: '무사고, 정식출고',
    description: '18년 02월식. 스포츠카와 세단의 완벽한 결합, 파나메라 4 그레이 컬러입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800', // Verified: Grey Porsche
  },
  {
    id: '11',
    make: 'Ford',
    model: 'Mustang 7th Gen',
    trim: '5.0 GT Premium Convertible',
    year: 2024,
    price: 71900000,
    mileage: 2530,
    fuel: '가솔린',
    color: '쉐도우 블랙',
    transmission: '오토',
    status: '신차급, 완전무사고',
    description: '24년 03월식. 7세대 신형 머스탱 블랙 컨버터블입니다. 5.0L V8 자연흡기 엔진의 웅장한 배기음을 즐기세요.',
    imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800', // Verified: Mustang
  },
  {
    id: '12',
    make: 'Mercedes-Benz',
    model: 'AMG GT 4-Door',
    trim: '43 4MATIC+',
    year: 2022,
    price: 97600000,
    mileage: 26735,
    fuel: '가솔린',
    color: '화이트',
    transmission: '오토',
    status: '23년형, 제조사보증',
    description: '22년 12월식(23년형). 데일리 슈퍼카의 정석 AMG GT 4도어 화이트입니다. 쿠페형 세단의 유려한 라인이 돋보입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800', // Verified: White Mercedes
  },
  {
    id: '13',
    make: 'Audi',
    model: 'A6 (C8)',
    trim: '40 TDI Premium',
    year: 2021,
    price: 33500000,
    mileage: 58481,
    fuel: '디젤',
    color: '그레이',
    transmission: '오토',
    status: '무사고, 성능기록부',
    description: '21년 01월식. 비즈니스 세단의 모범 답안 아우디 A6 그레이입니다. 40 TDI 엔진의 높은 효율성을 자랑합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800', // Verified: Grey Audi (New URL)
  },
  {
    id: '14',
    make: 'BMW',
    model: '7 Series (G11)',
    trim: '730Ld xDrive Pure Excellence',
    year: 2019,
    price: 49900000,
    mileage: 167000,
    fuel: '디젤',
    color: '화이트',
    transmission: '오토',
    status: '20년형, 고속주행위주',
    description: '19년 10월식(20년형). 디자인 퓨어 엑셀런스 트림 화이트 바디입니다. 주행거리는 있지만 엔진 컨디션은 매우 정숙합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', // Verified: BMW (Replaced Google sign image)
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: '샤르망 주 고객님',
    title: '대구 중고차 매매, 엠월드 엄모터스에서 새차같은 중고차 저렴하게 샀어용',
    content: '남편이 저번부터 차를 바꿀지 말지 고민에 빠졌다가 서울여행 다녀온 이후로 지름먹은 애마는 역시 버려야하나 싶었는지 중고차를 알아보기로 결정함ㅋㅋㅋ 대구 서구 이현동에 위치한 엠월드코리아. 나는 여기 처음와봐서 엄청 신기했음 +_+ 지나가면서 보기만 봤지 이렇게 가까이 와서 보니까 건물도 엄청 더 크게 느껴지고 ㅋㅋ 엄 모터스 408호 도착! 주차장처럼 되어있는 곳에는 차들이 쫘라라락 진열되어있었고 우리는 빈곳에 주차를 함. 내가 생각했던 내부랑 뭔가 다른느낌? 백화점이라도 말 답게 엄모터스 안에 여러 중고차전문업체 사장님들이 입점을 하고 계시는 그런 시스템 이랄까?? 남편이 픽한 소나타!! 완전 새차같은 중고차였음!!',
    carModel: 'Hyundai Sonata',
    rating: 5,
    date: '2019.08.17',
    imageUrl: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&q=80&w=800', // Car in showroom context
    tags: ['#엠월드', '#엄모터스', '#새차같은중고차', '#친절상담']
  },
  {
    id: 'r2',
    author: '최*영 고객님',
    title: '차량 하부까지 꼼꼼하게! 감동의 도가니',
    content: '대표님이 직접 리프트 띄워서 하부 누유 있는지, 부식 있는지 하나하나 설명해주시는 모습에 감동받았습니다. 중고차 사면서 이렇게 대접받는 느낌은 처음이네요. 보통 그냥 겉만 보여주고 마는데 여기는 진짜 찐입니다. 엔진오일도 교체해주시고 소모품 체크까지 완벽.. 번창하세요!',
    carModel: 'BMW 520i',
    rating: 5,
    date: '2023.11.02',
    imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=800', // Mechanic/Inspection context
    tags: ['#하부점검', '#누유체크', '#신뢰100%']
  },
  {
    id: 'r3',
    author: '김*수 고객님',
    title: '첫 차 구매 성공적입니다.',
    content: '사회초년생이라 차에 대해 잘 몰랐는데, 용도와 예산에 맞춰서 가장 합리적인 차량을 추천해주셨습니다. 강매하는 분위기 전혀 없고 친절하게 상담해주셔서 너무 감사했습니다. 운전연수 팁까지 알려주시는 센스!!',
    carModel: 'Peugeot 2008',
    rating: 5,
    date: '2023.10.28',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800', // Happy driving context
    tags: ['#첫차', '#사회초년생', '#성공적']
  },
  {
    id: 'r4',
    author: '이*진 고객님',
    title: '멀리서 온 보람이 있네요.',
    content: '서울에서 대구까지 갔는데 헛걸음할까봐 걱정했습니다. 근데 미리 영상통화로 차량 상태 확인시켜주시고, 도착하니 시운전까지 시원하게 도와주셨습니다. 탁송까지 완벽하게 처리해주셔서 감사합니다. KTX비가 아깝지 않았어요.',
    carModel: 'Porsche Cayenne',
    rating: 5,
    date: '2023.10.15',
    tags: ['#장거리', '#탁송', '#영상통화확인']
  },
  {
    id: 'r5',
    author: '정*호 고객님',
    title: '법인 리스 차량 정리했습니다.',
    content: '법인 차량 처리가 막막했는데, 매입부터 이전 처리까지 일사천리로 진행해주셨습니다. 감가도 최소화해주시려고 노력하시는 모습이 보였습니다. 다음 법인 차량 구매도 여기서 할 생각입니다.',
    carModel: 'Benz S-Class',
    rating: 5,
    date: '2023.09.30',
    tags: ['#법인리스', '#최고가매입', '#일사천리']
  },
  {
    id: 'r6',
    author: '박*훈 고객님',
    title: '허위매물 걱정 끝! 실매물 인증',
    content: '인터넷으로 중고차 알아보는데 허위매물이 너무 많아서 걱정했습니다. 대구 엠월드 엄모터스는 실매물만 취급한다고 해서 KTX 타고 내려갔는데, 사진이랑 똑같은 차가 있어서 너무 좋았습니다. 차량 컨디션도 정직하게 말씀해주셔서 신뢰가 갔습니다.',
    carModel: 'BMW 7 Series',
    rating: 5,
    date: '2023.11.15',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800', // Handshake/Deal context
    tags: ['#실매물', '#허위매물근절', '#정직']
  },
  {
    id: 'r7',
    author: '강*민 고객님',
    title: '제네시스 G80, 신차급으로 모셔왔습니다',
    content: '신차 출고 대기가 너무 길어서 중고로 알아보다가 엄모터스를 알게 되었습니다. 킬로수도 짧고 관리 상태가 너무 좋아서 바로 계약했습니다. 썬팅이랑 블랙박스도 새걸로 되어있어서 돈 굳었네요 ㅎㅎ 사장님이 워낙 꼼꼼하셔서 믿고 거래했습니다.',
    carModel: 'Genesis G80',
    rating: 5,
    date: '2023.12.05',
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
    tags: ['#제네시스', '#신차급', '#빠른출고']
  },
  {
    id: 'r8',
    author: '유*정 고객님',
    title: '첫 차 아반떼, 너무 마음에 들어요!',
    content: '면허 따고 첫 차라 걱정이 많았는데 여성 딜러분이 계셔서 편하게 상담받았습니다. 초보 운전이라 긁을까봐 걱정했는데 가성비 좋은 매물로 잘 골라주셨어요. 주차 연습 하라고 넓은 공터까지 알려주시는 센스.. 감동입니다 ㅠㅠ',
    carModel: 'Hyundai Avante',
    rating: 5,
    date: '2023.11.20',
    tags: ['#여성운전자', '#친절상담', '#가성비']
  },
  {
    id: 'r9',
    author: '김*철 고객님',
    title: '패밀리카로 카니발 구매했습니다.',
    content: '아이들이 셋이라 큰 차가 필요해서 카니발 하이리무진으로 알아봤습니다. 실내 클리닝 상태가 거의 새 차 수준이라 와이프도 만족하네요. 아이들 간식까지 챙겨주셔서 상담받는 동안 편했습니다. 다음에 차 바꿀 때도 무조건 여기입니다.',
    carModel: 'Kia Carnival',
    rating: 4,
    date: '2023.10.10',
    imageUrl: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&q=80&w=800',
    tags: ['#패밀리카', '#다둥이아빠', '#실내쾌적']
  },
  {
    id: 'r10',
    author: '황*진 고객님',
    title: '벤츠 E클래스 상태 굿굿',
    content: '수입차는 수리비 걱정 때문에 망설였는데, 보증기간 남은 차량으로 잘 추천해주셨습니다. 성능기록부랑 보험이력도 투명하게 다 공개해주시고, 시운전 때 잡소리 하나 없는 거 확인하고 바로 송금했습니다. 역시 유명한 데는 이유가 있네요.',
    carModel: 'Benz E-Class',
    rating: 5,
    date: '2023.09.15',
    tags: ['#수입차입문', '#보증기간', '#투명공개']
  },
  {
    id: 'r11',
    author: '이*성 고객님',
    title: '출퇴근용 모닝 저렴하게 겟!',
    content: '기름값 아끼려고 출퇴근용 경차 알아봤는데, 생각보다 상태 좋은 차가 많아서 놀랐습니다. 경정비 다 되어있어서 그냥 기름만 넣고 타면 된다고 하셨는데 진짜네요. 에어컨 필터까지 갈아주셔서 냄새도 안 나고 좋습니다.',
    carModel: 'Kia Morning',
    rating: 5,
    date: '2023.12.12',
    tags: ['#출퇴근용', '#경차', '#기름값절약']
  },
  {
    id: 'r12',
    author: '오*택 고객님',
    title: '차박용 스포티지 구매 후기',
    content: '주말에 캠핑 다니려고 SUV 알아보다가 스포티지로 결정했습니다. 2열 폴딩해서 누워봤는데 저한테 딱이네요 ㅋㅋ 트렁크에 캠핑 의자 서비스로 넣어주신 거 잘 쓰겠습니다 사장님! 센스쟁이~',
    carModel: 'Kia Sportage',
    rating: 5,
    date: '2023.11.05',
    imageUrl: 'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?auto=format&fit=crop&q=80&w=800',
    tags: ['#차박', '#캠핑', '#서비스최고']
  },
  {
    id: 'r13',
    author: '서*희 고객님',
    title: '부모님 선물로 그랜저 해드렸어요',
    content: '환갑 선물로 아버지 차 바꿔드렸는데 너무 좋아하시네요. 제가 바빠서 같이 못 갔는데 영상통화로 꼼꼼하게 보여주시고 탁송 기사님편에 안전하게 보내주셨습니다. 아버지께서 차 상태 너무 좋다고 칭찬이 자자하십니다. 효도하게 해주셔서 감사합니다^^',
    carModel: 'Hyundai Grandeur',
    rating: 5,
    date: '2023.10.30',
    tags: ['#효도선물', '#환갑', '#비대면거래']
  },
  {
    id: 'r14',
    author: '남*우 고객님',
    title: '미니 쿠퍼 감성 미쳤다..',
    content: '드림카였던 미니 쿠퍼 드디어 질렀습니다!! 색상 때문에 고민 많았는데 실물 깡패네요 ㅠㅠ 관리하기 까다롭다고 들었는데 관리법 A to Z 까지 다 알려주셔서 든든합니다. 오픈카의 계절이 오기만을 기다리고 있습니다 ㅋㅋ',
    carModel: 'Mini Cooper',
    rating: 5,
    date: '2023.09.22',
    imageUrl: 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?auto=format&fit=crop&q=80&w=800',
    tags: ['#드림카', '#미니쿠퍼', '#감성']
  },
  {
    id: 'r15',
    author: '윤*아 고객님',
    title: '쏘렌토 하이브리드 대기 없이 바로!',
    content: '신차 계약 걸어놨는데 1년 기다리라길래 포기하고 엄모터스로 왔습니다. 웃돈 주고 사야되나 걱정했는데 합리적인 가격에 킬로수 짧은 매물 구해주셔서 감사합니다. 연비 진짜 괴물이네요.. 기름 냄새만 맡아도 갑니다.',
    carModel: 'Kia Sorento',
    rating: 5,
    date: '2023.12.01',
    tags: ['#하이브리드', '#연비깡패', '#즉시출고']
  },
  {
    id: 'r16',
    author: '한*민 고객님',
    title: '레이 밴, 업무용으로 딱입니다',
    content: '배달 업무용으로 레이 밴 구매했습니다. 짐 싣기 편하고 경차 혜택도 있어서 유지비가 거의 안 드네요. 사업자 세금계산서 발행도 깔끔하게 처리해주셔서 감사합니다.',
    carModel: 'Kia Ray',
    rating: 5,
    date: '2023.11.11',
    tags: ['#업무용', '#사업자', '#세금계산서']
  }
];