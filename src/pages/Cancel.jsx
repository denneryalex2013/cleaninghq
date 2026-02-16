import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { XCircle } from 'lucide-react';

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="space-y-4">
            <p className="text-gray-600">
              If you experienced any issues or have questions, please contact our support team.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => navigate(createPageUrl('Home'))}
              >
                Return to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = 'mailto:support@cleaninghq.io'}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}