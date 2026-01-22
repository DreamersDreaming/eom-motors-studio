import { Car, Review, SiteConfig } from '../types';
import { INITIAL_INVENTORY, REVIEWS } from '../constants';

// Production Keys
// INVENTORY, TRASH, REVIEWS는 v1을 유지하여 기존 데이터 보존
// SETTINGS는 v3로 변경하여 기존의 꼬인 설정(CEO 이미지 등)을 초기화하고 새로운 기본값 적용
const STORAGE_KEYS = {
  INVENTORY: 'eom_motors_prod_v1_inventory', 
  TRASH: 'eom_motors_prod_v1_trash',
  REVIEWS: 'eom_motors_prod_v1_reviews',
  SETTINGS: 'eom_motors_prod_v3_settings',
};

const DEFAULT_SETTINGS: SiteConfig = {
  brandName: 'EOM',
  brandNameHighlight: 'MOTORS',
  heroTitle: '투명함이 만드는 프리미엄',
  heroSubtitle: '당신의 드림카가 현실이 됩니다.\n엄선된 퀄리티, 정직한 가격을 약속합니다.',
  heroImageUrl: 'https://picsum.photos/seed/carhero/1920/1080',
  ceoName: '엄 희 철',
  // User provided specific Google Photo URL as default
  ceoImageUrl: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSm0P3Oo32Dzo4v-h7elYJORtjPkVl5KczFf32pm5f56qRaNB1yrVe-zpbvaPGilPZy99FFHRgtFzCs-yxGO0Lo633UmttxKDxdRfPMebzDNc4MxhEICYV1lOD_zNaRgd69ZBZvpMNxbKKDkzMQhg32g-qtEb-WoFwIHawdCSw0TWvjLgg=s1024-rj', 
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
    } catch (e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert('⚠️ 브라우저 저장 공간이 부족합니다!\n\n이미지가 너무 많거나 큽니다. 오래된 매물을 삭제하거나 이미지를 줄여주세요.');
      }
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
      const parsed = data ? JSON.parse(data) : DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: SiteConfig) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
       if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert('⚠️ 설정 저장 실패: 저장 공간이 부족합니다.');
      }
    }
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.TRASH);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
};