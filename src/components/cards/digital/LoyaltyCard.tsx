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
    <div className="relative w-full h-full p-8 flex flex-col justify-between overflow-hidden">
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
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm opacity-75 mb-2 tracking-wider uppercase">Loyalty Card</p>
            <h3 className="text-3xl font-bold">{storeName}</h3>
          </div>
          {storeLogoUrl && (
            <motion.img 
              whileHover={{ scale: 1.1 }}
              src={storeLogoUrl} 
              alt={storeName}
              className="w-20 h-20 rounded-2xl object-cover bg-white/20 p-2 shadow-lg"
            />
          )}
        </div>
      </div>

      {/* Points Section - Centered and Prominent */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
            className="mb-8"
          >
            <p className="text-7xl font-bold mb-2">
              {points.toLocaleString()}
            </p>
            <p className="text-xl opacity-75">Points Balance</p>
          </motion.div>

          {/* Progress Bar */}
          <div className="max-w-sm mx-auto">
            <div className="h-4 bg-white/20 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-white/80 to-white/60 rounded-full shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-lg text-center mt-4 opacity-90">
              {pointsToNextReward - points} points to next reward
            </p>
          </div>

          {/* Reward Preview */}
          {progressPercentage > 70 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm"
            >
              <p className="text-sm opacity-75">Next Reward</p>
              <p className="text-lg font-semibold">Free Drink 🎉</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Member Info & Barcode */}
      <div className="relative z-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm opacity-75 mb-1">Member Since 2023</p>
            <p className="font-mono text-lg tracking-wider">{memberNumber}</p>
          </div>
          
          {/* Enhanced Barcode */}
          {barcode && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-6 py-4 rounded-2xl shadow-lg cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <div className="flex space-x-[3px] mb-2">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-black"
                      style={{
                        width: Math.random() > 0.5 ? '3px' : '2px',
                        height: '40px',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs font-mono tracking-wider">{barcode}</p>
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