import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Upload, Loader2, ArrowLeft, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { createPageUrl } from '../utils';
import ChatMessage from '../components/editor/ChatMessage';

export default function Editor() {
  const navigate = useNavigate();
  const [siteRequest, setSiteRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const urlParams = new URLSearchParams(window.location.search);
  const recordId = urlParams.get('id');

  useEffect(() => {
    loadData();
  }, [recordId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    if (!recordId) {
      setLoading(false);
      return;
    }

    try {
      const requests = await base44.entities.SiteRequest.filter({ id: recordId });
      
      if (requests.length === 0) {
        navigate(createPageUrl('Dashboard'));
        return;
      }

      const request = requests[0];

      setSiteRequest(request);

      const edits = await base44.entities.WebsiteEdit.filter({ site_request_id: recordId }, '-created_date', 100);
      setMessages(edits.reverse());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (messageText = input, fileUrl = null) => {
    if (!messageText.trim() && !fileUrl) return;

    setSending(true);
    
    try {
      const userMessage = {
        user_id: 'current_user',
        site_request_id: recordId,
        message: messageText,
        role: 'user',
        created_date: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await base44.functions.invoke('processWebsiteEdit', {
        site_request_id: recordId,
        message: messageText,
        file_url: fileUrl
      });

      await loadData();
      setPreviewKey(prev => prev + 1);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      setError(`Failed to process edit: ${errorMsg}. Please try again or contact support.`);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      await base44.entities.WebsiteAsset.create({
        user_id: 'current_user',
        site_request_id: recordId,
        file_url: file_url,
        file_type: 'image'
      });

      handleSend(`I uploaded this image: ${file_url}`, file_url);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!siteRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h1>
          <p className="text-gray-600 mb-6">The website you're trying to edit doesn't exist or has been deleted.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(createPageUrl('Dashboard'))} className="bg-teal-600 hover:bg-teal-700">
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate(createPageUrl('Home'))}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-700 font-semibold text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(createPageUrl('Preview') + `?id=${recordId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Preview
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">{siteRequest.company_name}</h1>
          </div>
          <Button
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => navigate(createPageUrl('Dashboard') + `?id=${recordId}`)}
          >
            Activate Website — $39/month
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-[1800px] mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Chat Panel */}
          <Card className="flex flex-col h-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">AI Website Editor</h2>
              <p className="text-sm text-gray-500 mt-1">
                Tell me what you'd like to change on your website
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Editing Your Website
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Try saying things like:
                  </p>
                  <div className="space-y-2 text-left max-w-md mx-auto">
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      "Change my headline to 'Professional Commercial Cleaning'"
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      "Change my primary color to blue"
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      "Add medical facility cleaning to my services"
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <ChatMessage key={idx} message={msg} />
                  ))}
                  {sending && (
                    <div className="flex gap-3 mb-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-teal-600 animate-spin" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <p className="text-sm text-gray-600">Processing your request...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || sending}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </Button>
                <Textarea
                  placeholder="Tell me what you'd like to change..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                  className="flex-1 min-h-[60px] max-h-[200px] resize-none"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={sending || !input.trim()}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Preview Panel */}
          <Card className="flex flex-col h-full overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold text-gray-900">Live Preview</h2>
              <p className="text-sm text-gray-500 mt-1">
                Changes appear instantly
              </p>
            </div>
            <div className="flex-1 bg-gray-100 overflow-hidden">
              <iframe
                key={previewKey}
                src={createPageUrl('Preview') + `?id=${recordId}&embedded=true`}
                className="w-full h-full border-0"
                title="Website Preview"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}