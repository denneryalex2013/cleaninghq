import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Apple, Loader2 } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user) {
          // Check if there's a site_request_id to link
          const urlParams = new URLSearchParams(window.location.search);
          const siteRequestId = urlParams.get('site_request_id');
          
          if (siteRequestId) {
            // Link the site request to this user
            try {
              await base44.entities.SiteRequest.update(siteRequestId, {
                user_id: user.id,
                owner_email: user.email
              });
            } catch (err) {
              console.error('Failed to link site:', err);
            }
            // Redirect to specific site dashboard after linking
            navigate(createPageUrl('Dashboard') + `?id=${siteRequestId}`);
          } else {
            // No site request to link, go to general dashboard
            navigate(createPageUrl('Dashboard'));
          }
        }
      } catch (error) {
        console.log('Not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async () => {
    await base44.auth.redirectToLogin(createPageUrl('CustomerDashboard'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CleaningHQ</h1>
            <p className="text-gray-600">Manage your website</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              <Mail className="w-5 h-5 mr-2" />
              Sign In with Email
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              variant="outline"
              className="w-full h-12"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={handleLogin}
              variant="outline"
              className="w-full h-12"
            >
              <Apple className="w-5 h-5 mr-2" />
              Continue with Apple
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have a website yet?{' '}
            <button
              onClick={() => navigate(createPageUrl('Start'))}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Create one
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}