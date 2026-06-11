import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plug, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function IntegrationsManager() {
  const [authorizing, setAuthorizing] = useState(null);

  const integrations = [
    {
      id: 'googledrive',
      name: 'Google Drive',
      description: 'Sync applications to Google Drive for backup and easy access',
      icon: '📁',
      status: 'not_connected'
    },
    {
      id: 'googlecalendar',
      name: 'Google Calendar',
      description: 'Schedule interviews and follow-ups',
      icon: '📅',
      status: 'not_connected'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      description: 'Send automated email updates to applicants',
      icon: '✉️',
      status: 'not_connected'
    }
  ];

  const handleConnect = async (integrationId) => {
    setAuthorizing(integrationId);
    toast.info(`To authorize ${integrationId}, an admin needs to use the request_oauth_authorization tool from the backend.`);
    setAuthorizing(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy dark:text-gold mb-2">Integrations</h2>
        <p className="text-slate-600 dark:text-slate-400">Connect external services to enhance your workflow</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {integrations.map(integration => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{integration.icon}</span>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                </div>
                {integration.status === 'connected' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{integration.description}</p>
              <Button
                onClick={() => handleConnect(integration.id)}
                disabled={authorizing === integration.id || integration.status === 'connected'}
                className={integration.status === 'connected' ? 'bg-green-600' : 'bg-navy dark:bg-gold'}
                size="sm"
              >
                <Plug className="w-4 h-4 mr-2" />
                {integration.status === 'connected' ? 'Connected' : authorizing === integration.id ? 'Connecting...' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Note:</strong> As an admin, you can authorize integrations which will allow the portal to sync data and automate workflows. Contact your system administrator to enable these integrations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}