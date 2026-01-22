import React, { useState, useEffect, useRef } from 'react';
import { Car, SiteConfig, Review } from '../types';
import { ASSETS } from '../constants';

interface AdminPanelProps {
  inventory: Car[];
  trash: Car[];
  onSaveCar: (car: Car) => Promise<void>;
  onSoftDeleteCar: (id: string) => Promise<void>;
  onRestoreCar: (id: string) => Promise<void>;
  onPermanentDeleteCar: (id: string) => void;
  reviews: Review[];
  onDeleteReview: (id: string) => Promise<void>;
  config: SiteConfig;
  onSaveConfig: (config: SiteConfig) => Promise<void>;
  onClose: () => void;
  onRestoreData: (data: { inventory?: Car[], trash?: Car[], reviews?: Review[], config?: SiteConfig }) => void;
  onFactoryReset: () => void;
}

type TabType = 'inventory' | 'trash' | 'reviews' | 'settings';
type ViewMode = 'list' | 'form';

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  inventory, trash, onSaveCar, onSoftDeleteCar, onRestoreCar, onPermanentDeleteCar,
  reviews, onDeleteReview, config, onSaveConfig, onClose, onRestoreData, onFactoryReset
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ show: boolean, message: string, action: () => void } | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const carImageInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const ceoImageInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const emptyCar: Car = {
    id: '', make: '', model: '', trim: '', year: new Date().getFullYear(),
    price: 0, mileage: 0, status: '', fuel: '가솔린', color: '',
    transmission: '오토', description: '',
    imageUrl: ASSETS.DEFAULT_CAR_IMAGE,
  };
  const [carForm, setCarForm] = useState<Car>(emptyCar);
  const [configForm, setConfigForm] = useState<SiteConfig>(config);

  useEffect(() => { setConfigForm(config); }, [config]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const requestConfirm = (message: string, action: () => void) => {
    setConfirmModal({ show: true, message, action });
  };

  const executeConfirm = () => {
    if (confirmModal) { confirmModal.action(); setConfirmModal(null); }
  };

  // Image Optimization
  const processImageFile = (file: File, callback: (base64: string) => void) => {
    if (file.size > 2 * 1024 * 1024) { // 2MB Check
      showToast('⚠️ 파일이 큽니다. 자동으로 압축합니다.', 'info');
    }
    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600; 
        const scaleSize = MAX_WIDTH / img.width;
        if (scaleSize < 1) {
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6); // High compression
        callback(dataUrl);
        setIsProcessingImage(false);
        showToast('이미지 최적화 완료', 'success');
      };
      img.onerror = () => { setIsProcessingImage(false); showToast('이미지 처리 오류', 'error'); };
    };
    reader.onerror = () => { setIsProcessingImage(false); showToast('파일 읽기 오류', 'error'); };
  };

  // Handlers
  const handleBackup = () => {
    const data = { inventory, trash, reviews, config, timestamp: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eom-motors-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    showToast('백업 파일이 다운로드되었습니다.');
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    requestConfirm('데이터를 덮어쓰고 복원하시겠습니까? (취소 불가)', () => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          onRestoreData(data);
          showToast('데이터 복원 완료', 'success');
        } catch { showToast('잘못된 백업 파일입니다.', 'error'); }
      };
      reader.readAsText(file);
    });
    e.target.value = '';
  };

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carForm.make || !carForm.model) return showToast('제조사와 모델명은 필수입니다.', 'error');
    const carToSave = { ...carForm, id: carForm.id || Date.now().toString() };
    try {
      await onSaveCar(carToSave);
      showToast('저장되었습니다!', 'success');
      setCarForm(emptyCar);
      setViewMode('list');
    } catch { showToast('❌ 저장 실패', 'error'); }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSaveConfig(configForm);
      showToast('설정이 저장되었습니다!', 'success');
    } catch { showToast('❌ 설정 저장 실패', 'error'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-brand-black text-white font-sans">
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2"><i className="fas fa-shield-alt text-brand-blue"></i> Admin Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {['inventory', 'trash', 'reviews', 'settings'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab as TabType); setViewMode('list'); }}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === tab ? 'bg-brand-blue text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}>
              <i className={`fas fa-${tab === 'inventory' ? 'car' : tab === 'trash' ? 'trash-restore' : tab === 'reviews' ? 'comments' : 'cog'} w-5 text-center`}></i>
              {tab === 'inventory' ? '매물 관리' : tab === 'trash' ? '휴지통' : tab === 'reviews' ? '후기 관리' : '일반 설정'}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={onClose} className="w-full border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded transition-colors"><i className="fas fa-sign-out-alt"></i> 종료</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-brand-black p-8 relative">
        {activeTab === 'inventory' && (
          <div className="max-w-6xl mx-auto">
            {viewMode === 'list' ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold">매물 관리</h1>
                  <button onClick={() => { setCarForm(emptyCar); setViewMode('form'); }} className="bg-brand-blue hover:bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg"><i className="fas fa-plus mr-2"></i> 등록</button>
                </div>
                
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-black/50 text-gray-400 text-sm uppercase">
                      <tr><th className="p-4">이미지</th><th className="p-4">정보</th><th className="p-4">가격</th><th className="p-4">상태</th><th className="p-4 text-right">관리</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {inventory.map(car => (
                        <tr key={car.id} className="hover:bg-gray-800/50">
                          <td className="p-4"><img src={car.imageUrl} className="w-16 h-12 object-cover rounded bg-gray-800" alt="thumb" onError={(e) => e.currentTarget.src = ASSETS.PLACEHOLDER_IMAGE} /></td>
                          <td className="p-4"><div className="font-bold text-white">{car.make} {car.model}</div><div className="text-xs text-gray-500">{car.year}년 · {car.mileage.toLocaleString()}km</div></td>
                          <td className="p-4 text-brand-blue font-bold">{(car.price / 10000).toLocaleString()}만원</td>
                          <td className="p-4"><span className="bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700">{car.status}</span></td>
                          <td className="p-4 text-right space-x-2">
                            <button onClick={() => { setCarForm({...car}); setViewMode('form'); }} className="bg-gray-800 hover:bg-brand-blue text-gray-300 hover:text-white p-2 rounded"><i className="fas fa-pencil-alt"></i></button>
                            <button onClick={() => requestConfirm('휴지통으로 이동하시겠습니까?', () => onSoftDeleteCar(car.id))} className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white p-2 rounded"><i className="fas fa-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {inventory.length === 0 && <div className="p-8 text-center text-gray-500">등록된 매물이 없습니다.</div>}
                </div>
              </>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 shadow-xl">
                 <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-800">
                   <h3 className="text-xl font-bold text-brand-blue">{carForm.id ? '수정' : '등록'}</h3>
                   <button onClick={() => { setCarForm(emptyCar); setViewMode('list'); }}><i className="fas fa-times text-xl text-gray-500 hover:text-white"></i></button>
                 </div>
                 <form onSubmit={handleCarSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Basic Fields */}
                    {[{l:'제조사',n:'make'},{l:'모델명',n:'model'},{l:'세부트림',n:'trim'},{l:'연료',n:'fuel'},{l:'상태',n:'status'}].map(f => (
                      <div key={f.n} className="col-span-1"><label className="text-xs text-gray-500 block mb-1">{f.l}</label><input className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name={f.n} value={(carForm as any)[f.n]} onChange={(e) => setCarForm({...carForm, [f.n]: e.target.value})} required={['make','model'].includes(f.n)} /></div>
                    ))}
                    {[{l:'연식',n:'year'},{l:'가격 (원)',n:'price'},{l:'주행거리',n:'mileage'}].map(f => (
                      <div key={f.n} className="col-span-1"><label className="text-xs text-gray-500 block mb-1">{f.l}</label><input type="number" className="w-full bg-black border border-gray-700 rounded p-3 focus:border-brand-blue outline-none" name={f.n} value={(carForm as any)[f.n]} onChange={(e) => setCarForm({...carForm, [f.n]: Number(e.target.value)})} /></div>
                    ))}
                    <div className="md:col-span-4">
                      <label className="text-xs text-gray-500 block mb-1">이미지 (URL 또는 파일)</label>
                      <div className="flex gap-2">
                        <input className="flex-1 bg-black border border-gray-700 rounded p-3" name="imageUrl" value={carForm.imageUrl} onChange={(e) => setCarForm({...carForm, imageUrl: e.target.value})} placeholder="https://..." />
                        <input type="file" ref={carImageInputRef} onChange={(e) => e.target.files?.[0] && processImageFile(e.target.files[0], (base64) => setCarForm(prev => ({ ...prev, imageUrl: base64 })))} accept="image/*" className="hidden" />
                        <button type="button" onClick={() => carImageInputRef.current?.click()} className="bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 whitespace-nowrap"><i className="fas fa-camera"></i> 파일</button>
                      </div>
                      {carForm.imageUrl && <div className="mt-2 h-32 bg-gray-800 rounded overflow-hidden"><img src={carForm.imageUrl} className="h-full object-contain" onError={(e) => e.currentTarget.src = ASSETS.PLACEHOLDER_IMAGE} /></div>}
                    </div>
                    <div className="md:col-span-4"><label className="text-xs text-gray-500 block mb-1">설명</label><textarea className="w-full bg-black border border-gray-700 rounded p-3 h-24" name="description" value={carForm.description} onChange={(e) => setCarForm({...carForm, description: e.target.value})} /></div>
                    <div className="md:col-span-4 flex justify-end gap-3 mt-4 border-t border-gray-800 pt-4">
                       <button type="button" onClick={() => setViewMode('list')} className="bg-gray-800 px-6 py-3 rounded text-white font-bold">취소</button>
                       <button type="submit" className="bg-brand-blue px-8 py-3 rounded text-white font-bold" disabled={isProcessingImage}><i className="fas fa-save mr-2"></i> 저장</button>
                    </div>
                 </form>
              </div>
            )}
          </div>
        )}

        {/* Trash Tab */}
        {activeTab === 'trash' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-red-500"><i className="fas fa-trash-alt"></i> 휴지통 (내 PC 전용)</h1>
            <div className="bg-gray-900 border border-red-900/30 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left">
                <thead className="bg-red-900/20 text-red-200 text-sm uppercase"><tr><th className="p-4">정보</th><th className="p-4 text-right">관리</th></tr></thead>
                <tbody className="divide-y divide-gray-800">
                  {trash.map(car => (
                    <tr key={car.id} className="hover:bg-red-900/10">
                      <td className="p-4 flex gap-4 items-center opacity-50">
                        <img src={car.imageUrl} className="w-16 h-12 object-cover rounded bg-gray-800 grayscale" onError={(e) => e.currentTarget.src = ASSETS.PLACEHOLDER_IMAGE} />
                        <div><div className="font-bold text-gray-300">{car.make} {car.model}</div></div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => requestConfirm('복구하시겠습니까?', () => onRestoreCar(car.id))} className="bg-green-700 text-white px-3 py-1.5 rounded"><i className="fas fa-undo"></i></button>
                        <button onClick={() => requestConfirm('영구 삭제하시겠습니까?', () => onPermanentDeleteCar(car.id))} className="bg-red-900 text-white px-3 py-1.5 rounded"><i className="fas fa-times"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {trash.length === 0 && <div className="p-12 text-center text-gray-500">휴지통이 비어있습니다.</div>}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
           <div className="max-w-6xl mx-auto">
             <h1 className="text-3xl font-bold mb-8"><i className="fas fa-comments"></i> 후기 관리</h1>
             <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
               <table className="w-full text-left">
                 <thead className="bg-black/50 text-gray-400 text-sm uppercase"><tr><th className="p-4">내용</th><th className="p-4 text-right">관리</th></tr></thead>
                 <tbody className="divide-y divide-gray-800">
                   {reviews.map(review => (
                     <tr key={review.id} className="hover:bg-gray-800/50">
                       <td className="p-4">
                         <div className="font-bold text-white">{review.author} <span className="text-brand-blue text-xs">({review.carModel})</span></div>
                         <div className="text-xs text-gray-400">{review.date} · ⭐{review.rating}</div>
                         <div className="text-sm text-gray-300 truncate max-w-lg">{review.title}</div>
                       </td>
                       <td className="p-4 text-right">
                         <button onClick={() => requestConfirm('삭제하시겠습니까?', () => onDeleteReview(review.id))} className="bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white px-3 py-1.5 rounded"><i className="fas fa-trash"></i></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {reviews.length === 0 && <div className="p-12 text-center text-gray-500">후기가 없습니다.</div>}
             </div>
           </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto pb-10">
             <h1 className="text-3xl font-bold mb-8">일반 설정</h1>
             <form onSubmit={handleConfigSubmit} className="space-y-6">
               <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                 <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">이미지 설정</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">히어로 이미지</label>
                      <div className="flex gap-2">
                        <input name="heroImageUrl" value={configForm.heroImageUrl} onChange={(e) => setConfigForm({...configForm, heroImageUrl: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2" placeholder="URL" />
                        <input type="file" ref={heroImageInputRef} className="hidden" onChange={(e) => e.target.files?.[0] && processImageFile(e.target.files[0], (base64) => setConfigForm({...configForm, heroImageUrl: base64}))} accept="image/*" />
                        <button type="button" onClick={() => heroImageInputRef.current?.click()} className="bg-gray-800 border border-gray-700 p-2 rounded"><i className="fas fa-camera"></i></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">CEO 이미지</label>
                      <div className="flex gap-2">
                         <input name="ceoImageUrl" value={configForm.ceoImageUrl} onChange={(e) => setConfigForm({...configForm, ceoImageUrl: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2" placeholder="URL" />
                         <input type="file" ref={ceoImageInputRef} className="hidden" onChange={(e) => e.target.files?.[0] && processImageFile(e.target.files[0], (base64) => setConfigForm({...configForm, ceoImageUrl: base64}))} accept="image/*" />
                         <button type="button" onClick={() => ceoImageInputRef.current?.click()} className="bg-gray-800 border border-gray-700 p-2 rounded"><i className="fas fa-camera"></i></button>
                      </div>
                      {configForm.ceoImageUrl && <img src={configForm.ceoImageUrl} className="mt-2 w-20 h-20 object-cover rounded bg-gray-800" onError={(e) => e.currentTarget.src = ASSETS.PLACEHOLDER_IMAGE} />}
                    </div>
                 </div>
               </div>
               
               <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                 <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">텍스트 설정</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {['brandName','brandNameHighlight','ceoName','licenseNumber','contactPhone','contactEmail'].map(f => (
                      <div key={f}><label className="text-xs text-gray-500 uppercase block mb-1">{f}</label><input name={f} value={(configForm as any)[f]} onChange={(e) => setConfigForm({...configForm, [f]: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2" /></div>
                    ))}
                    <div className="col-span-2"><label className="text-xs text-gray-500 block mb-1">주소</label><input name="contactAddress" value={configForm.contactAddress} onChange={(e) => setConfigForm({...configForm, contactAddress: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2" /></div>
                 </div>
               </div>

               <button type="submit" className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg" disabled={isProcessingImage}>설정 저장하기</button>
             </form>

             <div className="mt-12 pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
               <button onClick={handleBackup} className="bg-gray-800 hover:bg-blue-900/30 text-blue-400 py-3 rounded-lg border border-gray-700 font-bold"><i className="fas fa-download mr-2"></i> 백업 다운로드</button>
               <div className="relative">
                 <input type="file" ref={backupInputRef} onChange={handleRestoreFile} accept=".json" className="hidden" />
                 <button onClick={() => backupInputRef.current?.click()} className="w-full bg-gray-800 hover:bg-green-900/30 text-green-400 py-3 rounded-lg border border-gray-700 font-bold"><i className="fas fa-upload mr-2"></i> 백업 복구</button>
               </div>
               <button onClick={() => requestConfirm('정말 초기화하시겠습니까?', onFactoryReset)} className="bg-red-900/20 hover:bg-red-900/50 text-red-500 py-3 rounded-lg border border-red-900/50 font-bold"><i className="fas fa-exclamation-triangle mr-2"></i> 공장 초기화</button>
             </div>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] border font-bold ${toast.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 'bg-gray-800 border-gray-600 text-white'}`}>
          {toast.message}
        </div>
      )}

      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">확인</h3>
            <p className="text-gray-300 mb-8">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmModal(null)} className="px-5 py-2 rounded bg-gray-800 text-gray-300">취소</button>
              <button onClick={executeConfirm} className="px-5 py-2 rounded bg-brand-blue text-white font-bold">확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;