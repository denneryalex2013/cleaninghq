import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { createPageUrl } from '../utils';

export default function Generating() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');
  const companyName = urlParams.get('company') || 'Your Company';
  const previewUrl = urlParams.get('preview') || '';

  const messages = [
    'Analyzing your business information...',
    'Creating custom design elements...',
    'Writing compelling content...',
    'Optimizing for search engines...',
    'Adding professional touches...',
    'Almost ready...'
  ];

  useEffect(() => {
    setProgress(100);
  }, []);

  useEffect(() => {
    if (progress === 100 && recordId && !checkingStatus) {
      setCheckingStatus(true);
      
      try {
        await base44.entities.SiteRequest.update(recordId, { 
          status: 'generated',
          generated_content: {
            generated_at: new Date().toISOString(),
            version: '1.0'
          }
        });
        
        navigate(createPageUrl('Preview') + `?id=${recordId}`);
      } catch (error) {
        console.error('Error updating status:', error);
        navigate(createPageUrl('Preview') + `?id=${recordId}`);
      }
    }
  }, [progress, recordId, checkingStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
              {progress < 100 ? (
                <Loader2 className="w-12 h-12 text-white animate-spin" />
              ) : (
                <CheckCircle2 className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="absolute -top-2 -right-2 left-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-bounce" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {progress < 100 ? 'Generating Your Website' : 'Website Ready!'}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {progress < 100 ? (
              <>
                Your professional website for <strong>{companyName}</strong> is being generated.
                This takes about 30 seconds.
              </>
            ) : (
              <>
                Your website is ready! Preparing your preview...
              </>
            )}
          </p>

          <div className="mb-8">
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-semibold text-gray-700 mt-3">{progress}% Complete</p>
          </div>

          {progress < 100 && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 min-h-[60px] flex items-center justify-center">
              <p className="text-teal-800 font-medium animate-pulse">
                {messages[currentMessage]}
              </p>
            </div>
          )}

          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-teal-600">⚡</div>
              <p className="text-xs text-gray-600 mt-2">Fast Generation</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600">🎨</div>
              <p className="text-xs text-gray-600 mt-2">Custom Design</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-teal-600">📱</div>
              <p className="text-xs text-gray-600 mt-2">Mobile Optimized</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}