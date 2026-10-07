import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plug, Check, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

// Workspace-registered app-user connector for Google Drive ("Employee Google Drive").
const EMPLOYEE_DRIVE_CONNECTOR_ID = '6ac5c9964235104eaaa6024e';

export default function IntegrationsManager() {
  const [authorizing, setAuthorizing] = useState(null);
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveChecking, setDriveChecking] = useState(true);

  // Rule 2: connection status via data fetch — doubles as connection check.
  const checkDriveConnection = useCallback(async () => {
    setDriveChecking(true);
    try {
      const res = await base44.functions.invoke('checkEmployeeDriveConnection', {});
      setDriveConnected(res.data?.connected === true);
    } catch {
      setDriveConnected(false);
    } finally {
      setDriveChecking(false);
    }
  }, []);

  useEffect(() => {
    checkDriveConnection();
  }, [checkDriveConnection]);

  // Rule 3: open OAuth popup, poll for close, then re-fetch to auto-refresh.
  const handleConnectDrive = async () => {
    setAuthorizing('googledrive');
    try {
      const url = await base44.connectors.connectAppUser(EMPLOYEE_DRIVE_CONNECTOR_ID);
      const popup = window.open(url, '_blank');
      const timer = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(timer);
          checkDriveConnection();
          setAuthorizing(null);
        }
      }, 500);
    } catch (err) {
      toast.error(err.message || 'Failed to start Google Drive connection.');
      setAuthorizing(null);
    }
  };

  const handleDisconnectDrive = async () => {
    setAuthorizing('googledrive');
    try {
      await base44.connectors.disconnectAppUser(EMPLOYEE_DRIVE_CONNECTOR_ID);
      setDriveConnected(false);
      toast.success('Employee Drive disconnected.');
    } catch (err) {
      toast.error(err.message || 'Failed to disconnect Employee Drive.');
    } finally {
      setAuthorizing(null);
    }
  };

  const integrations = [
    {
      id: 'googledrive',
      name: 'Employee Drive',
      description: 'Connect your own Google Drive to file and access intake applications from your account.',
      icon: '📁',
      status: driveConnected ? 'connected' : 'not_connected'
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
    if (integrationId === 'googledrive') {
      if (driveConnected) {
        await handleDisconnectDrive();
      } else {
        await handleConnectDrive();
      }
      return;
    }
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
        {integrations.map(integration => {
          const isDrive = integration.id === 'googledrive';
          const isBusy = isDrive && authorizing === 'googledrive';
          const isConnected = isDrive ? driveConnected : integration.status === 'connected';
          const showChecking = isDrive && driveChecking;
          return (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{integration.icon}</span>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                  </div>
                  {showChecking ? (
                    <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
                  ) : isConnected ? (
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
                  disabled={isBusy || showChecking}
                  className={isConnected ? 'bg-green-600 hover:bg-green-700' : 'bg-navy dark:bg-gold'}
                  size="sm"
                >
                  <Plug className="w-4 h-4 mr-2" />
                  {isConnected
                    ? 'Disconnect'
                    : isBusy
                      ? 'Connecting...'
                      : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Note:</strong> Employee Drive connects your own Google account so intake applications are filed where you can access them. Other integrations are authorized by an admin for the whole portal.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}