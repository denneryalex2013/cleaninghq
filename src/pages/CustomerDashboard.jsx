import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, LogOut, ExternalLink, Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { createPageUrl } from '../utils';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [siteRequest, setSiteRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check authentication
        const currentUser = await base44.auth.me();
        if (!currentUser) {
          navigate(createPageUrl('Auth'));
          return;
        }
        setUser(currentUser);

        // Load site request by user email
        const requests = await base44.entities.SiteRequest.filter({ email: currentUser.email }, '-created_date', 1);
        if (requests.length > 0) {
          setSiteRequest(requests[0]);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    await base44.auth.logout(createPageUrl('Home'));
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      generating: Sparkles,
      generated: CheckCircle2,
      active: CheckCircle2
    };
    return icons[status] || AlertCircle;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      generating: 'bg-blue-100 text-blue-800 border-blue-200',
      generated: 'bg-green-100 text-green-800 border-green-200',
      active: 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!siteRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Website Found</h1>
            <p className="text-gray-600 mb-6">
              You don't have a website yet. Let's create one!
            </p>
            <Button 
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={() => navigate(createPageUrl('Start'))}
            >
              Create Website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(siteRequest.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{siteRequest.company_name}</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Website Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Generation</span>
                <Badge className={`${getStatusColor(siteRequest.status)} border flex items-center gap-2`}>
                  <StatusIcon className="w-4 h-4" />
                  {siteRequest.status.charAt(0).toUpperCase() + siteRequest.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subscription</span>
                <Badge className={`border ${siteRequest.subscription_status === 'active' ? 'bg-teal-100 text-teal-800' : 'bg-gray-100 text-gray-800'}`}>
                  {siteRequest.subscription_status === 'active' ? '✓ Active' : 'Not Active'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview & Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(createPageUrl('Preview') + `?id=${siteRequest.id}`)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Preview
              </Button>
              {siteRequest.subscription_status === 'active' && (
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={() => window.open(siteRequest.preview_url, '_blank')}
                >
                  Visit Live Site
                </Button>
              )}
              {siteRequest.subscription_status === 'inactive' && (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigate(createPageUrl('Dashboard') + `?id=${siteRequest.id}`)}
                >
                  Activate ($39/month)
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Sections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Edit Your Website
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                onClick={() => navigate(createPageUrl('HeroEditor') + `?id=${siteRequest.id}`)}
              >
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Hero Section</div>
                  <div className="text-sm text-gray-600">Edit headline & subheadline</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                onClick={() => navigate(createPageUrl('ImageManager') + `?id=${siteRequest.id}`)}
              >
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Images & Branding</div>
                  <div className="text-sm text-gray-600">Logo, hero, gallery photos</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}