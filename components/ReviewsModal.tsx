import React from 'react';
import { Review } from '../types';

interface ReviewsModalProps {
  reviews: Review[];
  onClose: () => void;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({ reviews, onClose }) => {
  // Prevent body scroll on mount
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm" 
        onClick={onClose}
      ></div>

      <div className="relative w-full h-full md:h-[90vh] md:max-w-6xl bg-brand-dark md:rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-brand-dark z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">리얼 포토 후기</h2>
            <p className="text-sm text-gray-400">고객님들이 직접 작성해주신 소중한 이야기입니다.</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 flex items-center justify-center transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-black/50">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="break-inside-avoid bg-brand-dark border border-gray-800 rounded-xl overflow-hidden hover:border-brand-blue/30 transition-all duration-300 shadow-lg"
              >
                {/* Optional Image */}
                {review.imageUrl && (
                  <div className="relative h-48 overflow-hidden bg-gray-900">
                    <img 
                      src={review.imageUrl} 
                      alt="Review" 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* Header: User & Rating */}
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-blue-800 flex items-center justify-center text-white text-xs font-bold">
                         {review.author.charAt(0)}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">{review.author}</p>
                         <p className="text-xs text-gray-500">{review.date}</p>
                       </div>
                     </div>
                     <div className="flex text-yellow-500 text-xs gap-0.5">
                       {[...Array(review.rating)].map((_, i) => (
                         <i key={i} className="fas fa-star"></i>
                       ))}
                     </div>
                  </div>

                  {/* Car Badge */}
                  <div className="mb-3">
                     <span className="inline-block px-2 py-1 rounded bg-gray-800 text-brand-blue text-xs font-medium border border-gray-700">
                       <i className="fas fa-car mr-1"></i> {review.carModel}
                     </span>
                  </div>

                  {/* Title & Content */}
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">{review.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {review.content}
                  </p>

                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800/50">
                      {review.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs text-brand-blue hover:underline cursor-pointer">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;