import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Showroom from './components/Showroom';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { DBService } from './services/firebase';
import { StorageService } from './services/storageService'; 
import { Car, SiteConfig, Review } from './types';
import { ASSETS } from './constants';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<Car[]>([]);
  const [trash, setTrash] = useState<Car[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [config, setConfig] = useState<SiteConfig>({
    brandName: 'EOM',
    brandNameHighlight: 'MOTORS',
    heroTitle: '투명함이 만드는 프리미엄',
    heroSubtitle: '',
    heroImageUrl: '',
    ceoName: '',
    ceoImageUrl: ASSETS.CEO_IMAGE_URL,
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    licenseNumber: ''
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Fetch Data (Async)
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const [invData, revData, confData] = await Promise.all([
          DBService.getInventory(),
          DBService.getReviews(),
          DBService.getSettings()
        ]);
        setInventory(invData);
        setReviews(revData);
        setConfig(confData);
        setTrash(StorageService.getTrash()); // Trash stays local
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // 휴지통만 로컬 스토리지 동기화 유지
  useEffect(() => { StorageService.saveTrash(trash); }, [trash]);

  // Admin Security Logic
  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '1234') { 
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      setPasswordInput('');
    }
  };

  // CRUD Handlers (Updated to Async)
  const handleSaveCar = async (car: Car) => {
    // Optimistic UI Update (화면 먼저 갱신)
    if (inventory.some(c => c.id === car.id)) {
      setInventory(prev => prev.map(c => c.id === car.id ? car : c));
    } else {
      setInventory(prev => [car, ...prev]);
    }
    // DB Save
    await DBService.saveCar(car);
  };

  const handleSoftDeleteCar = async (id: string) => {
    const carToDelete = inventory.find(c => c.id === id);
    if (carToDelete) {
      setInventory(prev => prev.filter(c => c.id !== id));
      setTrash(prev => [carToDelete, ...prev]);
      await DBService.deleteCar(id);
    }
  };

  const handleRestoreCar = async (id: string) => {
    const carToRestore = trash.find(c => c.id === id);
    if (carToRestore) {
      setTrash(prev => prev.filter(c => c.id !== id));
      setInventory(prev => [carToRestore, ...prev]);
      await DBService.saveCar(carToRestore);
    }
  };

  const handlePermanentDeleteCar = (id: string) => {
    setTrash(prev => prev.filter(c => c.id !== id));
  };
  
  const handleAddReview = async (review: Review) => {
    setReviews(prev => [review, ...prev]);
    await DBService.saveReview(review);
  };

  const handleDeleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    await DBService.deleteReview(id);
  };

  const handleEditClick = (id: string) => {
    if (!isAdmin) {
      setShowLoginModal(true);
    } 
  };

  const handleSaveConfig = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    await DBService.saveSettings(newConfig);
  };

  const handleRestoreData = (data: { inventory?: Car[], trash?: Car[], reviews?: Review[], config?: SiteConfig }) => {
    if (data.inventory) {
        setInventory(data.inventory);
        data.inventory.forEach(c => DBService.saveCar(c));
    }
    if (data.trash) setTrash(data.trash);
    if (data.reviews) {
        setReviews(data.reviews);
        data.reviews.forEach(r => DBService.saveReview(r));
    }
    if (data.config) {
        setConfig(data.config);
        DBService.saveSettings(data.config);
    }
  };

  const handleFactoryReset = () => {
    StorageService.clearAll();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-circle-notch fa-spin text-4xl text-brand-blue mb-4"></i>
          <p className="text-gray-400">엄모터스 스튜디오 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-blue selection:text-white">
      <Navbar onAdminClick={handleAdminClick} isAdmin={isAdmin} config={config} />
      
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">관리자 접속</h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-white">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">Access PIN</label>
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-center tracking-widest text-lg focus:border-brand-blue outline-none transition-colors"
                  placeholder="●●●●"
                  autoFocus
                />
              </div>
              <button type="submit" className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors">
                로그인
              </button>
            </form>
          </div>
        </div>
      )}

      {isAdmin && (
        <AdminPanel 
          inventory={inventory}
          trash={trash}
          onSaveCar={handleSaveCar}
          onSoftDeleteCar={handleSoftDeleteCar}
          onRestoreCar={handleRestoreCar}
          onPermanentDeleteCar={handlePermanentDeleteCar}
          reviews={reviews}
          onDeleteReview={handleDeleteReview}
          config={config}
          onSaveConfig={handleSaveConfig}
          onClose={() => setIsAdmin(false)}
          onRestoreData={handleRestoreData}
          onFactoryReset={handleFactoryReset}
        />
      )}

      <Hero config={config} />
      <Showroom inventory={inventory} isAdmin={isAdmin} onEdit={handleEditClick} />
      <Reviews reviews={reviews} onAddReview={handleAddReview} />
      <Footer config={config} />
    </div>
  );
};

export default App;