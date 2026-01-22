import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Showroom from './components/Showroom';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { StorageService } from './services/storageService';
import { Car, SiteConfig, Review } from './types';

const App: React.FC = () => {
  const [inventory, setInventory] = useState<Car[]>([]);
  const [trash, setTrash] = useState<Car[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [config, setConfig] = useState<SiteConfig>(StorageService.getSettings());
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Initialize data
  useEffect(() => {
    setInventory(StorageService.getInventory());
    setTrash(StorageService.getTrash());
    setReviews(StorageService.getReviews());
    setConfig(StorageService.getSettings());
  }, []);

  // Persistence Effects
  useEffect(() => { if (inventory.length > 0 || trash.length > 0) StorageService.saveInventory(inventory); }, [inventory]);
  useEffect(() => { StorageService.saveTrash(trash); }, [trash]);
  useEffect(() => { if (reviews.length > 0) StorageService.saveReviews(reviews); }, [reviews]);
  useEffect(() => { StorageService.saveSettings(config); }, [config]);

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
    if (passwordInput === '1234') { // Simple Client-side Security
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
      setPasswordInput('');
    }
  };

  // CRUD Handlers
  const handleSaveCar = (car: Car) => {
    if (inventory.some(c => c.id === car.id)) {
      setInventory(prev => prev.map(c => c.id === car.id ? car : c));
    } else {
      setInventory(prev => [car, ...prev]);
    }
  };

  const handleSoftDeleteCar = (id: string) => {
    const carToDelete = inventory.find(c => c.id === id);
    if (carToDelete) {
      setInventory(prev => prev.filter(c => c.id !== id));
      setTrash(prev => [carToDelete, ...prev]);
    }
  };

  const handleRestoreCar = (id: string) => {
    const carToRestore = trash.find(c => c.id === id);
    if (carToRestore) {
      setTrash(prev => prev.filter(c => c.id !== id));
      setInventory(prev => [carToRestore, ...prev]);
    }
  };

  const handlePermanentDeleteCar = (id: string) => {
    setTrash(prev => prev.filter(c => c.id !== id));
  };
  
  const handleAddReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
  };

  const handleDeleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleEditClick = (id: string) => {
    // Showroom에서 수정 버튼 클릭 시 바로 로그인 모달 혹은 관리자 패널로 연결
    if (!isAdmin) {
      setShowLoginModal(true);
    } 
  };

  const handleSaveConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig);
  };

  // Backup & Restore Handlers
  const handleRestoreData = (data: { inventory?: Car[], trash?: Car[], reviews?: Review[], config?: SiteConfig }) => {
    if (data.inventory) setInventory(data.inventory);
    if (data.trash) setTrash(data.trash);
    if (data.reviews) setReviews(data.reviews);
    if (data.config) setConfig(data.config);
  };

  const handleFactoryReset = () => {
    StorageService.clearAll();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-brand-blue selection:text-white">
      <Navbar onAdminClick={handleAdminClick} isAdmin={isAdmin} config={config} />
      
      {/* Admin Login Modal */}
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

      {/* Admin Panel Overlay */}
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
      <Showroom 
        inventory={inventory} 
        isAdmin={isAdmin} 
        onEdit={handleEditClick} 
      />
      <Reviews reviews={reviews} onAddReview={handleAddReview} />
      <Footer config={config} />
    </div>
  );
};

export default App;