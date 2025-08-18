import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    readonly = false,
    onRatingChange,
    className = ''
}: StarRatingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const starSize = sizeClasses[size];

    const handleStarClick = (starValue: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(starValue);
        }
    };

    return (
        <div className={`flex gap-1 ${className}`}>
            {Array.from({ length: maxRating }, (_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= rating;
                
                return (
                    <button
                        key={starValue}
                        type="button"
                        onClick={() => handleStarClick(starValue)}
                        disabled={readonly}
                        className={`${
                            readonly 
                                ? 'cursor-default' 
                                : 'cursor-pointer hover:scale-110 transition-transform duration-150'
                        } focus:outline-none`}
                    >
                        <Star
                            className={`${starSize} transition-colors duration-200 ${
                                isActive
                                    ? 'text-yellow-400 fill-current'
                                    : readonly
                                        ? 'text-gray-300'
                                        : 'text-gray-300 hover:text-yellow-200'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
}

export function StarDisplay({ rating, maxRating = 5, size = 'md', className = '' }: {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    return (
        <StarRating
            rating={rating}
            maxRating={maxRating}
            size={size}
            readonly={true}
            className={className}
        />
    );
}
