import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { base44 } from "@/api/base44Client";
import { createPageUrl } from '../utils';

export default function GeneratingWebsite() {
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
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 500);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100 && recordId && !checkingStatus) {
      setCheckingStatus(true);
      
      // Simulate generation completion after 3 seconds
      setTimeout(async () => {
        try {
          // Update status to generated
          await base44.entities.SiteRequest.update(recordId, { status: 'generated' });
          
          // Redirect to preview
          navigate(createPageUrl('Preview') + `?id=${recordId}`);
        } catch (error) {
          console.error('Error updating status:', error);
          // Still redirect even if update fails
          navigate(createPageUrl('Preview') + `?id=${recordId}`);
        }
      }, 3000);
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
                Your professional cleaning website for <strong>{companyName}</strong> is being generated.
                This usually takes less than 60 seconds.
              </>
            ) : (
              <>
                Your website is ready! We're preparing your preview...
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

          {progress === 100 && previewUrl && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6">
                <p className="text-sm font-medium text-gray-600 mb-2">Your preview URL:</p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 font-mono text-sm hover:text-teal-700 underline break-all"
                >
                  {previewUrl}
                </a>
              </div>
              <p className="text-sm text-gray-500">
                Check your email for next steps and customization options
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

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 Tip: Check your spam folder if you don't see our email</p>
        </div>
      </div>
    </div>
  );
}