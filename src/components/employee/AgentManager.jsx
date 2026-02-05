import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, MessageSquare, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AgentManager() {
  const [agentConfig, setAgentConfig] = useState({
    description: 'Mercy House intake and support representative',
    instructions: 'You are a warm, professional support representative...',
    whatsapp_greeting: '👋 Welcome to Mercy House Adult & Teen Challenge!'
  });

  const handleSave = () => {
    toast.info('Agent configuration updates require code changes. This is a demo UI showing current settings.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2">AI Agent Management</h2>
        <p className="text-slate-600 dark:text-slate-400">Configure the intake support AI agent</p>
      </div>

      <div className="grid gap-6">
        {/* Agent Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-navy dark:text-gold" />
              Intake Support Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400">Status</div>
                <div className="text-lg font-semibold text-green-600">Active</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Conversations</div>
                <div className="text-lg font-semibold text-navy dark:text-gold">-</div>
              </div>
            </div>

            <div>
              <Label>Agent Description</Label>
              <Input
                value={agentConfig.description}
                onChange={(e) => setAgentConfig({...agentConfig, description: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Instructions</Label>
              <Textarea
                value={agentConfig.instructions}
                onChange={(e) => setAgentConfig({...agentConfig, instructions: e.target.value})}
                rows={6}
                className="mt-1"
              />
            </div>

            <div>
              <Label>WhatsApp Greeting</Label>
              <Textarea
                value={agentConfig.whatsapp_greeting}
                onChange={(e) => setAgentConfig({...agentConfig, whatsapp_greeting: e.target.value})}
                rows={3}
                className="mt-1"
              />
            </div>

            <Button onClick={handleSave} className="bg-navy dark:bg-gold text-white dark:text-navy">
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Agent Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-navy dark:text-gold" />
                <span>View applications (read-only)</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-navy dark:text-gold" />
                <span>Check bed availability</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-navy dark:text-gold" />
                <span>Answer program questions</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-navy dark:text-gold" />
                <span>Web search for additional info</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}