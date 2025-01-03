import React from 'react';

const StarRating = ({ value = 0 }) => {
  // Ensure value is between 0 and 5
  const rating = Math.min(Math.max(value, 0), 5);
  
  // Calculate full and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="d-flex align-items-center gap-1">
      {rating.toFixed(1)}
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <i 
          key={`full-${index}`}
          className="bi bi-star-fill text-warning"
          style={{ fontSize: '.7rem' }}
        ></i>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <i 
          className="bi bi-star-half text-warning"
          style={{ fontSize: '.7rem' }}
        ></i>
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <i 
          key={`empty-${index}`}
          className="bi bi-star text-warning"
          style={{ fontSize: '.7rem' }}
        ></i>
      ))}
    </div>
  );
};

export default StarRating;