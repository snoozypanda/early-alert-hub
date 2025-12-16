import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

const mockMessages: Message[] = [
  { id: 1, sender: 'Command Center', content: 'Team Alpha, what is your current status?', time: '10:30 AM', isOwn: false },
  { id: 2, sender: 'You', content: 'Command Center, we have arrived at the flood site. Assessing damage now.', time: '10:32 AM', isOwn: true },
  { id: 3, sender: 'Command Center', content: 'Copy that. Send photos when possible. Rescue team is 15 minutes out.', time: '10:33 AM', isOwn: false },
  { id: 4, sender: 'Team Beta', content: 'Team Beta here. We have secured the northern perimeter.', time: '10:35 AM', isOwn: false },
  { id: 5, sender: 'You', content: 'Confirmed. We have 12 civilians requiring evacuation assistance.', time: '10:38 AM', isOwn: true },
  { id: 6, sender: 'Command Center', content: 'Understood. Dispatching additional vehicles. ETA 20 minutes.', time: '10:40 AM', isOwn: false },
];

const mockChannels = [
  { id: 1, name: 'Command Center', unread: 2, online: true },
  { id: 2, name: 'Team Alpha', unread: 0, online: true },
  { id: 3, name: 'Team Beta', unread: 1, online: true },
  { id: 4, name: 'Medical Unit', unread: 0, online: false },
  { id: 5, name: 'Logistics', unread: 3, online: true },
];

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState(mockChannels[0]);

  const handleSend = () => {
    if (message.trim()) {
      // UI only - would send message in real implementation
      setMessage('');
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Coordination Chat
            </h1>
            <p className="text-muted-foreground">Real-time communication with teams</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100%-4rem)]">
          {/* Channels List */}
          <Card className="border-border lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Channels</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {mockChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      activeChannel.id === channel.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${channel.online ? 'bg-chart-1' : 'bg-muted'}`} />
                        <span className="text-sm font-medium">{channel.name}</span>
                      </div>
                      {channel.unread > 0 && (
                        <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                          {channel.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="border-border lg:col-span-3 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {activeChannel.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-foreground">{activeChannel.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {activeChannel.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-foreground'
                      }`}
                    >
                      {!msg.isOwn && (
                        <p className="text-xs font-medium mb-1 opacity-70">{msg.sender}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  className="flex-1 bg-background"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
