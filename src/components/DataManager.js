import React, { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const DataManager = ({ onExport, onImport }) => {
  const { darkMode } = useTheme();
  const [importStatus, setImportStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    try {
      await onExport();
    } catch (error) {
      setError('Failed to export data. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          await onImport(data);
          setImportStatus('success');
          setTimeout(() => setImportStatus(null), 3000);
        } catch (error) {
          setError('Invalid file format. Please upload a valid JSON file.');
          setTimeout(() => setError(null), 3000);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setError('Failed to read file. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col gap-3">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-3 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {importStatus === 'success' && (
        <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">Data imported successfully!</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all flex items-center gap-2"
          title="Export Progress"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Export Progress</span>
        </button>

        <label className="bg-blue-500 hover:bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer">
          <Upload className="w-5 h-5" />
          <span className="hidden sm:inline">Import Progress</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default DataManager; 