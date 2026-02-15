import React, { useEffect, useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Sparkles, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const [siteRequest, setSiteRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');

  useEffect(() => {
    const loadSiteRequest = async () => {
      if (!recordId) {
        setLoading(false);
        return;
      }

      try {
        const requests = await base44.entities.SiteRequest.filter({ id: recordId });
        if (requests.length > 0) {
          setSiteRequest(requests[0]);
        }
      } catch (error) {
        console.error('Error loading site request:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSiteRequest();
  }, [recordId]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending' },
      generating: { icon: Sparkles, color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Generating' },
      generated: { icon: CheckCircle2, color: 'bg-green-100 text-green-800 border-green-200', label: 'Generated' },
      active: { icon: CheckCircle2, color: 'bg-teal-100 text-teal-800 border-teal-200', label: 'Active' }
    };
    return configs[status] || configs.pending;
  };

  const getSubscriptionConfig = (status) => {
    const configs = {
      inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Inactive' },
      active: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Active' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelled' }
    };
    return configs[status] || configs.inactive;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!siteRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your website request.</p>
          <Button onClick={() => navigate(createPageUrl('Home'))}>
            Go Back Home
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(siteRequest.status);
  const subscriptionConfig = getSubscriptionConfig(siteRequest.subscription_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {siteRequest.company_name}
          </h1>
          <p className="text-gray-600">Manage your website and subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Website Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Website Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Generation Status</span>
                  <Badge className={`${statusConfig.color} border flex items-center gap-2`}>
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subscription</span>
                  <Badge className={`${subscriptionConfig.color} border`}>
                    {subscriptionConfig.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Preview Link Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Website</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Preview URL</p>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <code className="text-sm text-teal-600 font-mono flex-1 break-all">
                      {siteRequest.preview_url}
                    </code>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(createPageUrl('Preview') + `?id=${recordId}`)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Preview
                  </Button>
                  {siteRequest.subscription_status === 'active' && (
                    <Button
                      className="flex-1 bg-teal-600 hover:bg-teal-700"
                      onClick={() => window.open(siteRequest.preview_url, '_blank')}
                    >
                      Visit Live Site
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Edit Website Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Edit Website
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Use AI to update your website content, change colors, add pages, and more.
                </p>
                <Button variant="outline" className="w-full" disabled>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Edit with AI Chat (Coming Soon)
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  This feature will let you make changes by chatting with AI
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Card */}
            {siteRequest.subscription_status === 'inactive' && (
              <Card className="border-2 border-teal-600">
                <CardHeader className="bg-gradient-to-br from-teal-50 to-blue-50">
                  <CardTitle className="text-center">Activate Your Website</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-gray-900 mb-2">$39</div>
                    <div className="text-gray-600">per month</div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Professional website</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Custom domain</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>AI content updates</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>24/7 hosting</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Cancel anytime</span>
                    </li>
                  </ul>

                  <Button className="w-full h-12 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 font-semibold">
                    Activate Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Company Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="font-semibold">{siteRequest.city}, {siteRequest.state}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-semibold">{siteRequest.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-semibold">{siteRequest.phone}</p>
                </div>
                {siteRequest.services && siteRequest.services.length > 0 && (
                  <div>
                    <span className="text-gray-600">Services:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {siteRequest.services.map((service, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}