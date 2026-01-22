import React, { useState, useEffect, useRef } from 'react';
import { Car, SiteConfig, Review } from '../types';

interface AdminPanelProps {
  inventory: Car[];
  trash: Car[];
  onSaveCar: (car: Car) => void;
  onSoftDeleteCar: (id: string) => void;
  onRestoreCar: (id: string) => void;
  onPermanentDeleteCar: (id: string) => void;
  reviews: Review[];
  onDeleteReview: (id: string) => void;
  config: SiteConfig;
  onSaveConfig: (config: SiteConfig) => void;
  onClose: () => void;
  onRestoreData: (data: { inventory?: Car[], trash?: Car[], reviews?: Review[], config?: SiteConfig }) => void;
  onFactoryReset: () => void;
}

type TabType = 'inventory' | 'trash' | 'reviews' | 'settings';
type ViewMode = 'list' | 'form';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  inventory, 
  trash,
  onSaveCar, 
  onSoftDeleteCar, 
  onRestoreCar,
  onPermanentDeleteCar,
  reviews,
  onDeleteReview,
  config, 
  onSaveConfig, 
  onClose,
  onRestoreData,
  onFactoryReset
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Custom UI State
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean, message: string, action: () => void } | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Hidden File Inputs Refs
  const carImageInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const ceoImageInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  // Inventory State
  const emptyCar: Car = {
    id: '', make: '', model: '', trim: '', year: new Date().getFullYear(),
    price: 0, mileage: 0, status: '', fuel: '가솔린', color: '',
    transmission: '오토', description: '',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
  };
  const [carForm, setCarForm] = useState<Car>(emptyCar);

  // Settings State
  const [configForm, setConfigForm] = useState<SiteConfig>(config);

  useEffect(() => {
    setConfigForm(config);
  }, [config]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Confirm Helper
  const requestConfirm = (message: string, action: () => void) => {
    setConfirmModal({ show: true, message, action });
  };

  const executeConfirm = () => {
    if (confirmModal) {
      confirmModal.action();
      setConfirmModal(null);
    }
  };

  // Image Processing Helper (Resize & Convert to Base64)
  const processImageFile = (file: File, callback: (base64: string) => void) => {
    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const scaleSize = MAX_WIDTH / img.width;
        
        // Resize if wider than MAX_WIDTH, otherwise keep original
        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to JPEG with 0.8 quality to save space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        callback(dataUrl);
        setIsProcessingImage(false);
        showToast('이미지가 성공적으로 업로드되었습니다.', 'success');
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        showToast('이미지 처리 중 오류가 발생했습니다.', 'error');
      };
    };
    reader.onerror = () => {
      setIsProcessingImage(false);
      showToast('파일을 읽는 중 오류가 발생했습니다.', 'error');
    };
  };

  // Backup & Restore Logic
  const handleBackup = () => {
    const data = {
      inventory,
      trash,
      reviews,
      config,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eom-motors-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    showToast('데이터 백업 파일이 다운로드되었습니다.');
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    requestConfirm('현재 데이터를 덮어쓰고 선택한 백업 파일로 복원하시겠습니까? 이 작업은 취소할 수 없습니다.', () => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          onRestoreData(data);
          showToast('데이터가 성공적으로 복원되었습니다.', 'success');
        } catch (err) {
          showToast('잘못된 백업 파일입니다.', 'error');
        }
      };
      reader.readAsText(file);
    });
    // Reset input
    e.target.value = '';
  };

  const handleFactoryResetClick = () => {
    requestConfirm('정말로 모든 데이터를 초기화하시겠습니까? 모든 설정, 매물, 후기가 삭제되고 초기 상태로 돌아갑니다.', () => {
      onFactoryReset();
    });
  };

  // Actions
  const handleEditClick = (car: Car) => {
    setCarForm({ ...car });
    setViewMode('form');
  };

  const handleDeleteClick = (id: string) => {
    requestConfirm('정말로 이 매물을 휴지통으로 이동하시겠습니까?', () => {
      onSoftDeleteCar(id);
      showToast('매물이 휴지통으로 이동되었습니다.', 'info');
    });
  };

  const handleRestoreClick = (id: string) => {
    requestConfirm('이 매물을 다시 전시장으로 복구하시겠습니까?', () => {
      onRestoreCar(id);
      showToast('매물이 전시장으로 복구되었습니다.', 'success');
    });
  };

  const handlePermanentDeleteClick = (id: string) => {
    requestConfirm('정말로 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.', () => {
      onPermanentDeleteCar(id);
      showToast('매물이 영구 삭제되었습니다.', 'error');
    });
  };

  const handleReviewDeleteClick = (id: string) => {
    requestConfirm('정말로 이 후기를 삭제하시겠습니까? 복구할 수 없습니다.', () => {
      onDeleteReview(id);
      showToast('후기가 삭제되었습니다.', 'success');
    });
  };

  const handleCarCreate = () => {
    setCarForm(emptyCar);
    setViewMode('form');
  };

  const handleCancelEdit = () => {
    setCarForm(emptyCar);
    setViewMode('list');
  };

  const handleCarFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCarForm(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'price' || name === 'mileage' ? Number(value) : value
    }));
  };

  const handleCarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0], (base64) => {
        setCarForm(prev => ({ ...prev, imageUrl: base64 }));
      });
    }
  };

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carForm.make || !carForm.model) return showToast('제조사와 모델명은 필수입니다.', 'error');
    
    const carToSave = { ...carForm, id: carForm.id || Date.now().toString() };
    onSaveCar(carToSave);
    
    showToast('매물 정보가 성공적으로 저장되었습니다!');
    
    setCarForm(emptyCar);
    setViewMode('list');
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfigForm(prev => ({ ...prev, [name]: value }));
  };

  const handleConfigImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'heroImageUrl' | 'ceoImageUrl') => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0], (base64) => {
        setConfigForm(prev => ({ ...prev, [fieldName]: base64 }));
      });
    }
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(configForm);
    showToast('사이트 설정이 저장 및 적용되었습니다!');
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-brand-black text-white overflow-hidden animate-fade-in font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-shield-alt text-brand-blue"></i>
            Admin Portal
          </h2>
          <p className="text-xs text-gray-500 mt-1">사이트 통합 관리 시스템</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => { setActiveTab('inventory'); setViewMode('list'); }}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'inventory' ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <i className="fas fa-car w-5 text-center"></i> 매물 관리
          </button>
          <button 
            onClick={() => { setActiveTab('trash'); setViewMode('list'); }}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'trash' ? 'bg-red-900/50 text-red-200 border border-red-900/50' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <i className="fas fa-trash-restore w-5 text-center"></i> 휴지통
            {trash.length > 0 && <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{trash.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'reviews' ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <i className="fas fa-comments w-5 text-center"></i> 구매후기 관리
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <i className="fas fa-cog w-5 text-center"></i> 일반 설정
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={onClose} className="w-full border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded transition-colors flex items-center justify-center gap-2">
            <i className="fas fa-sign-out-alt"></i> 관리자 종료
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-brand-black p-8 relative">
        
        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="max-w-6xl mx-auto">
            {viewMode === 'list' && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">매물 관리</h1>
                  <button onClick={handleCarCreate} className="bg-brand-blue hover:bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
                    <i className="fas fa-plus mr-2"></i> 신규 매물 등록
                  </button>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/50 text-gray-400 text-sm uppercase">
                        <th className="p-4">이미지</th>
                        <th className="p-4">정보 (모델/연식)</th>
                        <th className="p-4">가격</th>
                        <th className="p-4">상태</th>
                        <th className="p-4 text-right">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {inventory.map(car => (
                        <tr key={car.id} className="hover:bg-gray-800/50 transition-colors">
                          <td className="p-4">
                            <img 
                              src={car.imageUrl} 
                              className="w-16 h-12 object-cover rounded bg-gray-800" 
                              alt="thumb" 
                              onError={(e) => e.currentTarget.src = 'https://placehold.co/100x100/333/888?text=No+Img'}
                            />
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white">{car.make} {car.model}</div>
                            <div className="text-xs text-gray-500">{car.year}년식 · {car.mileage.toLocaleString()}km · {car.fuel}</div>
                          </td>
                          <td className="p-4 text-brand-blue font-bold">
                            {(car.price / 10000).toLocaleString()}만원
                          </td>
                          <td className="p-4">
                            <span className="bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700">{car.status}</span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button 
                              type="button"
                              onClick={() => handleEditClick(car)} 
                              className="bg-gray-800 hover:bg-brand-blue text-gray-300 hover:text-white p-2 rounded transition-colors" 
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteClick(car.id)} 
                              className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white p-2 rounded transition-colors" 
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {inventory.length === 0 && <div className="p-8 text-center text-gray-500">등록된 매물이 없습니다.</div>}
                </div>
              </>
            )}

            {viewMode === 'form' && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 shadow-xl animate-fade-in">
                 <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                   <h3 className="text-xl font-bold text-brand-blue">
                     {carForm.id ? '매물 정보 수정' : '새 매물 등록'}
                   </h3>
                   <button onClick={handleCancelEdit} className="text-gray-500 hover:text-white">
                     <i className="fas fa-times text-xl"></i>
                   </button>
                 </div>
                 
                 <form onSubmit={handleCarSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1"><label className="text-xs text-gray-500 block mb-1">제조사</label><input required className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="make" value={carForm.make} onChange={handleCarFormChange} placeholder="예: BMW" /></div>
                    <div className="col-span-1"><label className="text-xs text-gray-500 block mb-1">모델명</label><input required className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="model" value={carForm.model} onChange={handleCarFormChange} placeholder="예: 520d" /></div>
                    <div className="col-span-1"><label className="text-xs text-gray-500 block mb-1">세부트림</label><input className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="trim" value={carForm.trim || ''} onChange={handleCarFormChange} /></div>
                    <div className="col-span-1"><label className="text-xs text-gray-500 block mb-1">연식</label><input type="number" className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="year" value={carForm.year} onChange={handleCarFormChange} /></div>
                    
                    <div className="col-span-1"><label className="text-xs text-gray-500 block mb-1">가격 (원)</label><input type="number" className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="price" value={carForm.price} onChange={handleCarFormChange} /></div>
                    <div className="col-span-1"><label className="text-xs text-gray-500 block mb-1">주행거리 (km)</label><input type="number" className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="mileage" value={carForm.mileage} onChange={handleCarFormChange} /></div>
                    <div className="col-span-1"><label className="text-xs text-gray-500 block mb-1">연료</label><input className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="fuel" value={carForm.fuel} onChange={handleCarFormChange} /></div>
                    <div className="col-span-1"><label className="text-xs text-gray-500 block mb-1">상태</label><input className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="status" value={carForm.status} onChange={handleCarFormChange} /></div>
                    
                    <div className="md:col-span-4">
                      <label className="text-xs text-gray-500 block mb-1">이미지 (URL 입력 또는 파일 업로드)</label>
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                           <input className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name="imageUrl" value={carForm.imageUrl} onChange={handleCarFormChange} placeholder="https://... 또는 파일 선택" />
                           {/* Image Preview Area */}
                           {carForm.imageUrl && (
                             <div className="w-full h-32 bg-gray-800 rounded border border-gray-700 overflow-hidden relative">
                               <img src={carForm.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                               <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded">미리보기</div>
                             </div>
                           )}
                        </div>
                        <input 
                          type="file" 
                          ref={carImageInputRef}
                          onChange={handleCarImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button 
                          type="button"
                          onClick={() => carImageInputRef.current?.click()}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-700 flex items-center justify-center whitespace-nowrap h-[48px]"
                          title="이미지 파일 업로드"
                        >
                          <i className="fas fa-camera mr-2"></i> 파일 선택
                        </button>
                      </div>
                      {isProcessingImage && <p className="text-xs text-brand-blue mt-1"><i className="fas fa-spinner fa-spin"></i> 이미지 처리 중...</p>}
                    </div>
                    <div className="md:col-span-4"><label className="text-xs text-gray-500 block mb-1">설명</label><textarea className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" rows={5} name="description" value={carForm.description} onChange={handleCarFormChange} /></div>
                    
                    <div className="md:col-span-4 flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
                       <button type="button" onClick={handleCancelEdit} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold">취소</button>
                       <button type="submit" className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg" disabled={isProcessingImage}>
                         <i className="fas fa-save mr-2"></i> {carForm.id ? '수정 사항 저장' : '매물 등록하기'}
                       </button>
                    </div>
                 </form>
              </div>
            )}
          </div>
        )}

        {/* Trash Tab */}
        {activeTab === 'trash' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-red-500 flex items-center gap-2">
              <i className="fas fa-trash-alt"></i> 휴지통
            </h1>
            <div className="bg-gray-900 border border-red-900/30 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-red-900/20 text-red-200 text-sm uppercase">
                    <th className="p-4">이미지</th>
                    <th className="p-4">정보</th>
                    <th className="p-4">삭제된 가격</th>
                    <th className="p-4 text-right">복구 / 영구삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {trash.map(car => (
                    <tr key={car.id} className="hover:bg-red-900/10 transition-colors">
                      <td className="p-4 opacity-50">
                        <img 
                          src={car.imageUrl} 
                          className="w-16 h-12 object-cover rounded bg-gray-800 grayscale" 
                          alt="thumb" 
                          onError={(e) => e.currentTarget.src = 'https://placehold.co/100x100/333/888?text=No+Img'}
                        />
                      </td>
                      <td className="p-4 opacity-50">
                        <div className="font-bold text-gray-300">{car.make} {car.model}</div>
                        <div className="text-xs text-gray-500">{car.year}년식</div>
                      </td>
                      <td className="p-4 text-gray-500 decoration-slice">
                        {(car.price / 10000).toLocaleString()}만원
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          type="button"
                          onClick={() => handleRestoreClick(car.id)} 
                          className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                        >
                          <i className="fas fa-undo mr-1"></i> 복구
                        </button>
                        <button 
                          type="button"
                          onClick={() => handlePermanentDeleteClick(car.id)} 
                          className="bg-red-900 hover:bg-red-700 text-red-200 hover:text-white px-3 py-1.5 rounded text-sm transition-colors"
                        >
                          <i className="fas fa-times mr-1"></i> 영구 삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {trash.length === 0 && <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                <i className="fas fa-trash-restore text-4xl mb-4 text-gray-700"></i>
                <p>휴지통이 비어있습니다.</p>
              </div>}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
           <div className="max-w-6xl mx-auto">
             <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
               <i className="fas fa-comments"></i> 구매후기 관리
             </h1>
             <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-black/50 text-gray-400 text-sm uppercase">
                     <th className="p-4">작성일</th>
                     <th className="p-4">작성자 / 차종</th>
                     <th className="p-4">별점 / 제목</th>
                     <th className="p-4 text-right">관리</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800">
                   {reviews.map(review => (
                     <tr key={review.id} className="hover:bg-gray-800/50 transition-colors">
                       <td className="p-4 text-sm text-gray-400 w-32">
                         {review.date}
                       </td>
                       <td className="p-4 w-48">
                         <div className="font-bold text-white">{review.author}</div>
                         <div className="text-xs text-brand-blue">{review.carModel}</div>
                       </td>
                       <td className="p-4">
                         <div className="flex text-yellow-500 text-xs mb-1">
                           {[...Array(review.rating)].map((_, i) => (
                             <i key={i} className="fas fa-star"></i>
                           ))}
                         </div>
                         <div className="font-medium text-gray-300 line-clamp-1">{review.title}</div>
                         <div className="text-xs text-gray-500 line-clamp-1">{review.content}</div>
                       </td>
                       <td className="p-4 text-right">
                         <button 
                           type="button"
                           onClick={() => handleReviewDeleteClick(review.id)} 
                           className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-3 py-1.5 rounded text-sm transition-colors"
                         >
                           <i className="fas fa-trash mr-1"></i> 삭제
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {reviews.length === 0 && <div className="p-12 text-center text-gray-500">
                 등록된 후기가 없습니다.
               </div>}
             </div>
           </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto pb-10">
             <h1 className="text-3xl font-bold mb-8">일반 설정</h1>
             <form onSubmit={handleConfigSubmit} className="space-y-8">
               <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                 <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">브랜드 설정</h3>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">브랜드명 (앞)</label>
                      <input name="brandName" value={configForm.brandName} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">브랜드명 (강조/뒤)</label>
                      <input name="brandNameHighlight" value={configForm.brandNameHighlight} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                 </div>
               </div>

               <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                 <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">메인 히어로 섹션</h3>
                 <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">메인 카피 (큰 제목)</label>
                      <input name="heroTitle" value={configForm.heroTitle} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">서브 카피 (설명글)</label>
                      <textarea name="heroSubtitle" value={configForm.heroSubtitle} onChange={handleConfigChange} rows={3} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                 </div>
               </div>

               <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">이미지 리소스 관리</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">메인 배경 이미지 URL</label>
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <input name="heroImageUrl" value={configForm.heroImageUrl || ''} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" placeholder="https://..." />
                          {configForm.heroImageUrl && (
                             <div className="w-full h-32 bg-gray-800 rounded border border-gray-700 overflow-hidden relative">
                               <img src={configForm.heroImageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://placehold.co/800x200/333/888?text=Broken+Img'} />
                               <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded">미리보기</div>
                             </div>
                           )}
                        </div>
                        <input 
                          type="file" 
                          ref={heroImageInputRef}
                          onChange={(e) => handleConfigImageUpload(e, 'heroImageUrl')}
                          accept="image/*"
                          className="hidden"
                        />
                        <button 
                          type="button"
                          onClick={() => heroImageInputRef.current?.click()}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-700 flex items-center justify-center whitespace-nowrap h-[48px]"
                          title="이미지 파일 업로드"
                        >
                          <i className="fas fa-camera mr-2"></i> 파일 선택
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">1920x1080 이상의 고해상도 이미지를 권장합니다.</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">CEO 프로필 이미지 URL</label>
                      <div className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                           <input name="ceoImageUrl" value={configForm.ceoImageUrl || ''} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" placeholder="https://..." />
                           {configForm.ceoImageUrl && (
                             <div className="w-24 h-32 bg-gray-800 rounded border border-gray-700 overflow-hidden relative">
                               <img src={configForm.ceoImageUrl} alt="Preview" className="w-full h-full object-cover object-top" onError={(e) => e.currentTarget.src = 'https://placehold.co/100x133/333/888?text=No+Img'} />
                               <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded">미리보기</div>
                             </div>
                           )}
                        </div>
                        <input 
                          type="file" 
                          ref={ceoImageInputRef}
                          onChange={(e) => handleConfigImageUpload(e, 'ceoImageUrl')}
                          accept="image/*"
                          className="hidden"
                        />
                         <button 
                          type="button"
                          onClick={() => ceoImageInputRef.current?.click()}
                          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded border border-gray-700 flex items-center justify-center whitespace-nowrap h-[48px]"
                          title="이미지 파일 업로드"
                        >
                          <i className="fas fa-camera mr-2"></i> 파일 선택
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">세로형 인물 사진을 권장합니다.</p>
                    </div>
                  </div>
               </div>

               <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                 <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">회사 정보 및 연락처</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">대표자명</label>
                      <input name="ceoName" value={configForm.ceoName} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">사원증 번호</label>
                      <input name="licenseNumber" value={configForm.licenseNumber} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">대표 전화번호</label>
                      <input name="contactPhone" value={configForm.contactPhone} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">이메일</label>
                      <input name="contactEmail" value={configForm.contactEmail} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">주소</label>
                      <input name="contactAddress" value={configForm.contactAddress} onChange={handleConfigChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" />
                    </div>
                 </div>
               </div>

               <div className="flex justify-end pt-4">
                 <button type="submit" className="bg-brand-blue hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-transform hover:scale-105" disabled={isProcessingImage}>
                   <i className="fas fa-save mr-2"></i> 설정 저장하기
                 </button>
               </div>
             </form>

             {/* Backup & Restore Section */}
             <div className="mt-16 pt-10 border-t border-gray-800">
               <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                 <i className="fas fa-database text-gray-500"></i> 데이터 관리 (백업 및 초기화)
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-blue-400 text-xl">
                     <i className="fas fa-download"></i>
                   </div>
                   <h3 className="font-bold text-lg mb-2">데이터 백업</h3>
                   <p className="text-sm text-gray-500 mb-6 flex-grow">
                     현재 매물, 후기, 설정 등 모든 데이터를 파일로 저장합니다. 
                   </p>
                   <button 
                     onClick={handleBackup}
                     className="w-full py-3 bg-gray-800 hover:bg-blue-900/30 hover:text-blue-400 border border-gray-700 rounded-lg transition-colors font-bold"
                   >
                     백업 파일 다운로드
                   </button>
                 </div>

                 <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-green-400 text-xl">
                     <i className="fas fa-upload"></i>
                   </div>
                   <h3 className="font-bold text-lg mb-2">데이터 복구</h3>
                   <p className="text-sm text-gray-500 mb-6 flex-grow">
                     백업해둔 파일을 불러와 이전 상태로 되돌립니다.
                   </p>
                   <input 
                      type="file" 
                      ref={backupInputRef}
                      onChange={handleRestoreFile}
                      accept=".json"
                      className="hidden"
                    />
                   <button 
                     onClick={() => backupInputRef.current?.click()}
                     className="w-full py-3 bg-gray-800 hover:bg-green-900/30 hover:text-green-400 border border-gray-700 rounded-lg transition-colors font-bold"
                   >
                     백업 파일 불러오기
                   </button>
                 </div>

                 <div className="bg-gray-900 p-6 rounded-xl border border-red-900/30 flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-red-500 text-xl">
                     <i className="fas fa-exclamation-triangle"></i>
                   </div>
                   <h3 className="font-bold text-lg mb-2 text-red-500">공장 초기화</h3>
                   <p className="text-sm text-gray-500 mb-6 flex-grow">
                     모든 데이터를 삭제하고 처음 설치 상태로 되돌립니다.
                   </p>
                   <button 
                     onClick={handleFactoryResetClick}
                     className="w-full py-3 bg-red-900/20 hover:bg-red-900/50 text-red-500 border border-red-900/50 rounded-lg transition-colors font-bold"
                   >
                     초기화 실행
                   </button>
                 </div>
               </div>
             </div>
          </div>
        )}

      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] animate-fade-in flex items-center gap-3 border ${
          toast.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : 
          toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 
          'bg-gray-800 border-gray-600 text-white'
        }`}>
          <i className={`fas ${
            toast.type === 'success' ? 'fa-check-circle text-green-400' : 
            toast.type === 'error' ? 'fa-exclamation-circle text-red-400' : 
            'fa-info-circle text-blue-400'
          }`}></i>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-white">확인 요청</h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal(null)}
                className="px-5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors font-medium"
              >
                취소
              </button>
              <button 
                onClick={executeConfirm}
                className="px-5 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white shadow-lg transition-colors font-bold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;