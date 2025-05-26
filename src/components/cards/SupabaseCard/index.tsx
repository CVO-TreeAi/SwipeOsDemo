import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme } from '../BaseCard/types';
import { 
  Database, 
  Shield, 
  Key, 
  Server, 
  Lock, 
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  Table,
  Settings
} from 'lucide-react';

interface SupabaseCardProps {
  theme: Theme;
  isLocked?: boolean;
  pin?: string;
  onUnlock?: () => void;
  connectionStatus?: 'connected' | 'disconnected' | 'connecting';
}

export const SupabaseCard: React.FC<SupabaseCardProps> = ({
  theme,
  isLocked = true,
  pin = "1234",
  onUnlock,
  connectionStatus = 'disconnected'
}) => {
  const [isUnlocked, setIsUnlocked] = useState(!isLocked);
  const [enteredPin, setEnteredPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked_temp, setIsLocked_temp] = useState(false);
  const [dbStats, setDbStats] = useState({
    tables: 12,
    activeConnections: 3,
    lastBackup: '2 hours ago',
    storageUsed: '2.4 GB'
  });

  const isDark = theme === 'dark';

  const handlePinSubmit = () => {
    if (enteredPin === pin) {
      setIsUnlocked(true);
      setEnteredPin('');
      setPinError(false);
      setAttempts(0);
      onUnlock?.();
    } else {
      setPinError(true);
      setAttempts(prev => prev + 1);
      
      // Lock for 30 seconds after 3 failed attempts
      if (attempts >= 2) {
        setIsLocked_temp(true);
        setTimeout(() => {
          setIsLocked_temp(false);
          setAttempts(0);
        }, 30000);
      }
      
      // Clear error after 2 seconds
      setTimeout(() => {
        setPinError(false);
        setEnteredPin('');
      }, 2000);
    }
  };

  const handlePinInput = (digit: string) => {
    if (isLocked_temp) return;
    
    if (digit === 'clear') {
      setEnteredPin('');
      setPinError(false);
    } else if (digit === 'backspace') {
      setEnteredPin(prev => prev.slice(0, -1));
    } else if (enteredPin.length < 4) {
      const newPin = enteredPin + digit;
      setEnteredPin(newPin);
      
      // Auto-submit when 4 digits entered
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === pin) {
            setIsUnlocked(true);
            setEnteredPin('');
            setPinError(false);
            setAttempts(0);
            onUnlock?.();
          } else {
            setPinError(true);
            setAttempts(prev => prev + 1);
            
            if (attempts >= 2) {
              setIsLocked_temp(true);
              setTimeout(() => {
                setIsLocked_temp(false);
                setAttempts(0);
              }, 30000);
            }
            
            setTimeout(() => {
              setPinError(false);
              setEnteredPin('');
            }, 2000);
          }
        }, 100);
      }
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-400';
      case 'connecting':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle size={16} />;
      case 'connecting':
        return <Activity size={16} className="animate-pulse" />;
      default:
        return <XCircle size={16} />;
    }
  };

  if (!isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          relative w-full max-w-sm mx-auto rounded-2xl p-6 shadow-2xl border
          ${isDark 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }
        `}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`
            inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
            ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}
          `}>
            <Shield size={32} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Supabase Database
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter PIN to access database
          </p>
        </div>

        {/* PIN Display */}
        <div className="mb-6">
          <div className="flex justify-center gap-3 mb-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`
                  w-4 h-4 rounded-full border-2 transition-all duration-200
                  ${enteredPin.length > index 
                    ? (pinError 
                      ? 'bg-red-500 border-red-500' 
                      : 'bg-blue-500 border-blue-500'
                    )
                    : (isDark ? 'border-gray-600' : 'border-gray-300')
                  }
                  ${pinError ? 'animate-pulse' : ''}
                `}
              />
            ))}
          </div>
          
          {pinError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center"
            >
              Incorrect PIN. {3 - attempts} attempts remaining.
            </motion.p>
          )}
          
          {isLocked_temp && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm text-center"
            >
              Too many failed attempts. Locked for 30 seconds.
            </motion.p>
          )}
        </div>

        {/* PIN Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              onClick={() => handlePinInput(digit.toString())}
              disabled={isLocked_temp}
              className={`
                h-12 rounded-lg font-semibold transition-all duration-200
                ${isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }
                ${isLocked_temp ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              `}
            >
              {digit}
            </button>
          ))}
          
          <button
            onClick={() => handlePinInput('clear')}
            disabled={isLocked_temp}
            className={`
              h-12 rounded-lg font-semibold transition-all duration-200
              ${isDark 
                ? 'bg-red-700 hover:bg-red-600 text-white' 
                : 'bg-red-100 hover:bg-red-200 text-red-700'
              }
              ${isLocked_temp ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
          >
            CLR
          </button>
          
          <button
            onClick={() => handlePinInput('0')}
            disabled={isLocked_temp}
            className={`
              h-12 rounded-lg font-semibold transition-all duration-200
              ${isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }
              ${isLocked_temp ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
          >
            0
          </button>
          
          <button
            onClick={() => handlePinInput('backspace')}
            disabled={isLocked_temp}
            className={`
              h-12 rounded-lg font-semibold transition-all duration-200
              ${isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }
              ${isLocked_temp ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
            `}
          >
            ⌫
          </button>
        </div>

        {/* Security Notice */}
        <div className={`
          text-xs text-center p-3 rounded-lg
          ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}
        `}>
          <Lock size={12} className="inline mr-1" />
          Secure database access • PIN: {showPin ? pin : '••••'}
          <button
            onClick={() => setShowPin(!showPin)}
            className="ml-2 hover:opacity-70"
          >
            {showPin ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative w-full max-w-sm mx-auto rounded-2xl p-6 shadow-2xl border
        ${isDark 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700' 
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-full
            ${isDark ? 'bg-green-900/50' : 'bg-green-100'}
          `}>
            <Database size={24} className={isDark ? 'text-green-400' : 'text-green-600'} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Supabase
            </h3>
            <div className={`flex items-center gap-1 text-sm ${getConnectionStatusColor()}`}>
              {getConnectionStatusIcon()}
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsUnlocked(false)}
          className={`
            p-2 rounded-lg transition-colors
            ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
          `}
        >
          <Lock size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
        </button>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`
          p-3 rounded-lg
          ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
        `}>
          <div className="flex items-center gap-2 mb-1">
            <Table size={16} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Tables
            </span>
          </div>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {dbStats.tables}
          </p>
        </div>
        
        <div className={`
          p-3 rounded-lg
          ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
        `}>
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Active
            </span>
          </div>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {dbStats.activeConnections}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 mb-6">
        <button className={`
          w-full flex items-center gap-3 p-3 rounded-lg transition-colors
          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
        `}>
          <Database size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Query Database
          </span>
        </button>
        
        <button className={`
          w-full flex items-center gap-3 p-3 rounded-lg transition-colors
          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
        `}>
          <Server size={20} className={isDark ? 'text-green-400' : 'text-green-600'} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Manage Tables
          </span>
        </button>
        
        <button className={`
          w-full flex items-center gap-3 p-3 rounded-lg transition-colors
          ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
        `}>
          <Key size={20} className={isDark ? 'text-yellow-400' : 'text-yellow-600'} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            API Keys
          </span>
        </button>
      </div>

      {/* Storage Info */}
      <div className={`
        p-3 rounded-lg border
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}
      `}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Storage Used
          </span>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {dbStats.storageUsed}
          </span>
        </div>
        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div className="w-1/3 h-full bg-blue-500 rounded-full" />
        </div>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Last backup: {dbStats.lastBackup}
        </p>
      </div>
    </motion.div>
  );
}; 