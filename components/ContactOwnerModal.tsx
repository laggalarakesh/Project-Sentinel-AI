import React, { useState, useEffect } from 'react';
import { Scooter } from '../types';
import { generateContactScript } from '../services/geminiService';

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  scooter: Scooter;
}

const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({ isOpen, onClose, scooter }) => {
  const [script, setScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchScript = async () => {
        setIsLoading(true);
        setError(null);
        setScript(''); // Clear previous script to avoid flicker
        try {
          const generatedScript = await generateContactScript(scooter);
          setScript(generatedScript);
        } catch (e) {
          setError('Failed to generate script.');
          console.error(e);
        }
        setIsLoading(false);
      };
      fetchScript();
    }
  }, [isOpen, scooter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-400">Proactive Maintenance Outreach</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="mb-4 p-4 bg-gray-700 rounded-md">
            <h3 className="font-semibold text-gray-200">Scooter Details</h3>
            <p className="text-sm text-gray-400">ID: <span className="font-mono text-cyan-300">{scooter.id}</span></p>
            <p className="text-sm text-gray-400">Owner: <span className="text-gray-100">{scooter.owner.name}</span></p>
            <p className="text-sm text-gray-400">Phone: <span className="text-gray-100">{scooter.owner.phone}</span></p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-200">Generated Call Script:</h3>
          <div className={`bg-gray-900 p-4 rounded-md border border-gray-700 min-h-[200px] ${isLoading ? 'flex items-center justify-center' : ''}`}>
            {isLoading && (
              <div className="flex items-center text-gray-400">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating script with Gemini...</span>
              </div>
            )}
            {error && <p className="text-red-400">{error}</p>}
            {!isLoading && !error && (
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{script}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactOwnerModal;
