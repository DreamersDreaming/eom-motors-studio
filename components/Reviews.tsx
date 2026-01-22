import React, { useState } from 'react';
import { Review } from '../types';
import ReviewsModal from './ReviewsModal';

interface ReviewsProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews, onAddReview }) => {
  const [showModal, setShowModal] = useState(false);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Write Form State
  const [writeForm, setWriteForm] = useState({
    author: '',
    carModel: '',
    rating: 5,
    title: '',
    content: '',
    imageUrl: '',
    tags: ''
  });

  const handleWriteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: Date.now().toString(),
      author: writeForm.author,
      title: writeForm.title,
      content: writeForm.content,
      carModel: writeForm.carModel,
      rating: writeForm.rating,
      date: new Date().toLocaleDateString(),
      imageUrl: writeForm.imageUrl,
      tags: writeForm.tags.split(',').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`).filter(t => t !== '#')
    };
    
    onAddReview(newReview);
    setShowWriteModal(false);
    setWriteForm({ author: '', carModel: '', rating: 5, title: '', content: '', imageUrl: '', tags: '' });
    
    // Show custom success modal instead of alert
    setShowSuccessModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWriteForm(prev => ({ ...prev, [name]: value }));
  };

  // Duplicate reviews to create seamless loop for the marquee
  // Ensure we have at least a few items for marquee to work smoothly
  const displayReviews = reviews.length > 0 ? [...reviews, ...reviews, ...reviews] : [];

  return (
    <>
      <section id="reviews" className="py-24 bg-brand-black relative overflow-hidden">
        {/* Decorative bg elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 relative z-10 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Customer <span className="text-brand-blue">Reviews</span></h2>
              <p className="text-gray-400">엄모터스 엠월드점을 방문해주신 고객님들의 리얼 후기입니다.</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => setShowWriteModal(true)}
                className="bg-brand-blue text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg"
              >
                <i className="fas fa-pen"></i> 후기 작성하기
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="group text-gray-300 border border-gray-600 px-6 py-2 rounded-full hover:border-brand-blue hover:text-brand-blue transition-colors flex items-center gap-2"
              >
                후기 더보기 <i className="fas fa-plus text-xs group-hover:rotate-180 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Marquee Container */}
        {displayReviews.length > 0 ? (
          <div className="relative w-full overflow-hidden">
            <div className="flex w-max animate-scroll gap-6 px-6 hover:[animation-play-state:paused]">
              {displayReviews.map((review, index) => (
                <div 
                  key={`${review.id}-${index}`} 
                  onClick={() => setShowModal(true)}
                  className="w-[350px] md:w-[450px] flex-shrink-0 bg-brand-dark p-8 rounded-2xl border border-gray-800 hover:border-brand-blue/50 transition-colors shadow-lg cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <i key={i} className="fas fa-star text-sm"></i>
                      ))}
                    </div>
                    <span className="text-xs text-brand-blue border border-brand-blue/30 px-2 py-1 rounded bg-brand-blue/10">
                      {review.carModel}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-3 line-clamp-1 group-hover:text-brand-blue transition-colors">{review.title}</h3>
                  
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">
                    "{review.content}"
                  </p>
                  
                  {/* Photo Badge if image exists */}
                  {review.imageUrl && (
                     <div className="mb-4">
                       <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded flex items-center gap-1 w-max">
                         <i className="fas fa-camera"></i> 포토 후기
                       </span>
                     </div>
                  )}
                  
                  <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs">
                        <i className="fas fa-user"></i>
                      </div>
                      <span className="font-medium text-white text-sm">{review.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Gradient Fade Edges */}
            <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-brand-black to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-brand-black to-transparent pointer-events-none"></div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>등록된 후기가 없습니다. 첫 후기의 주인공이 되어보세요!</p>
          </div>
        )}
        
        {/* Mobile Buttons */}
        <div className="md:hidden mt-8 px-6 flex flex-col gap-3">
             <button 
               onClick={() => setShowWriteModal(true)}
               className="w-full bg-brand-blue text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg font-bold"
             >
              <i className="fas fa-pen mr-2"></i> 후기 작성하기
            </button>
             <button 
               onClick={() => setShowModal(true)}
               className="w-full text-brand-blue border border-brand-blue px-6 py-3 rounded-full hover:bg-brand-blue hover:text-white transition-colors"
             >
              더 많은 후기 보기
            </button>
        </div>
      </section>

      {/* Review Detail Modal */}
      {showModal && (
        <ReviewsModal reviews={reviews} onClose={() => setShowModal(false)} />
      )}

      {/* Write Review Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
           <div className="bg-brand-dark border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
             <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 rounded-t-2xl">
               <h3 className="text-xl font-bold text-white">소중한 후기 작성</h3>
               <button onClick={() => setShowWriteModal(false)} className="text-gray-500 hover:text-white">
                 <i className="fas fa-times text-xl"></i>
               </button>
             </div>
             
             <div className="p-6 overflow-y-auto">
               <form onSubmit={handleWriteSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs text-gray-500 mb-1">작성자명 <span className="text-brand-blue">*</span></label>
                     <input required name="author" value={writeForm.author} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" placeholder="홍길동" />
                   </div>
                   <div>
                     <label className="block text-xs text-gray-500 mb-1">구매 차종 <span className="text-brand-blue">*</span></label>
                     <input required name="carModel" value={writeForm.carModel} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" placeholder="예: BMW 520d" />
                   </div>
                 </div>

                 <div>
                    <label className="block text-xs text-gray-500 mb-2">만족도</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setWriteForm(prev => ({...prev, rating: star}))}
                          className={`text-2xl transition-transform hover:scale-110 ${writeForm.rating >= star ? 'text-yellow-500' : 'text-gray-700'}`}
                        >
                          <i className="fas fa-star"></i>
                        </button>
                      ))}
                    </div>
                 </div>

                 <div>
                   <label className="block text-xs text-gray-500 mb-1">제목 <span className="text-brand-blue">*</span></label>
                   <input required name="title" value={writeForm.title} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" placeholder="한줄 평을 남겨주세요" />
                 </div>

                 <div>
                   <label className="block text-xs text-gray-500 mb-1">내용 <span className="text-brand-blue">*</span></label>
                   <textarea required name="content" value={writeForm.content} onChange={handleChange} rows={4} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none resize-none" placeholder="자세한 후기는 다른 고객님들께 큰 도움이 됩니다." />
                 </div>

                 <div>
                   <label className="block text-xs text-gray-500 mb-1">사진 URL (선택)</label>
                   <input name="imageUrl" value={writeForm.imageUrl} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" placeholder="https://..." />
                 </div>

                 <div>
                   <label className="block text-xs text-gray-500 mb-1">태그 (쉼표로 구분)</label>
                   <input name="tags" value={writeForm.tags} onChange={handleChange} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-brand-blue outline-none" placeholder="예: 친절, 첫차, 대만족" />
                 </div>

                 <button type="submit" className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 shadow-lg transition-transform active:scale-95">
                   후기 등록하기
                 </button>
               </form>
             </div>
           </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-brand-blue/30 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative transform transition-all scale-100">
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check-circle text-4xl text-brand-blue animate-bounce"></i>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">작성 완료!</h3>
            
            <p className="text-gray-300 mb-8 leading-relaxed text-sm">
              소중한 후기가 등록되었습니다.<br/>
              고객님의 이야기는 큰 힘이 됩니다.
            </p>
            
            <button 
              onClick={() => setShowSuccessModal(false)} 
              className="bg-brand-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full transition-all shadow-lg hover:shadow-brand-blue/25"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;