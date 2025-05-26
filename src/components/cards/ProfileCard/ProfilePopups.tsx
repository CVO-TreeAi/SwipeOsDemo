import React, { useState } from 'react';
import { 
  X, 
  Edit, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Activity, 
  Users, 
  TrendingUp, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Share2,
  Link,
  Twitter,
  Linkedin,
  MessageSquare
} from 'lucide-react';
import { Theme } from '../BaseCard/types';
import { supabaseMCP } from '../../../lib/supabase';

interface ProfileEditPopupProps {
  theme: Theme;
  profileData: {
    userName: string;
    companyName: string;
    avatarUrl?: string;
    email?: string;
    phone?: string;
  };
  onUpdate: (data: any) => void;
  onClose: () => void;
}

export const EditProfilePopup: React.FC<ProfileEditPopupProps> = ({ theme, profileData, onUpdate, onClose }) => {
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState(profileData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Transform form data to match Supabase Profile interface
      const profileUpdate = {
        user_name: formData.userName,
        company_name: formData.companyName,
        avatar_url: formData.avatarUrl
      };
      
      // Save to Supabase
      await supabaseMCP.updateProfile('current-user-id', profileUpdate);
      onUpdate(formData);
      setIsSaving(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className={`p-6 h-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Edit className="text-blue-500" size={24} />
          Edit Profile
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <div className="text-center">
          <div className="relative inline-block">
            <img
              src={formData.avatarUrl || '/api/placeholder/100/100'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
              <Edit size={16} />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <User size={16} className="inline mr-2" />
              Name
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Building size={16} className="inline mr-2" />
              Company
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <Phone size={16} className="inline mr-2" />
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export const ProfileAnalyticsPopup: React.FC<{ theme: Theme; onClose: () => void }> = ({ theme, onClose }) => {
  const isDark = theme === 'dark';

  const stats = [
    { label: 'Profile Views', value: '1,234', change: '+12%', icon: <Activity /> },
    { label: 'Connections', value: '567', change: '+8%', icon: <Users /> },
    { label: 'Engagement Rate', value: '78%', change: '+15%', icon: <TrendingUp /> },
    { label: 'Activity Score', value: '92', change: '+5%', icon: <BarChart3 /> }
  ];

  return (
    <div className={`p-6 h-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="text-blue-500" size={24} />
          Analytics
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`
                p-6 rounded-xl border
                ${isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-50 border-gray-200'
                }
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  {React.cloneElement(stat.icon, { 
                    size: 24, 
                    className: isDark ? 'text-blue-400' : 'text-blue-600' 
                  })}
                </div>
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Activity Chart */}
        <div className={`
          p-6 rounded-xl border
          ${isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Weekly Activity
          </h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {[65, 80, 45, 90, 70, 85, 75].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-blue-500 rounded-t"
                  style={{ height: `${height}%` }}
                />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileUsersPopup: React.FC<{ theme: Theme; onClose: () => void }> = ({ theme, onClose }) => {
  const isDark = theme === 'dark';
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  const users = [
    { name: 'John Doe', company: 'TreeAI', avatar: '/api/placeholder/100/100', role: 'CEO' },
    { name: 'Jane Smith', company: 'TechCorp', avatar: '/api/placeholder/100/100', role: 'CTO' },
    { name: 'Mike Johnson', company: 'StartupXYZ', avatar: '/api/placeholder/100/100', role: 'Developer' },
    { name: 'Sarah Williams', company: 'DesignCo', avatar: '/api/placeholder/100/100', role: 'Designer' }
  ];

  return (
    <div className={`p-6 h-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-blue-500" size={24} />
          Users
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Current User Display */}
        <div className={`
          p-6 rounded-xl border
          ${isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={users[currentUserIndex].avatar} 
              alt={users[currentUserIndex].name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {users[currentUserIndex].name}
              </h3>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {users[currentUserIndex].role} at {users[currentUserIndex].company}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentUserIndex((prev) => (prev - 1 + users.length) % users.length)}
              className={`
                p-2 rounded-lg transition-colors
                ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
              `}
            >
              <ChevronLeft size={20} />
            </button>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentUserIndex + 1} of {users.length}
            </span>
            <button
              onClick={() => setCurrentUserIndex((prev) => (prev + 1) % users.length)}
              className={`
                p-2 rounded-lg transition-colors
                ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
              `}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Other Users List */}
        <div>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            All Users
          </h3>
          <div className="space-y-3">
            {users.map((user, index) => (
              <button
                key={index}
                onClick={() => setCurrentUserIndex(index)}
                className={`
                  w-full p-4 rounded-lg border transition-all
                  ${currentUserIndex === index
                    ? isDark 
                      ? 'bg-blue-900/30 border-blue-600' 
                      : 'bg-blue-50 border-blue-400'
                    : isDark
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.role} • {user.company}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileSharePopup: React.FC<{ theme: Theme; onClose: () => void }> = ({ theme, onClose }) => {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);

  const profileUrl = 'https://treeai.com/profile/johndoe';

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: 'Email', icon: <Mail />, action: () => window.open(`mailto:?body=${profileUrl}`) },
    { name: 'Twitter', icon: <Twitter />, action: () => window.open(`https://twitter.com/intent/tweet?url=${profileUrl}`) },
    { name: 'LinkedIn', icon: <Linkedin />, action: () => window.open(`https://linkedin.com/shareArticle?url=${profileUrl}`) },
    { name: 'Message', icon: <MessageSquare />, action: () => console.log('Open messaging app') }
  ];

  return (
    <div className={`p-6 h-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Share2 className="text-blue-500" size={24} />
          Share Profile
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Share Link */}
        <div>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Share Profile Link
          </h3>
          <div className={`
            p-4 rounded-lg border flex items-center gap-3
            ${isDark 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-gray-50 border-gray-200'
            }
          `}>
            <Link size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            <input
              type="text"
              value={profileUrl}
              readOnly
              className={`
                flex-1 bg-transparent outline-none
                ${isDark ? 'text-white' : 'text-gray-900'}
              `}
            />
            <button
              onClick={handleCopy}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }
              `}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div>
          <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Share Via
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className={`
                  p-4 rounded-lg border transition-all
                  ${isDark
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                  }
                  flex items-center gap-3
                `}
              >
                {React.cloneElement(option.icon, { 
                  size: 24, 
                  className: isDark ? 'text-blue-400' : 'text-blue-600' 
                })}
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className={`
          p-6 rounded-xl border text-center
          ${isDark 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <div className="w-48 h-48 mx-auto mb-4 bg-white p-4 rounded-lg">
            <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-600">QR Code</span>
            </div>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Scan to view profile
          </p>
        </div>
      </div>
    </div>
  );
}; 