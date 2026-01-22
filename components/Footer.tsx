import React, { useState } from 'react';
import { SiteConfig } from '../types';
import { ASSETS } from '../constants';

interface FooterProps {
  config: SiteConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  const [form, setForm] = useState({ 
    name: '', 
    contact: '', 
    targetCar: '',
    grade: '',
    year: '',
    mileage: '',
    options: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('contact', form.contact);
    formData.append('targetCar', form.targetCar);
    
    const message = `
이름: ${form.name}
연락처: ${form.contact}
관심 차량: ${form.targetCar}
원하는 등급/사양: ${form.grade || '미입력'}
희망 연식: ${form.year || '미입력'}
희망 주행거리: ${form.mileage || '미입력'}
추가 옵션: ${form.options || '없음'}

빠른 상담 부탁드립니다.`;

    formData.append('message', message.trim());
    formData.append('_subject', `[${config.brandName}] ${form.name}님의 상세 구매 상담 신청`);

    try {
      const response = await fetch("https://formspree.io/f/mdaaroog", {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setShowSuccessModal(true);
        setForm({ 
          name: '', contact: '', targetCar: '', grade: '', year: '', mileage: '', options: ''
        });
        setShowOptions(false);
      } else {
        alert("❌ 접수 중 오류가 발생했습니다. 전화 문의 부탁드립니다.");
      }
    } catch (error) {
      alert("❌ 네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // 무한 루프 방지 및 안전한 폴백 처리
    const target = e.currentTarget;
    if (target.src !== ASSETS.CEO_IMAGE_URL) {
      target.src = ASSETS.CEO_IMAGE_URL;
    } else {
      target.style.display = 'none'; // 최악의 경우 이미지를 숨김
    }
  };

  return (
    <footer id="footer" className="bg-neutral-900 border-t border-gray-800 pt-20 pb-10 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Company Info */}
          <div>
            <div className="text-3xl font-bold font-montserrat tracking-tighter mb-6">
              <span className="text-brand-blue">{config.brandName}</span> <span className="text-white">{config.brandNameHighlight}</span>
            </div>
            <p className="text-gray-400 mb-8 leading-loose">
              {config.brandName}{config.brandNameHighlight}는 고객님께 최고의 중고차 구매 경험을 제공합니다.<br />
              투명한 시세 공개와 엄격한 검수를 통과한 프리미엄 매물만을 취급합니다.
            </p>

            {/* CEO Profile Section */}
            <div className="flex items-center gap-6 mb-10 bg-brand-black p-5 rounded-xl border border-gray-800 max-w-md shadow-lg transform transition hover:scale-[1.02] duration-300">
              <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
                <img 
                  src={config.ceoImageUrl || ASSETS.CEO_IMAGE_URL} 
                  alt="CEO Profile" 
                  onError={handleImageError}
                  className="w-full h-full object-cover object-top filter hover:brightness-110 transition-all duration-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-brand-blue text-xs font-bold border border-brand-blue px-1.5 py-0.5 rounded">CEO</span>
                  <h4 className="text-white font-bold text-lg">{config.ceoName} <span className="text-xs text-gray-500 font-normal">대표</span></h4>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p className="flex items-center gap-2">
                    <i className="fas fa-id-card text-gray-600 text-xs w-4 text-center"></i>
                    <span>사원증번호: <span className="text-gray-300 font-mono">{config.licenseNumber}</span></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <i className="fas fa-building text-gray-600 text-xs w-4 text-center"></i>
                    <span>업체명: <span className="text-gray-300">{config.brandName} {config.brandNameHighlight}</span></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <i className="fas fa-award text-gray-600 text-xs w-4 text-center"></i>
                    <span className="text-xs text-brand-blue">정식 인증 딜러</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 text-gray-300">
                <i className="fas fa-map-marker-alt text-brand-blue w-6 text-center mt-1"></i>
                <span>{config.contactAddress}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <i className="fas fa-phone text-brand-blue w-6 text-center"></i>
                <span>{config.contactPhone}</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <i className="fas fa-envelope text-brand-blue w-6 text-center"></i>
                <span>{config.contactEmail}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-brand-blue transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-brand-blue transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-colors">
                <i className="fas fa-comment"></i>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div id="sell-section" className="bg-black p-8 rounded-2xl border border-gray-800 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-brand-blue">1:1</span> 맞춤 구매/판매 상담
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 ml-1">성함 <span className="text-brand-blue">*</span></label>
                  <input type="text" name="name" placeholder="홍길동" required value={form.name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 ml-1">연락처 <span className="text-brand-blue">*</span></label>
                  <input type="text" name="contact" placeholder="010-0000-0000" required value={form.contact} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 ml-1">관심 차량 (모델명) <span className="text-brand-blue">*</span></label>
                <input type="text" name="targetCar" placeholder="예: 제네시스 G80" required value={form.targetCar} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 ml-1">원하는 등급 / 사양</label>
                <input type="text" name="grade" placeholder="예: 2.5 터보 AWD" value={form.grade} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 ml-1">희망 연식</label>
                  <input type="text" name="year" placeholder="예: 2020년식 이상" value={form.year} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 ml-1">희망 주행거리</label>
                  <input type="text" name="mileage" placeholder="예: 5만km 미만" value={form.mileage} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors" />
                </div>
              </div>
              <div className="pt-2">
                <button type="button" onClick={() => setShowOptions(!showOptions)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 focus:outline-none transition-colors">
                  <i className={`fas ${showOptions ? 'fa-minus-square' : 'fa-plus-square'} text-brand-blue`}></i>
                  {showOptions ? '옵션 입력 닫기' : '추가 옵션 입력 (선루프, HUD 등)'}
                </button>
                {showOptions && (
                  <div className="mt-3 animate-fade-in">
                    <textarea name="options" rows={3} placeholder="요청사항을 자유롭게 적어주세요." value={form.options} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-colors resize-none text-sm" />
                  </div>
                )}
              </div>
              <button type="submit" disabled={isSubmitting} className={`w-full bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2 mt-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}>
                {isSubmitting ? <><i className="fas fa-circle-notch fa-spin"></i> 접수 중...</> : <><i className="fas fa-paper-plane"></i> 상담 신청하기</>}
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} {config.brandName} {config.brandNameHighlight}. All rights reserved.</p>
        </div>
      </div>
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-brand-blue/30 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative transform transition-all scale-100">
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><i className="fas fa-times text-xl"></i></button>
            <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6"><i className="fas fa-check-circle text-4xl text-brand-blue animate-bounce"></i></div>
            <h3 className="text-2xl font-bold text-white mb-4">상담 신청 완료!</h3>
            <p className="text-gray-300 mb-8 leading-relaxed">담당자 확인 후 빠르게 연락 드리겠습니다.</p>
            <button onClick={() => setShowSuccessModal(false)} className="bg-brand-blue hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold w-full shadow-lg">확인</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;