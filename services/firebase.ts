import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Car, Review, SiteConfig } from '../types';
import { INITIAL_INVENTORY, REVIEWS, ASSETS } from '../constants';

// --- Firebase 설정 ---
// .env.local 파일이나 환경 변수 설정이 필요합니다.
// Vite에서는 import.meta.env 객체를 통해 환경 변수에 접근합니다.

// Safe access helper to avoid runtime crashes if import.meta.env is somehow undefined
const getEnv = (key: string) => {
  try {
    return (import.meta as any).env?.[key];
  } catch (e) {
    return undefined;
  }
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// 키가 유효한지 확인 (빈 문자열이거나 undefined이면 false)
// 추가로 'PLACEHOLDER' 같은 기본값이 들어있는지도 확인
const isFirebaseConfigured = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "PLACEHOLDER_API_KEY" && 
  firebaseConfig.apiKey !== "API_KEY_HERE";

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase Connected!");
  } catch (e) {
    console.error("Firebase Init Error:", e);
  }
} else {
  console.log("⚠️ Firebase keys missing or invalid. Running in Local Storage Mode.");
}

// 로컬 모드일 때 로딩 흉내 (너무 빠르면 어색하므로)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const DBService = {
  // --- Inventory (Cars) ---
  getInventory: async (): Promise<Car[]> => {
    if (db) {
      try {
        const q = query(collection(db, "inventory"));
        const querySnapshot = await getDocs(q);
        const cars: Car[] = [];
        querySnapshot.forEach((doc) => {
          cars.push(doc.data() as Car);
        });
        // DB가 비어있으면(첫 시작) 초기 데이터 반환
        return cars.length > 0 ? cars.sort((a,b) => Number(b.id) - Number(a.id)) : INITIAL_INVENTORY;
      } catch (e) {
        console.error("DB Error", e);
        // Fallback to local/initial if DB fails
        return INITIAL_INVENTORY;
      }
    }
    // Local Fallback
    await delay(500);
    const local = localStorage.getItem('eom_motors_prod_v1_inventory');
    return local ? JSON.parse(local) : INITIAL_INVENTORY;
  },

  saveCar: async (car: Car) => {
    if (db) {
      await setDoc(doc(db, "inventory", car.id), car);
    }
    // Backup to local regardless
    const current = DBService.getLocal('eom_motors_prod_v1_inventory', INITIAL_INVENTORY);
    const updated = current.some((c: Car) => c.id === car.id) 
      ? current.map((c: Car) => c.id === car.id ? car : c) 
      : [car, ...current];
    localStorage.setItem('eom_motors_prod_v1_inventory', JSON.stringify(updated));
  },

  deleteCar: async (id: string) => {
    if (db) {
      await deleteDoc(doc(db, "inventory", id));
    }
    const current = DBService.getLocal('eom_motors_prod_v1_inventory', INITIAL_INVENTORY);
    localStorage.setItem('eom_motors_prod_v1_inventory', JSON.stringify(current.filter((c: Car) => c.id !== id)));
  },

  // --- Reviews ---
  getReviews: async (): Promise<Review[]> => {
    if (db) {
      try {
        const q = query(collection(db, "reviews"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const reviews: Review[] = [];
        querySnapshot.forEach((doc) => {
          reviews.push(doc.data() as Review);
        });
        return reviews.length > 0 ? reviews : REVIEWS;
      } catch (e) {
        return REVIEWS;
      }
    }
    await delay(500);
    const local = localStorage.getItem('eom_motors_prod_v1_reviews');
    return local ? JSON.parse(local) : REVIEWS;
  },

  saveReview: async (review: Review) => {
    if (db) {
      await setDoc(doc(db, "reviews", review.id), review);
    }
    const current = DBService.getLocal('eom_motors_prod_v1_reviews', REVIEWS);
    localStorage.setItem('eom_motors_prod_v1_reviews', JSON.stringify([review, ...current]));
  },

  deleteReview: async (id: string) => {
    if (db) {
      await deleteDoc(doc(db, "reviews", id));
    }
    const current = DBService.getLocal('eom_motors_prod_v1_reviews', REVIEWS);
    localStorage.setItem('eom_motors_prod_v1_reviews', JSON.stringify(current.filter((r: Review) => r.id !== id)));
  },

  // --- Settings (Config) ---
  getSettings: async (): Promise<SiteConfig> => {
    const defaultSettings: SiteConfig = {
      brandName: 'EOM',
      brandNameHighlight: 'MOTORS',
      heroTitle: '투명함이 만드는 프리미엄',
      heroSubtitle: '당신의 드림카가 현실이 됩니다.\n엄선된 퀄리티, 정직한 가격을 약속합니다.',
      heroImageUrl: 'https://picsum.photos/seed/carhero/1920/1080',
      ceoName: '엄 희 철',
      ceoImageUrl: ASSETS.CEO_IMAGE_URL,
      contactPhone: '010-9288-2333',
      contactEmail: 'contact@eom-motors.com',
      contactAddress: '대구 서구 문화로 37 엠월드 4층 408호 엄모터스',
      licenseNumber: '18-053-00035'
    };

    if (db) {
      try {
        const querySnapshot = await getDocs(collection(db, "settings"));
        let config = defaultSettings;
        querySnapshot.forEach((doc) => {
          if (doc.id === 'site_config') config = { ...defaultSettings, ...doc.data() as SiteConfig };
        });
        return config;
      } catch (e) {
        return defaultSettings;
      }
    }
    
    await delay(300);
    const local = localStorage.getItem('eom_motors_prod_v8_settings');
    return local ? JSON.parse(local) : defaultSettings;
  },

  saveSettings: async (config: SiteConfig) => {
    if (db) {
      await setDoc(doc(db, "settings", "site_config"), config);
    }
    localStorage.setItem('eom_motors_prod_v8_settings', JSON.stringify(config));
  },

  // Utils
  getLocal: (key: string, fallback: any) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  }
};