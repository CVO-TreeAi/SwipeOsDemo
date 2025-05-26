import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../BaseCard/types';

interface MembershipCardProps {
  theme: Theme;
  organizationName: string;
  memberName: string;
  memberId: string;
  memberType: 'Basic' | 'Premium' | 'VIP' | 'Elite';
  validUntil: string;
  photoUrl?: string;
  qrCode?: string;
  benefits?: string[];
  backgroundColor?: string;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  theme,
  organizationName,
  memberName,
  memberId,
  memberType,
  validUntil,
  photoUrl,
  qrCode,
  benefits = [],
  backgroundColor = '#2196F3',
}) => {
  const [showBenefits, setShowBenefits] = useState(false);

  const getMemberTypeColor = () => {
    switch (memberType) {
      case 'Basic': return '#757575';
      case 'Premium': return '#FFC107';
      case 'VIP': return '#9C27B0';
      case 'Elite': return '#FFD700';
      default: return '#2196F3';
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}dd 100%)`,
      }}
    >
      {/* Card Back (Benefits) */}
      <motion.div
        className="absolute inset-0 p-6 text-white"
        initial={false}
        animate={{
          rotateY: showBenefits ? 0 : -180,
          opacity: showBenefits ? 1 : 0,
        }}
        transition={{ duration: 0.6 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <h4 className="text-lg font-bold mb-3">Member Benefits</h4>
        <ul className="space-y-2 text-sm">
          {benefits.map((benefit, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: showBenefits ? 1 : 0, x: showBenefits ? 0 : -20 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start"
            >
              <span className="mr-2">✓</span>
              <span>{benefit}</span>
            </motion.li>
          ))}
        </ul>
        <button
          onClick={() => setShowBenefits(false)}
          className="absolute bottom-6 right-6 text-white/80 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </motion.div>

      {/* Card Front */}
      <motion.div
        className="absolute inset-0 p-6 text-white"
        initial={false}
        animate={{
          rotateY: showBenefits ? 180 : 0,
          opacity: showBenefits ? 0 : 1,
        }}
        transition={{ duration: 0.6 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{organizationName}</h3>
            <div 
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1"
              style={{ backgroundColor: getMemberTypeColor() }}
            >
              {memberType} Member
            </div>
          </div>
          {benefits.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowBenefits(true)}
              className="text-white/80 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.button>
          )}
        </div>

        {/* Member Info */}
        <div className="flex items-center space-x-4 mb-4">
          {photoUrl ? (
            <img 
              src={photoUrl} 
              alt={memberName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {memberName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">{memberName}</p>
            <p className="text-sm opacity-75">ID: {memberId}</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs opacity-75">Valid Until</p>
            <p className="text-sm font-medium">{validUntil}</p>
          </div>
          
          {qrCode ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-2 rounded"
            >
              <img src={qrCode} alt="QR Code" className="w-16 h-16" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white p-2 rounded"
            >
              {/* Placeholder QR Code */}
              <div className="w-16 h-16 grid grid-cols-8 gap-0">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="30" fill="transparent" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="20" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}; 