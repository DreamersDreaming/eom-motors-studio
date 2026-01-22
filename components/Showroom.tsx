import React, { useState } from 'react';
import { Car } from '../types';
import CarDetail from './CarDetail';

interface ShowroomProps {
  inventory: Car[];
  isAdmin: boolean;
  onEdit: (id: string) => void;
}

const Showroom: React.FC<ShowroomProps> = ({ inventory, isAdmin, onEdit }) => {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const formatCurrency = (amount: number) => {
    if (amount >= 100000000) {
      const eok = Math.floor(amount / 100000000);
      const remainder = Math.floor((amount % 100000000) / 10000);
      return remainder > 0 ? `${eok}억 ${remainder.toLocaleString()}만원` : `${eok}억원`;
    }
    return `${(amount / 10000).toLocaleString()}만원`;
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const handleCarClick = (car: Car) => {
    setSelectedCar(car);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedCar(null);
    document.body.style.overflow = 'auto';
  };

  const handleInquiryFromModal = () => {
    handleCloseModal();
    const element = document.getElementById('sell-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 강력한 폴백 핸들러
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://placehold.co/800x600/121212/2563EB?text=EOM+MOTORS';
  };

  return (
    <section id="showroom" className="py-20 bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-sans text-white">Eom Motors <span className="text-brand-blue">Showroom</span></h2>
          <p className="text-gray-400">엄격한 기준으로 선별된 최고의 매물을 만나보세요.</p>
        </div>

        {inventory.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-500 text-xl">현재 등록된 매물이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inventory.map((car) => (
              <div 
                key={car.id} 
                onClick={() => handleCarClick(car)}
                className="group bg-brand-black border border-gray-800 hover:border-brand-blue/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] flex flex-col cursor-pointer relative"
              >
                <div className="relative h-64 overflow-hidden bg-gray-900">
                  <img 
                    src={car.imageUrl} 
                    alt={car.model} 
                    onError={handleImageError}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold border border-white/10 text-white z-10">
                    {car.year}년식
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-4 left-4 bg-brand-blue shadow-lg px-3 py-1 rounded text-xs font-bold text-white z-10">
                    {car.status.split(',')[0]}
                  </div>

                  {/* Admin Edit Button */}
                  {isAdmin && (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onEdit(car.id); 
                      }}
                      className="absolute top-4 left-4 bg-white text-brand-blue w-9 h-9 rounded-full flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all shadow-xl z-20 transform hover:scale-110"
                      title="매물 수정"
                    >
                      <i className="fas fa-pencil-alt text-sm"></i>
                    </button>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow relative bg-gradient-to-b from-brand-black to-gray-900/20">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-brand-blue text-sm font-bold uppercase tracking-wider">{car.make}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 font-montserrat group-hover:text-brand-blue transition-colors">{car.model}</h3>
                  <p className="text-sm text-gray-500 mb-4 font-light">{car.trim || '상세 모델명 없음'}</p>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-400 mb-6 font-montserrat border-b border-gray-800 pb-4">
                    <span className="flex items-center gap-1"><i className="fas fa-road text-brand-gray w-4"></i> {formatNumber(car.mileage)}km</span>
                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                    <span className="flex items-center gap-1"><i className="fas fa-gas-pump text-brand-gray w-4"></i> {car.fuel || '가솔린'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-white font-sans tracking-tight">{formatCurrency(car.price)}</span>
                    <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                      <i className="fas fa-arrow-right text-xs"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCar && (
        <CarDetail 
          car={selectedCar} 
          onClose={handleCloseModal} 
          onInquiry={handleInquiryFromModal}
        />
      )}
    </section>
  );
};

export default Showroom;