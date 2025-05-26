import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../BaseCard/types';

interface GiftCardProps {
  theme: Theme;
  storeName: string;
  balance: number;
  originalAmount: number;
  cardNumber: string;
  pin?: string;
  expiryDate?: string;
  backgroundColor?: string;
  patternType?: 'dots' | 'waves' | 'geometric';
}

export const GiftCard: React.FC<GiftCardProps> = ({
  theme,
  storeName,
  balance,
  originalAmount,
  cardNumber,
  pin,
  expiryDate,
  backgroundColor = '#9C27B0',
  patternType = 'waves',
}) => {
  const [showPin, setShowPin] = useState(false);
  const usedPercentage = ((originalAmount - balance) / originalAmount) * 100;

  const renderPattern = () => {
    switch (patternType) {
      case 'dots':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }} />
          </div>
        );
      case 'waves':
        return (
          <svg className="absolute inset-0 opacity-10" viewBox="0 0 300 200">
            <path
              d="M0,50 Q75,20 150,50 T300,50 L300,200 L0,200 Z"
              fill="rgba(255,255,255,0.1)"
            />
            <path
              d="M0,100 Q75,70 150,100 T300,100 L300,200 L0,200 Z"
              fill="rgba(255,255,255,0.1)"
            />
          </svg>
        );
      case 'geometric':
        return (
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1))
              `,
              backgroundSize: '20px 35px',
              backgroundPosition: '0 -2px, -2px 0, 10px 18px, 8px 20px',
            }} />
          </div>
        );
    }
  };

  return (
    <div 
      className="relative w-full h-full p-6 flex flex-col justify-between overflow-hidden text-white"
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}cc 100%)`,
      }}
    >
      {/* Background Pattern */}
      {renderPattern()}

      {/* Header */}
      <div className="relative z-10">
        <p className="text-xs opacity-75 mb-1">Gift Card</p>
        <h3 className="text-2xl font-bold">{storeName}</h3>
      </div>

      {/* Balance */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative"
          >
            <p className="text-5xl font-bold">
              ${balance.toFixed(2)}
            </p>
            {balance < originalAmount && (
              <p className="text-xs opacity-75 mt-1">
                of ${originalAmount.toFixed(2)}
              </p>
            )}
          </motion.div>

          {/* Usage indicator */}
          {usedPercentage > 0 && (
            <div className="mt-4 w-32 mx-auto">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/60 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - usedPercentage}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="relative z-10 space-y-3">
        {/* Card Number */}
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-xs opacity-75">Card Number</p>
            <p className="font-mono text-sm tracking-wider">
              {cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
            </p>
          </div>
        </div>

        {/* PIN and Expiry */}
        <div className="flex justify-between items-end">
          {pin && (
            <div>
              <p className="text-xs opacity-75">PIN</p>
              <motion.button
                onClick={() => setShowPin(!showPin)}
                className="font-mono text-sm flex items-center space-x-1"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {showPin ? (
                    <motion.span
                      key="pin"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {pin}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      ••••
                    </motion.span>
                  )}
                </AnimatePresence>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          )}
          
          {expiryDate && (
            <div className="text-right">
              <p className="text-xs opacity-75">Expires</p>
              <p className="text-sm">{expiryDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 