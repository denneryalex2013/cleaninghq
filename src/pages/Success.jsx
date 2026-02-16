import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink } from 'lucide-react';

export default function Success() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  const businessId = urlParams.get('business_id');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to editor/dashboard
      navigate(createPageUrl('CustomerDashboard'));
    }
  }, [countdown, navigate, businessId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your subscription is now active. Your website is being published and will be live shortly.
          </p>

          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
              <code className="text-xs text-gray-800 font-mono break-all">
                {sessionId}
              </code>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-600">
              You'll receive a confirmation email shortly with your receipt and next steps.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => navigate(createPageUrl('CustomerDashboard'))}
              >
                Edit My Website
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = 'mailto:support@cleaninghq.io'}
              >
                Contact Support
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Redirecting to editor in {countdown} seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}