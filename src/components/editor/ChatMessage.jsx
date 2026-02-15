import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-teal-100">
          <AvatarFallback>
            <Sparkles className="h-4 w-4 text-teal-600" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-teal-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 px-2">
          {new Date(message.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 bg-gray-200">
          <AvatarFallback>
            <User className="h-4 w-4 text-gray-600" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}