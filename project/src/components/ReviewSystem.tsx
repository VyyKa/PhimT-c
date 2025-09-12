import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Minus, Send } from 'lucide-react';
import { Review, SentimentScore } from '../types';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface ReviewSystemProps {
  movieId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ movieId, reviews, onAddReview }) => {
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Simple sentiment analysis (mock implementation)
  const analyzeSentiment = (text: string): 'positive' | 'neutral' | 'negative' => {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best', 'awesome', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'boring', 'stupid', 'waste', 'disappointing'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveScore++;
      if (negativeWords.some(nw => word.includes(nw))) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };

  const calculateSentimentScore = (reviews: Review[]): SentimentScore => {
    if (reviews.length === 0) {
      return { positive: 0, neutral: 0, negative: 0, overall: 'neutral' };
    }

    const sentimentCounts = reviews.reduce(
      (acc, review) => {
        acc[review.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const total = reviews.length;
    const positive = (sentimentCounts.positive / total) * 100;
    const neutral = (sentimentCounts.neutral / total) * 100;
    const negative = (sentimentCounts.negative / total) * 100;

    let overall: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positive > neutral && positive > negative) overall = 'positive';
    else if (negative > neutral && negative > positive) overall = 'negative';

    return { positive, neutral, negative, overall };
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const sentimentScore = calculateSentimentScore(reviews);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đánh giá');
      return;
    }

    if (userRating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!userComment.trim()) {
      toast.error('Vui lòng nhập bình luận');
      return;
    }

    setIsSubmitting(true);

    try {
      const sentiment = analyzeSentiment(userComment);
      
      const newReview: Omit<Review, 'id' | 'createdAt'> = {
        userId: user.id,
        userName: user.name,
        rating: userRating,
        comment: userComment.trim(),
        sentiment
      };

      onAddReview(newReview);
      
      setUserRating(0);
      setUserComment('');
      toast.success('Đánh giá đã được thêm thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-6">Đánh giá & Bình luận</h3>

      {/* Rating Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-400">({reviews.length} đánh giá)</span>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= averageRating ? 'text-yellow-500 fill-current' : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="font-semibold mb-3">Phân tích cảm xúc</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="w-4 h-4 text-green-500" />
                <span className="text-sm">Tích cực</span>
              </div>
              <span className="text-green-400">{sentimentScore.positive.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Minus className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Trung tính</span>
              </div>
              <span className="text-gray-400">{sentimentScore.neutral.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ThumbsDown className="w-4 h-4 text-red-500" />
                <span className="text-sm">Tiêu cực</span>
              </div>
              <span className="text-red-400">{sentimentScore.negative.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-4 rounded-lg mb-6"
        >
          <h4 className="font-semibold mb-4">Thêm đánh giá của bạn</h4>
          
          {/* Star Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm">Đánh giá:</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className="transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= userRating ? 'text-yellow-500 fill-current' : 'text-gray-600 hover:text-yellow-400'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <textarea
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-red-600 resize-none"
            rows={3}
          />

          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || userRating === 0 || !userComment.trim()}
            className="mt-3 flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
          </button>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{review.userName}</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating ? 'text-yellow-500 fill-current' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      {getSentimentIcon(review.sentiment)}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">{review.comment}</p>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá bộ phim này!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;