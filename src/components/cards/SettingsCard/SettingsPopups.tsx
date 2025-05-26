import React, { useState } from 'react';
import { Theme } from '../BaseCard/types';
import { X, Save, RotateCcw, Download, Upload, Check, AlertTriangle, FileText, Cloud } from 'lucide-react';

interface SettingsPopupProps {
  theme: Theme;
  onClose: () => void;
}

// Backup Settings Page
export const BackupSettingsPopup: React.FC<SettingsPopupProps> = ({ theme, onClose }) => {
  const [backupOptions, setBackupOptions] = useState({
    includeUserData: true,
    includeAppSettings: true,
    includeCustomizations: true,
    includeHistory: false,
    backupLocation: 'cloud',
    encryption: true
  });
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupComplete, setBackupComplete] = useState(false);

  const handleBackup = async () => {
    setIsBackingUp(true);
    console.log('Creating backup with options:', backupOptions);

    // Simulate backup process
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupComplete(true);
      console.log('Backup completed successfully');
    }, 3000);
  };

  const backupSize = () => {
    let size = 0;
    if (backupOptions.includeUserData) size += 2.5;
    if (backupOptions.includeAppSettings) size += 0.8;
    if (backupOptions.includeCustomizations) size += 1.2;
    if (backupOptions.includeHistory) size += 15.3;
    return size.toFixed(1);
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Save className="text-green-500" size={24} />
          Backup Settings
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      {!backupComplete ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">What to backup</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupOptions.includeUserData}
                  onChange={(e) => setBackupOptions({...backupOptions, includeUserData: e.target.checked})}
                  className="w-4 h-4 text-green-500"
                />
                <span>User Data & Profiles</span>
                <span className="text-sm opacity-70">(2.5 MB)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupOptions.includeAppSettings}
                  onChange={(e) => setBackupOptions({...backupOptions, includeAppSettings: e.target.checked})}
                  className="w-4 h-4 text-green-500"
                />
                <span>App Settings</span>
                <span className="text-sm opacity-70">(0.8 MB)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupOptions.includeCustomizations}
                  onChange={(e) => setBackupOptions({...backupOptions, includeCustomizations: e.target.checked})}
                  className="w-4 h-4 text-green-500"
                />
                <span>Customizations & Themes</span>
                <span className="text-sm opacity-70">(1.2 MB)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={backupOptions.includeHistory}
                  onChange={(e) => setBackupOptions({...backupOptions, includeHistory: e.target.checked})}
                  className="w-4 h-4 text-green-500"
                />
                <span>Activity History</span>
                <span className="text-sm opacity-70">(15.3 MB)</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Backup Location</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="backupLocation"
                  value="cloud"
                  checked={backupOptions.backupLocation === 'cloud'}
                  onChange={(e) => setBackupOptions({...backupOptions, backupLocation: e.target.value})}
                  className="w-4 h-4 text-green-500"
                />
                <Cloud size={16} />
                <span>Cloud Storage (Recommended)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="backupLocation"
                  value="local"
                  checked={backupOptions.backupLocation === 'local'}
                  onChange={(e) => setBackupOptions({...backupOptions, backupLocation: e.target.value})}
                  className="w-4 h-4 text-green-500"
                />
                <FileText size={16} />
                <span>Local Device</span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={backupOptions.encryption}
                onChange={(e) => setBackupOptions({...backupOptions, encryption: e.target.checked})}
                className="w-4 h-4 text-green-500"
              />
              <span>Encrypt backup file</span>
            </label>
          </div>

          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center">
              <span>Estimated backup size:</span>
              <span className="font-semibold">{backupSize()} MB</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleBackup}
              disabled={isBackingUp}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isBackingUp ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Backup...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Create Backup
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto">
            <Check size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-500">Backup Complete!</h3>
            <p className="text-sm opacity-70 mt-2">Your settings have been successfully backed up</p>
          </div>
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-sm space-y-1">
              <div>Backup ID: BK-{Date.now()}</div>
              <div>Size: {backupSize()} MB</div>
              <div>Location: {backupOptions.backupLocation === 'cloud' ? 'Cloud Storage' : 'Local Device'}</div>
              <div>Created: {new Date().toLocaleString()}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// Reset to Default Page
export const ResetToDefaultPopup: React.FC<SettingsPopupProps> = ({ theme, onClose }) => {
  const [resetOptions, setResetOptions] = useState({
    resetAppSettings: true,
    resetUserPreferences: false,
    resetCustomizations: true,
    resetData: false,
    createBackup: true
  });
  const [confirmReset, setConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (!confirmReset) return;

    setIsResetting(true);
    console.log('Resetting settings with options:', resetOptions);

    // Simulate reset process
    setTimeout(() => {
      setIsResetting(false);
      console.log('Reset completed successfully');
      onClose();
    }, 3000);
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <RotateCcw className="text-red-500" size={24} />
          Reset to Default
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className={`p-4 rounded-lg border-l-4 border-red-500 ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-red-500" size={20} />
            <span className="font-semibold text-red-500">Warning</span>
          </div>
          <p className="text-sm">This action will reset your settings to their default values. This cannot be undone unless you have a backup.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">What to reset</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={resetOptions.resetAppSettings}
                onChange={(e) => setResetOptions({...resetOptions, resetAppSettings: e.target.checked})}
                className="w-4 h-4 text-red-500"
              />
              <span>App Settings</span>
              <span className="text-sm opacity-70">(Theme, notifications, etc.)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={resetOptions.resetUserPreferences}
                onChange={(e) => setResetOptions({...resetOptions, resetUserPreferences: e.target.checked})}
                className="w-4 h-4 text-red-500"
              />
              <span>User Preferences</span>
              <span className="text-sm opacity-70">(Language, timezone, etc.)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={resetOptions.resetCustomizations}
                onChange={(e) => setResetOptions({...resetOptions, resetCustomizations: e.target.checked})}
                className="w-4 h-4 text-red-500"
              />
              <span>Customizations</span>
              <span className="text-sm opacity-70">(Custom themes, layouts, etc.)</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={resetOptions.resetData}
                onChange={(e) => setResetOptions({...resetOptions, resetData: e.target.checked})}
                className="w-4 h-4 text-red-500"
              />
              <span className="text-red-500">User Data</span>
              <span className="text-sm opacity-70 text-red-500">(⚠️ This will delete all your data!)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={resetOptions.createBackup}
              onChange={(e) => setResetOptions({...resetOptions, createBackup: e.target.checked})}
              className="w-4 h-4 text-green-500"
            />
            <span>Create backup before reset</span>
            <span className="text-sm opacity-70">(Recommended)</span>
          </label>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={confirmReset}
              onChange={(e) => setConfirmReset(e.target.checked)}
              className="w-4 h-4 text-red-500"
            />
            <span className="text-red-500">I understand this action cannot be undone</span>
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleReset}
            disabled={!confirmReset || isResetting}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResetting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Resetting...
              </>
            ) : (
              <>
                <RotateCcw size={20} />
                Reset Settings
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Import Config Page
export const ImportConfigPopup: React.FC<SettingsPopupProps> = ({ theme, onClose }) => {
  const [importMethod, setImportMethod] = useState<'file' | 'url' | 'text'>('file');
  const [configUrl, setConfigUrl] = useState('');
  const [configText, setConfigText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{success: boolean, message: string} | null>(null);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('File content:', content);
        processImport(content);
      };
      reader.readAsText(file);
    }
  };

  const processImport = async (content: string) => {
    setIsImporting(true);
    console.log('Importing configuration:', content);

    // Simulate import process
    setTimeout(() => {
      setIsImporting(false);
      try {
        JSON.parse(content); // Validate JSON
        setImportResult({success: true, message: 'Configuration imported successfully!'});
      } catch {
        setImportResult({success: false, message: 'Invalid configuration format. Please check your file.'});
      }
    }, 2000);
  };

  const handleUrlImport = () => {
    if (!configUrl.trim()) return;
    console.log('Importing from URL:', configUrl);
    processImport('{"example": "config"}'); // Simulate fetched config
  };

  const handleTextImport = () => {
    if (!configText.trim()) return;
    processImport(configText);
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Upload className="text-orange-500" size={24} />
          Import Configuration
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Import Method</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setImportMethod('file')}
              className={`p-3 rounded-lg border text-center ${importMethod === 'file' ? 'bg-orange-500 text-white' : theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              File Upload
            </button>
            <button
              onClick={() => setImportMethod('url')}
              className={`p-3 rounded-lg border text-center ${importMethod === 'url' ? 'bg-orange-500 text-white' : theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              From URL
            </button>
            <button
              onClick={() => setImportMethod('text')}
              className={`p-3 rounded-lg border text-center ${importMethod === 'text' ? 'bg-orange-500 text-white' : theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {importMethod === 'file' && (
          <div>
            <label className="block text-sm font-medium mb-2">Select Configuration File</label>
            <input
              type="file"
              accept=".json,.txt"
              onChange={handleFileImport}
              className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            />
            <p className="text-sm opacity-70 mt-2">Supported formats: JSON, TXT</p>
          </div>
        )}

        {importMethod === 'url' && (
          <div>
            <label className="block text-sm font-medium mb-2">Configuration URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={configUrl}
                onChange={(e) => setConfigUrl(e.target.value)}
                placeholder="https://example.com/config.json"
                className={`flex-1 p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              />
              <button
                onClick={handleUrlImport}
                disabled={!configUrl.trim() || isImporting}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import
              </button>
            </div>
          </div>
        )}

        {importMethod === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-2">Configuration Text</label>
            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              placeholder="Paste your configuration JSON here..."
              rows={8}
              className={`w-full p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
            />
            <button
              onClick={handleTextImport}
              disabled={!configText.trim() || isImporting}
              className="w-full mt-2 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Import Configuration
            </button>
          </div>
        )}

        {isImporting && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p>Importing configuration...</p>
          </div>
        )}

        {importResult && (
          <div className={`p-4 rounded-lg ${importResult.success ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
            <div className="flex items-center gap-2">
              {importResult.success ? <Check className="text-green-500" size={20} /> : <AlertTriangle className="text-red-500" size={20} />}
              <span className={importResult.success ? 'text-green-500' : 'text-red-500'}>
                {importResult.message}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className={`w-full py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Export Config Page
export const ExportConfigPopup: React.FC<SettingsPopupProps> = ({ theme, onClose }) => {
  const [exportOptions, setExportOptions] = useState({
    includeUserSettings: true,
    includeAppSettings: true,
    includeCustomizations: true,
    includeSecrets: false,
    format: 'json' as 'json' | 'yaml' | 'txt'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    console.log('Exporting configuration with options:', exportOptions);

    // Simulate export process
    setTimeout(() => {
      const config = {
        userSettings: exportOptions.includeUserSettings ? { theme: 'dark', language: 'en' } : undefined,
        appSettings: exportOptions.includeAppSettings ? { notifications: true, autoSync: true } : undefined,
        customizations: exportOptions.includeCustomizations ? { customTheme: 'blue' } : undefined,
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsExporting(false);
      setExportComplete(true);
    }, 2000);
  };

  const downloadConfig = () => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `swipeos-config-${Date.now()}.${exportOptions.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    try {
      const response = await fetch(downloadUrl);
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      console.log('Configuration copied to clipboard');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className={`p-6 h-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Download className="text-purple-500" size={24} />
          Export Configuration
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <X size={20} />
        </button>
      </div>

      {!exportComplete ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">What to export</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={exportOptions.includeUserSettings}
                  onChange={(e) => setExportOptions({...exportOptions, includeUserSettings: e.target.checked})}
                  className="w-4 h-4 text-purple-500"
                />
                <span>User Settings</span>
                <span className="text-sm opacity-70">(Theme, preferences, etc.)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={exportOptions.includeAppSettings}
                  onChange={(e) => setExportOptions({...exportOptions, includeAppSettings: e.target.checked})}
                  className="w-4 h-4 text-purple-500"
                />
                <span>App Settings</span>
                <span className="text-sm opacity-70">(Notifications, sync, etc.)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={exportOptions.includeCustomizations}
                  onChange={(e) => setExportOptions({...exportOptions, includeCustomizations: e.target.checked})}
                  className="w-4 h-4 text-purple-500"
                />
                <span>Customizations</span>
                <span className="text-sm opacity-70">(Custom themes, layouts, etc.)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={exportOptions.includeSecrets}
                  onChange={(e) => setExportOptions({...exportOptions, includeSecrets: e.target.checked})}
                  className="w-4 h-4 text-purple-500"
                />
                <span className="text-orange-500">Include Secrets</span>
                <span className="text-sm opacity-70 text-orange-500">(⚠️ API keys, passwords, etc.)</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Export Format</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setExportOptions({...exportOptions, format: 'json'})}
                className={`p-3 rounded-lg border text-center ${exportOptions.format === 'json' ? 'bg-purple-500 text-white' : theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                JSON
              </button>
              <button
                onClick={() => setExportOptions({...exportOptions, format: 'yaml'})}
                className={`p-3 rounded-lg border text-center ${exportOptions.format === 'yaml' ? 'bg-purple-500 text-white' : theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                YAML
              </button>
              <button
                onClick={() => setExportOptions({...exportOptions, format: 'txt'})}
                className={`p-3 rounded-lg border text-center ${exportOptions.format === 'txt' ? 'bg-purple-500 text-white' : theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                Text
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Export Configuration
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white mx-auto">
            <Check size={32} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-purple-500">Export Complete!</h3>
            <p className="text-sm opacity-70 mt-2">Your configuration has been exported successfully</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={downloadConfig}
              className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download File
            </button>
            <button
              onClick={copyToClipboard}
              className={`flex-1 py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              Copy to Clipboard
            </button>
          </div>
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-lg font-medium border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}; 