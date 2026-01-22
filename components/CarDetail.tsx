import React from 'react';
import { Car } from '../types';

interface CarDetailProps {
  car: Car;
  onClose: () => void;
  onInquiry: () => void;
}

const CarDetail: React.FC<CarDetailProps> = ({ car, onClose, onInquiry }) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) {
      const eok = Math.floor(amount / 100000000);
      const remainder = Math.floor((amount % 100000000) / 10000);
      return remainder > 0 ? `${eok}억 ${remainder.toLocaleString()}만원` : `${eok}억원`;
    }
    return `${(amount / 10000).toLocaleString()}만원`;
  };

  const formatNumber = (num: number) => num.toLocaleString();

  // 강력한 폴백 핸들러
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://placehold.co/800x600/121212/2563EB?text=EOM+MOTORS';
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl h-full md:h-auto max-h-[90vh] bg-brand-dark border border-gray-800 rounded-2xl shadow-2xl overflow-y-auto flex flex-col md:flex-row">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center md:hidden"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Left: Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black">
          <img 
            src={car.imageUrl} 
            alt={car.model} 
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
             <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
               {car.status}
             </span>
          </div>
        </div>

        {/* Right: Info */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-brand-blue font-bold tracking-widest text-sm uppercase mb-1">{car.make}</h3>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{car.model}</h2>
              <p className="text-gray-400 text-lg mb-4">{car.trim || '상세 모델명 없음'}</p>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:flex text-gray-500 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-gray-800 pb-6">
            {formatCurrency(car.price)}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 block uppercase">연식</span>
              <span className="text-white font-medium flex items-center gap-2">
                <i className="far fa-calendar text-brand-blue w-4"></i> {car.year}년
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 block uppercase">주행거리</span>
              <span className="text-white font-medium flex items-center gap-2">
                <i className="fas fa-road text-brand-blue w-4"></i> {formatNumber(car.mileage)}km
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 block uppercase">연료</span>
              <span className="text-white font-medium flex items-center gap-2">
                <i className="fas fa-gas-pump text-brand-blue w-4"></i> {car.fuel || '가솔린'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 block uppercase">색상</span>
              <span className="text-white font-medium flex items-center gap-2">
                <i className="fas fa-palette text-brand-blue w-4"></i> {car.color || '블랙'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 block uppercase">변속기</span>
              <span className="text-white font-medium flex items-center gap-2">
                <i className="fas fa-cogs text-brand-blue w-4"></i> {car.transmission || '오토'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-gray-500 block uppercase">차량번호</span>
              <span className="text-white font-medium flex items-center gap-2">
                <i className="fas fa-car text-brand-blue w-4"></i> 문의
              </span>
            </div>
          </div>

          <div className="bg-brand-black p-4 rounded-lg border border-gray-800 mb-8">
            <h4 className="text-sm font-bold text-white mb-2">딜러 코멘트</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {car.description}
            </p>
          </div>

          <div className="mt-auto flex gap-4">
             <button 
               onClick={onInquiry}
               className="flex-1 bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
             >
               <i className="fas fa-comment-dots"></i> 구매 상담 요청
             </button>
             <button 
               className="flex-1 border border-gray-700 hover:bg-gray-800 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
               onClick={() => window.open('tel:010-9288-2333')}
             >
               <i className="fas fa-phone"></i> 전화 상담
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;