import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Star, MessageSquarePlus } from 'lucide-react';

export default function ReviewsSection() {
  const { reviews, addReview } = useContext(AppContext);

  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Please fill out both name and review comment fields.');
      return;
    }
    
    addReview({ name, rating, comment });
    
    // Clear fields & show confirmation micro-interaction
    setName('');
    setRating(5);
    setComment('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  // Avatar generation helpers
  const getInitials = (userName) => {
    return userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarBg = (userName) => {
    const colors = ['#b45309', '#d97706', '#eab308', '#c2410c', '#854d0e', '#1e293b'];
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="reviews-section-container">
      <div className="container">
        <h2 className="section-title">Customer Experience & Reviews</h2>
        
        <div className="reviews-grid">
          {/* Left panel: Aggregates and Form */}
          <div className="reviews-meta-form-panel">
            {/* Scorecard */}
            <div className="reviews-scorecard">
              <div className="scorecard-big-num">{averageRating}</div>
              <div className="scorecard-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={20}
                    className={s <= Math.round(averageRating) ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>
              <p className="scorecard-text">Based on {reviews.length} customer responses</p>
            </div>

            {/* Submission Form */}
            <div className="review-form-card">
              <h3>Share Your Feedback</h3>
              <p>Help us improve our interior and carpentry designs.</p>
              
              {formSubmitted && (
                <div className="review-success-badge">
                  Feedback submitted! Thank you for writing a review.
                </div>
              )}

              <form onSubmit={handleSubmit} className="new-review-form">
                <div className="form-group">
                  <label htmlFor="rev-name">Your Full Name</label>
                  <input
                    id="rev-name"
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Overall Experience</label>
                  <div className="rating-select-wrapper">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        className="star-selector-btn"
                        onClick={() => setRating(starVal)}
                        aria-label={`Select ${starVal} stars`}
                      >
                        <Star
                          size={24}
                          className={starVal <= rating ? 'star-select-filled' : 'star-select-empty'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="rev-comment">Review Details</label>
                  <textarea
                    id="rev-comment"
                    className="form-control text-area-control"
                    rows="3"
                    placeholder="Describe your design, cupboard assembly, wood quality, or installation process..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  <MessageSquarePlus size={16} />
                  <span>Submit Review</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right panel: Reviews Feed */}
          <div className="reviews-feed-panel">
            <h3>Recent Reviews</h3>
            <div className="reviews-list-scroller">
              {reviews.map((review) => (
                <div key={review.id} className="review-feed-card">
                  <div className="review-feed-header">
                    <div
                      className="review-user-avatar"
                      style={{ backgroundColor: getAvatarBg(review.name) }}
                    >
                      {getInitials(review.name)}
                    </div>
                    
                    <div className="review-user-meta">
                      <h4>{review.name}</h4>
                      <div className="review-stars-row">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= review.rating ? 'star-feed-filled' : 'star-feed-empty'}
                          />
                        ))}
                        <span className="review-date-stamp">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="review-feed-comment">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .reviews-section-container {
          padding: 60px 0;
          background-color: #fcf9f5;
          border-top: 1px solid var(--border-light);
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
          align-items: start;
        }

        .reviews-meta-form-panel {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Scorecard */
        .reviews-scorecard {
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 24px;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          text-align: center;
        }

        .scorecard-big-num {
          font-size: 3.5rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1.1;
        }

        .scorecard-stars {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin: 8px 0;
        }

        .star-filled {
          fill: var(--accent);
          color: var(--accent);
        }
        .star-empty {
          color: #cbd5e1;
        }

        .scorecard-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Form Card */
        .review-form-card {
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 30px;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          text-align: left;
        }

        .review-form-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .review-form-card p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        .review-success-badge {
          background-color: #d1fae5;
          border: 1px solid #6ee7b7;
          color: #065f46;
          padding: 10px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .rating-select-wrapper {
          display: flex;
          gap: 8px;
          margin: 4px 0;
        }

        .star-selector-btn {
          background: transparent;
          padding: 2px;
        }
        .star-selector-btn:hover {
          transform: scale(1.15);
        }

        .star-select-filled {
          fill: var(--accent);
          color: var(--accent);
        }
        .star-select-empty {
          color: #cbd5e1;
        }

        .text-area-control {
          resize: vertical;
          min-height: 80px;
        }

        /* Feed Panel */
        .reviews-feed-panel {
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 30px;
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
          text-align: left;
          height: 100%;
          max-height: 610px;
          display: flex;
          flex-direction: column;
        }

        .reviews-feed-panel h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 10px;
        }

        .reviews-list-scroller {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          flex-grow: 1;
          padding-right: 6px;
        }

        .review-feed-card {
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-light);
        }
        .review-feed-card:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .review-feed-header {
          display: flex;
          gap: 12px;
          margin-bottom: 10px;
          align-items: center;
        }

        .review-user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 -2px 4px rgba(0,0,0,0.1);
        }

        .review-user-meta h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .review-stars-row {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .star-feed-filled {
          fill: var(--accent);
          color: var(--accent);
        }
        .star-feed-empty {
          color: #cbd5e1;
        }

        .review-date-stamp {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 8px;
        }

        .review-feed-comment {
          font-size: 0.88rem;
          color: var(--text-main);
          line-height: 1.5;
          font-style: italic;
        }

        @media (max-width: 991px) {
          .reviews-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .reviews-feed-panel {
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
