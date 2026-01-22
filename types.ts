
export interface Car {
  id: string;
  make: string;
  model: string;
  trim?: string; // e.g., 2.5 가솔린 터보 AWD
  year: number;
  price: number; // In Won
  mileage: number; // In km
  status: string; // e.g., '무사고', '1인신조'
  fuel: string; // e.g., '가솔린', '디젤'
  color: string; // e.g., '화이트', '블랙'
  transmission: string; // e.g., '오토'
  description: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  author: string;
  title: string;
  content: string;
  carModel: string;
  rating: number;
  date: string;
  imageUrl?: string; // Review photo
  tags?: string[]; // e.g. ['#첫차', '#친절']
}

export interface InquiryForm {
  name: string;
  contact: string;
  targetCar: string;
}

export interface SiteConfig {
  brandName: string;
  brandNameHighlight: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string; // Main background image
  ceoName: string;
  ceoImageUrl?: string; // CEO profile image
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  licenseNumber: string; // 사원증 번호
}
