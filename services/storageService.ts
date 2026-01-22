import { Car, Review, SiteConfig } from '../types';
import { INITIAL_INVENTORY, REVIEWS, ASSETS } from '../constants';

// Production Keys
// INVENTORY, TRASH, REVIEWS는 v1을 유지하여 데이터 보존
// SETTINGS는 v8로 변경하여 최신 이미지 에셋 적용 및 강제 업데이트
const STORAGE_KEYS = {
  INVENTORY: 'eom_motors_prod_v1_inventory', 
  TRASH: 'eom_motors_prod_v1_trash',
  REVIEWS: 'eom_motors_prod_v1_reviews',
  SETTINGS: 'eom_motors_prod_v8_settings',
};

const DEFAULT_SETTINGS: SiteConfig = {
  brandName: 'EOM',
  brandNameHighlight: 'MOTORS',
  heroTitle: '투명함이 만드는 프리미엄',
  heroSubtitle: '당신의 드림카가 현실이 됩니다.\n엄선된 퀄리티, 정직한 가격을 약속합니다.',
  heroImageUrl: 'https://picsum.photos/seed/carhero/1920/1080',
  ceoName: '엄 희 철',
  // Use Centralized Asset
  ceoImageUrl: ASSETS.CEO_IMAGE_URL, 
  contactPhone: '010-9288-2333',
  contactEmail: 'contact@eom-motors.com',
  contactAddress: '대구 서구 문화로 37 엠월드 4층 408호 엄모터스',
  licenseNumber: '18-053-00035'
};

export const StorageService = {
  getInventory: (): Car[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return data ? JSON.parse(data) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  },

  saveInventory: (inventory: Car[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
      return true;
    } catch (e) {
      throw new Error('STORAGE_FULL');
    }
  },

  getTrash: (): Car[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRASH);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTrash: (trash: Car[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(trash));
    } catch (e) {
      console.error('Storage full for trash', e);
    }
  },

  getReviews: (): Review[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return data ? JSON.parse(data) : REVIEWS;
    } catch {
      return REVIEWS;
    }
  },

  saveReviews: (reviews: Review[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (e) {
      console.error('Storage full for reviews', e);
    }
  },

  getSettings: (): SiteConfig => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      // 데이터가 없거나, ceoImageUrl이 비어있으면 기본값 사용
      if (!data) return DEFAULT_SETTINGS;
      
      const parsed = JSON.parse(data);
      if (!parsed.ceoImageUrl) {
        parsed.ceoImageUrl = ASSETS.CEO_IMAGE_URL;
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: SiteConfig) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
       throw new Error('STORAGE_FULL');
    }
  },

  clearAll: () => {
    // Current Keys
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.TRASH);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    
    // Cleanup Legacy Keys (Optional but good for hygiene)
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('eom_motors_prod_')) {
            localStorage.removeItem(key);
        }
    });
  }
};