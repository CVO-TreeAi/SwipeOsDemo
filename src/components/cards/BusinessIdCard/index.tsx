import React from 'react';
import { BaseCard } from '../BaseCard';
import { BusinessIdCardProps } from '../BaseCard/types';

export const BusinessIdCard: React.FC<BusinessIdCardProps> = ({
  companyLogoUrl,
  contactEmail,
  phone,
  ...baseProps
}) => {
  return (
    <BaseCard {...baseProps}>
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={companyLogoUrl}
              alt="Company logo"
              className="w-12 h-12 rounded-lg object-cover border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=Company&background=6366f1&color=fff&size=48`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold mb-1">Business ID</h2>
            <p className={`text-xs ${baseProps.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Company Information
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              baseProps.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{contactEmail}</p>
              <p className={`text-xs ${baseProps.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Contact Email
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              baseProps.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{phone}</p>
              <p className={`text-xs ${baseProps.theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Phone Number
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default BusinessIdCard; 