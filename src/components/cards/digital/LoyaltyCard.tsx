import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../BaseCard/types';

interface LoyaltyCardProps {
  theme: Theme;
  storeName: string;
  storeLogoUrl?: string;
  memberNumber: string;
  points: number;
  pointsToNextReward: number;
  barcode?: string;
  backgroundColor?: string;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  theme,
  storeName,
  storeLogoUrl,
  memberNumber,
  points,
  pointsToNextReward,
  barcode,
  backgroundColor = '#FF6B6B',
}) => {
  const progressPercentage = (points / pointsToNextReward) * 100;

  return (
    <div className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`,
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs opacity-75 mb-1">Loyalty Card</p>
          <h3 className="text-xl font-bold">{storeName}</h3>
        </div>
        {storeLogoUrl && (
          <img 
            src={storeLogoUrl} 
            alt={storeName}
            className="w-12 h-12 rounded-lg object-cover bg-white/20 p-1"
          />
        )}
      </div>

      {/* Points Section */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-4xl font-bold mb-1"
          >
            {points.toLocaleString()}
          </motion.div>
          <p className="text-sm opacity-75">Points</p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-center mt-1 opacity-75">
            {pointsToNextReward - points} points to next reward
          </p>
        </div>
      </div>

      {/* Member Info */}
      <div className="relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs opacity-75">Member</p>
            <p className="font-mono text-sm">{memberNumber}</p>
          </div>
          
          {/* Barcode */}
          {barcode && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white text-black px-3 py-1 rounded"
            >
              <div className="flex flex-col items-center">
                <div className="flex space-x-[2px]">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black"
                      style={{
                        width: Math.random() > 0.5 ? '2px' : '1px',
                        height: '20px',
                      }}
                    />
                  ))}
                </div>
                <p className="text-[8px] mt-1 font-mono">{barcode}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Card styling based on store brand color */}
      <style jsx>{`
        div {
          color: white;
          background: linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%);
        }
      `}</style>
    </div>
  );
}; 