import React from 'react';
import { BusinessIdCardProps } from '../BaseCard/types';
import { Building, Mail, Phone, Globe, MapPin } from 'lucide-react';

export const BusinessIdCard: React.FC<Omit<BusinessIdCardProps, 'onSwipe' | 'position'>> = ({
  companyLogoUrl,
  contactEmail,
  phone,
  theme,
}) => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <img
            src={companyLogoUrl}
            alt="Company logo"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200 dark:border-gray-700 shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=Company&background=6366f1&color=fff&size=64`;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold mb-1">Business ID</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            TreeAI Services Inc.
          </p>
        </div>
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <Mail className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{contactEmail}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Contact Email
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <Phone className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{phone}</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Business Phone
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <Globe className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">www.treeai.com</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Website
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">123 Tree Street, Forest City</p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Business Address
            </p>
          </div>
        </div>
      </div>

      <div className={`mt-auto pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">License #12345</span>
          </div>
          <span className="text-xs text-gray-500">Verified ✓</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessIdCard; 